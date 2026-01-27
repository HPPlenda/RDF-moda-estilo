// Dados Mockados (Simulando o products.ts)
const products = [
    { id: 1, name: "Camiseta Básica", category: "masculino", price: 59.9, isNew: true, isOffer: false },
    { id: 2, name: "Vestido Floral", category: "feminino", price: 129.9, isNew: false, isOffer: true },
    { id: 3, name: "Sapato Infantil", category: "infantil", price: 89.9, isNew: true, isOffer: false },
    // Adicione mais produtos conforme necessário
];

// ESTADO DA APLICAÇÃO
let state = {
    activeCategory: 'masculino',
    searchQuery: '',
    cart: [],
    isCartOpen: false
};

// SELETORES
const contentArea = document.getElementById('content-area');
const cartCountLabel = document.getElementById('cartCount');
const cartSheet = document.getElementById('cartSheet');

// FUNÇÕES DE LÓGICA
function render() {
    // 1. Filtragem
    let filtered = products.filter(p => p.category === state.activeCategory);
    
    if (state.searchQuery) {
        filtered = products.filter(p => 
            p.name.toLowerCase().includes(state.searchQuery.toLowerCase())
        );
    }

    // 2. Construir HTML
    let html = `<h2>${state.searchQuery ? `Resultados para "${state.searchQuery}"` : state.activeCategory.toUpperCase()}</h2>`;
    html += `<div class="product-grid">`;
    
    filtered.forEach(product => {
        html += `
            <div class="product-card">
                <img src="https://via.placeholder.com/150" alt="${product.name}">
                <h4>${product.name}</h4>
                <p>R$ ${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})">Adicionar</button>
            </div>
        `;
    });
    
    html += `</div>`;
    contentArea.innerHTML = html;

    // 3. Atualizar Carrinho
    cartCountLabel.innerText = state.cart.length;
    cartSheet.classList.toggle('open', state.isCartOpen);
    
    // Atualizar ícones (se estiver usando Lucide)
    lucide.createIcons();
}

// EVENTOS
document.querySelectorAll('.tab').forEach(button => {
    button.addEventListener('click', (e) => {
        state.activeCategory = e.target.dataset.category;
        state.searchQuery = ''; // Limpa busca ao trocar categoria
        
        document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        render();
    });
});

document.getElementById('searchInput').addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    render();
});

function addToCart(id) {
    const product = products.find(p => p.id === id);
    state.cart.push(product);
    render();
}

document.getElementById('cartBtn').onclick = () => { state.isCartOpen = true; render(); };
document.getElementById('bottomCartBtn').onclick = () => { state.isCartOpen = true; render(); };
document.getElementById('closeCart').onclick = () => { state.isCartOpen = false; render(); };

// Inicializar
render();