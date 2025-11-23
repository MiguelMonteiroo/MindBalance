import usersFile from "../data/users.json";
import checkinsFile from "../data/checkins.json";
import suggestionsFile from "../data/suggestions.json";
import resourcesFile from "../data/resources.json";

function loadJSON(name) {
  const ls = localStorage.getItem(name);
  if (ls) return JSON.parse(ls);

  switch (name) {
    case "users.json": return usersFile;
    case "checkins.json": return checkinsFile;
    case "suggestions.json": return suggestionsFile;
    case "resources.json": return resourcesFile;
    default: return {};
  }
}

function saveJSON(name, data) {
  localStorage.setItem(name, JSON.stringify(data));
}

export const generateId = (prefix) => `${prefix}${Date.now()}`;


// ========================= ANALYTICS =========================

export function analyzeCheckin(checkin, userHistory) {
  const suggestionData = loadJSON("suggestions.json").suggestions;

  let consecutiveHeavy = 0;
  let consecutiveLowMood = 0;

  if (userHistory?.length > 0) {
    const sorted = [...userHistory].sort((a, b) => b.date.localeCompare(a.date));

    for (const item of sorted.slice(0, 7)) {
      if (item.workload === "pesada") consecutiveHeavy++;
      else break;
    }

    for (const item of sorted.slice(0, 7)) {
      if (item.mood <= 2) consecutiveLowMood++;
      else break;
    }
  }

  let selected = null;

  for (const sug of suggestionData) {
    const t = sug.trigger;
    let match = true;

    if (t.mood) {
      const val = parseInt(t.mood.replace(/\D/g, ""));
      if (t.mood.includes("<=") && checkin.mood > val) match = false;
      if (t.mood.includes(">=") && checkin.mood < val) match = false;
    }

    if (t.energy) {
      const val = parseInt(t.energy.replace(/\D/g, ""));
      if (t.energy.includes("<=") && checkin.energy > val) match = false;
      if (t.energy.includes(">=") && checkin.energy < val) match = false;
    }

    if (t.workload && t.workload !== checkin.workload) match = false;

    if (t.consecutiveDays) {
      const needed = t.consecutiveDays;
      if (checkin.workload === "pesada" && consecutiveHeavy < needed) match = false;
      if (checkin.mood <= 2 && consecutiveLowMood < needed) match = false;
    }

    if (match) {
      selected = sug;
      if (sug.priority === "high") break;
    }
  }

  return (
    selected || {
      message: "Obrigado por fazer seu check-in!",
      resourcesRecommended: [],
      actions: [],
    }
  );
}

// ========================= WELLBEING =========================

export function calculateWellbeingStats(checkins, period = "week") {
  if (!checkins?.length)
    return { avgMood: 0, avgEnergy: 0, checkinsCompleted: 0, trend: "no_data" };

  const now = new Date();
  const days = period === "week" ? 7 : period === "month" ? 30 : 365;
  const cutoff = new Date(now - days * 86400000);

  const recent = checkins.filter((c) => new Date(c.date) >= cutoff);
  if (recent.length === 0)
    return { avgMood: 0, avgEnergy: 0, checkinsCompleted: 0, trend: "no_data" };

  const avgMood = recent.reduce((a, b) => a + b.mood, 0) / recent.length;
  const avgEnergy = recent.reduce((a, b) => a + b.energy, 0) / recent.length;

  let trend = "stable";

  if (recent.length >= 2) {
    const half = Math.floor(recent.length / 2);
    const first = recent.slice(0, half);
    const second = recent.slice(half);

    const diff =
      second.reduce((a, b) => a + b.mood, 0) / second.length -
      first.reduce((a, b) => a + b.mood, 0) / first.length;

    if (diff > 0.5) trend = "improving";
    if (diff < -0.5) trend = "declining";
  }

  return {
    avgMood: Number(avgMood.toFixed(1)),
    avgEnergy: Number(avgEnergy.toFixed(1)),
    checkinsCompleted: recent.length,
    trend,
  };
}


// ========================= PURE BACKEND FUNCTIONS =========================

