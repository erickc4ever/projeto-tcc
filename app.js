/**
 * ==================================================================================
 * app.js - Lógica de Interface do Usuário (UI)
 * ----------------------------------------------------------------------------------
 * Este arquivo é responsável por interações visuais e animações que melhoram a
 * experiência do usuário, mas não fazem parte da lógica de negócio principal.
 *
 * Responsabilidade Principal:
 * 1. Controlar a troca de tema (claro/escuro).
 * ==================================================================================
 */

console.log("Iniciando o app.js...");

// Selecionamos o botão de troca de tema.
const themeToggleButton = document.getElementById('theme-toggle');

// Selecionamos o elemento raiz <html> para alterar o atributo 'data-theme'.
// Usar o <html> é uma boa prática para garantir que a página inteira mude.
const htmlElement = document.documentElement;

/**
 * Função para alternar o tema da aplicação.
 * Lê o atributo 'data-theme' atual e o inverte.
 */
function toggleTheme() {
    // Verifica qual é o tema atual. Se não houver 'data-theme', assume-se 'light'.
    const currentTheme = htmlElement.getAttribute('data-theme');

    if (currentTheme === 'dark') {
        // Se o tema for escuro, muda para o claro.
        htmlElement.setAttribute('data-theme', 'light');
        console.log("Tema alterado para: Claro");
    } else {
        // Se for claro (ou nulo), muda para o escuro.
        htmlElement.setAttribute('data-theme', 'dark');
        console.log("Tema alterado para: Escuro");
    }
}

// Adicionamos um "ouvinte" que espera por um clique no botão.
// Quando o botão for clicado, a função toggleTheme será chamada.
themeToggleButton.addEventListener('click', toggleTheme);


// Mensagem final para confirmar que o script foi carregado com sucesso.
console.log("app.js carregado com sucesso. Lógica de UI pronta.");

