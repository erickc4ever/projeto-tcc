/**
 * ==================================================================================
 * app.js - Lógica da Interface do Utilizador (UI) da "änalitks"
 * ----------------------------------------------------------------------------------
 * Responsabilidades:
 * 1. Controlar a troca de tema (claro/escuro).
 * 2. Manipular pequenas animações ou interações visuais que não são a lógica
 * principal de negócio.
 * ==================================================================================
 */

// Espera que o HTML esteja completamente carregado antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    console.log("app.js (UI) carregado com sucesso.");

    // --- LÓGICA DE TROCA DE TEMA ---

    // Seleciona o botão de troca de tema e o body do documento.
    const themeToggleButton = document.getElementById('theme-toggle-btn');
    const body = document.body;

    // Adiciona um "ouvinte" que aguarda por um clique no botão.
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            // Verifica se o body já tem o atributo 'data-theme' com o valor 'dark'.
            const isDarkMode = body.getAttribute('data-theme') === 'dark';

            if (isDarkMode) {
                // Se estiver no modo escuro, remove o atributo para voltar ao tema claro (padrão).
                body.removeAttribute('data-theme');
                console.log("Tema alterado para: Claro");
            } else {
                // Se estiver no modo claro, define o atributo para 'dark' para ativar o tema escuro.
                body.setAttribute('data-theme', 'dark');
                console.log("Tema alterado para: Escuro");
            }
        });
    }

});

