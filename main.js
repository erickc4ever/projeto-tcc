/**
 * ==================================================================================
 * main.js - Cérebro Completo da Aplicação "Calculadora Certa"
 * ----------------------------------------------------------------------------------
 * Este arquivo contém toda a lógica funcional da aplicação.
 * Responsabilidades:
 * 1. Conectar-se com o backend (Supabase).
 * 2. Gerenciar a autenticação de usuários (login/logout).
 * 3. Capturar dados do usuário e realizar os cálculos financeiros.
 * 4. Salvar os resultados dos cálculos no banco de dados para usuários logados.
 * 5. Enviar mensagens ao console para facilitar a depuração.
 * ==================================================================================
 */

// PARTE 1: CONFIGURAÇÃO DO BACKEND (SUPABASE)
// ----------------------------------------------------------------------------------

// Suas chaves de API públicas para se conectar ao projeto Supabase.
const SUPABASE_URL = 'https://ejddiovmtjpipangyqeo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqZGRpb3ZtdGpwaXBhbmd5cWVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MTU4MDksImV4cCI6MjA3NDI5MTgwOX0.GH53mox_cijkhqAxy-sNmvxGcgtoLzuoE5sfP9hHdho';

// Cria o "cliente", nosso objeto principal para interagir com o Supabase.
// A biblioteca 'supabase' é carregada pelo script no HTML.
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('Cliente Supabase inicializado.');


// PARTE 2: SELEÇÃO DOS ELEMENTOS HTML
// ----------------------------------------------------------------------------------

// Selecionamos todos os elementos da interface com os quais vamos interagir.
const loginBtn = document.getElementById('login-btn');
const salarioBrutoInput = document.getElementById('salario-bruto-input');
const calcularBtn = document.getElementById('calcular-btn');
const resultadosContainer = document.getElementById('resultados-container');
const salvarBtn = document.getElementById('salvar-btn');

// Spans para exibir os resultados
const resultadoBrutoSpan = document.getElementById('resultado-bruto');
const resultadoInssSpan = document.getElementById('resultado-inss');
const resultadoIrrfSpan = document.getElementById('resultado-irrf');
const resultadoLiquidoSpan = document.getElementById('resultado-liquido');

// Variável para guardar o último resultado de cálculo, para podermos salvar depois.
let ultimoResultado = null;


// PARTE 3: LÓGICA DE AUTENTICAÇÃO
// ----------------------------------------------------------------------------------

/**
 * Função para fazer login usando o Google.
 * O Supabase abre uma janela pop-up para o usuário se autenticar.
 */
async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    });
    if (error) {
        console.error('Erro ao fazer login com Google:', error);
    }
}

/**
 * Função para fazer logout do usuário.
 */
async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Erro ao fazer logout:', error);
    } else {
        // Esconde o botão de salvar e o container de resultados ao deslogar
        salvarBtn.style.display = 'none';
        resultadosContainer.style.display = 'none';
        console.log("Usuário deslogado com sucesso.");
    }
}

// O Supabase verifica o estado da autenticação (se o usuário está logado ou não)
// sempre que a página carrega ou o estado muda.
supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
        // Se o usuário ESTÁ logado:
        console.log('Usuário está logado:', session.user.email);
        loginBtn.textContent = 'Sair'; // Muda o texto do botão para "Sair"
    } else {
        // Se o usuário NÃO ESTÁ logado:
        console.log('Nenhum usuário logado.');
        loginBtn.textContent = 'Entrar'; // Mantém/volta o texto para "Entrar"
    }
});

// Adiciona o evento de clique ao botão de login/logout.
loginBtn.addEventListener('click', async (e) => {
    e.preventDefault(); // Previne que o link '#' recarregue a página
    const { data } = await supabase.auth.getSession();
    
    if (data.session) {
        // Se já existe uma sessão (usuário logado), a ação é de logout.
        signOut();
    } else {
        // Se não há sessão, a ação é de login.
        signInWithGoogle();
    }
});


