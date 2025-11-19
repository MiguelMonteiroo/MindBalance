# 📚 GUIA DO BACKEND - EXPLICAÇÃO SIMPLES

## O que acabamos de criar?

Criamos o "cérebro" do MindBalance! O backend é a parte que:
- 🗄️ Armazena os dados (em arquivos JSON)
- 🤖 Processa a inteligência artificial
- 📡 Se comunica com o front-end (React)

---

## 📁 ARQUIVOS QUE CRIAMOS

### 1. **data/users.json**
**O que é:** Cadastro de usuários  
**O que tem:** Nome, email, senha, departamento, preferências  
**Exemplo:** Mariana (Designer), Carlos (RH), Ana (Marketing), Pedro (TI)

### 2. **data/checkins.json**
**O que é:** Histórico de todos os check-ins feitos  
**O que tem:** Humor, energia, carga de trabalho, comentários, sugestões da IA  
**Exemplo:** "Mariana reportou humor 2/5 e carga pesada"

### 3. **data/resources.json**
**O que é:** Biblioteca de recursos de autocuidado  
**O que tem:** 8 recursos prontos (técnicas de respiração, alongamento, Pomodoro, etc.)  
**Cada recurso tem:** Título, categoria, descrição, conteúdo completo, dificuldade

### 4. **data/suggestions.json**
**O que é:** Banco de sugestões que a IA usa  
**O que tem:** Regras de quando dar cada sugestão e quais recursos recomendar

### 5. **requirements.txt**
**O que é:** Lista de bibliotecas Python necessárias  
**O que tem:** Flask (servidor web), Flask-CORS (permite React conversar com Python)

### 6. **app.py** ⭐ (ARQUIVO PRINCIPAL)
**O que é:** O servidor que "liga" tudo  
**O que faz:** 
- Recebe pedidos do front-end
- Busca dados nos arquivos JSON
- Processa a lógica da IA
- Devolve respostas

---

## 🤖 COMO A IA FUNCIONA

A IA no nosso projeto é **baseada em regras** (não precisa de machine learning complexo).

### Exemplo prático:

**Situação:** Mariana faz check-in reportando:
- Humor: 2/5 😕
- Energia: 2/5 🔋
- Carga: pesada 📦

**O que a IA faz:**

1. **Analisa o check-in atual**
   - "Humor e energia baixos"

2. **Olha o histórico**
   - "Nos últimos 3 dias, ela também reportou carga pesada"

3. **Busca no banco de sugestões**
   - Encontra a regra: "Se mood <=2 E energy <=2 → dar sugestão de alta prioridade"

4. **Monta a resposta**
   - Mensagem: "Percebi que você está sobrecarregada..."
   - Recursos recomendados: [Respiração 4-7-8, Alongamento]
   - Ações sugeridas: ["Fazer pausa", "Conversar com gestor"]

5. **Salva tudo no checkins.json**

---

## 📡 ENDPOINTS DA API (O QUE O FRONT-END PODE PEDIR)

### **1. Login**
`POST /api/auth/login`

Envia: `{ "email": "...", "password": "..." }`  
Recebe: Dados do usuário + token

### **2. Fazer Check-in**
`POST /api/checkin`

Envia: `{ "userId": "user001", "mood": 3, "energy": 4, "workload": "adequada" }`  
Recebe: Check-in salvo + sugestão da IA

### **3. Ver Histórico**
`GET /api/checkin/history/user001?period=week`

Recebe: Todos os check-ins da última semana

### **4. Dashboard Pessoal**
`GET /api/dashboard/personal/user001`

Recebe:
- Média de humor e energia da semana
- Dados para gráficos
- Insights da IA ("Seu bem-estar está 15% melhor!")

### **5. Dashboard Admin (Gestor)**
`GET /api/dashboard/admin?department=Marketing`

Recebe:
- Bem-estar geral da empresa/departamento
- Alertas de equipes em risco
- Distribuição de carga de trabalho
- **Tudo anonimizado!**

### **6. Listar Recursos**
`GET /api/resources?category=Mindfulness`

Recebe: Todos os recursos da categoria escolhida

### **7. Detalhes de um Recurso**
`GET /api/resources/1`

Recebe: Conteúdo completo da "Respiração 4-7-8"

---

## 🧪 COMO TESTAR O BACKEND

### **Método 1: Pelo navegador**

1. Abra o terminal na pasta `backend`
2. Digite: `python app.py`
3. Abra o navegador em: `http://localhost:5000/api/health`
4. Deve aparecer: "MindBalance API está funcionando!"
