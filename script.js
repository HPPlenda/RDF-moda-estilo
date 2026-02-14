// Estado da Aplicação
let cart = [];
let favorites = [];
let user = JSON.parse(localStorage.getItem('user')) || null;

const allProducts = [
    { id: 1, name: "Camisa Casual", price: 49.99, cat: "masculino" },
    { id: 2, name: "Calça Jeans", price: 89.90, cat: "masculino" },
    { id: 3, name: "Tênis Esportivo", price: 120.00, cat: "masculino" },
    { id: 4, name: "Jaqueta Couro", price: 199.90, cat: "masculino" },
    { id: 5, name: "Camiseta Básica", price: 29.99, cat: "masculino" },
    { id: 6, name: "Bermuda Cargo", price: 59.90, cat: "masculino" },
    { id: 7, name: "Vestido Floral", price: 120.00, cat: "feminino" },
    { id: 8, name: "Blusa Silk", price: 55.00, cat: "feminino" },
    { id: 9, name: "Saia Plissada", price: 79.90, cat: "feminino" },
    { id: 10, name: "Bolsa Lateral", price: 89.99, cat: "feminino" },
    { id: 11, name: "Sandália Alta", price: 99.90, cat: "feminino" },
    { id: 12, name: "Blazer Feminino", price: 149.90, cat: "feminino" },
    { id: 13, name: "Conjunto Kids", price: 39.90, cat: "infantil" },
    { id: 14, name: "Sapato Bebê", price: 29.99, cat: "infantil" },
    { id: 15, name: "Macacão Infantil", price: 49.90, cat: "infantil" },
    { id: 16, name: "Camiseta Cartoon", price: 19.99, cat: "infantil" },
    { id: 17, name: "Vestidinho Bebê", price: 35.90, cat: "infantil" },
    { id: 18, name: "Shorts Kids", price: 25.99, cat: "infantil" }
];

function toggleMenu() {
    const drawer = document.getElementById('drawer');
    const menuIcon = document.getElementById('menu-icon');
    drawer.classList.toggle('active');
    
    if (drawer.classList.contains('active')) {
        menuIcon.classList.replace('fa-bars', 'fa-times');
    } else {
        menuIcon.classList.replace('fa-times', 'fa-bars');
    }
}

function showPage(pId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const drawer = document.getElementById('drawer');
    drawer.classList.remove('active');
    const menuIcon = document.getElementById('menu-icon');
    if(menuIcon) menuIcon.classList.replace('fa-times', 'fa-bars');
    
    const target = document.getElementById(pId);
    if(target) target.classList.add('active');
    
    if(pId === 'carrinho') renderCart();
    if(pId === 'favoritos') renderFavorites();
    if(pId === 'pedidos') renderPedidos();
    if(pId === 'cadastro') initCadastro();
    window.scrollTo(0,0);
}

document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('click', function() {
        const color = this.getAttribute('data-color');
        this.style.setProperty('--cat-color', color);
        this.classList.add('clicked');
        setTimeout(() => {
            this.classList.remove('clicked');
        }, 400);
    });
});

function loadVitrine(cat) {
    const grid = document.getElementById('products-grid');
    const vitrine = document.getElementById('vitrine');
    const title = document.getElementById('vitrine-title');
    
    vitrine.className = 'page px-4 bg-' + cat;
    
    const titleMap = {
        masculino: 'Masculinas',
        feminino: 'Femininas',
        infantil: 'Infantis'
    };
    
    title.innerText = "Roupas " + (titleMap[cat] || cat.charAt(0).toUpperCase() + cat.slice(1));
    const filtered = allProducts.filter(p => p.cat === cat);
    grid.innerHTML = filtered.map(prod => createProductCard(prod)).join('');
    showPage('vitrine');
}

function createProductCard(prod) {
    const isFav = favorites.some(f => f.id === prod.id);
    const inCart = cart.some(c => c.id === prod.id);
    return `
        <div class="product-card" data-prod-id="${prod.id}">
            <img src="RDM moda & estilo.svg" alt="Produto" class="product-img">
            <h3 class="font-bold uppercase text-sm">${prod.name}</h3>
            <p class="price font-bold text-lg my-2">R$ ${prod.price.toFixed(2)}</p>
            <button onclick="toggleCart(${prod.id})" class="btn-cart ${inCart ? 'active' : ''}">
                ${inCart ? 'Adicionado' : 'Botar no carrinho'}
            </button>
            <button onclick="toggleFav(${prod.id})" class="btn-fav ${isFav ? 'active' : ''}">
                <i class="fa-solid fa-crown"></i>
                <span>${isFav ? 'Favoritado' : 'Favoritar'}</span>
            </button>
        </div>
    `;
}

function toggleCart(id) {
    const index = cart.findIndex(p => p.id === id);
    if(index > -1) {
        cart.splice(index, 1);
    } else {
        const prod = allProducts.find(p => p.id === id);
        cart.push({...prod, qty: 1});
    }
    updateCartUI();
    updateProductButtons(id);
}

