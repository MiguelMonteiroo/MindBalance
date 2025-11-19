# 🚀 Como Rodar o Projeto MindBalance

## 📋 Pré-requisitos

- **Python 3.8+** instalado 
- **Node.js 16+** instalado 
- Terminal/Prompt de Comando
- Editor de código (VS Code recomendado)

---

## ⚙️ PASSO 1: Configurar o Backend

### 1.1. Abra o terminal na pasta do projeto

```bash
cd mindbalance/backend
```

### 1.2. Instale as dependências do Python

**Windows:**
```bash
pip install -r requirements.txt
```

**Linux/Mac:**
```bash
pip install -r requirements.txt --break-system-packages
```

### 1.3. Inicie o servidor

```bash
python app.py
```

Você verá:
```
🧠 MindBalance API iniciando...
📍 Servidor rodando em: http://localhost:5000
💡 Pressione Ctrl+C para parar
```

### 1.4. Teste se está funcionando

Abra o navegador e acesse: `http://localhost:5000/api/health`

Deve aparecer:
```json
{
  "status": "healthy",
  "message": "MindBalance API está funcionando!",
  "timestamp": "..."
}
```

✅ **Backend funcionando!**


## 👥 Usuários de Teste

Você pode fazer login com qualquer um desses:

| Nome | Email | Senha | Tipo |
|------|-------|-------|------|
| Mariana Silva | mariana.silva@empresa.com | senha123 | Colaborador |
| Carlos Santos | carlos.santos@empresa.com | senha123 | Admin (RH) |
| Ana Costa | ana.costa@empresa.com | senha123 | Colaborador |
| Pedro Oliveira | pedro.oliveira@empresa.com | senha123 | Colaborador |

---


