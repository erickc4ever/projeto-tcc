/**
 * ==================================================================================
 * app.js - Lógica da Interface do Usuário (UI) da "änalitks"
 * ----------------------------------------------------------------------------------
 * Responsabilidades:
 * 1. Lidar com interações visuais que não afetam o estado principal da aplicação.
 * 2. Gerenciar a troca de tema (claro/escuro).
 * 3. Futuramente, pode conter animações e outros efeitos visuais.
 * ==================================================================================
 */

console.log("Iniciando o app.js (UI)...");

// --- LÓGICA DE TROCA DE TEMA ---

// 1. Selecionamos os elementos necessários do HTML.
const themeToggleButton = document.getElementById('theme-toggle');
const htmlElement = document.documentElement; // Usamos documentElement para pegar a tag <html>

// 2. Adicionamos um "ouvinte" que espera por um clique no botão.
themeToggleButton.addEventListener('click', () => {
    // 3. Verificamos qual é o tema atual lendo o atributo 'data-theme'.
    const currentTheme = htmlElement.getAttribute('data-theme');
    
    // 4. Invertemos o tema.
    // Se o tema atual for 'dark', o novo tema será 'light'. Caso contrário, será 'dark'.
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    // 5. Aplicamos o novo tema ao elemento <html>.
    htmlElement.setAttribute('data-theme', newTheme);

    console.log(`Tema alterado para: ${newTheme}`);
});

console.log("app.js carregado com sucesso. Lógica de UI pronta.");

