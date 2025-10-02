/**
 * ==================================================================================
 * main.js - Cérebro da Aplicação "änalitks" (Com Calculadora de Férias)
 * ----------------------------------------------------------------------------------
 * Este ficheiro agora inclui a lógica completa para a ferramenta de
 * Cálculo de Férias, com todas as suas regras específicas.
 * O código foi refatorado para usar funções de cálculo de impostos reutilizáveis.
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
        investimentos: document.getElementById('investimentos-screen'),
        ferias: document.getElementById('ferias-screen'), // Nova tela
        irpf: document.getElementById('irpf-screen'),
    };

    // --- Seletores (Autenticação, Dashboard, Salário, Investimentos, IRPF) ---
    const authForms = { login: document.getElementById('login-form'), signup: document.getElementById('signup-form'), choices: document.getElementById('auth-choices') };
    const authButtons = { showLogin: document.getElementById('show-login-btn'), showSignup: document.getElementById('show-signup-btn'), showLoginLink: document.getElementById('show-login-link'), showSignupLink: document.getElementById('show-signup-link'), logout: document.getElementById('logout-btn') };
    const dashboardButtons = { salario: document.getElementById('goto-salario-btn'), investimentos: document.getElementById('goto-investimentos-btn'), ferias: document.getElementById('goto-ferias-btn'), decimoTerceiro: document.getElementById('goto-decimo-terceiro-btn'), horaValor: document.getElementById('goto-hora-valor-btn'), irpf: document.getElementById('goto-irpf-btn') };
    const salarioElements = { form: { salarioBruto: document.getElementById('salario-bruto'), dependentes: document.getElementById('salario-dependentes') }, buttons: { calcular: document.getElementById('calcular-salario-btn'), voltar: document.getElementById('back-to-dashboard-from-salario') }, results: { container: document.getElementById('salario-results-section'), salarioBruto: document.getElementById('resultado-salario-bruto'), inss: document.getElementById('resultado-inss'), baseIrrf: document.getElementById('resultado-base-irrf'), irrf: document.getElementById('resultado-irrf'), salarioLiquido: document.getElementById('resultado-salario-liquido'), explicacaoInss: document.getElementById('explicacao-inss'), explicacaoIrrf: document.getElementById('explicacao-irrf') } };
    const investimentosElements = { form: { valorInicial: document.getElementById('valor-inicial'), aporteMensal: document.getElementById('aporte-mensal'), taxaJurosAnual: document.getElementById('taxa-juros-anual'), periodoAnos: document.getElementById('periodo-anos') }, buttons: { calcular: document.getElementById('calcular-investimentos-btn'), voltar: document.getElementById('back-to-dashboard-from-investimentos') }, results: { container: document.getElementById('investimentos-results-section'), valorFinal: document.getElementById('resultado-valor-final'), totalInvestido: document.getElementById('resultado-total-investido'), totalJuros: document.getElementById('resultado-total-juros') } };
    const irpfElements = { form: { rendimentosAnuais: document.getElementById('rendimentos-anuais'), despesasSaude: document.getElementById('despesas-saude'), despesasEducacao: document.getElementById('despesas-educacao'), dependentes: document.getElementById('dependentes') }, buttons: { calcular: document.getElementById('calcular-irpf-btn'), voltar: document.getElementById('back-to-dashboard-from-irpf') }, results: { container: document.getElementById('irpf-results-section'), completa: document.getElementById('resultado-irpf-completa'), simplificada: document.getElementById('resultado-irpf-simplificada'), recomendacao: document.getElementById('recomendacao-irpf').querySelector('p') } };

    // --- Seletores do Cálculo de Férias ---
    const feriasElements = {
        form: {
            salarioBruto: document.getElementById('ferias-salario-bruto'),
            dias: document.getElementById('ferias-dias'),
            venderDias: document.getElementById('ferias-vender-dias'),
            adiantar13: document.getElementById('ferias-adiantar-13'),
        },
        buttons: {
            calcular: document.getElementById('calcular-ferias-btn'),
            voltar: document.getElementById('back-to-dashboard-from-ferias'),
        },
        results: {
            container: document.getElementById('ferias-results-section'),
            feriasBrutas: document.getElementById('resultado-ferias-brutas'),
            tercoConstitucional: document.getElementById('resultado-terco-constitucional'),
            abonoPecuniario: document.getElementById('resultado-abono-pecuniario'),
            totalBruto: document.getElementById('resultado-total-bruto-ferias'),
            inss: document.getElementById('resultado-inss-ferias'),
            irrf: document.getElementById('resultado-irrf-ferias'),
            adiantamento13: document.getElementById('resultado-adiantamento-13'),
            liquido: document.getElementById('resultado-liquido-ferias'),
            abonoLine: document.getElementById('abono-pecuniario-line'),
            adiantamento13Line: document.getElementById('adiantamento-13-line'),
        }
    };
    
    // PARTE 2: FUNÇÕES DE GESTÃO DE TELA E UI
    // ----------------------------------------------------------------------------------
    function showScreen(screenName) { Object.values(screens).forEach(screen => { if (screen) screen.classList.add('hidden'); }); if (screens[screenName]) { screens[screenName].classList.remove('hidden'); console.log(`A exibir a tela: ${screenName}`); } else { console.warn(`AVISO: A tela "${screenName}" ainda não foi criada no index.html.`); alert(`A funcionalidade para "${screenName}" ainda está em desenvolvimento!`); screens.dashboard.classList.remove('hidden'); } }
    function updateUserUI(user) { const welcomeMessage = document.getElementById('welcome-message'); if (user) { if(welcomeMessage) { welcomeMessage.textContent = `Bem-vindo(a), ${user.email}!`; } showScreen('dashboard'); } else { showScreen('auth'); } }

    // PARTE 3: FUNÇÕES DE AUTENTICAÇÃO
    // ----------------------------------------------------------------------------------
    async function handleLogin(event) { event.preventDefault(); const email = authForms.login.querySelector('#login-email').value; const password = authForms.login.querySelector('#login-password').value; const { error } = await supabaseClient.auth.signInWithPassword({ email, password }); if (error) alert(`Erro no login: ${error.message}`); }
    async function handleSignup(event) { event.preventDefault(); const email = authForms.signup.querySelector('#signup-email').value; const password = authForms.signup.querySelector('#signup-password').value; const { error } = await supabaseClient.auth.signUp({ email, password }); if (error) { alert(`Erro no registo: ${error.message}`); } else { alert('Registo realizado! Verifique o seu e-mail para confirmar a conta e depois faça o login.'); authForms.signup.classList.add('hidden'); authForms.login.classList.remove('hidden'); } }
    async function handleLogout() { await supabaseClient.auth.signOut(); authForms.login.reset(); authForms.signup.reset(); authForms.login.classList.add('hidden'); authForms.signup.classList.add('hidden'); authForms.choices.classList.remove('hidden'); }

    // PARTE 4: FUNÇÕES DE CÁLCULO REUTILIZÁVEIS
    // ----------------------------------------------------------------------------------
    function calcularINSS(baseDeCalculo) {
        const faixas = [ { teto: 1412.00, aliquota: 0.075, parcela: 0 }, { teto: 2666.68, aliquota: 0.09,  parcela: 21.18 }, { teto: 4000.03, aliquota: 0.12,  parcela: 101.18 }, { teto: 7786.02, aliquota: 0.14,  parcela: 181.18 } ];
        if (baseDeCalculo > faixas[3].teto) { return (faixas[3].teto * faixas[3].aliquota) - faixas[3].parcela; }
        for (const faixa of faixas) { if (baseDeCalculo <= faixa.teto) { return (baseDeCalculo * faixa.aliquota) - faixa.parcela; } }
        return 0;
    }

    function calcularIRRF(baseDeCalculo, numDependentes = 0) {
        const DEDUCAO_POR_DEPENDENTE = 189.59;
        const baseReal = baseDeCalculo - (numDependentes * DEDUCAO_POR_DEPENDENTE);
        const faixas = [ { teto: 2259.20, aliquota: 0,     parcela: 0 }, { teto: 2826.65, aliquota: 0.075, parcela: 169.44 }, { teto: 3751.05, aliquota: 0.15,  parcela: 381.44 }, { teto: 4664.68, aliquota: 0.225, parcela: 662.77 }, { teto: Infinity,aliquota: 0.275, parcela: 896.00 } ];
        for (const faixa of faixas) { if (baseReal <= faixa.teto) { const imposto = (baseReal * faixa.aliquota) - faixa.parcela; return Math.max(0, imposto); } }
        return 0;
    }

    // PARTE 5: LÓGICA DAS FERRAMENTAS
    // ----------------------------------------------------------------------------------
    function executarCalculoSalario() { /* ... Lógica existente ... */ }
    function executarSimulacaoInvestimentos() { /* ... Lógica existente ... */ }
    function executarCalculoIRPFAnual() { /* ... Lógica existente ... */ }

    function executarCalculoFerias() {
        const salarioBruto = parseFloat(feriasElements.form.salarioBruto.value) || 0;
        const diasFerias = parseInt(feriasElements.form.dias.value) || 0;
        const venderDias = feriasElements.form.venderDias.checked;
        const adiantar13 = feriasElements.form.adiantar13.checked;

        if (salarioBruto <= 0 || diasFerias <= 0) {
            alert('Por favor, insira valores válidos para salário e dias de férias.');
            return;
        }

        const feriasBrutas = (salarioBruto / 30) * diasFerias;
        const tercoConstitucional = feriasBrutas / 3;
        const totalBrutoFerias = feriasBrutas + tercoConstitucional;

        const abonoPecuniario = venderDias ? (salarioBruto / 30) * 10 : 0;
        const adiantamento13 = adiantar13 ? salarioBruto / 2 : 0;
        
        const descontoINSS = calcularINSS(totalBrutoFerias);
        const baseIRRF = totalBrutoFerias - descontoINSS;
        const descontoIRRF = calcularIRRF(baseIRRF); // Sem dependentes neste cálculo

        const liquidoReceber = (totalBrutoFerias - descontoINSS - descontoIRRF) + abonoPecuniario + adiantamento13;

        // Exibir resultados
        feriasElements.results.feriasBrutas.textContent = `R$ ${feriasBrutas.toFixed(2)}`;
        feriasElements.results.tercoConstitucional.textContent = `R$ ${tercoConstitucional.toFixed(2)}`;
        feriasElements.results.totalBruto.textContent = `R$ ${totalBrutoFerias.toFixed(2)}`;
        feriasElements.results.inss.textContent = `- R$ ${descontoINSS.toFixed(2)}`;
        feriasElements.results.irrf.textContent = `- R$ ${descontoIRRF.toFixed(2)}`;
        feriasElements.results.liquido.textContent = `R$ ${liquidoReceber.toFixed(2)}`;

        // Mostrar/esconder linhas opcionais
        if (venderDias) {
            feriasElements.results.abonoPecuniario.textContent = `R$ ${abonoPecuniario.toFixed(2)}`;
            feriasElements.results.abonoLine.classList.remove('hidden');
        } else {
            feriasElements.results.abonoLine.classList.add('hidden');
        }
        if (adiantar13) {
            feriasElements.results.adiantamento13.textContent = `R$ ${adiantamento13.toFixed(2)}`;
            feriasElements.results.adiantamento13Line.classList.remove('hidden');
        } else {
            feriasElements.results.adiantamento13Line.classList.add('hidden');
        }

        feriasElements.results.container.classList.remove('hidden');
    }

    // PARTE 6: REGISTO DE EVENT LISTENERS
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
    if(investimentosElements.buttons.calcular) investimentosElements.buttons.calcular.addEventListener('click', executarSimulacaoInvestimentos);
    if(investimentosElements.buttons.voltar) investimentosElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
    if(irpfElements.buttons.calcular) irpfElements.buttons.calcular.addEventListener('click', executarCalculoIRPFAnual);
    if(irpfElements.buttons.voltar) irpfElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
    
    // --- Ações do Cálculo de Férias ---
    if(feriasElements.buttons.calcular) feriasElements.buttons.calcular.addEventListener('click', executarCalculoFerias);
    if(feriasElements.buttons.voltar) feriasElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));

    // --- Estado de Autenticação ---
    supabaseClient.auth.onAuthStateChange((_event, session) => { updateUserUI(session ? session.user : null); });

    console.log("main.js carregado com sucesso. Aplicação pronta.");
});

