/**
 * ==================================================================================
 * main.js - Cérebro da Aplicação "änalitks" (Com Simulador de IRPF)
 * ----------------------------------------------------------------------------------
 * Este ficheiro agora inclui a lógica completa para o simulador de
 * Imposto de Renda de Pessoa Física (IRPF) Anual.
 * ==================================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // PARTE 1: CONFIGURAÇÃO E SELETORES DE ELEMENTOS
    // ----------------------------------------------------------------------------------
    console.log("Iniciando o main.js...");

    const SUPABASE_URL = 'https://ejddiovmtjpipangyqeo.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqZGRpb3ZtdGpwaXBhbmd5cWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MTU4MDksImV4cCI6MjA3NDI5MTgwOX0.GH53mox_cijkhqAxy-sNmvxGcgtoLzuoE5sfP9hHdho';
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log('Cliente Supabase inicializado.');

    const screens = {
        auth: document.getElementById('auth-screen'),
        dashboard: document.getElementById('dashboard-screen'),
        irpf: document.getElementById('irpf-screen'),
    };

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

    const dashboardButtons = {
        salario: document.getElementById('goto-salario-btn'),
        investimentos: document.getElementById('goto-investimentos-btn'),
        ferias: document.getElementById('goto-ferias-btn'),
        decimoTerceiro: document.getElementById('goto-decimo-terceiro-btn'),
        horaValor: document.getElementById('goto-hora-valor-btn'),
        irpf: document.getElementById('goto-irpf-btn'),
    };

    const irpfElements = {
        form: {
            rendimentosAnuais: document.getElementById('rendimentos-anuais'),
            despesasSaude: document.getElementById('despesas-saude'),
            despesasEducacao: document.getElementById('despesas-educacao'),
            dependentes: document.getElementById('dependentes'),
        },
        buttons: {
            calcular: document.getElementById('calcular-irpf-btn'),
            voltar: document.getElementById('back-to-dashboard-from-irpf'),
        },
        results: {
            container: document.getElementById('irpf-results-section'),
            completa: document.getElementById('resultado-irpf-completa'),
            simplificada: document.getElementById('resultado-irpf-simplificada'),
            recomendacao: document.getElementById('recomendacao-irpf').querySelector('p'),
        }
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
            console.warn(`AVISO: A tela "${screenName}" ainda não foi criada no index.html.`);
            alert(`A funcionalidade para "${screenName}" ainda está em desenvolvimento!`);
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

    // PARTE 4: LÓGICA DE CÁLCULO DO IRPF ANUAL
    // ----------------------------------------------------------------------------------

    function calcularImpostoAnual(baseDeCalculo) {
        // Tabela Progressiva Anual IRPF (valores de exemplo para 2024/2025)
        const faixas = [
            { limite: 24511.92, aliquota: 0,     deducao: 0 },
            { limite: 33919.80, aliquota: 0.075, deducao: 1838.39 },
            { limite: 45012.60, aliquota: 0.15,  deducao: 4382.38 },
            { limite: 55976.16, aliquota: 0.225, deducao: 7758.32 },
            { limite: Infinity, aliquota: 0.275, deducao: 10557.13 }
        ];

        for (const faixa of faixas) {
            if (baseDeCalculo <= faixa.limite) {
                const imposto = (baseDeCalculo * faixa.aliquota) - faixa.deducao;
                return imposto > 0 ? imposto : 0;
            }
        }
        return 0;
    }

    function executarCalculoIRPFAnual() {
        const rendimentos = parseFloat(irpfElements.form.rendimentosAnuais.value) || 0;
        const saude = parseFloat(irpfElements.form.despesasSaude.value) || 0;
        const educacao = parseFloat(irpfElements.form.despesasEducacao.value) || 0;
        const dependentes = parseInt(irpfElements.form.dependentes.value) || 0;

        if (rendimentos <= 0) {
            alert('Por favor, insira o total de rendimentos anuais.');
            return;
        }

        // --- Valores de dedução (tabela de 2024/2025 como exemplo) ---
        const DEDUCAO_POR_DEPENDENTE = 2275.08;
        const LIMITE_DEDUCAO_EDUCACAO = 3561.50;
        const LIMITE_DESCONTO_SIMPLIFICADO = 16754.34;

        // --- Cálculo da Declaração Completa ---
        const deducaoDependentes = dependentes * DEDUCAO_POR_DEPENDENTE;
        const deducaoEducacao = Math.min(educacao, LIMITE_DEDUCAO_EDUCACAO);
        const totalDeducoes = deducaoDependentes + deducaoEducacao + saude;
        const baseCalculoCompleta = rendimentos - totalDeducoes;
        const impostoDevidoCompleta = calcularImpostoAnual(baseCalculoCompleta);

        // --- Cálculo da Declaração Simplificada ---
        const descontoSimplificado = rendimentos * 0.20;
        const descontoAplicado = Math.min(descontoSimplificado, LIMITE_DESCONTO_SIMPLIFICADO);
        const baseCalculoSimplificada = rendimentos - descontoAplicado;
        const impostoDevidoSimplificada = calcularImpostoAnual(baseCalculoSimplificada);

        // --- Exibir Resultados ---
        irpfElements.results.completa.textContent = `R$ ${impostoDevidoCompleta.toFixed(2)}`;
        irpfElements.results.simplificada.textContent = `R$ ${impostoDevidoSimplificada.toFixed(2)}`;

        if (impostoDevidoCompleta < impostoDevidoSimplificada) {
            irpfElements.results.recomendacao.textContent = "Recomendação: A Declaração COMPLETA é mais vantajosa!";
        } else if (impostoDevidoSimplificada < impostoDevidoCompleta) {
            irpfElements.results.recomendacao.textContent = "Recomendação: A Declaração SIMPLIFICADA é mais vantajosa!";
        } else {
            irpfElements.results.recomendacao.textContent = "Recomendação: Ambos os modelos resultam no mesmo valor de imposto.";
        }

        irpfElements.results.container.classList.remove('hidden');
    }

    // PARTE 5: REGISTO DE EVENT LISTENERS
    // ----------------------------------------------------------------------------------
    if(authButtons.showLogin) authButtons.showLogin.addEventListener('click', () => { authForms.choices.classList.add('hidden'); authForms.login.classList.remove('hidden'); });
    if(authButtons.showSignup) authButtons.showSignup.addEventListener('click', () => { authForms.choices.classList.add('hidden'); authForms.signup.classList.remove('hidden'); });
    if(authButtons.showLoginLink) authButtons.showLoginLink.addEventListener('click', (e) => { e.preventDefault(); authForms.signup.classList.add('hidden'); authForms.login.classList.remove('hidden'); });
    if(authButtons.showSignupLink) authButtons.showSignupLink.addEventListener('click', (e) => { e.preventDefault(); authForms.login.classList.add('hidden'); authForms.signup.classList.remove('hidden'); });
    if(authForms.login) authForms.login.addEventListener('submit', handleLogin);
    if(authForms.signup) authForms.signup.addEventListener('submit', handleSignup);
    if(authButtons.logout) authButtons.logout.addEventListener('click', handleLogout);

    // --- Navegação da Dashboard ---
    if(dashboardButtons.salario) dashboardButtons.salario.addEventListener('click', () => showScreen('salario'));
    if(dashboardButtons.investimentos) dashboardButtons.investimentos.addEventListener('click', () => showScreen('investimentos'));
    if(dashboardButtons.ferias) dashboardButtons.ferias.addEventListener('click', () => showScreen('ferias'));
    if(dashboardButtons.decimoTerceiro) dashboardButtons.decimoTerceiro.addEventListener('click', () => showScreen('decimoTerceiro'));
    if(dashboardButtons.horaValor) dashboardButtons.horaValor.addEventListener('click', () => showScreen('horaValor'));
    if(dashboardButtons.irpf) dashboardButtons.irpf.addEventListener('click', () => showScreen('irpf'));

    // --- Ações do Simulador IRPF ---
    if(irpfElements.buttons.calcular) irpfElements.buttons.calcular.addEventListener('click', executarCalculoIRPFAnual);
    if(irpfElements.buttons.voltar) irpfElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));

    // --- Estado de Autenticação ---
    supabaseClient.auth.onAuthStateChange((_event, session) => {
        updateUserUI(session ? session.user : null);
    });

    console.log("main.js carregado com sucesso. Aplicação pronta.");
});