function updateCartUI() {
    const count = document.getElementById('cart-count');
    count.innerText = cart.length;
    count.classList.toggle('hidden', cart.length === 0);
}

function renderCart() {
    const list = document.getElementById('cart-list');
    const totalEl = document.getElementById('cart-total');
    const buyBtn = document.getElementById('buy-btn');
    
    if(cart.length === 0) {
        list.innerHTML = "<p class='text-center text-gray-500'>Carrinho vazio</p>";
        totalEl.innerText = "Total: R$ 0,00";
        buyBtn.classList.add('hidden');
        return;
    }
    
    let total = 0;
    list.innerHTML = cart.map((item, index) => {
        total += item.price * item.qty;
        return `
            <div class="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm border">
                <img src="RDM moda & estilo.svg" alt="Produto" class="w-16 h-16 rounded">
                <div class="flex-1 font-bold text-xs uppercase">
                    ${item.name}<br>
                    <span class="text-blue-500">R$ ${(item.price * item.qty).toFixed(2)}</span>
                </div>
                <div class="flex items-center gap-2">
                    <i class="fa-solid fa-circle-minus text-xl text-gray-400" onclick="changeQty(${index}, -1)"></i>
                    <span class="font-bold">${item.qty}</span>
                    <i class="fa-solid fa-circle-plus text-xl text-blue-500" onclick="changeQty(${index}, 1)"></i>
                    <i class="fa-solid fa-trash-can ml-2 text-red-400" onclick="removeFromCart(${index})"></i>
                </div>
            </div>
        `;
    }).join('');
    totalEl.innerText = `Total: R$ ${total.toFixed(2)}`;
    buyBtn.classList.remove('hidden');
}

function changeQty(index, delta) {
    if(cart[index].qty + delta > 0) {
        cart[index].qty += delta;
        renderCart();
    }
}

function removeFromCart(index) {
    const removedId = cart[index].id;
    cart.splice(index, 1);
    renderCart();
    updateCartUI();
    updateProductButtons(removedId);
}

function toggleFav(id) {
    const index = favorites.findIndex(p => p.id === id);
    if(index > -1) {
        favorites.splice(index, 1);
    } else {
        const prod = allProducts.find(p => p.id === id);
        favorites.push(prod);
    }
    updateProductButtons(id);
}

function renderFavorites() {
    const list = document.getElementById('fav-list');
    if(favorites.length === 0) {
        list.innerHTML = "<p class='text-center text-gray-500'>Nenhum favorito ainda.</p>";
        return;
    }
    list.innerHTML = favorites.map(prod => createProductCard(prod)).join('');
}

function finalizarCompra() {
    if(cart.length > 0) {
        alert("Pedido realizado com sucesso!");
        cart = [];
        updateCartUI();
        showPage('pedidos');
    } else {
        alert("Seu carrinho está vazio!");
    }
}

function updateProductButtons(id) {
    const cards = document.querySelectorAll(`.product-card[data-prod-id="${id}"]`);
    cards.forEach(card => {
        const isFav = favorites.some(f => f.id === id);
        const inCart = cart.some(c => c.id === id);
        const cartBtn = card.querySelector('.btn-cart');
        cartBtn.classList.toggle('active', inCart);
        cartBtn.innerText = inCart ? 'Adicionado' : 'Botar no carrinho';
        const favBtn = card.querySelector('.btn-fav');
        favBtn.classList.toggle('active', isFav);
        favBtn.querySelector('span').innerText = isFav ? 'Favoritado' : 'Favoritar';
    });
}

function initCadastro() {
    const inputs = document.querySelectorAll('#cadastro input');
    inputs.forEach(input => {
        input.addEventListener('input', checkCadastroFilled);
    });
    checkCadastroFilled();
}

function checkCadastroFilled() {
    const inputs = document.querySelectorAll('#cadastro input');
    const allFilled = Array.from(inputs).every(input => input.value.trim() !== '');
    const saveBtn = document.getElementById('save-btn');
    if(saveBtn) saveBtn.classList.toggle('hidden', !allFilled);
}

function saveUser() {
    const userData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        bairro: document.getElementById('bairro').value,
        rua: document.getElementById('rua').value,
        numero: document.getElementById('numero').value,
        referencia: document.getElementById('referencia').value
    };
    localStorage.setItem('user', JSON.stringify(userData));
    user = userData;
    alert('Cadastro salvo com sucesso!');
}

function renderPedidos() {
    const msg = document.getElementById('pedidos-msg');
    if (!user) {
        msg.innerText = 'Você precisa se cadastrar para fazer pedidos';
        msg.classList.add('text-red-500');
    } else {
        msg.innerText = 'Não há pedidos realizados';
        msg.classList.remove('text-red-500');
    }
}
