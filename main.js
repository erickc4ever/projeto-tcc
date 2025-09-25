// ===================================================================================
// ARQUIVO: main.js
// OBJETIVO: Cérebro da aplicação. Gerencia o estado, a autenticação e a
//           comunicação com o backend (Supabase).
// VERSÃO: Otimizada e Robusta
// ===================================================================================

// -----------------------------------------------------------------------------------
// 1. INICIALIZAÇÃO E CONFIGURAÇÃO DO SUPABASE
// -----------------------------------------------------------------------------------
const { createClient } = supabase;

// --- ATENÇÃO: PREENCHA COM AS SUAS CREDENCIAIS DO SUPABASE ---
const SUPABASE_URL = 'https://ejddiovmtjpipangyqeo.supabase.co'; // Encontre em: Project Settings > API > Project URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqZGRpb3ZtdGpwaXBhbmd5cWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MTU4MDksImV4cCI6MjA3NDI5MTgwOX0.GH53mox_cijkhqAxy-sNmvxGcgtoLzuoE5sfP9hHdho';     // Encontre em: Project Settings > API > Project API Keys > anon public

const sbClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// -----------------------------------------------------------------------------------
// 2. ESTADO GLOBAL DA APLICAÇÃO
// -----------------------------------------------------------------------------------
const appState = {
    user: null,
    vendas: [],
    categorias: [],
    metricas: null
};

// -----------------------------------------------------------------------------------
// 3. FUNÇÕES DE AUTENTICAÇÃO
// -----------------------------------------------------------------------------------
async function handleSignUp(email, password) {
    const { data, error } = await sbClient.auth.signUp({ email, password });
    if (error) {
        console.error('Erro no cadastro:', error.message);
        return { success: false, message: error.message };
    }
    return { success: true, user: data.user };
}

async function handleSignIn(email, password) {
    const { data, error } = await sbClient.auth.signInWithPassword({ email, password });
    if (error) {
        console.error('Erro no login:', error.message);
        return { success: false, message: error.message };
    }
    appState.user = data.user;
    return { success: true, user: data.user };
}

async function handleSignOut() {
    const { error } = await sbClient.auth.signOut();
    if (error) {
        console.error('Erro ao sair:', error.message);
    } else {
        Object.assign(appState, { user: null, vendas: [], categorias: [], metricas: null });
    }
}

// -----------------------------------------------------------------------------------
// 4. FUNÇÕES DE API (CONVERSA COM O BANCO DE DADOS)
// -----------------------------------------------------------------------------------
async function fetchCategories() {
    const { data, error } = await sbClient.from('categorias').select('id, nome');
    if (error) {
        console.error('Erro ao buscar categorias:', error.message);
        appState.categorias = [];
        return;
    }
    appState.categorias = data;
}

async function addCategory(categoryName) {
    const { data, error } = await sbClient.from('categorias').insert([{ nome: categoryName }]).select();
    if (error) {
        console.error('Erro ao adicionar categoria:', error.message);
        return { success: false, message: error.message };
    }
    return { success: true, data: data[0] };
}

async function addSale(saleData) {
    const { data, error } = await sbClient.from('vendas').insert([saleData]).select();
    if (error) {
        console.error('Erro ao adicionar venda:', error.message);
        return { success: false, message: error.message };
    }
    return { success: true, data: data[0] };
}

async function fetchSales(filters = {}) {
    let query = sbClient.from('vendas')
        .select('id, produto, quantidade, valor_unitario, total, data_venda, categorias(id, nome)')
        .order('data_venda', { ascending: false });

    if (filters.startDate) query = query.gte('data_venda', filters.startDate);
    if (filters.endDate) query = query.lte('data_venda', filters.endDate);
    if (filters.categoryId) query = query.eq('categoria_id', filters.categoryId);

    const { data, error } = await query;
    if (error) {
        console.error('Erro ao buscar vendas:', error.message);
        appState.vendas = [];
        return;
    }
    appState.vendas = data;
}

async function getDashboardMetrics(filters = {}) {
    // Esta é a chamada mais otimizada: uma única requisição para buscar todas as métricas.
    const { data, error } = await sbClient.rpc('get_dashboard_metrics', {
        start_date: filters.startDate || null,
        end_date: filters.endDate || null,
        category_id_filter: filters.categoryId || null
    });

    if (error) {
        console.error('Erro ao buscar métricas:', error.message);
        appState.metricas = null;
        return;
    }
    appState.metricas = data;
}

// -----------------------------------------------------------------------------------
// 5. ORQUESTRAÇÃO E FLUXO DE DADOS (Otimizações Principais)
// -----------------------------------------------------------------------------------

/**
 * Carrega todos os dados iniciais do dashboard em paralelo para máxima velocidade.
 * @param {object} filters - Filtros a serem aplicados no carregamento.
 */
async function loadDashboardData(filters = {}) {
    // Mostra um indicador de carregamento na UI (função do app.js)
    showLoadingIndicator(true);
    
    // Executa as buscas de dados essenciais em paralelo.
    await Promise.all([
        getDashboardMetrics(filters),
        fetchCategories(),
        fetchSales(filters)
    ]);
    
    // Com todos os dados no appState, manda o app.js renderizar tudo.
    renderDashboard(appState);

    // Esconde o indicador de carregamento.
    showLoadingIndicator(false);
}

/**
 * Função chamada pela UI quando o usuário adiciona uma nova venda.
 * Garante que os dados sejam reinseridos e a tela atualizada.
 */
async function onSaleAdded() {
    // Recarrega todos os dados do dashboard sem filtros.
    await loadDashboardData();
}

/**
 * Função chamada pela UI quando o usuário aplica novos filtros.
 * @param {object} filters - Os filtros selecionados na interface.
 */
async function onFiltersChanged(filters) {
    // Recarrega todos os dados do dashboard com os novos filtros.
    await loadDashboardData(filters);
}

// -----------------------------------------------------------------------------------
// 6. PONTO DE ENTRADA E CONTROLE DE SESSÃO
// -----------------------------------------------------------------------------------

/**
 * Observa as mudanças de estado de autenticação (login, logout, sessão inicial).
 * Controla qual "tela" (login ou dashboard) o usuário vê.
 */
function setupAuthListener() {
    sbClient.auth.onAuthStateChange((_event, session) => {
        if (session) {
            // Se existe uma sessão, o usuário está logado.
            appState.user = session.user;
            showDashboardView(); // Função do app.js que mostra a seção do dashboard
            loadDashboardData(); // Carrega os dados do dashboard
        } else {
            // Se não há sessão, o usuário está deslogado.
            appState.user = null;
            showLoginView(); // Função do app.js que mostra a seção de login
        }
    });
}

// Ponto de entrada da aplicação.
function init() {
    console.log('App inicializado.');
    setupAuthListener();
}

document.addEventListener('DOMContentLoaded', init);

