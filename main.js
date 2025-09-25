// ===================================================================================
// ARQUIVO: main.js (Cérebro da Aplicação)
// OBJETIVO: Gerir a lógica de negócios, estado da aplicação e comunicação com o Supabase.
// VERSÃO: Refatorada para maior segurança e menor repetição de código.
// ===================================================================================

console.log('🚀 Sistema Analítico iniciado! Aguardando configuração do Supabase...');

// -----------------------------------------------------------------------------------
// 1. CONFIGURAÇÃO DO CLIENTE SUPABASE E CONSTANTES
// -----------------------------------------------------------------------------------
const SUPABASE_URL = 'https://ejddiovmtjpipangyqeo.supabase.co'; // Substitua pelo seu URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqZGRpb3ZtdGpwaXBhbmd5cWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MTU4MDksImV4cCI6MjA3NDI5MTgwOX0.GH53mox_cijkhqAxy-sNmvxGcgtoLzuoE5sfP9hHdho'; // Substitua pela sua Chave Anon

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('✅ Cliente Supabase configurado.');

// --- PONTO DE SEGURANÇA ---
// O e-mail abaixo é usado APENAS para VERIFICAR se um usuário já logado tem
// permissões de admin. A conta de admin deve ser criada normalmente pelo
// formulário de cadastro. NUNCA coloque senhas no código.
const ADMIN_EMAIL = 'admin123@gmail.com';

// -----------------------------------------------------------------------------------
// 2. ESTADO GLOBAL DA APLICAÇÃO
// -----------------------------------------------------------------------------------
const appState = {
    user: null,
    isAdmin: false,
    vendas: [],
    categorias: [],
    metricas: {},
    globalCategories: [],
    filtros: { startDate: null, endDate: null, categoryId: null },
};

// -----------------------------------------------------------------------------------
// 3. FUNÇÕES AUXILIARES OTIMIZADAS (Menos Repetição)
// -----------------------------------------------------------------------------------

/**
 * Função genérica para executar ações de autenticação, mostrando o loader
 * e tratando erros de forma centralizada.
 * @param {Function} authPromise - A função de autenticação do Supabase a ser chamada.
 * @param {object} credentials - As credenciais (email, password).
 * @returns {Promise<{success: boolean, message?: string}>}
 */
async function handleAuthAction(authPromise, credentials) {
    showLoadingIndicator(true);
    const { data, error } = await authPromise(credentials);
    showLoadingIndicator(false);

    if (error) {
        console.error('Erro na autenticação:', error.message);
        return { success: false, message: error.message };
    }
    return { success: true };
}

/**
 * Função genérica para escrever dados no banco (insert, delete),
 * mostrando o loader e tratando erros.
 * @param {object} queryPromise - A query do Supabase a ser executada.
 * @param {string} successMessage - Mensagem para logar em caso de sucesso.
 * @returns {Promise<{success: boolean}>}
 */
async function writeData(queryPromise, successMessage) {
    showLoadingIndicator(true);
    const { error } = await queryPromise;
    showLoadingIndicator(false);

    if (error) {
        console.error('Erro na operação com o banco de dados:', error.message);
        return { success: false };
    }
    if (successMessage) console.log(successMessage);
    return { success: true };
}


// -----------------------------------------------------------------------------------
// 4. FUNÇÕES DE AUTENTICAÇÃO (Agora usando os auxiliares)
// -----------------------------------------------------------------------------------
const handleSignIn = async (email, password) => {
    const result = await handleAuthAction(supabase.auth.signInWithPassword.bind(supabase.auth), { email, password });
    if(result.success) console.log('Login bem-sucedido para:', email);
    return result;
};

const handleSignUp = async (email, password) => {
    const result = await handleAuthAction(supabase.auth.signUp.bind(supabase.auth), { email, password });
    if (result.success) console.log('Novo usuário cadastrado:', email);
    return result;
};

const handleSignOut = async () => {
    await supabase.auth.signOut();
    console.log('🚪 Usuário deslogado.');
};

// -----------------------------------------------------------------------------------
// 5. FUNÇÕES DE API (INTERAÇÃO COM O BANCO DE DADOS)
// -----------------------------------------------------------------------------------

// --- Funções de Leitura ---
const fetchUserCategories = async () => supabase.from('categorias').select('*');
const fetchSales = async () => {
    let query = supabase.from('vendas').select('*, categorias(nome)').order('data_venda', { ascending: false });
    if (appState.filtros.startDate) query = query.gte('data_venda', appState.filtros.startDate);
    if (appState.filtros.endDate) query = query.lte('data_venda', appState.filtros.endDate);
    if (appState.filtros.categoryId) query = query.eq('categoria_id', appState.filtros.categoryId);
    return query;
};
const fetchDashboardMetrics = async () => supabase.rpc('get_dashboard_metrics', {
    p_start_date: appState.filtros.startDate,
    p_end_date: appState.filtros.endDate,
    p_category_id: appState.filtros.categoryId
});
const fetchGlobalCategories = async () => {
    const { data, error } = await supabase.from('categorias_globais').select('*').order('nome');
    if (error) console.error('Erro ao buscar categorias globais:', error);
    return data || [];
};

// --- Funções de Escrita (Agora usando o auxiliar 'writeData') ---
const addSale = (saleData) => writeData(supabase.from('vendas').insert([saleData]));
const addGlobalCategory = (name) => writeData(supabase.from('categorias_globais').insert([{ nome: name }]), `✅ Categoria global "${name}" adicionada.`);
const deleteGlobalCategory = (id) => writeData(supabase.from('categorias_globais').delete().eq('id', id), `🗑️ Categoria global ID ${id} deletada.`);

// -----------------------------------------------------------------------------------
// 6. ORQUESTRADORES E FLUXO PRINCIPAL
// -----------------------------------------------------------------------------------
const loadDashboardData = async () => {
    console.log('🔄 Carregando dados do dashboard...');
    showLoadingIndicator(true);
    
    const [salesRes, categoriesRes, metricsRes] = await Promise.all([
        fetchSales(),
        fetchUserCategories(),
        fetchDashboardMetrics()
    ]);

    appState.vendas = salesRes.data || [];
    appState.categorias = categoriesRes.data || [];
    appState.metricas = metricsRes.data ? metricsRes.data[0] : {};

    if (appState.isAdmin) {
        console.log('👑 Admin detectado. Buscando categorias globais...');
        appState.globalCategories = await fetchGlobalCategories();
    }
    
    showLoadingIndicator(false);
    console.log('✅ Dados do dashboard carregados.', appState);
    renderDashboard(appState); 
};

const onFiltersChanged = (newFilters) => {
    appState.filtros = { ...appState.filtros, ...newFilters };
    loadDashboardData();
};

const onDataChanged = () => {
    console.log('Dados alterados. Recarregando...');
    loadDashboardData();
};

// -----------------------------------------------------------------------------------
// 7. LISTENER DE AUTENTICAÇÃO E INICIALIZAÇÃO
// -----------------------------------------------------------------------------------
const setupAuthListener = () => {
    console.log('🔑 Listener de autenticação configurado. Verificando sessão...');
    supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
            const user = session.user;
            appState.user = user;
            appState.isAdmin = user.email === ADMIN_EMAIL;
            
            console.log(appState.isAdmin ? '👑 Acesso de administrador concedido para:' : '👤 Acesso de usuário padrão para:', user.email);
            
            showDashboardView();
            loadDashboardData();
        } else {
            appState.user = null;
            appState.isAdmin = false;
            showLoginView();
        }
    });
};

// Inicia a aplicação
setupAuthListener();

