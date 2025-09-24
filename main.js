// main.js - Gerencia a lógica central do aplicativo, incluindo autenticação,
// comunicação com o banco de dados (Supabase) e as regras de negócio.

// Configuração do cliente Supabase
const supabaseUrl = window.ENV.VITE_SUPABASE_URL;
const supabaseAnonKey = window.ENV.VITE_SUPABASE_ANON_KEY;
// Usando a versão UMD do Supabase que é carregada no HTML
const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

// =========================================
// FUNÇÕES DE AUTENTICAÇÃO
// =========================================

// Função para fazer o login de um usuário existente
async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        if (error) throw error;
        return { success: true, data: data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Função para cadastrar um novo usuário
async function signUp(email, password, options = {}) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: options
        });
        if (error) throw error;
        return { success: true, data: data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Função para deslogar o usuário
async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Ouve mudanças no estado de autenticação e notifica o app.js
if (typeof window.onAuthStateChange === 'function') {
    supabase.auth.onAuthStateChange(window.onAuthStateChange);
}

// =========================================
// FUNÇÕES DE GESTÃO DE DADOS (TRANSAÇÕES, CATEGORIAS, METAS)
// =========================================

/**
 * Busca todas as categorias do usuário logado.
 */
async function fetchCategories() {
    const { data, error } = await supabase
        .from('categorias')
        .select('*')
        .order('nome', { ascending: true }); // Ordena por nome

    if (error) {
        console.error("Erro ao buscar categorias:", error);
        return { success: false, error: error.message };
    }
    return { success: true, data: data };
}

/**
 * Adiciona uma nova transação financeira.
 * @param {object} transacao - Dados da transação (valor, data, tipo, categoria_id, descricao)
 */
async function addTransaction(transacao) {
    // Pega o ID do usuário logado
    const user = supabase.auth.getUser();
    if (!user) {
        return { success: false, error: "Usuário não autenticado." };
    }

    const { error } = await supabase
        .from('transacoes')
        .insert({
            user_id: user.data.user.id,
            valor: transacao.valor,
            data: transacao.data,
            tipo: transacao.tipo,
            categoria_id: transacao.categoria_id,
            descricao: transacao.descricao
        });

    if (error) {
        console.error("Erro ao adicionar transação:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

/**
 * Busca todas as transações do usuário logado.
 */
async function fetchTransactions() {
    const { data, error } = await supabase
        .from('transacoes')
        .select('*')
        .order('data', { ascending: false }); // Ordena pela data mais recente

    if (error) {
        console.error("Erro ao buscar transações:", error);
        return { success: false, error: error.message };
    }
    return { success: true, data: data };
}

/**
 * Adiciona uma nova meta financeira.
 * @param {object} meta - Dados da meta (nome, valor_alvo)
 */
async function addGoal(meta) {
    const user = supabase.auth.getUser();
    if (!user) {
        return { success: false, error: "Usuário não autenticado." };
    }

    const { error } = await supabase
        .from('metas_financeiras')
        .insert({
            user_id: user.data.user.id,
            nome: meta.nome,
            valor_alvo: meta.valor_alvo,
            valor_atual: 0 // Valor inicial sempre 0
        });
    
    if (error) {
        console.error("Erro ao adicionar meta:", error);
        return { success: false, error: error.message };
    }
    return { success: true };
}

/**
 * Busca todas as metas financeiras do usuário logado.
 */
async function fetchGoals() {
    const { data, error } = await supabase
        .from('metas_financeiras')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Erro ao buscar metas:", error);
        return { success: false, error: error.message };
    }
    return { success: true, data: data };
}


// =========================================
// FUNÇÕES DE LÓGICA DE NEGÓCIO
// =========================================

/**
 * Simula a verificação do status de assinatura do usuário.
 * No TCC, isso seria uma chamada a uma API de pagamento.
 * Aqui, vamos simular baseados em dados simples, como a contagem de transações.
 */
async function getSubscriptionStatus() {
    const { data: transacoes, error } = await supabase
        .from('transacoes')
        .select('id');
    
    if (error) {
        console.error("Erro ao verificar status de assinatura:", error);
        return { isPremium: false };
    }
    
    // Simula o plano Freemium: Gratuito até 10 transações
    const transactionLimit = 10;
    const isPremium = transacoes.length >= transactionLimit;
    
    return { isPremium: isPremium };
}

/**
 * Simula o processo de upgrade para o plano Premium.
 */
async function simulateUpgrade() {
    // Para o TCC, apenas retorna um sucesso simulado.
    // Em um projeto real, isso envolveria uma API de pagamento.
    return { success: true, message: "Upgrade para Premium simulado com sucesso!" };
}


// =========================================
// EXPOR FUNÇÕES GLOBALMENTE
// =========================================
window.signIn = signIn;
window.signUp = signUp;
window.signOut = signOut;
window.fetchCategories = fetchCategories;
window.addTransaction = addTransaction;
window.fetchTransactions = fetchTransactions;
window.addGoal = addGoal;
window.fetchGoals = fetchGoals;
window.getSubscriptionStatus = getSubscriptionStatus;
window.simulateUpgrade = simulateUpgrade;

console.log('Main.js carregado');
