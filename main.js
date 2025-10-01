/**
 * ==================================================================================
 * main.js - Cérebro da Aplicação "änalitks"
 * ----------------------------------------------------------------------------------
 * Responsabilidades:
 * 1. Gerenciar a exibição de telas (Autenticação, Dashboard, etc.).
 * 2. Lidar com a lógica de autenticação de usuários (Login, Cadastro, Logout).
 * 3. Orquestrar a navegação entre as diferentes ferramentas financeiras.
 * 4. Conter as funções de cálculo para cada ferramenta.
 * ==================================================================================
 */

// PARTE 1: CONFIGURAÇÃO E SELETORES DE ELEMENTOS
// ----------------------------------------------------------------------------------
console.log("Iniciando o main.js da änalitks...");

// --- Configuração do Supabase ---
const SUPABASE_URL = 'https://ejddiovmtjpipangyqeo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqZGRpb3ZtdGpwaXBhbmd5cWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MTU4MDksImV4cCI6MjA3NDI5MTgwOX0.GH53mox_cijkhqAxy-sNmvxGcgtoLzuoE5sfP9hHdho';
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log('Cliente Supabase inicializado.');

// --- Seletores de Telas ---
const screens = {
    auth: document.getElementById('auth-screen'),
    dashboard: document.getElementById('dashboard-screen'),
    // Adicionaremos as telas de cada calculadora aqui no futuro
};

// --- Seletores de Autenticação ---
const authForms = {
    login: document.getElementById('login-form'),
    signup: document.getElementById('signup-form'),
    choices: document.getElementById('auth-choices'),
};
const authButtons = {
    showLogin: document.getElementById('show-login-btn'),
    showSignup: document.getElementById('show-signup-btn'),
    showLoginLink: document.getElementById('show-login-link'),
    showSignupLink: document.getElementById('show-signup-link'),
    // O botão de logout estará na dashboard, vamos selecioná-lo depois
};


// PARTE 2: GERENCIAMENTO DE TELAS E UI
// ----------------------------------------------------------------------------------

/**
 * Esconde todas as telas e exibe apenas a tela desejada.
 * @param {string} screenName - O nome da tela a ser exibida ('auth', 'dashboard', etc.).
 */
function showScreen(screenName) {
    // Esconde todas as telas
    Object.values(screens).forEach(screen => screen.classList.add('hidden'));
    
    // Mostra a tela solicitada
    if (screens[screenName]) {
        screens[screenName].classList.remove('hidden');
        console.log(`Exibindo a tela: ${screenName}`);
    } else {
        console.error(`ERRO: A tela "${screenName}" não foi encontrada.`);
    }
}

/**
 * Atualiza a interface com base no estado de login do usuário.
 * @param {object|null} user - O objeto do usuário do Supabase, ou null se não estiver logado.
 */
function updateUserUI(user) {
    if (user) {
        // Se o usuário está logado, mostra a dashboard
        // Vamos popular a dashboard com informações do usuário no futuro
        showScreen('dashboard');
    } else {
        // Se não há usuário, mostra a tela de autenticação
        showScreen('auth');
    }
}


// PARTE 3: LÓGICA DE AUTENTICAÇÃO
// ----------------------------------------------------------------------------------

/**
 * Lida com o envio do formulário de login.
 * @param {Event} event - O evento de submit do formulário.
 */
async function handleLogin(event) {
    event.preventDefault(); // Impede o recarregamento da página
    const email = authForms.login.querySelector('#login-email').value;
    const password = authForms.login.querySelector('#login-password').value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
        alert(`Erro no login: ${error.message}`);
        console.error("Erro no login:", error);
    } else {
        console.log("Login bem-sucedido:", data.user.email);
        // O onAuthStateChange cuidará de mostrar a dashboard
    }
}

/**
 * Lida com o envio do formulário de cadastro.
 * @param {Event} event - O evento de submit do formulário.
 */
async function handleSignup(event) {
    event.preventDefault();
    const email = authForms.signup.querySelector('#signup-email').value;
    const password = authForms.signup.querySelector('#signup-password').value;

    const { error } = await supabaseClient.auth.signUp({ email, password });

    if (error) {
        alert(`Erro no cadastro: ${error.message}`);
        console.error("Erro no cadastro:", error);
    } else {
        alert('Cadastro realizado! Verifique seu e-mail para confirmar a conta e depois faça o login.');
        // Volta para a tela de login
        authForms.signup.classList.add('hidden');
        authForms.login.classList.remove('hidden');
    }
}

// Futuramente, a função de logout será adicionada aqui.


// PARTE 4: REGISTRO DE EVENTOS (EVENT LISTENERS)
// ----------------------------------------------------------------------------------
console.log("Registrando eventos...");

// --- Eventos da UI de Autenticação ---

// Botão "Já tenho cadastro" mostra o formulário de login
authButtons.showLogin.addEventListener('click', () => {
    authForms.choices.classList.add('hidden');
    authForms.login.classList.remove('hidden');
});

// Botão "Sou novo" mostra o formulário de cadastro
authButtons.showSignup.addEventListener('click', () => {
    authForms.choices.classList.add('hidden');
    authForms.signup.classList.remove('hidden');
});

// Link "Já tem uma conta?" (no form de cadastro) mostra o formulário de login
authButtons.showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    authForms.signup.classList.add('hidden');
    authForms.login.classList.remove('hidden');
});

// Link "Não tem uma conta?" (no form de login) mostra o formulário de cadastro
authButtons.showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    authForms.login.classList.add('hidden');
    authForms.signup.classList.remove('hidden');
});

// --- Eventos de Envio dos Formulários ---
authForms.login.addEventListener('submit', handleLogin);
authForms.signup.addEventListener('submit', handleSignup);


// PARTE 5: INICIALIZAÇÃO E ESTADO DE AUTENTICAÇÃO
// ----------------------------------------------------------------------------------

// Ouve as mudanças no estado de autenticação (login, logout)
supabaseClient.auth.onAuthStateChange((_event, session) => {
    console.log("Estado de autenticação mudou. Sessão:", session);
    // A função updateUserUI será chamada sempre que o estado mudar,
    // garantindo que a tela correta seja exibida.
    updateUserUI(session ? session.user : null);
});

console.log("main.js da änalitks carregado com sucesso. Aplicação pronta.");

