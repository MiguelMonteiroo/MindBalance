import usersFile from "../data/users.json";
import checkinsFile from "../data/checkins.json";
import suggestionsFile from "../data/suggestions.json";
import resourcesFile from "../data/resources.json";

// ========================= STORAGE =========================

// now async
export async function loadJSON(name) {
  const ls = localStorage.getItem(name);
  if (ls) return JSON.parse(ls);

  let file = null;
  switch (name) {
    case "users.json": file = usersFile; break;
    case "checkins.json": file = checkinsFile; break;
    case "suggestions.json": file = suggestionsFile; break;
    case "resources.json": file = resourcesFile; break;
    default: return {};
  }

  const cloned = JSON.parse(JSON.stringify(file));

  // async simulation
  await Promise.resolve();

  localStorage.setItem(name, JSON.stringify(cloned));
  return cloned;
}

export async function saveJSON(name, data) {
  await Promise.resolve(); // async placeholder
  localStorage.setItem(name, JSON.stringify(data));
}

export const generateId = (prefix) => `${prefix}${Date.now()}`;


// ========================= ANALYTICS =========================

export async function analyzeCheckin(checkin, userHistory) {
  const suggestionData = (await loadJSON("suggestions.json")).suggestions;

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


// ========================= BACKEND =========================

export async function login(email, password) {
  const users = (await loadJSON("users.json")).users;

  const user = users.find((u) => u.email === email);
  if (!user) return { success: false, message: "Usuário não encontrado" };
  if (user.password !== password)
    return { success: false, message: "Senha incorreta" };

  const safeUser = { ...user };
  delete safeUser.password;

  return {
    success: true,
    user: safeUser,
    token: `token_${user.id}`,
  };
}

export async function submitCheckin(data) {
  const checkinsData = await loadJSON("checkins.json");

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

  const ai = await analyzeCheckin(newCheckin, userHistory);

  newCheckin.aiSuggestion = ai.message;
  newCheckin.recommendedResources = ai.resourcesRecommended || [];
  newCheckin.suggestedActions = ai.actions || [];

  checkinsData.checkins.push(newCheckin);
  await saveJSON("checkins.json", checkinsData);

  return { success: true, checkin: newCheckin };
}

export async function getHistory(userId, period = "week") {
  const data = (await loadJSON("checkins.json")).checkins;

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

export async function getResources({ category, difficulty } = {}) {
  const data = await loadJSON("resources.json");
  let resources = data.resources;

  if (category) resources = resources.filter((r) => r.category === category);
  if (difficulty) resources = resources.filter((r) => r.difficulty === difficulty);

  return { success: true, resources, categories: data.categories };
}

export async function getResourceById(id) {
  const data = await loadJSON("resources.json");
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


// ========================= SERVICES =========================

export const authService = {
  login: async (email, password) => {
    const data = await login(email, password);
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
    return await submitCheckin(checkinData);
  },

  getHistory: async (userId, period = "week") => {
    return await getHistory(userId, period);
  },
};

export const dashboardService = {
   getPersonal: async (userId) => {
    const data = await getHistory(userId);
    const history = data.history
    // Estatísticas semanais
    const weekSummary = calculateWellbeingStats(history, "week");

    // Criar dados para o gráfico
    const chartData = history
      .slice() // copiar
      .sort((a, b) => new Date(a.date) - new Date(b.date)) // ordenar crescente
      .map((item) => ({
        date: item.date,
        mood: item.mood,
        energy: item.energy,
      }));

    // Insights simples baseados nos números
    const insights = [];

    if (weekSummary.avgMood < 3)
      insights.push("Seu humor está abaixo do ideal esta semana. Tente fazer pausas regulares e dormir bem.");

    if (weekSummary.avgEnergy < 3)
      insights.push("Sua energia está baixa. Hidrate-se e tente evitar sobrecarga de tarefas.");

    if (weekSummary.trend === "improving")
      insights.push("Ótimo progresso! Seu bem-estar está melhorando nos últimos dias.");

    if (insights.length === 0)
      insights.push("Continue registrando seus check-ins diariamente para receber análises mais precisas.");

    return {
      success: true,
      weekSummary,
      chartData,
      insights,
    };
  },
};

export const resourcesService = {
  getAll: async (category = null, difficulty = null) => {
    return await getResources({ category, difficulty });
  },

  getById: async (id) => {
    return await getResourceById(id);
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
