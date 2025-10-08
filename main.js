/**
 * ==================================================================================
 * main.js - Cérebro da "änalitks"
 * ----------------------------------------------------------------------------------
 * Este ficheiro foi modificado para implementar a lógica de salvar o resultado
 * do SIMULADOR DE IRPF ANUAL e finalizar a integração de todas as calculadoras
 * do Módulo CLT com o sistema de Histórico.
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
        welcome: document.getElementById('welcome-screen'),
        dashboard: document.getElementById('dashboard-screen'),
        pjDashboard: document.getElementById('pj-dashboard-screen'),
        simplesNacional: document.getElementById('simples-nacional-screen'),
        pjHoraValor: document.getElementById('pj-hora-valor-screen'),
        salario: document.getElementById('salario-screen'),
        investimentos: document.getElementById('investimentos-screen'),
        ferias: document.getElementById('ferias-screen'),
        decimoTerceiro: document.getElementById('decimo-terceiro-screen'),
        horaValor: document.getElementById('hora-valor-screen'),
        irpf: document.getElementById('irpf-screen'),
        profile: document.getElementById('profile-screen'),
        reports: document.getElementById('reports-screen'),
        historico: document.getElementById('historico-screen'),
    };

    // --- Seletores ---
    const authForms = { login: document.getElementById('login-form'), signup: document.getElementById('signup-form'), choices: document.getElementById('auth-choices') };
    const authButtons = { showLogin: document.getElementById('show-login-btn'), showSignup: document.getElementById('show-signup-btn'), showLoginLink: document.getElementById('show-login-link'), showSignupLink: document.getElementById('show-signup-link'), logout: document.getElementById('logout-btn'), logoutPj: document.getElementById('logout-btn-pj') };
    const welcomeScreenElements = { welcomeMessage: document.getElementById('welcome-message-choice'), buttons: { clt: document.getElementById('goto-clt-dashboard-btn'), pj: document.getElementById('goto-pj-dashboard-btn') } };
    const dashboardButtons = { salario: document.getElementById('goto-salario-btn'), investimentos: document.getElementById('goto-investimentos-btn'), ferias: document.getElementById('goto-ferias-btn'), decimoTerceiro: document.getElementById('goto-decimo-terceiro-btn'), horaValor: document.getElementById('goto-hora-valor-btn'), irpf: document.getElementById('goto-irpf-btn'), showAbout: document.getElementById('show-about-btn'), profile: document.getElementById('goto-profile-btn'), reports: document.getElementById('goto-reports-btn'), historico: document.getElementById('goto-historico-btn') };
    const pjDashboardButtons = { simples: document.getElementById('goto-simples-nacional-btn'), horaValorPj: document.getElementById('goto-pj-hora-valor-btn'), backToWelcome: document.getElementById('back-to-welcome-from-pj') };
    const dashboardElements = { quote: document.getElementById('dashboard-quote') };
    const modalElements = { overlay: document.getElementById('about-modal-overlay'), closeBtn: document.getElementById('close-about-btn') };
    const profileElements = { form: { salarioBruto: document.getElementById('profile-salario-bruto'), dependentes: document.getElementById('profile-dependentes'), horasDia: document.getElementById('profile-horas-dia'), diasSemana: document.getElementById('profile-dias-semana'), }, buttons: { salvar: document.getElementById('salvar-perfil-btn'), voltar: document.getElementById('back-to-dashboard-from-profile'), }, statusMessage: document.getElementById('profile-status-message'), };
    const reportsElements = { salaryChart: document.getElementById('salary-chart'), investmentChart: document.getElementById('investment-chart'), notice: document.getElementById('reports-notice'), content: document.getElementById('reports-content'), backButton: document.getElementById('back-to-dashboard-from-reports'), summary: { dailyValue: document.getElementById('summary-daily-value'), thirteenthValue: document.getElementById('summary-13th-value') } };
    const historicoElements = { lista: document.getElementById('historico-lista'), voltar: document.getElementById('back-to-dashboard-from-historico') };

    const salarioElements = { form: { salarioBruto: document.getElementById('salario-bruto'), dependentes: document.getElementById('salario-dependentes') }, buttons: { calcular: document.getElementById('calcular-salario-btn'), voltar: document.getElementById('back-to-dashboard-from-salario'), salvar: document.getElementById('salvar-salario-btn') }, results: { container: document.getElementById('salario-results-section'), salarioBruto: document.getElementById('resultado-salario-bruto'), inss: document.getElementById('resultado-inss'), baseIrrf: document.getElementById('resultado-base-irrf'), irrf: document.getElementById('resultado-irrf'), salarioLiquido: document.getElementById('resultado-salario-liquido'), explicacaoInss: document.getElementById('explicacao-inss'), explicacaoIrrf: document.getElementById('explicacao-irrf') } };
    const investimentosElements = { form: { valorInicial: document.getElementById('valor-inicial'), aporteMensal: document.getElementById('aporte-mensal'), taxaJurosAnual: document.getElementById('taxa-juros-anual'), periodoAnos: document.getElementById('periodo-anos') }, buttons: { calcular: document.getElementById('calcular-investimentos-btn'), voltar: document.getElementById('back-to-dashboard-from-investimentos'), salvar: document.getElementById('salvar-investimentos-btn') }, results: { container: document.getElementById('investimentos-results-section'), valorFinal: document.getElementById('resultado-valor-final'), totalInvestido: document.getElementById('resultado-total-investido'), totalJuros: document.getElementById('resultado-total-juros') } };
    const feriasElements = { form: { salarioBruto: document.getElementById('ferias-salario-bruto'), dias: document.getElementById('ferias-dias'), venderDias: document.getElementById('ferias-vender-dias'), adiantar13: document.getElementById('ferias-adiantar-13') }, buttons: { calcular: document.getElementById('calcular-ferias-btn'), voltar: document.getElementById('back-to-dashboard-from-ferias'), salvar: document.getElementById('salvar-ferias-btn') }, results: { container: document.getElementById('ferias-results-section'), feriasBrutas: document.getElementById('resultado-ferias-brutas'), tercoConstitucional: document.getElementById('resultado-terco-constitucional'), abonoPecuniario: document.getElementById('resultado-abono-pecuniario'), totalBruto: document.getElementById('resultado-total-bruto-ferias'), inss: document.getElementById('resultado-inss-ferias'), irrf: document.getElementById('resultado-irrf-ferias'), adiantamento13: document.getElementById('resultado-adiantamento-13'), liquido: document.getElementById('resultado-liquido-ferias'), abonoLine: document.getElementById('abono-pecuniario-line'), adiantamento13Line: document.getElementById('adiantamento-13-line') } };
    const decimoTerceiroElements = { form: { salarioBruto: document.getElementById('decimo-terceiro-salario-bruto'), meses: document.getElementById('decimo-terceiro-meses'), dependentes: document.getElementById('decimo-terceiro-dependentes') }, buttons: { calcular: document.getElementById('calcular-decimo-terceiro-btn'), voltar: document.getElementById('back-to-dashboard-from-decimo-terceiro'), salvar: document.getElementById('salvar-decimo-terceiro-btn') }, results: { container: document.getElementById('decimo-terceiro-results-section'), bruto: document.getElementById('resultado-13-bruto'), primeiraParcela: document.getElementById('resultado-13-primeira-parcela'), segundaParcelaBruta: document.getElementById('resultado-13-segunda-parcela-bruta'), inss: document.getElementById('resultado-inss-13'), irrf: document.getElementById('resultado-irrf-13'), segundaParcelaLiquida: document.getElementById('resultado-13-segunda-parcela-liquida'), liquidoTotal: document.getElementById('resultado-13-liquido-total') } };
    const horaValorElements = { form: { salario: document.getElementById('hora-valor-salario'), horasDia: document.getElementById('hora-valor-horas-dia'), diasSemana: document.getElementById('hora-valor-dias-semana') }, buttons: { calcular: document.getElementById('calcular-hora-valor-btn'), voltar: document.getElementById('back-to-dashboard-from-hora-valor'), salvar: document.getElementById('salvar-hora-valor-btn') }, results: { container: document.getElementById('hora-valor-results-section'), valorHora: document.getElementById('resultado-hora-valor'), explicacao: document.getElementById('explicacao-hora-valor') } };
    const irpfElements = { form: { rendimentosAnuais: document.getElementById('rendimentos-anuais'), despesasSaude: document.getElementById('despesas-saude'), despesasEducacao: document.getElementById('despesas-educacao'), dependentes: document.getElementById('dependentes') }, buttons: { calcular: document.getElementById('calcular-irpf-btn'), voltar: document.getElementById('back-to-dashboard-from-irpf'), salvar: document.getElementById('salvar-irpf-btn') }, results: { container: document.getElementById('irpf-results-section'), completa: document.getElementById('resultado-irpf-completa'), simplificada: document.getElementById('resultado-irpf-simplificada'), recomendacao: document.getElementById('recomendacao-irpf').querySelector('p') } };
    const simplesNacionalElements = { form: { faturamentoMensal: document.getElementById('faturamento-mensal'), anexo: document.getElementById('anexo-simples') }, buttons: { calcular: document.getElementById('calcular-simples-btn'), voltar: document.getElementById('back-to-pj-dashboard-from-simples'), salvar: document.getElementById('salvar-simples-nacional-btn') }, results: { container: document.getElementById('simples-results-section'), rbt12: document.getElementById('resultado-rbt12'), aliquotaEfetiva: document.getElementById('resultado-aliquota-efetiva'), valorDas: document.getElementById('resultado-valor-das'), explicacao: document.getElementById('explicacao-simples') } };
    const pjHoraValorElements = { form: { salarioDesejado: document.getElementById('pj-salario-desejado'), custosFixos: document.getElementById('pj-custos-fixos'), feriasAno: document.getElementById('pj-ferias-ano'), horasDia: document.getElementById('pj-horas-dia'), diasSemana: document.getElementById('pj-dias-semana') }, buttons: { calcular: document.getElementById('calcular-pj-hora-valor-btn'), voltar: document.getElementById('back-to-pj-dashboard-from-hora'), salvar: document.getElementById('salvar-pj-hora-valor-btn') }, results: { container: document.getElementById('pj-hora-valor-results-section'), valorHora: document.getElementById('resultado-pj-hora-valor'), explicacao: document.getElementById('explicacao-pj-hora-valor') } };

    // PARTE 2: DADOS E CONTEÚDO
    let userProfile = null;
    let salaryChartInstance = null;
    let investmentChartInstance = null;
    const dashboardQuotes = [ "Um objetivo sem um plano é apenas um desejo. Use as nossas ferramentas para transformar os seus desejos em planos.", "A melhor altura para plantar uma árvore foi há 20 anos. A segunda melhor altura é agora. O mesmo vale para os seus investimentos.", "Cuidado com as pequenas despesas; um pequeno furo pode afundar um grande navio.", "O seu futuro financeiro é criado pelo que você faz hoje, não amanhã. Cada cálculo é um passo na direção certa.", "Saber o valor do seu tempo é o primeiro passo para garantir que ele seja bem recompensado." ];

    // PARTE 3: FUNÇÕES DE GESTÃO DE TELA E UI
    function showScreen(screenName) { Object.values(screens).forEach(screen => { if (screen) screen.classList.add('hidden'); }); if (screens[screenName]) { screens[screenName].classList.remove('hidden'); console.log(`A exibir a tela: ${screenName}`); } else { console.warn(`AVISO: A tela "${screenName}" ainda não foi criada no index.html.`); alert(`A funcionalidade para "${screenName}" ainda está em desenvolvimento!`); screens.dashboard.classList.remove('hidden'); } }
    async function updateUserUI(user) { if (user) { welcomeScreenElements.welcomeMessage.textContent = `Olá, ${user.email}!`; await fetchUserProfile(user); showScreen('welcome'); } else { userProfile = null; showScreen('auth'); } }

    // PARTE 4: FUNÇÕES DE AUTENTICAÇÃO E PERFIL
    async function handleLogin(event) { event.preventDefault(); const email = authForms.login.querySelector('#login-email').value; const password = authForms.login.querySelector('#login-password').value; const { error } = await supabaseClient.auth.signInWithPassword({ email, password }); if (error) alert(`Erro no login: ${error.message}`); }
    async function handleSignup(event) { event.preventDefault(); const email = authForms.signup.querySelector('#signup-email').value; const password = authForms.signup.querySelector('#signup-password').value; const { error } = await supabaseClient.auth.signUp({ email, password }); if (error) { alert(`Erro no registo: ${error.message}`); } else { alert('Registo realizado! Verifique o seu e-mail para confirmar a conta e depois faça o login.'); authForms.signup.classList.add('hidden'); authForms.login.classList.remove('hidden'); } }
    async function handleLogout() { await supabaseClient.auth.signOut(); authForms.login.reset(); authForms.signup.reset(); authForms.login.classList.add('hidden'); authForms.signup.classList.add('hidden'); authForms.choices.classList.remove('hidden'); }
    async function handleSaveProfile() { const { data: { user } } = await supabaseClient.auth.getUser(); if (!user) { alert('Precisa de estar autenticado para salvar o perfil.'); return; } const salarioBruto = parseFloat(profileElements.form.salarioBruto.value) || null; const dependentes = parseInt(profileElements.form.dependentes.value); const horasDia = parseFloat(profileElements.form.horasDia.value) || null; const diasSemana = parseInt(profileElements.form.diasSemana.value) || null; const updates = { user_id: user.id, salario_bruto: salarioBruto, dependentes: isNaN(dependentes) ? null : dependentes, horas_dia: horasDia, dias_semana: diasSemana, updated_at: new Date(), }; const { error } = await supabaseClient.from('profiles').upsert(updates); if (error) { console.error('Erro ao salvar o perfil:', error); profileElements.statusMessage.textContent = `Erro ao salvar: ${error.message}`; profileElements.statusMessage.classList.remove('hidden'); } else { console.log('Perfil salvo com sucesso!'); userProfile = updates; profileElements.statusMessage.textContent = 'Perfil salvo com sucesso!'; profileElements.statusMessage.classList.remove('hidden'); setTimeout(() => { profileElements.statusMessage.classList.add('hidden'); }, 3000); } }
    async function fetchUserProfile(user) { if (!user) return; const { data, error } = await supabaseClient.from('profiles').select('*').eq('user_id', user.id).single(); if (error && error.code !== 'PGRST116') { console.error('Erro ao buscar o perfil:', error); } else if (data) { userProfile = data; console.log('Perfil do utilizador carregado:', userProfile); } else { console.log('Nenhum perfil encontrado para este utilizador.'); userProfile = null; } }
    function preencherFormulariosComPerfil() { if (!userProfile) return; if (userProfile.salario_bruto) profileElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.dependentes !== null) profileElements.form.dependentes.value = userProfile.dependentes; if (userProfile.horas_dia) profileElements.form.horasDia.value = userProfile.horas_dia; if (userProfile.dias_semana) profileElements.form.diasSemana.value = userProfile.dias_semana; if (userProfile.salario_bruto) salarioElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.dependentes !== null) salarioElements.form.dependentes.value = userProfile.dependentes; if (userProfile.salario_bruto) feriasElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.salario_bruto) decimoTerceiroElements.form.salarioBruto.value = userProfile.salario_bruto; if (userProfile.dependentes !== null) decimoTerceiroElements.form.dependentes.value = userProfile.dependentes; if (userProfile.salario_bruto) horaValorElements.form.salario.value = userProfile.salario_bruto; if (userProfile.horas_dia) horaValorElements.form.horasDia.value = userProfile.horas_dia; if (userProfile.dias_semana) horaValorElements.form.diasSemana.value = userProfile.dias_semana; }

// ==================================================================================
// PARTE 5: FUNÇÕES DE CÁLCULO E GRÁFICOS (CORRIGIDA)
// ----------------------------------------------------------------------------------
// Esta versão corrige o bug que impedia a tela "Visão Geral" de abrir mais de uma vez.
// A lógica agora destrói apenas a "instância" do gráfico, preservando o elemento <canvas>.
// ==================================================================================

function calcularINSS(baseDeCalculo) { const faixas = [ { teto: 1412.00, aliquota: 0.075, parcela: 0 }, { teto: 2666.68, aliquota: 0.09,  parcela: 21.18 }, { teto: 4000.03, aliquota: 0.12,  parcela: 101.18 }, { teto: 7786.02, aliquota: 0.14,  parcela: 181.18 } ]; if (baseDeCalculo > faixas[3].teto) { return (faixas[3].teto * faixas[3].aliquota) - faixas[3].parcela; } for (const faixa of faixas) { if (baseDeCalculo <= faixa.teto) { return (baseDeCalculo * faixa.aliquota) - faixa.parcela; } } return 0; }
function calcularIRRF(baseDeCalculo, numDependentes = 0) { const DEDUCAO_POR_DEPENDENTE = 189.59; const baseReal = baseDeCalculo - (numDependentes * DEDUCAO_POR_DEPENDENTE); const faixas = [ { teto: 2259.20, aliquota: 0,     parcela: 0 }, { teto: 2826.65, aliquota: 0.075, parcela: 169.44 }, { teto: 3751.05, aliquota: 0.15,  parcela: 381.44 }, { teto: 4664.68, aliquota: 0.225, parcela: 662.77 }, { teto: Infinity,aliquota: 0.275, parcela: 896.00 } ]; for (const faixa of faixas) { if (baseReal <= faixa.teto) { const imposto = (baseReal * faixa.aliquota) - faixa.parcela; return Math.max(0, imposto); } } return 0; }
function calcularImpostoAnual(baseDeCalculo) { const faixas = [ { limite: 24511.92, aliquota: 0,     deducao: 0 }, { limite: 33919.80, aliquota: 0.075, deducao: 1838.39 }, { limite: 45012.60, aliquota: 0.15,  deducao: 4382.38 }, { limite: 55976.16, aliquota: 0.225, deducao: 7758.32 }, { limite: Infinity, aliquota: 0.275, deducao: 10557.13 } ]; for (const faixa of faixas) { if (baseDeCalculo <= faixa.limite) { const imposto = (baseDeCalculo * faixa.aliquota) - faixa.deducao; return imposto > 0 ? imposto : 0; } } return 0; }

async function renderSalaryChart() {
    // CORREÇÃO: Destrói a instância anterior do gráfico, se ela existir.
    if (salaryChartInstance) {
        salaryChartInstance.destroy();
    }
    
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;

    const canvas = reportsElements.salaryChart;
    const container = canvas.parentElement;
    
    // CORREÇÃO: Em vez de apagar o HTML, apenas limpa a área para a mensagem.
    // Garante que o container não tenha conteúdo de texto antes de desenhar.
    const existingMessage = container.querySelector('.chart-notice');
    if (existingMessage) existingMessage.remove();

    const { data, error } = await supabaseClient
        .from('historico_salarios')
        .select('created_at, salario_liquido_calculado')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
        canvas.style.display = 'none'; // Esconde o canvas
        const noDataMessage = document.createElement('p');
        noDataMessage.className = 'explanation-text text-center chart-notice';
        noDataMessage.textContent = 'Salve o seu primeiro cálculo de salário para ver a sua evolução aqui!';
        container.appendChild(noDataMessage);
        return;
    }

    canvas.style.display = 'block'; // Garante que o canvas esteja visível

    const labels = data.map(item => new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));
    const chartData = data.map(item => item.salario_liquido_calculado);

    salaryChartInstance = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Salário Líquido',
                data: chartData,
                borderColor: '#6D28D9',
                backgroundColor: 'rgba(109, 40, 217, 0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

async function renderInvestmentChart() {
    // CORREÇÃO: Destrói a instância anterior do gráfico, se ela existir.
    if (investmentChartInstance) {
        investmentChartInstance.destroy();
    }
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return;

    const canvas = reportsElements.investmentChart;
    const container = canvas.parentElement;

    // CORREÇÃO: Limpa qualquer mensagem antiga.
    const existingMessage = container.querySelector('.chart-notice');
    if (existingMessage) existingMessage.remove();


    const { data, error } = await supabaseClient
        .from('historico_investimentos')
        .select('created_at, valor_final_calculado, periodo_anos_informado')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) {
        canvas.style.display = 'none'; // Esconde o canvas
        const noDataMessage = document.createElement('p');
        noDataMessage.className = 'explanation-text text-center chart-notice';
        noDataMessage.textContent = 'Salve a sua primeira simulação de investimento para comparar cenários aqui!';
        container.appendChild(noDataMessage);
        return;
    }
    
    canvas.style.display = 'block'; // Garante que o canvas esteja visível

    const labels = data.map(item => `Salvo em ${new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} (${item.periodo_anos_informado} anos)`);
    const chartData = data.map(item => item.valor_final_calculado);

    investmentChartInstance = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Valor Final Projetado',
                data: chartData,
                backgroundColor: '#8B5CF6',
            }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function renderSummaryCards() {
    if (!userProfile || !userProfile.salario_bruto || !userProfile.horas_dia || !userProfile.dias_semana) {
        reportsElements.summary.dailyValue.textContent = 'N/A';
        reportsElements.summary.thirteenthValue.textContent = 'N/A';
        return;
    }
    const salarioBruto = userProfile.salario_bruto;
    const diasSemana = userProfile.dias_semana;
    const descontoINSS = calcularINSS(salarioBruto);
    const salarioLiquido = salarioBruto - descontoINSS - calcularIRRF(salarioBruto - descontoINSS, userProfile.dependentes || 0);
    const diasTrabalhadosMes = diasSemana * 4.5;
    const valorDiaLiquido = salarioLiquido / diasTrabalhadosMes;
    reportsElements.summary.dailyValue.textContent = `R$ ${valorDiaLiquido.toFixed(2)}`;
    const decimoTerceiroBruto = (salarioBruto / 12) * 12;
    const decimoTerceiroLiquido = (decimoTerceiroBruto - calcularINSS(decimoTerceiroBruto) - calcularIRRF(decimoTerceiroBruto - calcularINSS(decimoTerceiroBruto), userProfile.dependentes || 0));
    reportsElements.summary.thirteenthValue.textContent = `R$ ${decimoTerceiroLiquido.toFixed(2)}`;
}

    // PARTE 6: LÓGICA DAS FERRAMENTAS
    // ----------------------------------------------------------------------------------
    function executarCalculoSalario() { 
        const salarioBruto = parseFloat(salarioElements.form.salarioBruto.value) || 0; 
        const numDependentes = parseInt(salarioElements.form.dependentes.value) || 0; 
        if (salarioBruto <= 0) { alert('Por favor, insira um valor de salário bruto válido.'); return; } 
        const descontoINSS = calcularINSS(salarioBruto); 
        const baseCalculoIRRF = salarioBruto - descontoINSS; 
        const descontoIRRF = calcularIRRF(baseCalculoIRRF, numDependentes); 
        const salarioLiquido = salarioBruto - descontoINSS - descontoIRRF; 
        salarioElements.results.salarioBruto.textContent = `R$ ${salarioBruto.toFixed(2)}`; 
        salarioElements.results.inss.textContent = `- R$ ${descontoINSS.toFixed(2)}`; 
        salarioElements.results.baseIrrf.textContent = `R$ ${(baseCalculoIRRF - (numDependentes * 189.59)).toFixed(2)}`; 
        salarioElements.results.irrf.textContent = `- R$ ${descontoIRRF.toFixed(2)}`; 
        salarioElements.results.salarioLiquido.textContent = `R$ ${salarioLiquido.toFixed(2)}`; 
        salarioElements.results.container.classList.remove('hidden'); 
        salarioElements.buttons.salvar.classList.remove('hidden');
    }
    
    function executarSimulacaoInvestimentos() {
        const valorInicial = parseFloat(investimentosElements.form.valorInicial.value) || 0;
        const aporteMensal = parseFloat(investimentosElements.form.aporteMensal.value) || 0;
        const taxaJurosAnual = parseFloat(investimentosElements.form.taxaJurosAnual.value) || 0;
        const periodoAnos = parseInt(investimentosElements.form.periodoAnos.value) || 0;
        if (taxaJurosAnual <= 0 || periodoAnos <= 0) { alert('Por favor, insira uma taxa de juros e um período em anos válidos.'); return; }
        const taxaMensal = (taxaJurosAnual / 100) / 12;
        const periodoMeses = periodoAnos * 12;
        let valorAcumulado = valorInicial;
        for (let i = 0; i < periodoMeses; i++) {
            valorAcumulado *= (1 + taxaMensal);
            valorAcumulado += aporteMensal;
        }
        const totalInvestido = valorInicial + (aporteMensal * periodoMeses);
        const totalJuros = valorAcumulado - totalInvestido;
        investimentosElements.results.valorFinal.textContent = `R$ ${valorAcumulado.toFixed(2)}`;
        investimentosElements.results.totalInvestido.textContent = `R$ ${totalInvestido.toFixed(2)}`;
        investimentosElements.results.totalJuros.textContent = `R$ ${totalJuros.toFixed(2)}`;
        investimentosElements.results.container.classList.remove('hidden');
        investimentosElements.buttons.salvar.classList.remove('hidden');
    }

    function executarCalculoFerias() {
        const salarioBruto = parseFloat(feriasElements.form.salarioBruto.value) || 0;
        const diasFerias = parseInt(feriasElements.form.dias.value) || 0;
        const venderDias = feriasElements.form.venderDias.checked;
        const adiantar13 = feriasElements.form.adiantar13.checked;
        if (salarioBruto <= 0 || diasFerias <= 0) { alert('Por favor, insira valores válidos para salário e dias de férias.'); return; }
        const feriasBrutas = (salarioBruto / 30) * diasFerias;
        const tercoConstitucional = feriasBrutas / 3;
        const totalBrutoFerias = feriasBrutas + tercoConstitucional;
        const abonoPecuniario = venderDias ? (salarioBruto / 30) * 10 : 0;
        const adiantamento13 = adiantar13 ? salarioBruto / 2 : 0;
        const descontoINSS = calcularINSS(totalBrutoFerias);
        const baseIRRF = totalBrutoFerias - descontoINSS;
        const descontoIRRF = calcularIRRF(baseIRRF);
        const liquidoReceber = (totalBrutoFerias - descontoINSS - descontoIRRF) + abonoPecuniario + adiantamento13;
        feriasElements.results.feriasBrutas.textContent = `R$ ${feriasBrutas.toFixed(2)}`;
        feriasElements.results.tercoConstitucional.textContent = `R$ ${tercoConstitucional.toFixed(2)}`;
        feriasElements.results.totalBruto.textContent = `R$ ${totalBrutoFerias.toFixed(2)}`;
        feriasElements.results.inss.textContent = `- R$ ${descontoINSS.toFixed(2)}`;
        feriasElements.results.irrf.textContent = `- R$ ${descontoIRRF.toFixed(2)}`;
        feriasElements.results.liquido.textContent = `R$ ${liquidoReceber.toFixed(2)}`;
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
        feriasElements.buttons.salvar.classList.remove('hidden');
    }

    function executarCalculo13Salario() {
        const salarioBruto = parseFloat(decimoTerceiroElements.form.salarioBruto.value) || 0;
        const mesesTrabalhados = parseInt(decimoTerceiroElements.form.meses.value) || 0;
        const numDependentes = parseInt(decimoTerceiroElements.form.dependentes.value) || 0;
        if (salarioBruto <= 0 || mesesTrabalhados <= 0 || mesesTrabalhados > 12) { alert('Por favor, insira valores válidos para salário e meses trabalhados (1 a 12).'); return; }
        const decimoTerceiroBruto = (salarioBruto / 12) * mesesTrabalhados;
        const primeiraParcela = decimoTerceiroBruto / 2;
        const segundaParcelaBruta = decimoTerceiroBruto - primeiraParcela;
        const descontoINSS = calcularINSS(decimoTerceiroBruto);
        const baseIRRF = decimoTerceiroBruto - descontoINSS;
        const descontoIRRF = calcularIRRF(baseIRRF, numDependentes);
        const segundaParcelaLiquida = segundaParcelaBruta - descontoINSS - descontoIRRF;
        const totalLiquido = primeiraParcela + segundaParcelaLiquida;
        decimoTerceiroElements.results.bruto.textContent = `R$ ${decimoTerceiroBruto.toFixed(2)}`;
        decimoTerceiroElements.results.primeiraParcela.textContent = `R$ ${primeiraParcela.toFixed(2)}`;
        decimoTerceiroElements.results.segundaParcelaBruta.textContent = `R$ ${segundaParcelaBruta.toFixed(2)}`;
        decimoTerceiroElements.results.inss.textContent = `- R$ ${descontoINSS.toFixed(2)}`;
        decimoTerceiroElements.results.irrf.textContent = `- R$ ${descontoIRRF.toFixed(2)}`;
        decimoTerceiroElements.results.segundaParcelaLiquida.textContent = `R$ ${segundaParcelaLiquida.toFixed(2)}`;
        decimoTerceiroElements.results.liquidoTotal.textContent = `R$ ${totalLiquido.toFixed(2)}`;
        decimoTerceiroElements.results.container.classList.remove('hidden');
        decimoTerceiroElements.buttons.salvar.classList.remove('hidden');
    }
    function executarCalculoHoraValor() { const salario = parseFloat(horaValorElements.form.salario.value) || 0; const horasDia = parseFloat(horaValorElements.form.horasDia.value) || 0; const diasSemana = parseInt(horaValorElements.form.diasSemana.value) || 0; if (salario <= 0 || horasDia <= 0 || diasSemana <= 0 || diasSemana > 7) { alert('Por favor, insira valores válidos para salário, horas por dia e dias por semana (1 a 7).'); return; } const horasTrabalhadasMes = horasDia * diasSemana * 4.5; const valorHora = salario / horasTrabalhadasMes; const explicacao = `Baseado no salário de R$ ${salario.toFixed(2)} que você informou, o cálculo é: R$ ${salario.toFixed(2)} / (${horasTrabalhadasMes.toFixed(1)} horas/mês).`; horaValorElements.results.valorHora.textContent = `R$ ${valorHora.toFixed(2)}`; horaValorElements.results.explicacao.textContent = explicacao; horaValorElements.results.container.classList.remove('hidden'); horaValorElements.buttons.salvar.classList.remove('hidden'); }
    
    function executarCalculoIRPFAnual() {
        const rendimentos = parseFloat(irpfElements.form.rendimentosAnuais.value) || 0;
        const saude = parseFloat(irpfElements.form.despesasSaude.value) || 0;
        const educacao = parseFloat(irpfElements.form.despesasEducacao.value) || 0;
        const dependentes = parseInt(irpfElements.form.dependentes.value) || 0;
        if (rendimentos <= 0) { alert('Por favor, insira o total de rendimentos anuais.'); return; }
        const DEDUCAO_POR_DEPENDENTE = 2275.08;
        const LIMITE_DEDUCAO_EDUCACAO = 3561.50;
        const LIMITE_DESCONTO_SIMPLIFICADO = 16754.34;
        const deducaoDependentes = dependentes * DEDUCAO_POR_DEPENDENTE;
        const deducaoEducacao = Math.min(educacao, LIMITE_DEDUCAO_EDUCACAO);
        const totalDeducoes = deducaoDependentes + deducaoEducacao + saude;
        const baseCalculoCompleta = rendimentos - totalDeducoes;
        const impostoDevidoCompleta = calcularImpostoAnual(baseCalculoCompleta);
        const descontoSimplificado = rendimentos * 0.20;
        const descontoAplicado = Math.min(descontoSimplificado, LIMITE_DESCONTO_SIMPLIFICADO);
        const baseCalculoSimplificada = rendimentos - descontoAplicado;
        const impostoDevidoSimplificada = calcularImpostoAnual(baseCalculoSimplificada);
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
        // ADICIONADO: Mostrar o botão de salvar do IRPF.
        irpfElements.buttons.salvar.classList.remove('hidden');
    }
    
    function executarCalculoSimplesNacional() { const faturamentoMensal = parseFloat(simplesNacionalElements.form.faturamentoMensal.value) || 0; const anexo = simplesNacionalElements.form.anexo.value; if (faturamentoMensal <= 0) { alert('Por favor, insira um valor de faturamento mensal válido.'); return; } const rbt12 = faturamentoMensal * 12; const tabelas = { anexo3: [ { ate: 180000, aliquota: 0.06, deduzir: 0 }, { ate: 360000, aliquota: 0.112, deduzir: 9360 }, { ate: 720000, aliquota: 0.135, deduzir: 17640 }, { ate: 1800000, aliquota: 0.16, deduzir: 35640 }, { ate: 3600000, aliquota: 0.21, deduzir: 125640 }, { ate: 4800000, aliquota: 0.33, deduzir: 648000 } ], anexo5: [ { ate: 180000, aliquota: 0.155, deduzir: 0 }, { ate: 360000, aliquota: 0.18, deduzir: 4500 }, { ate: 720000, aliquota: 0.195, deduzir: 9900 }, { ate: 1800000, aliquota: 0.205, deduzir: 17100 }, { ate: 3600000, aliquota: 0.23, deduzir: 62100 }, { ate: 4800000, aliquota: 0.305, deduzir: 540000 } ] }; const tabelaSelecionada = tabelas[anexo]; let faixaEncontrada = null; for (const faixa of tabelaSelecionada) { if (rbt12 <= faixa.ate) { faixaEncontrada = faixa; break; } } if (!faixaEncontrada) { alert('Faturamento anual excede o limite do Simples Nacional (R$ 4.800.000,00).'); return; } const { aliquota, deduzir } = faixaEncontrada; const aliquotaEfetiva = ((rbt12 * aliquota) - deduzir) / rbt12; const valorDAS = faturamentoMensal * aliquotaEfetiva; simplesNacionalElements.results.rbt12.textContent = `R$ ${rbt12.toFixed(2)}`; simplesNacionalElements.results.aliquotaEfetiva.textContent = `${(aliquotaEfetiva * 100).toFixed(2)}%`; simplesNacionalElements.results.valorDas.textContent = `R$ ${valorDAS.toFixed(2)}`; simplesNacionalElements.results.explicacao.textContent = `Cálculo: ((R$${rbt12.toFixed(2)} * ${aliquota * 100}%) - R$${deduzir}) / R$${rbt12.toFixed(2)} = Alíquota Efetiva de ${(aliquotaEfetiva * 100).toFixed(2)}%.`; simplesNacionalElements.results.container.classList.remove('hidden'); }
    function executarCalculoPjHoraValor() { const salarioDesejado = parseFloat(pjHoraValorElements.form.salarioDesejado.value) || 0; const custosFixos = parseFloat(pjHoraValorElements.form.custosFixos.value) || 0; const feriasAno = parseInt(pjHoraValorElements.form.feriasAno.value) || 0; const horasDia = parseFloat(pjHoraValorElements.form.horasDia.value) || 0; const diasSemana = parseInt(pjHoraValorElements.form.diasSemana.value) || 0; if (salarioDesejado <= 0 || horasDia <= 0 || diasSemana <= 0) { alert('Por favor, preencha o salário desejado, horas por dia e dias por semana.'); return; } const custoAnualTotal = (salarioDesejado * 12) + (custosFixos * 12); const diasTrabalhaveisAno = (diasSemana * 52) - feriasAno; if (diasTrabalhaveisAno <= 0) { alert('O número de dias de férias não pode ser maior ou igual ao total de dias de trabalho no ano.'); return; } const horasTrabalhaveisAno = diasTrabalhaveisAno * horasDia; const valorHora = custoAnualTotal / horasTrabalhaveisAno; pjHoraValorElements.results.valorHora.textContent = `R$ ${valorHora.toFixed(2)}`; pjHoraValorElements.results.explicacao.textContent = `Custo Anual de R$ ${custoAnualTotal.toFixed(2)} / ${horasTrabalhaveisAno.toFixed(0)} horas úteis no ano.`; pjHoraValorElements.results.container.classList.remove('hidden'); }

    // ==================================================================================
    // NOVA PARTE: LÓGICA DE BACKEND (SALVAR E CARREGAR HISTÓRICO)
    // ==================================================================================
    async function handleSalvarHoraValor() {
        console.log('Botão de salvar "Valor da Hora" clicado.');
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) { alert('Você precisa de estar autenticado para salvar um resultado.'); return; }
        await supabaseClient.from('historico_valor_hora').delete().eq('user_id', user.id);
        const salarioInformado = parseFloat(horaValorElements.form.salario.value) || 0;
        const horasDia = parseFloat(horaValorElements.form.horasDia.value) || 0;
        const diasSemana = parseInt(horaValorElements.form.diasSemana.value) || 0;
        const valorHoraCalculado = parseFloat(horaValorElements.results.valorHora.textContent.replace('R$ ', '')) || 0;
        const calculoParaSalvar = { user_id: user.id, salario_informado: salarioInformado, horas_dia: horasDia, dias_semana: diasSemana, valor_hora_calculado: valorHoraCalculado };
        const { error } = await supabaseClient.from('historico_valor_hora').insert(calculoParaSalvar);
        if (error) { console.error('Erro ao salvar o cálculo:', error); alert(`Ocorreu um erro ao salvar: ${error.message}`); } else { console.log('Cálculo salvo com sucesso!'); alert('Resultado salvo com sucesso!'); horaValorElements.buttons.salvar.textContent = 'Salvo!'; setTimeout(() => { horaValorElements.buttons.salvar.textContent = 'Salvar Resultado'; }, 2000); }
    }
    async function handleSalvarSalario() {
        console.log('Botão de salvar "Salário" clicado.');
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) { alert('Você precisa de estar autenticado para salvar um resultado.'); return; }
        await supabaseClient.from('historico_salarios').delete().eq('user_id', user.id);
        const salarioBruto = parseFloat(salarioElements.form.salarioBruto.value) || 0;
        const dependentes = parseInt(salarioElements.form.dependentes.value) || 0;
        const inss = parseFloat(salarioElements.results.inss.textContent.replace('- R$ ', '')) || 0;
        const irrf = parseFloat(salarioElements.results.irrf.textContent.replace('- R$ ', '')) || 0;
        const liquido = parseFloat(salarioElements.results.salarioLiquido.textContent.replace('R$ ', '')) || 0;
        const calculoParaSalvar = { user_id: user.id, salario_bruto_informado: salarioBruto, dependentes_informado: dependentes, desconto_inss_calculado: inss, desconto_irrf_calculado: irrf, salario_liquido_calculado: liquido };
        const { error } = await supabaseClient.from('historico_salarios').insert(calculoParaSalvar);
        if (error) { console.error('Erro ao salvar o cálculo de salário:', error); alert(`Ocorreu um erro ao salvar: ${error.message}`); } else { console.log('Cálculo de salário salvo com sucesso!'); alert('Resultado salvo com sucesso!'); salarioElements.buttons.salvar.textContent = 'Salvo!'; setTimeout(() => { salarioElements.buttons.salvar.textContent = 'Salvar Resultado'; }, 2000); }
    }

    async function handleSalvarInvestimentos() {
        console.log('Botão de salvar "Investimentos" clicado.');
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) { alert('Você precisa de estar autenticado para salvar um resultado.'); return; }
        await supabaseClient.from('historico_investimentos').delete().eq('user_id', user.id);
        const valorInicial = parseFloat(investimentosElements.form.valorInicial.value) || 0;
        const aporteMensal = parseFloat(investimentosElements.form.aporteMensal.value) || 0;
        const taxaJuros = parseFloat(investimentosElements.form.taxaJurosAnual.value) || 0;
        const periodoAnos = parseInt(investimentosElements.form.periodoAnos.value) || 0;
        const valorFinal = parseFloat(investimentosElements.results.valorFinal.textContent.replace('R$ ', '')) || 0;
        const calculoParaSalvar = { user_id: user.id, valor_inicial_informado: valorInicial, aporte_mensal_informado: aporteMensal, taxa_juros_informada: taxaJuros, periodo_anos_informado: periodoAnos, valor_final_calculado: valorFinal };
        const { error } = await supabaseClient.from('historico_investimentos').insert(calculoParaSalvar);
        if (error) { console.error('Erro ao salvar a simulação:', error); alert(`Ocorreu um erro ao salvar: ${error.message}`); } else { console.log('Simulação salva com sucesso!'); alert('Simulação salva com sucesso!'); investimentosElements.buttons.salvar.textContent = 'Salvo!'; setTimeout(() => { investimentosElements.buttons.salvar.textContent = 'Salvar Simulação'; }, 2000); }
    }
    
    async function handleSalvarFerias() {
        console.log('Botão de salvar "Férias" clicado.');
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) { alert('Você precisa de estar autenticado para salvar um resultado.'); return; }
        await supabaseClient.from('historico_ferias').delete().eq('user_id', user.id);
        const salarioBruto = parseFloat(feriasElements.form.salarioBruto.value) || 0;
        const diasFerias = parseInt(feriasElements.form.dias.value) || 0;
        const vendeuDias = feriasElements.form.venderDias.checked;
        const adiantou13 = feriasElements.form.adiantar13.checked;
        const liquidoReceber = parseFloat(feriasElements.results.liquido.textContent.replace('R$ ', '')) || 0;
        const calculoParaSalvar = { user_id: user.id, salario_bruto_informado: salarioBruto, dias_ferias_informado: diasFerias, vendeu_dias: vendeuDias, adiantou_13: adiantou13, liquido_receber_calculado: liquidoReceber };
        const { error } = await supabaseClient.from('historico_ferias').insert(calculoParaSalvar);
        if (error) { console.error('Erro ao salvar o cálculo de férias:', error); alert(`Ocorreu um erro ao salvar: ${error.message}`); } else { console.log('Cálculo de férias salvo com sucesso!'); alert('Cálculo salvo com sucesso!'); feriasElements.buttons.salvar.textContent = 'Salvo!'; setTimeout(() => { feriasElements.buttons.salvar.textContent = 'Salvar Cálculo'; }, 2000); }
    }
    
    async function handleSalvarDecimoTerceiro() {
        console.log('Botão de salvar "13º Salário" clicado.');
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) {
            alert('Você precisa de estar autenticado para salvar um resultado.');
            return;
        }
        await supabaseClient.from('historico_decimo_terceiro').delete().eq('user_id', user.id);
        const salarioBruto = parseFloat(decimoTerceiroElements.form.salarioBruto.value) || 0;
        const mesesTrabalhados = parseInt(decimoTerceiroElements.form.meses.value) || 0;
        const liquidoTotal = parseFloat(decimoTerceiroElements.results.liquidoTotal.textContent.replace('R$ ', '')) || 0;
        const calculoParaSalvar = { user_id: user.id, salario_bruto_informado: salarioBruto, meses_trabalhados_informado: mesesTrabalhados, liquido_total_calculado: liquidoTotal };
        const { error } = await supabaseClient.from('historico_decimo_terceiro').insert(calculoParaSalvar);
        if (error) { console.error('Erro ao salvar o cálculo de 13º:', error); alert(`Ocorreu um erro ao salvar: ${error.message}`); } else { console.log('Cálculo de 13º salvo com sucesso!'); alert('Cálculo salvo com sucesso!'); decimoTerceiroElements.buttons.salvar.textContent = 'Salvo!'; setTimeout(() => { decimoTerceiroElements.buttons.salvar.textContent = 'Salvar Cálculo'; }, 2000); }
    }

    // ADICIONADO: Nova função para salvar a simulação de IRPF.
    async function handleSalvarIRPF() {
        console.log('Botão de salvar "IRPF Anual" clicado.');
        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) {
            alert('Você precisa de estar autenticado para salvar um resultado.');
            return;
        }

        await supabaseClient.from('historico_irpf').delete().eq('user_id', user.id);

        const rendimentos = parseFloat(irpfElements.form.rendimentosAnuais.value) || 0;
        const impostoCompleta = parseFloat(irpfElements.results.completa.textContent.replace('R$ ', '')) || 0;
        const impostoSimplificada = parseFloat(irpfElements.results.simplificada.textContent.replace('R$ ', '')) || 0;
        const recomendacao = irpfElements.results.recomendacao.textContent;

        const calculoParaSalvar = {
            user_id: user.id,
            rendimentos_anuais_informado: rendimentos,
            imposto_completa_calculado: impostoCompleta,
            imposto_simplificada_calculado: impostoSimplificada,
            recomendacao: recomendacao
        };

        const { error } = await supabaseClient.from('historico_irpf').insert(calculoParaSalvar);

        if (error) {
            console.error('Erro ao salvar a simulação de IRPF:', error);
            alert(`Ocorreu um erro ao salvar: ${error.message}`);
        } else {
            console.log('Simulação de IRPF salva com sucesso!');
            alert('Simulação salva com sucesso!');
            irpfElements.buttons.salvar.textContent = 'Salvo!';
            setTimeout(() => {
                irpfElements.buttons.salvar.textContent = 'Salvar Simulação';
            }, 2000);
        }
    }

    async function carregarHistorico() {
        console.log('A carregar o histórico de cálculos...');
        historicoElements.lista.innerHTML = '<p class="explanation-text text-center">A carregar o seu histórico...</p>';
        showScreen('historico');

        const { data: { user } } = await supabaseClient.auth.getUser();
        if (!user) {
            historicoElements.lista.innerHTML = '<p class="explanation-text text-center">Você precisa de estar autenticado para ver o histórico.</p>';
            return;
        }

        // ADICIONADO: Buscar dados de IRPF junto com os outros.
        const [salariosRes, horaValorRes, investimentosRes, feriasRes, decimoTerceiroRes, irpfRes] = await Promise.all([
            supabaseClient.from('historico_salarios').select('*').eq('user_id', user.id),
            supabaseClient.from('historico_valor_hora').select('*').eq('user_id', user.id),
            supabaseClient.from('historico_investimentos').select('*').eq('user_id', user.id),
            supabaseClient.from('historico_ferias').select('*').eq('user_id', user.id),
            supabaseClient.from('historico_decimo_terceiro').select('*').eq('user_id', user.id),
            supabaseClient.from('historico_irpf').select('*').eq('user_id', user.id)
        ]);
        
        const errorFound = salariosRes.error || horaValorRes.error || investimentosRes.error || feriasRes.error || decimoTerceiroRes.error || irpfRes.error;
        if (errorFound) {
            console.error('Erro ao buscar histórico:', errorFound);
            historicoElements.lista.innerHTML = `<p class="explanation-text text-center error-text">Ocorreu um erro ao carregar o seu histórico.</p>`;
            return;
        }

        const salarios = salariosRes.data.map(item => ({ ...item, type: 'salario' }));
        const horasValor = horaValorRes.data.map(item => ({ ...item, type: 'horaValor' }));
        const investimentos = investimentosRes.data.map(item => ({ ...item, type: 'investimento' }));
        const ferias = feriasRes.data.map(item => ({ ...item, type: 'ferias' }));
        const decimoTerceiro = decimoTerceiroRes.data.map(item => ({ ...item, type: 'decimoTerceiro' }));
        // ADICIONADO: Mapear os dados de IRPF.
        const irpf = irpfRes.data.map(item => ({ ...item, type: 'irpf' }));
        
        const todosOsCalculos = [...salarios, ...horasValor, ...investimentos, ...ferias, ...decimoTerceiro, ...irpf];

        todosOsCalculos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        historicoElements.lista.innerHTML = ''; 

        if (todosOsCalculos.length === 0) {
            historicoElements.lista.innerHTML = '<p class="explanation-text text-center">Você ainda não salvou nenhum cálculo.</p>';
            return;
        }
        
        todosOsCalculos.forEach(calculo => {
            const dataFormatada = new Date(calculo.created_at).toLocaleDateString('pt-BR');
            let itemHtml = '';

            switch (calculo.type) {
                case 'salario':
                    itemHtml = `
                        <div class="historico-item">
                            <h3>Cálculo de Salário</h3>
                            <p class="explanation-text">Salvo em: ${dataFormatada}</p>
                            <div class="result-line">
                                <span>Salário Bruto Informado:</span>
                                <span>R$ ${calculo.salario_bruto_informado.toFixed(2)}</span>
                            </div>
                            <div class="result-line final-result">
                                <span>Salário Líquido Calculado:</span>
                                <span class="font-bold">R$ ${calculo.salario_liquido_calculado.toFixed(2)}</span>
                            </div>
                        </div>`;
                    break;
                case 'horaValor':
                    itemHtml = `
                        <div class="historico-item">
                            <h3>Cálculo de Valor da Hora</h3>
                            <p class="explanation-text">Salvo em: ${dataFormatada}</p>
                            <div class="result-line">
                                <span>Salário Informado:</span>
                                <span>R$ ${calculo.salario_informado.toFixed(2)}</span>
                            </div>
                            <div class="result-line final-result">
                                <span>Valor da Hora Calculado:</span>
                                <span class="font-bold">R$ ${calculo.valor_hora_calculado.toFixed(2)}</span>
                            </div>
                        </div>`;
                    break;
                case 'investimento':
                    itemHtml = `
                        <div class="historico-item">
                            <h3>Simulação de Investimentos</h3>
                            <p class="explanation-text">Salvo em: ${dataFormatada}</p>
                            <div class="result-line">
                                <span>Aporte Mensal:</span>
                                <span>R$ ${calculo.aporte_mensal_informado.toFixed(2)} por ${calculo.periodo_anos_informado} anos</span>
                            </div>
                            <div class="result-line final-result">
                                <span>Valor Final Acumulado:</span>
                                <span class="font-bold">R$ ${calculo.valor_final_calculado.toFixed(2)}</span>
                            </div>
                        </div>`;
                    break;
                case 'ferias':
                    itemHtml = `
                        <div class="historico-item">
                            <h3>Cálculo de Férias</h3>
                            <p class="explanation-text">Salvo em: ${dataFormatada}</p>
                            <div class="result-line">
                                <span>Salário Bruto:</span>
                                <span>R$ ${calculo.salario_bruto_informado.toFixed(2)} para ${calculo.dias_ferias_informado} dias</span>
                            </div>
                            <div class="result-line final-result">
                                <span>Líquido a Receber:</span>
                                <span class="font-bold">R$ ${calculo.liquido_receber_calculado.toFixed(2)}</span>
                            </div>
                        </div>`;
                    break;
                case 'decimoTerceiro':
                    itemHtml = `
                        <div class="historico-item">
                            <h3>Cálculo de 13º Salário</h3>
                            <p class="explanation-text">Salvo em: ${dataFormatada}</p>
                            <div class="result-line">
                                <span>Salário Bruto:</span>
                                <span>R$ ${calculo.salario_bruto_informado.toFixed(2)} (${calculo.meses_trabalhados_informado} meses)</span>
                            </div>
                            <div class="result-line final-result">
                                <span>Total Líquido do 13º:</span>
                                <span class="font-bold">R$ ${calculo.liquido_total_calculado.toFixed(2)}</span>
                            </div>
                        </div>`;
                    break;
                // ADICIONADO: Template para exibir o histórico de IRPF.
                case 'irpf':
                    itemHtml = `
                        <div class="historico-item">
                            <h3>Simulador de IRPF Anual</h3>
                            <p class="explanation-text">Salvo em: ${dataFormatada}</p>
                            <div class="result-line">
                                <span>Rendimentos Anuais:</span>
                                <span>R$ ${calculo.rendimentos_anuais_informado.toFixed(2)}</span>
                            </div>
                            <div class="result-line final-result">
                                <span>Recomendação:</span>
                                <span class="font-bold">${calculo.recomendacao.replace('Recomendação: ', '')}</span>
                            </div>
                        </div>`;
                    break;
            }
            historicoElements.lista.innerHTML += itemHtml;
        });
    }

    // PARTE 7: REGISTO DE EVENT LISTENERS
    // ----------------------------------------------------------------------------------
    if(authButtons.showLogin) authButtons.showLogin.addEventListener('click', () => { authForms.choices.classList.add('hidden'); authForms.login.classList.remove('hidden'); });
    if(authButtons.showSignup) authButtons.showSignup.addEventListener('click', () => { authForms.choices.classList.add('hidden'); authForms.signup.classList.remove('hidden'); });
    if(authForms.login) authForms.login.addEventListener('submit', handleLogin);
    if(authForms.signup) authForms.signup.addEventListener('submit', handleSignup);
    if(authButtons.logout) authButtons.logout.addEventListener('click', handleLogout);
    if(authButtons.logoutPj) authButtons.logoutPj.addEventListener('click', handleLogout);

    if(welcomeScreenElements.buttons.clt) welcomeScreenElements.buttons.clt.addEventListener('click', async () => { 
        const { data: { user } } = await supabaseClient.auth.getUser(); 
        const welcomeMessage = document.getElementById('welcome-message'); 
        if (welcomeMessage && user) { 
            welcomeMessage.textContent = `Bem-vindo(a), ${user.email}!`; 
        } 
        const randomIndex = Math.floor(Math.random() * dashboardQuotes.length); 
        dashboardElements.quote.textContent = dashboardQuotes[randomIndex]; 
        showScreen('dashboard'); 
    });
    
    if(welcomeScreenElements.buttons.pj) welcomeScreenElements.buttons.pj.addEventListener('click', () => showScreen('pjDashboard'));

    if(dashboardButtons.salario) dashboardButtons.salario.addEventListener('click', () => { preencherFormulariosComPerfil(); showScreen('salario'); });
    if(dashboardButtons.investimentos) dashboardButtons.investimentos.addEventListener('click', () => showScreen('investimentos'));
    if(dashboardButtons.ferias) dashboardButtons.ferias.addEventListener('click', () => { preencherFormulariosComPerfil(); showScreen('ferias'); });
    if(dashboardButtons.decimoTerceiro) dashboardButtons.decimoTerceiro.addEventListener('click', () => { preencherFormulariosComPerfil(); showScreen('decimoTerceiro'); });
    if(dashboardButtons.horaValor) dashboardButtons.horaValor.addEventListener('click', () => { preencherFormulariosComPerfil(); showScreen('horaValor'); });
    if(dashboardButtons.irpf) dashboardButtons.irpf.addEventListener('click', () => showScreen('irpf'));
    if(dashboardButtons.profile) dashboardButtons.profile.addEventListener('click', () => { preencherFormulariosComPerfil(); showScreen('profile'); });
   if(dashboardButtons.reports) {
    dashboardButtons.reports.addEventListener('click', async () => {
        // Primeiro, verifica se o perfil existe para mostrar ou esconder o conteúdo principal
        if (!userProfile) {
            reportsElements.content.classList.add('hidden');
            reportsElements.notice.classList.remove('hidden');
        } else {
            reportsElements.content.classList.remove('hidden');
            reportsElements.notice.classList.add('hidden');
            
            // Agora, chama as novas funções assíncronas para desenhar os gráficos e os cartões
            await renderSalaryChart();
            await renderInvestmentChart();
            renderSummaryCards();
        }
        // Só depois de tudo pronto, mostra a tela
        showScreen('reports');
    });
}

    if(dashboardButtons.historico) dashboardButtons.historico.addEventListener('click', carregarHistorico);

    if(pjDashboardButtons.simples) pjDashboardButtons.simples.addEventListener('click', () => showScreen('simplesNacional'));
    if(pjDashboardButtons.horaValorPj) pjDashboardButtons.horaValorPj.addEventListener('click', () => showScreen('pjHoraValor'));
    if(pjDashboardButtons.backToWelcome) pjDashboardButtons.backToWelcome.addEventListener('click', () => showScreen('welcome'));

    if(salarioElements.buttons.calcular) salarioElements.buttons.calcular.addEventListener('click', executarCalculoSalario);
    if(salarioElements.buttons.voltar) salarioElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
    if(investimentosElements.buttons.calcular) investimentosElements.buttons.calcular.addEventListener('click', executarSimulacaoInvestimentos);
    if(investimentosElements.buttons.voltar) investimentosElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
    if(feriasElements.buttons.calcular) feriasElements.buttons.calcular.addEventListener('click', executarCalculoFerias);
    if(feriasElements.buttons.voltar) feriasElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
    if(decimoTerceiroElements.buttons.calcular) decimoTerceiroElements.buttons.calcular.addEventListener('click', executarCalculo13Salario);
    if(decimoTerceiroElements.buttons.voltar) decimoTerceiroElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
    if(horaValorElements.buttons.calcular) horaValorElements.buttons.calcular.addEventListener('click', executarCalculoHoraValor);
    if(horaValorElements.buttons.voltar) horaValorElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
    if(irpfElements.buttons.calcular) irpfElements.buttons.calcular.addEventListener('click', executarCalculoIRPFAnual);
    if(irpfElements.buttons.voltar) irpfElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
    if(profileElements.buttons.salvar) profileElements.buttons.salvar.addEventListener('click', handleSaveProfile);
    if(profileElements.buttons.voltar) profileElements.buttons.voltar.addEventListener('click', () => showScreen('dashboard'));
    if(reportsElements.backButton) reportsElements.backButton.addEventListener('click', () => showScreen('dashboard'));
    if(simplesNacionalElements.buttons.calcular) simplesNacionalElements.buttons.calcular.addEventListener('click', executarCalculoSimplesNacional);
    if(simplesNacionalElements.buttons.voltar) simplesNacionalElements.buttons.voltar.addEventListener('click', () => showScreen('pjDashboard'));
    if(pjHoraValorElements.buttons.calcular) pjHoraValorElements.buttons.calcular.addEventListener('click', executarCalculoPjHoraValor);
    if(pjHoraValorElements.buttons.voltar) pjHoraValorElements.buttons.voltar.addEventListener('click', () => showScreen('pjDashboard'));
    if(historicoElements.voltar) historicoElements.voltar.addEventListener('click', () => showScreen('dashboard'));

    if(horaValorElements.buttons.salvar) horaValorElements.buttons.salvar.addEventListener('click', handleSalvarHoraValor);
    if(salarioElements.buttons.salvar) salarioElements.buttons.salvar.addEventListener('click', handleSalvarSalario);
    if(investimentosElements.buttons.salvar) investimentosElements.buttons.salvar.addEventListener('click', handleSalvarInvestimentos);
    if(feriasElements.buttons.salvar) feriasElements.buttons.salvar.addEventListener('click', handleSalvarFerias);
    if(decimoTerceiroElements.buttons.salvar) decimoTerceiroElements.buttons.salvar.addEventListener('click', handleSalvarDecimoTerceiro);
    // ADICIONADO: Event listener para o novo botão de salvar de IRPF.
    if(irpfElements.buttons.salvar) irpfElements.buttons.salvar.addEventListener('click', handleSalvarIRPF);
    
    if(dashboardButtons.showAbout) dashboardButtons.showAbout.addEventListener('click', () => { modalElements.overlay.classList.remove('hidden'); });
    if(modalElements.closeBtn) modalElements.closeBtn.addEventListener('click', () => { modalElements.overlay.classList.add('hidden'); });
    if(modalElements.overlay) modalElements.overlay.addEventListener('click', (event) => { if (event.target === modalElements.overlay) { modalElements.overlay.classList.add('hidden'); } });

    supabaseClient.auth.onAuthStateChange((_event, session) => { updateUserUI(session ? session.user : null); });

    console.log("main.js carregado com sucesso. Aplicação pronta.");
});

