/**
 * ==================================================================================
 * main.js - Cérebro da Aplicação "änalitks" (Versão com Dashboard Funcional)
 * ----------------------------------------------------------------------------------
 * Este ficheiro agora inclui a lógica para navegar a partir da dashboard
 * para as diferentes telas de calculadora.
 * ==================================================================================
 */

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
        // As telas das calculadoras serão adicionadas aqui quando forem criadas no HTML
        // Ex: salario: document.getElementById('salario-screen'),
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

    // --- Seletores da Dashboard ---
    const dashboardButtons = {
        // Atribuindo IDs aos botões da dashboard para podermos selecioná-los
        salario: document.getElementById('goto-salario-btn'),
        investimentos: document.getElementById('goto-investimentos-btn'),
        ferias: document.getElementById('goto-ferias-btn'),
        decimoTerceiro: document.getElementById('goto-decimo-terceiro-btn'),
        horaValor: document.getElementById('goto-hora-valor-btn'),
    };
    
    // PARTE 2: FUNÇÕES DE GESTÃO DE TELA E UI
    // ----------------------------------------------------------------------------------

    function showScreen(screenName) {
        Object.values(screens).forEach(screen => {
            if (screen) screen.classList.add('hidden');
        });
        
        if (screens[screenName]) {
            screens[screenName].classList.remove('hidden');
            console.log(`A exibir a tela: ${screenName}`);
        } else {
            // Aviso amigável de que a tela ainda precisa de ser criada
            console.warn(`AVISO: A tela "${screenName}" ainda não foi criada no index.html.`);
            alert(`A funcionalidade para "${screenName}" ainda está em desenvolvimento!`);
            // Mostra a dashboard novamente como fallback
            screens.dashboard.classList.remove('hidden');
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
    // (As funções handleLogin, handleSignup, e handleLogout permanecem as mesmas)
    async function handleLogin(event) {
        event.preventDefault();
        const email = authForms.login.querySelector('#login-email').value;
        const password = authForms.login.querySelector('#login-password').value;
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) alert(`Erro no login: ${error.message}`);
    }

    async function handleSignup(event) {
        event.preventDefault();
        const email = authForms.signup.querySelector('#signup-email').value;
        const password = authForms.signup.querySelector('#signup-password').value;
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
        authForms.login.reset();
        authForms.signup.reset();
        authForms.login.classList.add('hidden');
        authForms.signup.classList.add('hidden');
        authForms.choices.classList.remove('hidden');
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

    // --- Navegação da Dashboard ---
    if(dashboardButtons.salario) dashboardButtons.salario.addEventListener('click', () => showScreen('salario'));
    if(dashboardButtons.investimentos) dashboardButtons.investimentos.addEventListener('click', () => showScreen('investimentos'));
    if(dashboardButtons.ferias) dashboardButtons.ferias.addEventListener('click', () => showScreen('ferias'));
    if(dashboardButtons.decimoTerceiro) dashboardButtons.decimoTerceiro.addEventListener('click', () => showScreen('decimoTerceiro'));
    if(dashboardButtons.horaValor) dashboardButtons.horaValor.addEventListener('click', () => showScreen('horaValor'));


    // --- Estado de Autenticação ---
    supabaseClient.auth.onAuthStateChange((_event, session) => {
        updateUserUI(session ? session.user : null);
    });

    console.log("main.js carregado com sucesso. Aplicação pronta.");
});

