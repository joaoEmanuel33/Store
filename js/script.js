// Variáveis globais
let currentProduct = null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

// Funções do Modal de Quantidade
function openModal(productId, productName, productPrice, productDescription, productImage) {
    console.log('openModal called with:', { productId, productName, productPrice, productDescription, productImage }); // Log para depuração

    // Verifica se o usuário está logado
    if (!localStorage.getItem('loggedInUserEmail')) {
        // Exibe o pop-up de login/cadastro
        document.getElementById('login-popup').style.display = 'block';
        return; // Impede que o modal de quantidade seja aberto
    }

    // Preencher os detalhes do modal
    document.getElementById('modal-product-name').textContent = productName;
    document.getElementById('modal-product-description').textContent = productDescription || 'Descrição não disponível'; // Adicionar fallback
    document.getElementById('modal-product-price').textContent = productPrice.toFixed(2).replace('.', ',');
    document.getElementById('modal-product-image').src = productImage || 'default-image.jpg'; // Adicionar fallback para imagem

    // Exibir o modal de quantidade
    document.getElementById('quantity-modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('quantity-modal').style.display = 'none';
}

function incrementQuantity() {
    const input = document.getElementById('quantity');
    if (input.value < 10) {
        input.value = parseInt(input.value) + 1;
    }
}

function decrementQuantity() {
    const input = document.getElementById('quantity');
    if (input.value > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// Funções do Carrinho
function addToCart() {
    // Capturar os dados do modal
    const productName = document.getElementById('modal-product-name').textContent;
    const productPrice = parseFloat(document.getElementById('modal-product-price').textContent.replace(',', '.'));
    const productQuantity = parseInt(document.getElementById('quantity').value, 10);
    const productImage = document.getElementById('modal-product-image').src;

    // Verificar se o produto já está no carrinho
    const existingProduct = cart.find(item => item.name === productName);

    if (existingProduct) {
        // Atualizar a quantidade se o produto já estiver no carrinho
        existingProduct.quantity += productQuantity;
    } else {
        // Adicionar novo produto ao carrinho
        cart.push({
            name: productName,
            price: productPrice,
            quantity: productQuantity,
            image: productImage
        });
    }

    // Atualizar o contador do carrinho
    updateCartCount();

    // Atualizar o carrinho na interface
    updateCartUI();

    // Fechar o modal de quantidade
    closeModal();

    // Abrir o carrinho
    toggleCart();
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (!cartCountElement) return; // Element not found, skip update
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems;
}

function formatPrice(price) {
    return price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <h4>${item.name}</h4>
            <p>Quantidade: ${item.quantity}</p>
            <p>Preço unitário: ${formatPrice(item.price)}</p>
            <p>Subtotal: ${formatPrice(itemTotal)}</p>
            <button onclick="removeFromCart(${index})">Remover</button>
        `;
        cartItems.appendChild(itemElement);
    });

    cartTotal.textContent = formatPrice(total);
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
}

function toggleCart() {
    const cartPanel = document.getElementById('shopping-cart');
    cartPanel.classList.toggle('active');
}

// Fechar o carrinho quando clicar fora dele
document.addEventListener('click', (e) => {
    const cartPanel = document.getElementById('shopping-cart');
    const cartIcon = document.querySelector('.cart-icon');

    if (cartPanel.classList.contains('active') &&
        !cartPanel.contains(e.target) &&
        !cartIcon.contains(e.target)) {
        cartPanel.classList.remove('active');
    }
});

// Fechar o modal de quantidade quando clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('quantity-modal');
    if (event.target == modal) {
        closeModal();
    }
}

// Inicializar o carrinho ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
});

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    // Limpar o conteúdo atual do carrinho
    cartItemsContainer.innerHTML = '';

    // Atualizar os itens do carrinho
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>Quantidade: ${item.quantity}</p>
                <p>Preço: R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</p>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Atualizar o total do carrinho
    cartTotalElement.textContent = total.toFixed(2).replace('.', ',');
}

function closeCart() {
    const cartPanel = document.getElementById('shopping-cart');
    cartPanel.classList.remove('active'); // Removido display: none
}

function openPaymentModal() {
    const paymentModal = document.getElementById('payment-modal');
    const paymentItemsContainer = document.getElementById('payment-items');
    const paymentTotalElement = document.getElementById('payment-total');

    // Limpar o conteúdo atual do modal de pagamento
    paymentItemsContainer.innerHTML = '';

    // Adicionar os itens do carrinho ao modal de pagamento
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const paymentItem = document.createElement('div');
        paymentItem.classList.add('payment-item');
        paymentItem.innerHTML = `
            <div class="payment-item-details">
                <img src="${item.image}" alt="${item.name}" class="payment-item-image">
                <div>
                    <h4>${item.name}</h4>
                    <p>Quantidade: ${item.quantity}</p>
                    <p>Preço unitário: R$ ${item.price.toFixed(2).replace('.', ',')}</p>
                    <p>Subtotal: R$ ${itemTotal.toFixed(2).replace('.', ',')}</p>
                </div>
            </div>
        `;
        paymentItemsContainer.appendChild(paymentItem);
    });

    // Atualizar o total no modal de pagamento
    paymentTotalElement.textContent = total.toFixed(2).replace('.', ',');

    // Exibir o modal de pagamento
    paymentModal.style.display = 'block';
}

function closePaymentModal() {
    const paymentModal = document.getElementById('payment-modal');
    paymentModal.style.display = 'none';
}

function proceedToPayment() {
    showToast('Redirecionando para a página de pagamento...');
    // Aqui você pode redirecionar para uma página de pagamento real
    closePaymentModal();
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast show';

    // Remover o toast após 3 segundos
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}

// Seção de Login e Cadastro
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginSubmit = document.getElementById('loginForm');
const signupSubmit = document.getElementById('signupForm');
const loginError = document.getElementById('loginError');
const signupSuccess = document.getElementById('signupSuccess');
const signupError = document.getElementById('signupError');

// Função para salvar dados do usuário no localStorage
function saveUser(name, cep, address, complement, email, password, profilePhoto) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const newUser = { name, cep, address, complement, email, password, profilePhoto };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Usuário cadastrado:', newUser); // Para depuração
}

// Função para atualizar dados do usuário no localStorage
function updateUser(email, updatedData) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(user => user.email === email);
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updatedData };
        localStorage.setItem('users', JSON.stringify(users));
        console.log('Usuário atualizado:', users[userIndex]);
    }
}

// Função para verificar se um usuário existe no localStorage pelo email
function findUserByEmail(email) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(user => user.email === email);
}

// Event listener para o formulário de cadastro
if (signupSubmit) { // Verifica se o elemento existe na página
    signupSubmit.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário
        console.log('Signup form submitted');

        const name = signupForm.signupName.value;
        const cep = signupForm.signupCep.value;
        const address = signupForm.signupAddress.value;
        const complement = signupForm.signupComplement.value;
        const email = signupForm.signupEmail.value;
        const password = signupForm.signupPassword.value;
        const profilePhoto = null; // No photo on signup

        if (!name || !cep || !address || !email || !password) {
            signupError.textContent = 'Por favor, preencha todos os campos obrigatórios.';
            return;
        }

        if (findUserByEmail(email)) {
            signupError.textContent = 'Este email já está cadastrado.';
            return;
        }

        saveUser(name, cep, address, complement, email, password, profilePhoto);
        signupForm.reset();
        signupError.textContent = '';
        signupSuccess.textContent = 'Cadastro realizado com sucesso! Você pode fazer login.';
        showToast('Usuário cadastrado com sucesso!');
        console.log('Showing toast and will redirect in 3 seconds');
        setTimeout(() => {
            console.log('Redirecting now');
            window.location.assign('index.html'); // Redireciona para a página inicial após 3 segundos
        }, 3000);
    });
}

// Event listener para o formulário de login
if (loginSubmit) { // Verifica se o elemento existe na página
    loginSubmit.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o envio padrão do formulário

        const email = loginForm.loginEmail.value;
        const password = loginForm.loginPassword.value;
        const storedUser = findUserByEmail(email);

        if (storedUser && storedUser.password === password) {
            // Login bem-sucedido!
            localStorage.setItem('loggedInUserEmail', email); // Armazena o email do usuário logado
            window.location.href = 'index.html'; // Redireciona para a página inicial
        } else {
            loginError.textContent = 'Essa conta não existe ou as informações estão incorretas.';
        }
    });
}

// Verifica se já existe um usuário logado ao carregar a página (em qualquer página)
if (localStorage.getItem('loggedInUserEmail') && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('cadastro.html')) {
    // Se estiver logado e não estiver na página de login ou cadastro,
    // você pode fazer algo aqui, como exibir informações do usuário.
    console.log('Usuário logado:', localStorage.getItem('loggedInUserEmail'));
    // Atualiza o botão do usuário com o nome do usuário e foto
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const loggedInEmail = localStorage.getItem('loggedInUserEmail');
    const loggedInUser = users.find(user => user.email === loggedInEmail);
    const userButton = document.getElementById('user-button');
    const headerProfilePhoto = document.getElementById('headerProfilePhoto');
    if (loggedInUser && userButton) {
        userButton.textContent = loggedInUser.name;
        if (loggedInUser.profilePhoto) {
            headerProfilePhoto.src = loggedInUser.profilePhoto;
            headerProfilePhoto.style.display = 'inline-block';
        } else {
            headerProfilePhoto.style.display = 'none';
        }
    }
}

// Pop-up de Login/Cadastro
const loginPopup = document.getElementById('login-popup');

function closeLoginPopup() {
    if (loginPopup) {
        loginPopup.style.display = 'none';
    }
}

function openSignupPage() {
    window.location.href = 'login.html'; // Redireciona para a página de login (onde o cadastro está)
}

// Adicione este event listener para fechar o pop-up ao clicar fora dele
window.addEventListener('click', function(event) {
    if (loginPopup && event.target == loginPopup) {
        closeLoginPopup();
    }
});

// Função para alternar a exibição do dropdown do usuário
function toggleUserDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
        } else {
            dropdown.style.display = 'block';
        }
    }
}

// Função para deslogar o usuário
function logout() {
    localStorage.removeItem('loggedInUserEmail');
    window.location.href = 'login.html';
}

// Função para editar a conta do usuário
function editAccount() {
    window.location.href = 'profile.html';
}

// Funções para o perfil do usuário (profile.html)
const profileForm = document.getElementById('profileForm');
const profilePhotoInput = document.getElementById('profilePhotoInput');
const profilePhotoPreview = document.getElementById('profilePhotoPreview');
const profileSuccess = document.getElementById('profileSuccess');

function loadUserProfile() {
    const loggedInEmail = localStorage.getItem('loggedInUserEmail');
    if (!loggedInEmail) return;

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === loggedInEmail);
    if (!user) return;

    if (profileForm) {
        profileForm.profileName.value = user.name || '';
        profileForm.profileCep.value = user.cep || '';
        profileForm.profileAddress.value = user.address || '';
        profileForm.profileComplement.value = user.complement || '';
        profileForm.profileEmail.value = user.email || '';
    }
    if (profilePhotoPreview) {
        if (user.profilePhoto) {
            profilePhotoPreview.src = user.profilePhoto;
        } else {
            profilePhotoPreview.src = 'assets/default-profile.png';
        }
    }
}

function handleProfilePhotoChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        if (profilePhotoPreview) {
            profilePhotoPreview.src = e.target.result;
        }
    };
    reader.readAsDataURL(file);
}

function saveUserProfile(event) {
    event.preventDefault();
    const loggedInEmail = localStorage.getItem('loggedInUserEmail');
    if (!loggedInEmail) return;

    const updatedData = {
        name: profileForm.profileName.value,
        cep: profileForm.profileCep.value,
        address: profileForm.profileAddress.value,
        complement: profileForm.profileComplement.value,
    };

    if (profilePhotoPreview && profilePhotoPreview.src && !profilePhotoPreview.src.includes('default-profile.png')) {
        updatedData.profilePhoto = profilePhotoPreview.src;
    }

    updateUser(loggedInEmail, updatedData);
    profileSuccess.textContent = 'Perfil atualizado com sucesso!';
    showToast('Perfil atualizado com sucesso!');

    // Update header photo and name if on index or other pages
    const userButton = document.getElementById('user-button');
    const headerProfilePhoto = document.getElementById('headerProfilePhoto');
    if (userButton) {
        userButton.textContent = updatedData.name;
    }
    if (headerProfilePhoto && updatedData.profilePhoto) {
        headerProfilePhoto.src = updatedData.profilePhoto;
        headerProfilePhoto.style.display = 'inline-block';
    }
}

if (profilePhotoInput) {
    profilePhotoInput.addEventListener('change', handleProfilePhotoChange);
}

if (profileForm) {
    profileForm.addEventListener('submit', saveUserProfile);
}

document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();
});

// Função para alternar a exibição do dropdown do usuário
function toggleUserDropdown() {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) {
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
        } else {
            dropdown.style.display = 'block';
        }
    }
}

// Função para deslogar o usuário
function logout() {
    localStorage.removeItem('loggedInUserEmail');
    window.location.href = 'login.html';
}

// Função para editar a conta do usuário
function editAccount() {
    window.location.href = 'cadastro.html';
}