export function login(email, password) {
  const users = loadJSON("users.json").users;

  const user = users.find((u) => u.email === email);
  if (!user) return { success: false, message: "Usuário não encontrado" };
  if (user.password !== password) return { success: false, message: "Senha incorreta" };

  const safeUser = { ...user };
  delete safeUser.password;

  return {
    success: true,
    user: safeUser,
    token: `token_${user.id}`,
  };
}

export function submitCheckin(data) {
  const checkinsData = loadJSON("checkins.json");

  const userHistory = checkinsData.checkins.filter((c) => c.userId === data.userId);
  const now = new Date();

  const newCheckin = {
    id: generateId("ck"),
    userId: data.userId,
    date: now.toISOString().slice(0, 10),
    time: now.toISOString().slice(11, 19),
    mood: data.mood,
    energy: data.energy,
    workload: data.workload,
    comment: data.comment || "",
  };

  const ai = analyzeCheckin(newCheckin, userHistory);

  newCheckin.aiSuggestion = ai.message;
  newCheckin.recommendedResources = ai.resourcesRecommended || [];
  newCheckin.suggestedActions = ai.actions || [];

  checkinsData.checkins.push(newCheckin);
  saveJSON("checkins.json", checkinsData);

  return { success: true, checkin: newCheckin };
}

export function getHistory(userId, period = "week") {
  const data = loadJSON("checkins.json").checkins;

  const userCheckins = data
    .filter((c) => c.userId === userId)
    .sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

  const now = new Date();
  const cutoff =
    period === "week"
      ? new Date(now - 7 * 86400000)
      : period === "month"
      ? new Date(now - 30 * 86400000)
      : new Date(now - 365 * 86400000);

  return {
    success: true,
    history: userCheckins.filter((c) => new Date(c.date) >= cutoff),
  };
}

export function getResources({ category, difficulty } = {}) {
  const data = loadJSON("resources.json");
  let resources = data.resources;

  if (category) resources = resources.filter((r) => r.category === category);
  if (difficulty) resources = resources.filter((r) => r.difficulty === difficulty);

  return { success: true, resources, categories: data.categories };
}

export function getResourceById(id) {
  const data = loadJSON("resources.json");
  const resource = data.resources.find((r) => r.id === Number(id));
  if (!resource) return { success: false, message: "Recurso não encontrado" };
  return { success: true, resource };
}

// ========================= HEALTH =========================

export function health() {
  return {
    status: "healthy",
    message: "MindBalance API funcionando!",
    timestamp: new Date().toISOString(),
  };
}


// ========================= SERVICES (AGORA SEM REQUEST) =========================

export const authService = {
  login: async (email, password) => {
    const data = login(email, password);
    if (data.success && data.token) {
      localStorage.setItem("mindbalance_token", data.token);
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem("mindbalance_token");
    localStorage.removeItem("mindbalance_user");
  },
};

export const checkinService = {
  create: async (checkinData) => {
    return submitCheckin(checkinData);
  },

  getHistory: async (userId, period = "week") => {
    return getHistory(userId, period);
  },
};

export const dashboardService = {
  getPersonal: async (userId) => {
    const history = getHistory(userId).history;
    const stats = calculateWellbeingStats(history);
    return { success: true, stats };
  },

  getAdmin: async (department = "all", period = "week") => {
    const users = loadJSON("users.json").users;
    const checkins = loadJSON("checkins.json").checkins;

    const filtered =
      department === "all"
        ? users
        : users.filter((u) => u.department === department);

    const result = filtered.map((u) => {
      const history = checkins.filter((c) => c.userId === u.id);
      const stats = calculateWellbeingStats(history, period);
      return { user: u, stats };
    });

    return { success: true, result };
  },
};

export const resourcesService = {
  getAll: async (category = null, difficulty = null) => {
    return getResources({ category, difficulty });
  },

  getById: async (id) => {
    return getResourceById(id);
  },
};

export const healthCheck = async () => {
  return health();
};

const api = {
  auth: authService,
  checkin: checkinService,
  dashboard: dashboardService,
  resources: resourcesService,
  healthCheck,
};

export default api;
