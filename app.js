/**
 * ==================================================================================
 * app.js - Lógica de Interface (UI) da Aplicação "Calculadora Certa"
 * ----------------------------------------------------------------------------------
 * Este arquivo contém a lógica relacionada à experiência do usuário e animações.
 * Responsabilidades:
 * 1. Gerenciar a troca de tema (claro/escuro).
 * 2. Controlar animações e transições visuais (a serem adicionadas no futuro).
 * 3. Enviar mensagens ao console para facilitar a depuração.
 * ==================================================================================
 */

// PARTE 1: LÓGICA DE TROCA DE TEMA
// ----------------------------------------------------------------------------------

// Selecionamos o botão que o usuário clica para mudar o tema.
const themeToggleButton = document.getElementById('theme-toggle');

// Selecionamos o elemento <html> da página. É nele que aplicaremos o atributo
// que o nosso CSS usará para saber qual tema mostrar.
const htmlElement = document.documentElement;

// Adicionamos um "ouvinte" que dispara uma ação sempre que o botão é clicado.
themeToggleButton.addEventListener('click', () => {
    // Verificamos se o atributo 'data-theme' já está definido como 'dark'.
    const isDarkMode = htmlElement.getAttribute('data-theme') === 'dark';

    if (isDarkMode) {
        // Se estiver no modo escuro, removemos o atributo para voltar ao tema claro.
        htmlElement.removeAttribute('data-theme');
        console.log("Tema alterado para: Claro");
    } else {
        // Se estiver no modo claro, adicionamos o atributo para ativar o tema escuro.
        htmlElement.setAttribute('data-theme', 'dark');
        console.log("Tema alterado para: Escuro");
    }
});


// MENSAGEM FINAL DE VERIFICAÇÃO
// ----------------------------------------------------------------------------------
// Esta mensagem confirma que o script 'app.js' foi carregado corretamente.
console.log("app.js (UI) carregado com sucesso. Lógica de interface pronta.");
