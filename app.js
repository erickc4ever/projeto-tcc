// ===================================================================================
// ARQUIVO: app.js
// OBJETIVO: Responsável por toda a manipulação da interface (UI),
//           renderização de dados e gerenciamento de eventos do usuário.
//           Este arquivo é o "artista" que desenha o que o main.js (cérebro) decide.
// ===================================================================================

// -----------------------------------------------------------------------------------
// 1. REFERÊNCIAS AOS ELEMENTOS DO DOM
// -----------------------------------------------------------------------------------
const loader = document.getElementById('loader');
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');

// Elementos de Autenticação
const tabLogin = document.getElementById('tab-login');
const tabSignup = document.getElementById('tab-signup');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const signupEmailInput = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');
const loginErrorMessage = document.getElementById('login-error-message');
const signupErrorMessage = document.getElementById('signup-error-message');
const logoutButton = document.getElementById('logout-button');
const userEmailDisplay = document.getElementById('user-email-display');

// Elementos do Dashboard
const filtersForm = document.getElementById('filters-form');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const categoryFilterSelect = document.getElementById('category-filter');

// Elementos do Modal
const addSaleBtn = document.getElementById('add-sale-btn');
const addSaleModal = document.getElementById('add-sale-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const addSaleForm = document.getElementById('add-sale-form');
const saleProductInput = document.getElementById('sale-product');
const saleQuantityInput = document.getElementById('sale-quantity');
const salePriceInput = document.getElementById('sale-price');
const saleDateInput = document.getElementById('sale-date');
const saleCategorySelect = document.getElementById('sale-category');
const modalErrorMessage = document.getElementById('modal-error-message');

// Elementos de Exibição de Dados
const kpiTotalRevenue = document.getElementById('kpi-total-revenue');
const kpiAvgTicket = document.getElementById('kpi-avg-ticket');
const kpiTotalSales = document.getElementById('kpi-total-sales');
const kpiTopCategory = document.getElementById('kpi-top-category');
const recentSalesContainer = document.getElementById('recent-sales-container');

// Contextos dos Gráficos
const revenueChartCtx = document.getElementById('revenue-chart').getContext('2d');
const topProductsChartCtx = document.getElementById('top-products-chart').getContext('2d');
const categoryChartCtx = document.getElementById('category-chart').getContext('2d');

// -----------------------------------------------------------------------------------
// 2. ESTADO DA UI E INSTÂNCIAS DOS GRÁFICOS
// -----------------------------------------------------------------------------------
const charts = {}; // Objeto para armazenar as instâncias dos gráficos

// -----------------------------------------------------------------------------------
// 3. FUNÇÕES DE MANIPULAÇÃO DA UI (VISIBILIDADE)
// -----------------------------------------------------------------------------------
const showLoginView = () => {
    loginView.style.display = 'flex';
    dashboardView.style.display = 'none';
};

const showDashboardView = () => {
    loginView.style.display = 'none';
    dashboardView.style.display = 'flex';
};

const showLoadingIndicator = (isLoading) => {
    loader.style.display = isLoading ? 'flex' : 'none';
};

const toggleModal = (show) => {
    addSaleModal.style.display = show ? 'flex' : 'none';
    if (!show) {
        addSaleForm.reset(); // Limpa o formulário ao fechar
        modalErrorMessage.textContent = '';
    }
};

// -----------------------------------------------------------------------------------
// 4. FUNÇÕES DE RENDERIZAÇÃO DE DADOS
// -----------------------------------------------------------------------------------

/**
 * Formata um número para o padrão de moeda brasileira (BRL).
 * @param {number} value - O número a ser formatado.
 * @returns {string} - O valor formatado como moeda.
 */
const formatCurrency = (value) => {
    if (typeof value !== 'number') return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

/**
 * Renderiza os cards de KPI (Métricas Principais).
 * @param {object} metrics - O objeto de métricas vindo do main.js.
 */
function renderKPIs(metrics) {
    kpiTotalRevenue.textContent = formatCurrency(metrics?.total_revenue || 0);
    kpiAvgTicket.textContent = formatCurrency(metrics?.avg_ticket || 0);
    kpiTotalSales.textContent = metrics?.total_sales || 0;
    kpiTopCategory.textContent = metrics?.top_category?.nome || 'N/A';
}

/**
 * Renderiza a tabela de vendas recentes.
 * @param {Array} sales - A lista de vendas vinda do main.js.
 */
function renderRecentSalesTable(sales) {
    if (sales.length === 0) {
        recentSalesContainer.innerHTML = '<p>Nenhuma venda encontrada.</p>';
        return;
    }

    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Produto</th>
                    <th>Data</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${sales.slice(0, 10).map(sale => `
                    <tr>
                        <td>${sale.produto}</td>
                        <td>${new Date(sale.data_venda).toLocaleDateString('pt-BR')}</td>
                        <td>${formatCurrency(sale.total)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    recentSalesContainer.innerHTML = tableHTML;
}

/**
 * Preenche os menus suspensos de categoria.
 * @param {Array} categories - A lista de categorias.
 */
function populateCategoryDropdowns(categories) {
    const optionsHTML = categories.map(cat => `<option value="${cat.id}">${cat.nome}</option>`).join('');
    categoryFilterSelect.innerHTML = `<option value="">Todas as categorias</option>${optionsHTML}`;
    saleCategorySelect.innerHTML = `<option value="">Selecione...</option>${optionsHTML}`;
}


/**
 * Cria ou atualiza todos os gráficos do dashboard.
 * @param {object} appState - O estado completo da aplicação.
 */
function renderCharts(appState) {
    // Destruir gráficos antigos para evitar sobreposição e memory leaks
    Object.values(charts).forEach(chart => chart.destroy());

    // --- Gráfico de Faturamento por Dia ---
    const dailyRevenue = {};
    appState.vendas.forEach(sale => {
        const date = sale.data_venda;
        dailyRevenue[date] = (dailyRevenue[date] || 0) + sale.total;
    });
    const sortedDates = Object.keys(dailyRevenue).sort((a, b) => new Date(a) - new Date(b));
    charts.revenue = new Chart(revenueChartCtx, {
        type: 'line',
        data: {
            labels: sortedDates.map(date => new Date(date).toLocaleDateString('pt-BR')),
            datasets: [{
                label: 'Faturamento',
                data: sortedDates.map(date => dailyRevenue[date]),
                borderColor: 'rgba(0, 122, 255, 1)',
                backgroundColor: 'rgba(0, 122, 255, 0.1)',
                fill: true,
                tension: 0.1
            }]
        }
    });

    // --- Gráfico de Produtos Mais Vendidos ---
    const productSales = {};
    appState.vendas.forEach(sale => {
        productSales[sale.produto] = (productSales[sale.produto] || 0) + sale.total;
    });
    const topProducts = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5);
    charts.topProducts = new Chart(topProductsChartCtx, {
        type: 'bar',
        data: {
            labels: topProducts.map(p => p[0]),
            datasets: [{
                label: 'Total Vendido',
                data: topProducts.map(p => p[1]),
                backgroundColor: 'rgba(0, 122, 255, 0.7)'
            }]
        },
        options: { indexAxis: 'y' }
    });

    // --- Gráfico de Vendas por Categoria ---
    const categorySales = {};
    appState.vendas.forEach(sale => {
        const categoryName = sale.categorias?.nome || 'Sem Categoria';
        categorySales[categoryName] = (categorySales[categoryName] || 0) + sale.total;
    });
    charts.category = new Chart(categoryChartCtx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(categorySales),
            datasets: [{
                data: Object.values(categorySales),
                backgroundColor: ['#007AFF', '#34C759', '#FF9500', '#FF3B30', '#5856D6', '#AF52DE']
            }]
        }
    });
}

/**
 * Função principal que atualiza toda a UI do dashboard.
 * @param {object} appState - O estado completo da aplicação, vindo do main.js.
 */
function renderDashboard(appState) {
    if (!appState.user) return;
    userEmailDisplay.textContent = appState.user.email;
    
    populateCategoryDropdowns(appState.categorias);
    renderKPIs(appState.metricas);
    renderRecentSalesTable(appState.vendas);
    renderCharts(appState);
}


// -----------------------------------------------------------------------------------
// 5. CONFIGURAÇÃO DOS EVENT LISTENERS
// -----------------------------------------------------------------------------------
function setupEventListeners() {
    // --- Autenticação ---
    tabLogin.addEventListener('click', () => {
        tabLogin.classList.add('active');
        tabSignup.classList.remove('active');
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
    });

    tabSignup.addEventListener('click', () => {
        tabSignup.classList.add('active');
        tabLogin.classList.remove('active');
        signupForm.style.display = 'block';
        loginForm.style.display = 'none';
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        loginErrorMessage.textContent = '';
        const { success, message } = await handleSignIn(loginEmailInput.value, loginPasswordInput.value);
        if (!success) {
            loginErrorMessage.textContent = 'Email ou senha inválidos.';
        }
    });

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        signupErrorMessage.textContent = '';
        const { success, message } = await handleSignUp(signupEmailInput.value, signupPasswordInput.value);
        if (!success) {
            signupErrorMessage.textContent = 'Erro ao criar conta. Verifique os dados.';
        } else {
            alert('Cadastro realizado com sucesso! Faça o login.');
            // Alterna para a aba de login
            tabLogin.click();
        }
    });

    logoutButton.addEventListener('click', handleSignOut);

    // --- Modal ---
    addSaleBtn.addEventListener('click', () => toggleModal(true));
    closeModalBtn.addEventListener('click', () => toggleModal(false));
    addSaleModal.addEventListener('click', (e) => {
        if (e.target === addSaleModal) toggleModal(false); // Fecha se clicar fora
    });

    addSaleForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        modalErrorMessage.textContent = '';
        const saleData = {
            produto: saleProductInput.value,
            quantidade: parseInt(saleQuantityInput.value),
            valor_unitario: parseFloat(salePriceInput.value),
            data_venda: saleDateInput.value,
            categoria_id: saleCategorySelect.value ? parseInt(saleCategorySelect.value) : null
        };
        const { success } = await addSale(saleData);
        if (success) {
            toggleModal(false);
            await onSaleAdded(); // Avisa o main.js para recarregar os dados
        } else {
            modalErrorMessage.textContent = 'Erro ao salvar venda. Tente novamente.';
        }
    });

    // --- Filtros ---
    filtersForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const filters = {
            startDate: startDateInput.value,
            endDate: endDateInput.value,
            categoryId: categoryFilterSelect.value
        };
        onFiltersChanged(filters); // Avisa o main.js para recarregar com filtros
    });
}

// -----------------------------------------------------------------------------------
// 6. INICIALIZAÇÃO
// -----------------------------------------------------------------------------------
setupEventListeners();
