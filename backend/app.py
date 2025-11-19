"""
MindBalance - API Backend
Servidor Flask com endpoints para gestão de bem-estar no trabalho
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
from datetime import datetime, timedelta
from pathlib import Path

# Inicializar aplicação Flask
app = Flask(__name__)
CORS(app)  # Permitir requisições do React

# Caminho para os arquivos de dados
DATA_DIR = Path(__file__).parent / 'data'

# ==================== FUNÇÕES AUXILIARES ====================

def load_json(filename):
    """Carrega dados de um arquivo JSON"""
    filepath = DATA_DIR / filename
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filename, data):
    """Salva dados em um arquivo JSON"""
    filepath = DATA_DIR / filename
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def generate_id(prefix):
    """Gera um ID único com timestamp"""
    timestamp = datetime.now().strftime('%Y%m%d%H%M%S%f')
    return f"{prefix}{timestamp}"

# ==================== SISTEMA DE IA ====================

def analyze_checkin(checkin_data, user_history):
    """
    Analisa um check-in e retorna sugestão da IA
    Esta é uma IA simplificada baseada em regras
    """
    mood = checkin_data['mood']
    energy = checkin_data['energy']
    workload = checkin_data['workload']
    
    # Carregar sugestões
    suggestions_data = load_json('suggestions.json')
    suggestions = suggestions_data['suggestions']
    
    # Contar dias consecutivos com carga pesada
    consecutive_heavy = 0
    consecutive_low_mood = 0
    
    if user_history:
        # Ordenar por data (mais recente primeiro)
        sorted_history = sorted(user_history, key=lambda x: x['date'], reverse=True)
        
        # Contar carga pesada consecutiva
        for check in sorted_history[:7]:  # últimos 7 dias
            if check['workload'] == 'pesada':
                consecutive_heavy += 1
            else:
                break
        
        # Contar humor baixo consecutivo
        for check in sorted_history[:7]:
            if check['mood'] <= 2:
                consecutive_low_mood += 1
            else:
                break
    
    # Encontrar sugestão apropriada
    selected_suggestion = None
    
    for sug in suggestions:
        trigger = sug['trigger']
        match = True
        
        # Verificar mood
        if 'mood' in trigger:
            condition = trigger['mood']
            if '<=' in condition:
                threshold = int(condition.replace('<=', ''))
                if mood > threshold:
                    match = False
            elif '>=' in condition:
                threshold = int(condition.replace('>=', ''))
                if mood < threshold:
                    match = False
        
        # Verificar energy
        if 'energy' in trigger:
            condition = trigger['energy']
            if '<=' in condition:
                threshold = int(condition.replace('<=', ''))
                if energy > threshold:
                    match = False
            elif '>=' in condition:
                threshold = int(condition.replace('>=', ''))
                if energy < threshold:
                    match = False
        
        # Verificar workload
        if 'workload' in trigger:
            if trigger['workload'] != workload:
                match = False
        
        # Verificar dias consecutivos
        if 'consecutiveDays' in trigger:
            required_days = trigger['consecutiveDays']
            if workload == 'pesada' and consecutive_heavy < required_days:
                match = False
            if mood <= 2 and consecutive_low_mood < required_days:
                match = False
        
        if match:
            selected_suggestion = sug
            if sug['priority'] == 'high':
                break  # Priorizar sugestões de alta prioridade
    
    # Se não encontrou sugestão específica, usar padrão
    if not selected_suggestion:
        selected_suggestion = {
            "message": "Obrigado por fazer seu check-in! Continue cuidando do seu bem-estar.",
            "resourcesRecommended": [],
            "actions": []
        }
    
    return selected_suggestion

def calculate_wellbeing_stats(checkins, period='week'):
    """Calcula estatísticas de bem-estar para um período"""
    if not checkins:
        return {
            'avgMood': 0,
            'avgEnergy': 0,
            'checkinsCompleted': 0,
            'trend': 'insufficient_data'
        }
    
    # Filtrar por período
    now = datetime.now()
    if period == 'week':
        cutoff = now - timedelta(days=7)
    elif period == 'month':
        cutoff = now - timedelta(days=30)
    else:
        cutoff = now - timedelta(days=365)
    
    recent_checkins = [
        c for c in checkins 
        if datetime.strptime(c['date'], '%Y-%m-%d') >= cutoff
    ]
    
    if not recent_checkins:
        return {
            'avgMood': 0,
            'avgEnergy': 0,
            'checkinsCompleted': 0,
            'trend': 'no_data'
        }
    
    # Calcular médias
    avg_mood = sum(c['mood'] for c in recent_checkins) / len(recent_checkins)
    avg_energy = sum(c['energy'] for c in recent_checkins) / len(recent_checkins)
    
    # Determinar tendência
    if len(recent_checkins) >= 2:
        first_half = recent_checkins[:len(recent_checkins)//2]
        second_half = recent_checkins[len(recent_checkins)//2:]
        
        avg_first = sum(c['mood'] for c in first_half) / len(first_half)
        avg_second = sum(c['mood'] for c in second_half) / len(second_half)
        
        diff = avg_second - avg_first
        if diff > 0.5:
            trend = 'improving'
        elif diff < -0.5:
            trend = 'declining'
        else:
            trend = 'stable'
    else:
        trend = 'stable'
    
    return {
        'avgMood': round(avg_mood, 1),
        'avgEnergy': round(avg_energy, 1),
        'checkinsCompleted': len(recent_checkins),
        'trend': trend
    }

# ==================== ENDPOINTS DE AUTENTICAÇÃO ====================

@app.route('/api/auth/login', methods=['POST'])
def login():
    """
    Autentica usuário
    Body: { "email": "user@empresa.com", "password": "senha123" }
    """
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        # Carregar usuários
        users_data = load_json('users.json')
        
        # Buscar usuário
        user = next((u for u in users_data['users'] if u['email'] == email), None)
        
        if not user:
            return jsonify({'success': False, 'message': 'Usuário não encontrado'}), 404
        
        if user['password'] != password:
            return jsonify({'success': False, 'message': 'Senha incorreta'}), 401
        
        # Remover senha da resposta
        user_safe = {k: v for k, v in user.items() if k != 'password'}
        
        return jsonify({
            'success': True,
            'user': user_safe,
            'token': f"token_{user['id']}"  # Token simples para demonstração
        })
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== ENDPOINTS DE CHECK-IN ====================

@app.route('/api/checkin', methods=['POST'])
def create_checkin():
    """
    Registra um novo check-in
    Body: { "userId": "user123", "mood": 3, "energy": 4, "workload": "adequada", "comment": "" }
    """
    try:
        data = request.json
        
        # Carregar check-ins existentes
        checkins_data = load_json('checkins.json')
        
        # Buscar histórico do usuário
        user_history = [c for c in checkins_data['checkins'] if c['userId'] == data['userId']]
        
        # Criar novo check-in
        new_checkin = {
            'id': generate_id('ck'),
            'userId': data['userId'],
            'date': datetime.now().strftime('%Y-%m-%d'),
            'time': datetime.now().strftime('%H:%M:%S'),
            'mood': data['mood'],
            'energy': data['energy'],
            'workload': data['workload'],
            'comment': data.get('comment', '')
        }
        
        # Gerar sugestão da IA
        ai_suggestion = analyze_checkin(new_checkin, user_history)
        new_checkin['aiSuggestion'] = ai_suggestion['message']
        new_checkin['recommendedResources'] = ai_suggestion.get('resourcesRecommended', [])
        new_checkin['suggestedActions'] = ai_suggestion.get('actions', [])
        
        # Salvar
        checkins_data['checkins'].append(new_checkin)
        save_json('checkins.json', checkins_data)
        
        return jsonify({
            'success': True,
            'checkin': new_checkin
        })
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/checkin/history/<user_id>', methods=['GET'])
def get_checkin_history(user_id):
    """
    Retorna histórico de check-ins do usuário
    Query params: ?period=week (week, month, year)
    """
    try:
        period = request.args.get('period', 'week')
        
        # Carregar check-ins
        checkins_data = load_json('checkins.json')
        
        # Filtrar por usuário
        user_checkins = [c for c in checkins_data['checkins'] if c['userId'] == user_id]
        
        # Ordenar por data (mais recente primeiro)
        user_checkins.sort(key=lambda x: (x['date'], x['time']), reverse=True)
        
        # Filtrar por período
        now = datetime.now()
        if period == 'week':
            cutoff = now - timedelta(days=7)
        elif period == 'month':
            cutoff = now - timedelta(days=30)
        elif period == 'year':
            cutoff = now - timedelta(days=365)
        else:
            cutoff = now - timedelta(days=7)
        
        filtered_checkins = [
            c for c in user_checkins
            if datetime.strptime(c['date'], '%Y-%m-%d') >= cutoff
        ]
        
        return jsonify({
            'success': True,
            'history': filtered_checkins,
            'total': len(filtered_checkins)
        })
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== ENDPOINTS DE DASHBOARD ====================

@app.route('/api/dashboard/personal/<user_id>', methods=['GET'])
def personal_dashboard(user_id):
    """
    Retorna dados para dashboard pessoal do colaborador
    """
    try:
        # Carregar check-ins do usuário
        checkins_data = load_json('checkins.json')
        user_checkins = [c for c in checkins_data['checkins'] if c['userId'] == user_id]
        
        # Calcular estatísticas
        week_stats = calculate_wellbeing_stats(user_checkins, 'week')
        month_stats = calculate_wellbeing_stats(user_checkins, 'month')
        
        # Preparar dados para gráfico
        user_checkins.sort(key=lambda x: (x['date'], x['time']))
        chart_data = [
            {
                'date': c['date'],
                'mood': c['mood'],
                'energy': c['energy']
            }
            for c in user_checkins[-14:]  # Últimos 14 dias
        ]
        
        # Gerar insights
        insights = []
        
        if week_stats['trend'] == 'improving':
            insights.append(f"Seu bem-estar está {((week_stats['avgMood'] / 5) * 100):.0f}% melhor que na semana passada! 🎉")
        elif week_stats['trend'] == 'declining':
            insights.append("Notei uma queda no seu bem-estar. Que tal aumentar o autocuidado esta semana?")
        
        if week_stats['checkinsCompleted'] >= 5:
            insights.append("Você tem mantido consistência nos check-ins. Parabéns! ⭐")
        
        if week_stats['avgEnergy'] < 3:
            insights.append("Sua energia está abaixo do ideal. Considere revisar sono, alimentação e pausas.")
        
        return jsonify({
            'success': True,
            'weekSummary': week_stats,
            'monthSummary': month_stats,
            'chartData': chart_data,
            'insights': insights
        })
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/dashboard/admin', methods=['GET'])
def admin_dashboard():
    """
    Retorna dados agregados para gestores (anonimizados)
    Query params: ?department=Marketing&period=week
    """
    try:
        department = request.args.get('department', 'all')
        period = request.args.get('period', 'week')
        
        # Carregar dados
        checkins_data = load_json('checkins.json')
        users_data = load_json('users.json')
        
        # Filtrar por departamento se especificado
        if department != 'all':
            dept_users = [u['id'] for u in users_data['users'] if u['department'] == department]
            relevant_checkins = [c for c in checkins_data['checkins'] if c['userId'] in dept_users]
        else:
            relevant_checkins = checkins_data['checkins']
        
        # Calcular estatísticas gerais
        overall_stats = calculate_wellbeing_stats(relevant_checkins, period)
        
        # Taxa de participação
        total_users = len(users_data['users'])
        users_with_checkins = len(set(c['userId'] for c in relevant_checkins))
        participation_rate = (users_with_checkins / total_users * 100) if total_users > 0 else 0
        
        # Identificar alertas (equipes em risco)
        alerts = []
        departments = set(u['department'] for u in users_data['users'])
        
        for dept in departments:
            dept_users = [u['id'] for u in users_data['users'] if u['department'] == dept]
            dept_checkins = [c for c in relevant_checkins if c['userId'] in dept_users]
            dept_stats = calculate_wellbeing_stats(dept_checkins, 'week')
            
            if dept_stats['avgMood'] < 2.5:
                alerts.append({
                    'team': dept,
                    'reason': f'Bem-estar abaixo do ideal (média {dept_stats["avgMood"]})',
                    'severity': 'high' if dept_stats['avgMood'] < 2 else 'medium'
                })
            
            if dept_stats['trend'] == 'declining':
                alerts.append({
                    'team': dept,
                    'reason': 'Tendência de queda no bem-estar',
                    'severity': 'medium'
                })
        
        # Distribuição de carga de trabalho
        workload_dist = {
            'leve': len([c for c in relevant_checkins if c['workload'] == 'leve']),
            'adequada': len([c for c in relevant_checkins if c['workload'] == 'adequada']),
            'pesada': len([c for c in relevant_checkins if c['workload'] == 'pesada'])
        }
        
        total = sum(workload_dist.values())
        workload_percent = {
            k: round((v / total * 100), 1) if total > 0 else 0
            for k, v in workload_dist.items()
        }
        
        return jsonify({
            'success': True,
            'overallWellbeing': overall_stats['avgMood'],
            'participationRate': round(participation_rate, 1),
            'alerts': alerts,
            'trends': overall_stats,
            'workloadDistribution': workload_percent
        })
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== ENDPOINTS DE RECURSOS ====================

@app.route('/api/resources', methods=['GET'])
def get_resources():
    """
    Retorna biblioteca de recursos
    Query params: ?category=Mindfulness&difficulty=Fácil
    """
    try:
        category = request.args.get('category')
        difficulty = request.args.get('difficulty')
        
        # Carregar recursos
        resources_data = load_json('resources.json')
        resources = resources_data['resources']
        
        # Filtrar
        if category:
            resources = [r for r in resources if r['category'] == category]
        
        if difficulty:
            resources = [r for r in resources if r['difficulty'] == difficulty]
        
        return jsonify({
            'success': True,
            'resources': resources,
            'categories': resources_data['categories']
        })
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

@app.route('/api/resources/<int:resource_id>', methods=['GET'])
def get_resource_detail(resource_id):
    """
    Retorna detalhes de um recurso específico
    """
    try:
        resources_data = load_json('resources.json')
        resource = next((r for r in resources_data['resources'] if r['id'] == resource_id), None)
        
        if not resource:
            return jsonify({'success': False, 'message': 'Recurso não encontrado'}), 404
        
        return jsonify({
            'success': True,
            'resource': resource
        })
    
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500

# ==================== ENDPOINT DE SAÚDE ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Verifica se a API está funcionando"""
    return jsonify({
        'status': 'healthy',
        'message': 'MindBalance API está funcionando!',
        'timestamp': datetime.now().isoformat()
    })

# ==================== INICIALIZAÇÃO ====================

if __name__ == '__main__':
    print("🧠 MindBalance API iniciando...")
    print("📍 Servidor rodando em: http://localhost:5000")
    print("💡 Pressione Ctrl+C para parar")
    app.run(debug=True, host='0.0.0.0', port=5000)
