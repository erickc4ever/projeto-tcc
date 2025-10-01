/**
 * ==================================================================================
 * main.js - Cérebro da Aplicação "Calculadora Certa" (Versão Reestruturada)
 * ----------------------------------------------------------------------------------
 * Organizado em seções para maior clareza e facilidade de depuração.
 * ==================================================================================
 */

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
    calculator: document.getElementById('calculator-screen'),
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

// --- Seletores da Calculadora ---
const calculatorElements = {
    salarioBrutoInput: document.getElementById('salario-bruto-input'),
    calcularBtn: document.getElementById('calcular-btn'),
    salvarBtn: document.getElementById('salvar-btn'),
    resultadosContainer: document.getElementById('resultados-container'),
    resultadoBrutoSpan: document.getElementById('resultado-bruto'),
    resultadoInssSpan: document.getElementById('resultado-inss'),
    resultadoIrrfSpan: document.getElementById('resultado-irrf'),
    resultadoLiquidoSpan: document.getElementById('resultado-liquido'),
};

// --- Seletores de Navegação ---
const navButtons = {
    gotoInss: document.getElementById('goto-inss-btn'),
    backToDashboard: document.getElementById('back-to-dashboard-btn'),
};

// --- Variável de Estado ---
let ultimoResultado = null;


// PARTE 2: FUNÇÕES DE CÁLCULO (O CÉREBRO PURO)
// ----------------------------------------------------------------------------------

/**
 * Calcula o desconto do INSS com base na tabela progressiva.
 * @param {number} salario - O salário bruto.
 * @returns {number} O valor do desconto.
 */
function calcularDescontoINSS(salario) {
    const faixas = [
        { limite: 1412.00, aliquota: 0.075, deducao: 0 },
        { limite: 2666.68, aliquota: 0.09,  deducao: 21.18 },
        { limite: 4000.03, aliquota: 0.12,  deducao: 101.18 },
        { limite: 7786.02, aliquota: 0.14,  deducao: 181.18 }
    ];
    const tetoINSS = 908.85;

    if (salario > faixas[3].limite) return tetoINSS;

    for (const faixa of faixas) {
        if (salario <= faixa.limite) {
            return (salario * faixa.aliquota) - faixa.deducao;
        }
    }
    return 0;
}

/**
 * Calcula o desconto do IRRF com base na tabela progressiva.
 * @param {number} baseDeCalculo - Salário bruto menos o desconto do INSS.
 * @returns {number} O valor do desconto.
 */
function calcularDescontoIRRF(baseDeCalculo) {
    const faixas = [
        { limite: 2259.20, aliquota: 0,       deducao: 0 },
        { limite: 2826.65, aliquota: 0.075,   deducao: 169.44 },
        { limite: 3751.05, aliquota: 0.15,    deducao: 381.44 },
        { limite: 4664.68, aliquota: 0.225,   deducao: 662.77 },
        { limite: Infinity,aliquota: 0.275,   deducao: 896.00 }
    ];

    for (const faixa of faixas) {
        if (baseDeCalculo <= faixa.limite) {
            const imposto = (baseDeCalculo * faixa.aliquota) - faixa.deducao;
            return imposto > 0 ? imposto : 0;
        }
    }
    return 0;
}

/**
 * Orquestra o processo de cálculo e atualização da UI.
 */
function executarCalculo() {
    console.log("Botão 'Calcular' pressionado. Iniciando cálculo...");
    
    const salarioBruto = parseFloat(calculatorElements.salarioBrutoInput.value);

    if (isNaN(salarioBruto) || salarioBruto <= 0) {
        alert("Por favor, insira um salário válido.");
        console.error("ERRO: O valor inserido não é um salário válido.");
        return;
    }

    const descontoINSS = calcularDescontoINSS(salarioBruto);
    const baseCalculoIRRF = salarioBruto - descontoINSS;
    const descontoIRRF = calcularDescontoIRRF(baseCalculoIRRF);
    const salarioLiquido = salarioBruto - descontoINSS - descontoIRRF;

    calculatorElements.resultadoBrutoSpan.textContent = salarioBruto.toFixed(2);
    calculatorElements.resultadoInssSpan.textContent = descontoINSS.toFixed(2);
    calculatorElements.resultadoIrrfSpan.textContent = descontoIRRF.toFixed(2);
    calculatorElements.resultadoLiquidoSpan.textContent = salarioLiquido.toFixed(2);

    calculatorElements.resultadosContainer.style.display = 'block';
    
    ultimoResultado = {
        name: `Cálculo de R$ ${salarioBruto.toFixed(2)}`,
        type: 'salario_liquido',
        inputs: { salarioBruto },
        results: { descontoINSS, descontoIRRF, salarioLiquido }
    };
    
    calculatorElements.salvarBtn.disabled = false;
    console.log("Cálculo realizado com sucesso:", ultimoResultado);
}


