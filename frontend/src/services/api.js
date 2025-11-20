// Serviço de API para comunicação com o backend

const API_URL = 'http://localhost:5000/api';

// Função auxiliar para fazer requisições
const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('mindbalance_token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Erro na requisição');
    }
    
    return data;
  } catch (error) {
    console.error('Erro na API:', error);
    throw error;
  }
};

// ===== AUTENTICAÇÃO =====
export const authService = {
  // Login
  login: async (email, password) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.success && data.token) {
      localStorage.setItem('mindbalance_token', data.token);
    }
    
    return data;
  },
  
  // Logout (limpa dados locais)
  logout: () => {
    localStorage.removeItem('mindbalance_token');
    localStorage.removeItem('mindbalance_user');
  },
};

// ===== CHECK-INS =====
export const checkinService = {
  // Criar novo check-in
  create: async (checkinData) => {
    return await request('/checkin', {
      method: 'POST',
      body: JSON.stringify(checkinData),
    });
  },
  
  // Buscar histórico de check-ins
  getHistory: async (userId, period = 'week') => {
    return await request(`/checkin/history/${userId}?period=${period}`);
  },
};

// ===== DASHBOARD =====
export const dashboardService = {
  // Dashboard pessoal
  getPersonal: async (userId) => {
    return await request(`/dashboard/personal/${userId}`);
  },
  
  // Dashboard administrativo
  getAdmin: async (department = 'all', period = 'week') => {
    return await request(`/dashboard/admin?department=${department}&period=${period}`);
  },
};

// ===== RECURSOS =====
export const resourcesService = {
  // Listar todos os recursos
  getAll: async (category = null, difficulty = null) => {
    let url = '/resources';
    const params = new URLSearchParams();
    
    if (category) params.append('category', category);
    if (difficulty) params.append('difficulty', difficulty);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    return await request(url);
  },
  
  // Obter detalhes de um recurso
  getById: async (resourceId) => {
    return await request(`/resources/${resourceId}`);
  },
};

// ===== HEALTH CHECK =====
export const healthCheck = async () => {
  return await request('/health');
};

// Exportar tudo junto também
const api = {
  auth: authService,
  checkin: checkinService,
  dashboard: dashboardService,
  resources: resourcesService,
  healthCheck,
};

export default api;
