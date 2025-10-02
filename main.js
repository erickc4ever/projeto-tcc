/**
 * ==================================================================================
 * main.js - Cérebro da Aplicação "änalitks" (Com Calculadora de Salário)
 * ----------------------------------------------------------------------------------
 * Este ficheiro agora inclui a lógica completa para a ferramenta de
 * Cálculo de Salário, incluindo os cálculos detalhados de INSS e IRRF.
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
        salario: document.getElementById('salario-screen'), // Nova tela adicionada
    };

    const authForms = { login: document.getElementById('login-form'), signup: document.getElementById('signup-form'), choices: document.getElementById('auth-choices') };
    const authButtons = { showLogin: document.getElementById('show-login-btn'), showSignup: document.getElementById('show-signup-btn'), showLoginLink: document.getElementById('show-login-link'), showSignupLink: document.getElementById('show-signup-link'), logout: document.getElementById('logout-btn') };
    const dashboardButtons = { salario: document.getElementById('goto-salario-btn'), investimentos: document.getElementById('goto-investimentos-btn'), ferias: document.getElementById('goto-ferias-btn'), decimoTerceiro: document.getElementById('goto-decimo-terceiro-btn'), horaValor: document.getElementById('goto-hora-valor-btn'), irpf: document.getElementById('goto-irpf-btn') };

    const irpfElements = {
        form: { rendimentosAnuais: document.getElementById('rendimentos-anuais'), despesasSaude: document.getElementById('despesas-saude'), despesasEducacao: document.getElementById('despesas-educacao'), dependentes: document.getElementById('dependentes') },
        buttons: { calcular: document.getElementById('calcular-irpf-btn'), voltar: document.getElementById('back-to-dashboard-from-irpf') },
        results: { container: document.getElementById('irpf-results-section'), completa: document.getElementById('resultado-irpf-completa'), simplificada: document.getElementById('resultado-irpf-simplificada'), recomendacao: document.getElementById('recomendacao-irpf').querySelector('p') }
    };

    // --- Seletores da Calculadora de Salário ---
    const salarioElements = {
        form: {
            salarioBruto: document.getElementById('salario-bruto'),
            dependentes: document.getElementById('salario-dependentes'),
        },
        buttons: {
            calcular: document.getElementById('calcular-salario-btn'),
            voltar: document.getElementById('back-to-dashboard-from-salario'),
        },
        results: {
            container: document.getElementById('salario-results-section'),
            salarioBruto: document.getElementById('resultado-salario-bruto'),
            inss: document.getElementById('resultado-inss'),
            baseIrrf: document.getElementById('resultado-base-irrf'),
            irrf: document.getElementById('resultado-irrf'),
            salarioLiquido: document.getElementById('resultado-salario-liquido'),
            explicacaoInss: document.getElementById('explicacao-inss'),
            explicacaoIrrf: document.getElementById('explicacao-irrf'),
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
    async function handleLogin(event) { event.preventDefault(); const email = authForms.login.querySelector('#login-email').value; const password = authForms.login.querySelector('#login-password').value; const { error } = await supabaseClient.auth.signInWithPassword({ email, password }); if (error) alert(`Erro no login: ${error.message}`); }
    async function handleSignup(event) { event.preventDefault(); const email = authForms.signup.querySelector('#signup-email').value; const password = authForms.signup.querySelector('#signup-password').value; const { error } = await supabaseClient.auth.signUp({ email, password }); if (error) { alert(`Erro no registo: ${error.message}`); } else { alert('Registo realizado! Verifique o seu e-mail para confirmar a conta e depois faça o login.'); authForms.signup.classList.add('hidden'); authForms.login.classList.remove('hidden'); } }
    async function handleLogout() { await supabaseClient.auth.signOut(); authForms.login.reset(); authForms.signup.reset(); authForms.login.classList.add('hidden'); authForms.signup.classList.add('hidden'); authForms.choices.classList.remove('hidden'); }

    // PARTE 4: LÓGICA DE CÁLCULO
    // ----------------------------------------------------------------------------------
    
    // --- Lógica do IRPF Anual ---
    function executarCalculoIRPFAnual() { /* ... Lógica do IRPF Anual já implementada ... */ }

    // --- Lógica do Salário Mensal ---
    function executarCalculoSalario() {
        const salarioBruto = parseFloat(salarioElements.form.salarioBruto.value) || 0;
        const numDependentes = parseInt(salarioElements.form.dependentes.value) || 0;

        if (salarioBruto <= 0) {
            alert('Por favor, insira um valor de salário bruto válido.');
            return;
        }

        // --- Cálculo do INSS (Tabela 2024/2025) ---
        const faixasINSS = [
            { teto: 1412.00, aliquota: 0.075, parcela: 0 },
            { teto: 2666.68, aliquota: 0.09,  parcela: 21.18 },
            { teto: 4000.03, aliquota: 0.12,  parcela: 101.18 },
            { teto: 7786.02, aliquota: 0.14,  parcela: 181.18 }
        ];
        let descontoINSS = 0;
        let explicacaoINSS = '';
        
        if (salarioBruto > faixasINSS[3].teto) {
            descontoINSS = (faixasINSS[3].teto * faixasINSS[3].aliquota) - faixasINSS[3].parcela;
            explicacaoINSS = `O cálculo do INSS é limitado ao teto de R$ ${faixasINSS[3].teto.toFixed(2)}.`;
        } else {
            for (const faixa of faixasINSS) {
                if (salarioBruto <= faixa.teto) {
                    descontoINSS = (salarioBruto * faixa.aliquota) - faixa.parcela;
                    explicacaoINSS = `O seu salário enquadra-se na alíquota de ${(faixa.aliquota * 100)}%. O cálculo é (R$ ${salarioBruto.toFixed(2)} * ${faixa.aliquota}) - R$ ${faixa.parcela.toFixed(2)}.`;
                    break;
                }
            }
        }
        
        // --- Cálculo do IRRF (Tabela 2024/2025) ---
        const DEDUCAO_POR_DEPENDENTE_IRRF = 189.59;
        const baseCalculoIRRF = salarioBruto - descontoINSS - (numDependentes * DEDUCAO_POR_DEPENDENTE_IRRF);
        
        const faixasIRRF = [
            { teto: 2259.20, aliquota: 0,     parcela: 0 },
            { teto: 2826.65, aliquota: 0.075, parcela: 169.44 },
            { teto: 3751.05, aliquota: 0.15,  parcela: 381.44 },
            { teto: 4664.68, aliquota: 0.225, parcela: 662.77 },
            { teto: Infinity,aliquota: 0.275, parcela: 896.00 }
        ];
        let descontoIRRF = 0;
        let explicacaoIRRF = 'Isento de IRRF.';

        for (const faixa of faixasIRRF) {
            if (baseCalculoIRRF <= faixa.teto) {
                if (faixa.aliquota > 0) {
                    descontoIRRF = (baseCalculoIRRF * faixa.aliquota) - faixa.parcela;
                    explicacaoIRRF = `A sua base de cálculo (R$ ${baseCalculoIRRF.toFixed(2)}) enquadra-se na alíquota de ${(faixa.aliquota * 100)}%. O cálculo é (R$ ${baseCalculoIRRF.toFixed(2)} * ${faixa.aliquota}) - R$ ${faixa.parcela.toFixed(2)}.`;
                }
                break;
            }
        }
        descontoIRRF = Math.max(0, descontoIRRF); // Garante que o imposto não seja negativo

        // --- Salário Líquido ---
        const salarioLiquido = salarioBruto - descontoINSS - descontoIRRF;

        // --- Exibir Resultados ---
        salarioElements.results.salarioBruto.textContent = `R$ ${salarioBruto.toFixed(2)}`;
        salarioElements.results.inss.textContent = `- R$ ${descontoINSS.toFixed(2)}`;
        salarioElements.results.explicacaoInss.textContent = explicacaoINSS;
        salarioElements.results.baseIrrf.textContent = `R$ ${baseCalculoIRRF.toFixed(2)}`;
        salarioElements.results.irrf.textContent = `- R$ ${descontoIRRF.toFixed(2)}`;
        salarioElements.results.explicacaoIrrf.textContent = explicacaoIRRF;
        salarioElements.results.salarioLiquido.textContent = `R$ ${salarioLiquido.toFixed(2)}`;
        
        salarioElements.results.container.classList.remove('hidden');
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

    if(irpfElements.buttons.calcular) irpfElements.buttons.calcular.addEventListener('click', executarCalculoIRPFAnual);
    if(irpfElements.buttons.voltar) irpfElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
    
    // --- Ações do Cálculo de Salário ---
    if(salarioElements.buttons.calcular) salarioElements.buttons.calcular.addEventListener('click', executarCalculoSalario);
    if(salarioElements.buttons.voltar) salarioElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));

    // --- Estado de Autenticação ---
    supabaseClient.auth.onAuthStateChange((_event, session) => {
        updateUserUI(session ? session.user : null);
    });

    console.log("main.js carregado com sucesso. Aplicação pronta.");
});