// PARTE 3: FUNÇÕES DE GERENCIAMENTO DE TELA E UI
// ----------------------------------------------------------------------------------

function showScreen(screenName) {
    Object.values(screens).forEach(screen => screen.classList.add('hidden'));
    screens[screenName].classList.remove('hidden');
    console.log(`Exibindo a tela: ${screenName}`);
}

function updateUserUI(user) {
    if (user) {
        document.getElementById('welcome-message').textContent = `Bem-vindo(a), ${user.email}!`;
        showScreen('dashboard');
    } else {
        showScreen('auth');
    }
}


// PARTE 4: FUNÇÕES DE AUTENTICAÇÃO E DADOS
// ----------------------------------------------------------------------------------

async function handleLogin(event) {
    event.preventDefault();
    const email = authForms.login.querySelector('#login-email').value;
    const password = authForms.login.querySelector('#login-password').value;
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) alert(`Erro no login: ${error.message}`);
}

async function handleSignup(event) {
    event.preventDefault();
    const email = authForms.signup.querySelector('#signup-email').value;
    const password = authForms.signup.querySelector('#signup-password').value;
    const { error } = await supabaseClient.auth.signUp({ email, password });
    if (error) {
        alert(`Erro no cadastro: ${error.message}`);
    } else {
        alert('Cadastro realizado! Verifique seu e-mail para confirmar e depois faça o login.');
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

async function salvarSimulacao() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return alert('Você precisa estar logado para salvar.');
    if (!ultimoResultado) return alert('Calcule primeiro antes de salvar.');

    const { error } = await supabaseClient.from('simulations').insert({ user_id: user.id, ...ultimoResultado });
    
    if (error) {
        alert(`Erro ao salvar: ${error.message}`);
        console.error("Erro ao salvar:", error);
    } else {
        alert('Simulação salva com sucesso!');
        calculatorElements.salvarBtn.disabled = true;
    }
}


// PARTE 5: REGISTRO DE EVENT LISTENERS
// ----------------------------------------------------------------------------------
console.log("Registrando event listeners...");

// --- Autenticação ---
authButtons.showLogin.addEventListener('click', () => {
    authForms.choices.classList.add('hidden');
    authForms.login.classList.remove('hidden');
});
authButtons.showSignup.addEventListener('click', () => {
    authForms.choices.classList.add('hidden');
    authForms.signup.classList.remove('hidden');
});
authButtons.showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    authForms.signup.classList.add('hidden');
    authForms.login.classList.remove('hidden');
});
authButtons.showSignupLink.addEventListener('click', (e) => {
    e.preventDefault();
    authForms.login.classList.add('hidden');
    authForms.signup.classList.remove('hidden');
});
authForms.login.addEventListener('submit', handleLogin);
authForms.signup.addEventListener('submit', handleSignup);
authButtons.logout.addEventListener('click', handleLogout);

// --- Navegação ---
navButtons.gotoInss.addEventListener('click', () => showScreen('calculator'));
navButtons.backToDashboard.addEventListener('click', () => showScreen('dashboard'));

// --- Calculadora ---
calculatorElements.calcularBtn.addEventListener('click', executarCalculo);
calculatorElements.salvarBtn.addEventListener('click', salvarSimulacao);

// --- Estado de Autenticação ---
supabaseClient.auth.onAuthStateChange((_event, session) => {
    console.log("Estado de autenticação mudou:", session);
    updateUserUI(session ? session.user : null);
});


// PARTE 6: INICIALIZAÇÃO DA APLICAÇÃO
// ----------------------------------------------------------------------------------
// A função onAuthStateChange já lida com a verificação inicial da sessão,
// então não precisamos de uma chamada separada ao carregar a página.
console.log("main.js carregado com sucesso. Aplicação pronta.");