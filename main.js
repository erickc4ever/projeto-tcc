/**
 * ==================================================================================
 * main.js - Cérebro da Aplicação "änalitks" (Versão Corrigida)
 * ----------------------------------------------------------------------------------
 * O código foi envolvido por 'DOMContentLoaded' para garantir que o HTML
 * esteja pronto antes da execução, corrigindo o bug da tela em branco.
 * ==================================================================================
 */

// Espera o HTML ser completamente carregado para executar o script.
document.addEventListener('DOMContentLoaded', () => {
    
    // PARTE 1: CONFIGURAÇÃO E SELETORES DE ELEMENTOS
    // ----------------------------------------------------------------------------------
    console.log("Iniciando o main.js...");

    // --- Configuração do Supabase ---
    const SUPABASE_URL = 'https://ejddiovmtjpipangyqeo.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqZGRpb3ZtdGpwaXBhbmd5cWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MTU4MDksImV4cCI6MjA3NDI5MTgwOX0.GH53mox_cijkhqAxy-sNmvxGcgtoLzuoE5sfP9hHdho';
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Cliente Supabase inicializado.');

    // --- Seletores de Telas ---
    const screens = {
        auth: document.getElementById('auth-screen'),
        dashboard: document.getElementById('dashboard-screen'),
        // Adicione aqui os IDs das outras telas de calculadora quando forem criadas
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
        logout: document.getElementById('logout-btn'),
    };
    
    // Adicione aqui outros seletores (calculadora, dashboard, etc.)

    
    // PARTE 2: FUNÇÕES DE GESTÃO DE TELA E UI
    // ----------------------------------------------------------------------------------

    function showScreen(screenName) {
        // Esconde todas as telas
        Object.values(screens).forEach(screen => {
            if (screen) screen.classList.add('hidden');
        });
        
        // Mostra a tela desejada
        if (screens[screenName]) {
            screens[screenName].classList.remove('hidden');
            console.log(`A exibir a tela: ${screenName}`);
        } else {
            console.error(`ERRO: A tela "${screenName}" não foi encontrada.`);
        }
    }

    function updateUserUI(user) {
        const welcomeMessage = document.getElementById('welcome-message');
        if (user) {
            if(welcomeMessage) {
                welcomeMessage.textContent = `Bem-vindo(a), ${user.email}!`;
            }
            showScreen('dashboard');
        } else {
            showScreen('auth');
        }
    }


    // PARTE 3: FUNÇÕES DE AUTENTICAÇÃO
    // ----------------------------------------------------------------------------------

    async function handleLogin(event) {
        event.preventDefault();
        const emailInput = authForms.login.querySelector('#login-email');
        const passwordInput = authForms.login.querySelector('#login-password');
        const email = emailInput.value;
        const password = passwordInput.value;

        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        
        if (error) {
            alert(`Erro no login: ${error.message}`);
            console.error('Erro de login:', error);
        } else {
            console.log('Login bem-sucedido:', data.user);
            // O onAuthStateChange cuidará de mostrar a dashboard
        }
    }

    async function handleSignup(event) {
        event.preventDefault();
        const emailInput = authForms.signup.querySelector('#signup-email');
        const passwordInput = authForms.signup.querySelector('#signup-password');
        const email = emailInput.value;
        const password = passwordInput.value;

        const { error } = await supabaseClient.auth.signUp({ email, password });
        
        if (error) {
            alert(`Erro no registo: ${error.message}`);
        } else {
            alert('Registo realizado! Verifique o seu e-mail para confirmar a conta e depois faça o login.');
            authForms.signup.classList.add('hidden');
            authForms.login.classList.remove('hidden');
        }
    }

    async function handleLogout() {
        await supabaseClient.auth.signOut();
        // O onAuthStateChange cuidará de mostrar a tela de auth
        authForms.login.reset();
        authForms.signup.reset();
        authForms.login.classList.add('hidden');
        authForms.signup.classList.add('hidden');
        authForms.choices.classList.remove('hidden');
        console.log("Utilizador deslogado.");
    }


    // PARTE 4: REGISTO DE EVENT LISTENERS
    // ----------------------------------------------------------------------------------
    console.log("A registar event listeners...");

    // --- Autenticação ---
    if(authButtons.showLogin) authButtons.showLogin.addEventListener('click', () => {
        authForms.choices.classList.add('hidden');
        authForms.login.classList.remove('hidden');
    });

    if(authButtons.showSignup) authButtons.showSignup.addEventListener('click', () => {
        authForms.choices.classList.add('hidden');
        authForms.signup.classList.remove('hidden');
    });

    if(authButtons.showLoginLink) authButtons.showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        authForms.signup.classList.add('hidden');
        authForms.login.classList.remove('hidden');
    });

    if(authButtons.showSignupLink) authButtons.showSignupLink.addEventListener('click', (e) => {
        e.preventDefault();
        authForms.login.classList.add('hidden');
        authForms.signup.classList.remove('hidden');
    });

    if(authForms.login) authForms.login.addEventListener('submit', handleLogin);
    if(authForms.signup) authForms.signup.addEventListener('submit', handleSignup);
    if(authButtons.logout) authButtons.logout.addEventListener('click', handleLogout);

    // --- Estado de Autenticação ---
    supabaseClient.auth.onAuthStateChange((_event, session) => {
        console.log("Estado de autenticação mudou:", session);
        updateUserUI(session ? session.user : null);
    });

    console.log("main.js carregado com sucesso. Aplicação pronta.");

});

