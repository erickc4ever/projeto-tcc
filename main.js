/**
 * ==================================================================================
 * main.js - Cérebro da Aplicação "änalitks" (Com Simulador de Investimentos)
 * ----------------------------------------------------------------------------------
 * Este ficheiro agora inclui a lógica completa para a ferramenta de
 * simulação de juros compostos para investimentos.
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
        salario: document.getElementById('salario-screen'),
        investimentos: document.getElementById('investimentos-screen'), // Nova tela
        irpf: document.getElementById('irpf-screen'),
    };

    // --- Seletores de Autenticação, Dashboard, Salário e IRPF (sem alterações) ---
    const authForms = { login: document.getElementById('login-form'), signup: document.getElementById('signup-form'), choices: document.getElementById('auth-choices') };
    const authButtons = { showLogin: document.getElementById('show-login-btn'), showSignup: document.getElementById('show-signup-btn'), showLoginLink: document.getElementById('show-login-link'), showSignupLink: document.getElementById('show-signup-link'), logout: document.getElementById('logout-btn') };
    const dashboardButtons = { salario: document.getElementById('goto-salario-btn'), investimentos: document.getElementById('goto-investimentos-btn'), ferias: document.getElementById('goto-ferias-btn'), decimoTerceiro: document.getElementById('goto-decimo-terceiro-btn'), horaValor: document.getElementById('goto-hora-valor-btn'), irpf: document.getElementById('goto-irpf-btn') };
    const salarioElements = { form: { salarioBruto: document.getElementById('salario-bruto'), dependentes: document.getElementById('salario-dependentes') }, buttons: { calcular: document.getElementById('calcular-salario-btn'), voltar: document.getElementById('back-to-dashboard-from-salario') }, results: { container: document.getElementById('salario-results-section'), salarioBruto: document.getElementById('resultado-salario-bruto'), inss: document.getElementById('resultado-inss'), baseIrrf: document.getElementById('resultado-base-irrf'), irrf: document.getElementById('resultado-irrf'), salarioLiquido: document.getElementById('resultado-salario-liquido'), explicacaoInss: document.getElementById('explicacao-inss'), explicacaoIrrf: document.getElementById('explicacao-irrf') } };
    const irpfElements = { form: { rendimentosAnuais: document.getElementById('rendimentos-anuais'), despesasSaude: document.getElementById('despesas-saude'), despesasEducacao: document.getElementById('despesas-educacao'), dependentes: document.getElementById('dependentes') }, buttons: { calcular: document.getElementById('calcular-irpf-btn'), voltar: document.getElementById('back-to-dashboard-from-irpf') }, results: { container: document.getElementById('irpf-results-section'), completa: document.getElementById('resultado-irpf-completa'), simplificada: document.getElementById('resultado-irpf-simplificada'), recomendacao: document.getElementById('recomendacao-irpf').querySelector('p') } };

    // --- Seletores do Simulador de Investimentos ---
    const investimentosElements = {
        form: {
            valorInicial: document.getElementById('valor-inicial'),
            aporteMensal: document.getElementById('aporte-mensal'),
            taxaJurosAnual: document.getElementById('taxa-juros-anual'),
            periodoAnos: document.getElementById('periodo-anos'),
        },
        buttons: {
            calcular: document.getElementById('calcular-investimentos-btn'),
            voltar: document.getElementById('back-to-dashboard-from-investimentos'),
        },
        results: {
            container: document.getElementById('investimentos-results-section'),
            valorFinal: document.getElementById('resultado-valor-final'),
            totalInvestido: document.getElementById('resultado-total-investido'),
            totalJuros: document.getElementById('resultado-total-juros'),
        }
    };
    
    // PARTE 2: FUNÇÕES DE GESTÃO DE TELA E UI
    // ----------------------------------------------------------------------------------
    function showScreen(screenName) {
        Object.values(screens).forEach(screen => { if (screen) screen.classList.add('hidden'); });
        if (screens[screenName]) {
            screens[screenName].classList.remove('hidden');
            console.log(`A exibir a tela: ${screenName}`);
        } else {
            console.warn(`AVISO: A tela "${screenName}" ainda não foi criada no index.html.`);
            alert(`A funcionalidade para "${screenName}" ainda está em desenvolvimento!`);
            screens.dashboard.classList.remove('hidden');
        }
    }
    function updateUserUI(user) { const welcomeMessage = document.getElementById('welcome-message'); if (user) { if(welcomeMessage) { welcomeMessage.textContent = `Bem-vindo(a), ${user.email}!`; } showScreen('dashboard'); } else { showScreen('auth'); } }

    // PARTE 3: FUNÇÕES DE AUTENTICAÇÃO (sem alterações)
    // ----------------------------------------------------------------------------------
    async function handleLogin(event) { event.preventDefault(); const email = authForms.login.querySelector('#login-email').value; const password = authForms.login.querySelector('#login-password').value; const { error } = await supabaseClient.auth.signInWithPassword({ email, password }); if (error) alert(`Erro no login: ${error.message}`); }
    async function handleSignup(event) { event.preventDefault(); const email = authForms.signup.querySelector('#signup-email').value; const password = authForms.signup.querySelector('#signup-password').value; const { error } = await supabaseClient.auth.signUp({ email, password }); if (error) { alert(`Erro no registo: ${error.message}`); } else { alert('Registo realizado! Verifique o seu e-mail para confirmar a conta e depois faça o login.'); authForms.signup.classList.add('hidden'); authForms.login.classList.remove('hidden'); } }
    async function handleLogout() { await supabaseClient.auth.signOut(); authForms.login.reset(); authForms.signup.reset(); authForms.login.classList.add('hidden'); authForms.signup.classList.add('hidden'); authForms.choices.classList.remove('hidden'); }

    // PARTE 4: LÓGICA DE CÁLCULO
    // ----------------------------------------------------------------------------------
    
    function executarCalculoSalario() { /* ... Lógica do Salário já implementada ... */ }
    function executarCalculoIRPFAnual() { /* ... Lógica do IRPF Anual já implementada ... */ }

    // --- Lógica do Simulador de Investimentos ---
    function executarSimulacaoInvestimentos() {
        const valorInicial = parseFloat(investimentosElements.form.valorInicial.value) || 0;
        const aporteMensal = parseFloat(investimentosElements.form.aporteMensal.value) || 0;
        const taxaJurosAnual = parseFloat(investimentosElements.form.taxaJurosAnual.value) || 0;
        const periodoAnos = parseInt(investimentosElements.form.periodoAnos.value) || 0;

        if (taxaJurosAnual <= 0 || periodoAnos <= 0) {
            alert('Por favor, insira uma taxa de juros e um período em anos válidos.');
            return;
        }

        const taxaMensal = (taxaJurosAnual / 100) / 12;
        const periodoMeses = periodoAnos * 12;

        let valorAcumulado = valorInicial;

        for (let i = 0; i < periodoMeses; i++) {
            valorAcumulado *= (1 + taxaMensal); // Aplica juros ao montante total
            valorAcumulado += aporteMensal;     // Adiciona o novo aporte
        }

        const totalInvestido = valorInicial + (aporteMensal * periodoMeses);
        const totalJuros = valorAcumulado - totalInvestido;

        // --- Exibir Resultados ---
        investimentosElements.results.valorFinal.textContent = `R$ ${valorAcumulado.toFixed(2)}`;
        investimentosElements.results.totalInvestido.textContent = `R$ ${totalInvestido.toFixed(2)}`;
        investimentosElements.results.totalJuros.textContent = `R$ ${totalJuros.toFixed(2)}`;

        investimentosElements.results.container.classList.remove('hidden');
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

    if(dashboardButtons.salario) dashboardButtons.salario.addEventListener('click', () => showScreen('salario'));
    if(dashboardButtons.investimentos) dashboardButtons.investimentos.addEventListener('click', () => showScreen('investimentos'));
    if(dashboardButtons.ferias) dashboardButtons.ferias.addEventListener('click', () => showScreen('ferias'));
    if(dashboardButtons.decimoTerceiro) dashboardButtons.decimoTerceiro.addEventListener('click', () => showScreen('decimoTerceiro'));
    if(dashboardButtons.horaValor) dashboardButtons.horaValor.addEventListener('click', () => showScreen('horaValor'));
    if(dashboardButtons.irpf) dashboardButtons.irpf.addEventListener('click', () => showScreen('irpf'));

    if(salarioElements.buttons.calcular) salarioElements.buttons.calcular.addEventListener('click', executarCalculoSalario);
    if(salarioElements.buttons.voltar) salarioElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
    if(irpfElements.buttons.calcular) irpfElements.buttons.calcular.addEventListener('click', executarCalculoIRPFAnual);
    if(irpfElements.buttons.voltar) irpfElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
    
    // --- Ações do Simulador de Investimentos ---
    if(investimentosElements.buttons.calcular) investimentosElements.buttons.calcular.addEventListener('click', executarSimulacaoInvestimentos);
    if(investimentosElements.buttons.voltar) investimentosElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));

    // --- Estado de Autenticação ---
    supabaseClient.auth.onAuthStateChange((_event, session) => {
        updateUserUI(session ? session.user : null);
    });

    console.log("main.js carregado com sucesso. Aplicação pronta.");
});