// PARTE 4: LÓGICA DA CALCULADORA FINANCEIRA
// ----------------------------------------------------------------------------------
// (As funções de cálculo `calcularDescontoINSS` e `calcularDescontoIRRF` permanecem as mesmas)

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
        if (salario <= faixa.limite) return (salario * faixa.aliquota) - faixa.deducao;
    }
    return 0;
}

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

calcularBtn.addEventListener('click', async () => {
    const salarioBruto = parseFloat(salarioBrutoInput.value);
    if (isNaN(salarioBruto) || salarioBruto <= 0) {
        console.error("ERRO: O valor inserido não é um salário válido.");
        alert("Por favor, insira um salário válido.");
        return; 
    }

    const descontoINSS = calcularDescontoINSS(salarioBruto);
    const baseCalculoIRRF = salarioBruto - descontoINSS;
    const descontoIRRF = calcularDescontoIRRF(baseCalculoIRRF);
    const salarioLiquido = salarioBruto - descontoINSS - descontoIRRF;
    
    // Guarda o resultado na variável global
    ultimoResultado = {
        salarioBruto,
        descontoINSS,
        descontoIRRF,
        salarioLiquido
    };

    resultadoBrutoSpan.textContent = salarioBruto.toFixed(2);
    resultadoInssSpan.textContent = descontoINSS.toFixed(2);
    resultadoIrrfSpan.textContent = descontoIRRF.toFixed(2);
    resultadoLiquidoSpan.textContent = salarioLiquido.toFixed(2);

    resultadosContainer.style.display = 'block';

    // VERIFICA SE O USUÁRIO ESTÁ LOGADO PARA MOSTRAR O BOTÃO SALVAR
    const { data } = await supabase.auth.getSession();
    if (data.session) {
        salvarBtn.style.display = 'block'; // Mostra o botão
    } else {
        salvarBtn.style.display = 'none'; // Esconde o botão
    }

    console.log("Cálculo realizado com sucesso:", ultimoResultado);
});


// PARTE 5: SALVAR DADOS NO BACKEND
// ----------------------------------------------------------------------------------

salvarBtn.addEventListener('click', async () => {
    // Pega a sessão atual para garantir que o usuário ainda está logado.
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        alert("Você precisa estar logado para salvar uma simulação.");
        console.warn("Tentativa de salvar sem estar logado.");
        return;
    }

    if (!ultimoResultado) {
        alert("Faça um cálculo antes de salvar.");
        console.warn("Tentativa de salvar sem ter um cálculo recente.");
        return;
    }

    // Prepara o objeto para ser inserido no banco de dados.
    const simulacaoParaSalvar = {
        user_id: session.user.id, // ID do usuário logado
        name: `Cálculo de R$ ${ultimoResultado.salarioBruto.toFixed(2)}`,
        type: 'salario_liquido',
        inputs: { salarioBruto: ultimoResultado.salarioBruto },
        results: { 
            descontoINSS: ultimoResultado.descontoINSS,
            descontoIRRF: ultimoResultado.descontoIRRF,
            salarioLiquido: ultimoResultado.salarioLiquido
        }
    };

    // Insere os dados na tabela 'simulations' do Supabase.
    const { error } = await supabase.from('simulations').insert(simulacaoParaSalvar);

    if (error) {
        console.error("Erro ao salvar a simulação:", error);
        alert("Ocorreu um erro ao salvar sua simulação. Tente novamente.");
    } else {
        console.log("Simulação salva com sucesso!", simulacaoParaSalvar);
        alert("Sua simulação foi salva com sucesso!");
        salvarBtn.style.display = 'none'; // Esconde o botão após salvar
    }
});


// MENSAGEM FINAL DE VERIFICAÇÃO
// ----------------------------------------------------------------------------------
console.log("main.js (Cérebro Completo) carregado. Lógica de cálculo, auth e backend pronta.");