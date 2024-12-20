document.addEventListener('DOMContentLoaded', () => {

    function loadCartNumbers() {
        let productNumbers = localStorage.getItem('cartNumbers');
        if (productNumbers) {
            const headerIcon = document.querySelector('.header-icon span');
            if (headerIcon) {
                headerIcon.textContent = productNumbers;
            }
        }
    }

    function cartNumbers(increase = true) {
        let productNumbers = localStorage.getItem('cartNumbers');
        productNumbers = parseInt(productNumbers) || 0;

        const headerIcon = document.querySelector('.header-icon span');
        if (headerIcon) {
            if (increase) {
                localStorage.setItem('cartNumbers', productNumbers + 1);
                headerIcon.textContent = productNumbers + 1;
            } else if (productNumbers > 0) {
                localStorage.setItem('cartNumbers', productNumbers - 1);
                headerIcon.textContent = productNumbers - 1;
            }
        }
    }

    loadCartNumbers();

    function generateUniqueId() {
        return 'id-' + Math.random().toString(36).substr(2, 16);
    }

    function addToCart(product) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

        if (!product.id) {
            product.id = generateUniqueId();
        }

        const existingProduct = cartItems.find(item => item.id === product.id);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            product.quantity = 1;
            cartItems.push(product);
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        cartNumbers(); 

    }

    function removeFromCart(productId) {
        let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        cartItems = cartItems.filter(item => item.id !== productId);
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

       
        let productNumbers = parseInt(localStorage.getItem('cartNumbers')) || 0;
        if (productNumbers > 0) {
            localStorage.setItem('cartNumbers', productNumbers - 1);
            const headerIcon = document.querySelector('.header-icon span');
            if (headerIcon) {
                headerIcon.textContent = productNumbers - 1;
            }
        }

        updateCart();
    }

    function updateCart() {
        const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        const cartItemContainer = document.querySelector('.cart-item-container');
        const cartTotal = document.querySelector('.cart-total');
        const cartTable = document.querySelector('.cart-totals');
        const orderBtn=document.querySelector('.order-now');
        let total = 0;

        if (cartItemContainer) {
            cartItemContainer.innerHTML = '';

            if (cartItems.length === 0) {
                cartItemContainer.innerHTML = `
                    <div class="empty-cart">
                        <img src="img/empty-cart.png" alt="Empty Cart" width="500">
                    </div> 
                `;
                orderBtn.style.display='none';
                cartTable.innerHTML='';
            } else {
                cartItems.forEach(item => {
                    const productDiv = document.createElement('div');
                    productDiv.classList.add('cart-products');

                    productDiv.innerHTML = `
                        <img class="product-image" src="${item.image}" alt="${item.name}">
                        <div class="description">
                            <h1>${item.name}</h1>
                            <h3>${item.description}</h3>
                        </div>
                        <div class="price">
                            <h2>$${item.price}</h2>
                        </div>
                        <div class="quantity">
                            <button class="decrease" data-id="${item.id}"><img src="img/circle-minus-solid.svg" alt="" width="30"></button>
                            <span>${item.quantity}</span>
                            <button class="increase" data-id="${item.id}"><img src="img/circle-plus-solid.svg" alt="" width="30"></button>
                        </div>
                        <button class="btn-remove" data-id="${item.id}">Remove</button>
                    `;

                    cartItemContainer.appendChild(productDiv);
                    total += item.price * item.quantity;
                });
            }

            if (cartTotal) {
                cartTotal.textContent = `$${total}`;
            }

            document.querySelectorAll('.decrease').forEach(button => {
                button.addEventListener('click', event => {
                    const id = event.target.closest('button').dataset.id;
                    const cartItems = JSON.parse(localStorage.getItem('cartItems'));

                    const product = cartItems.find(item => item.id === id);
                    if (product) {
                        if (product.quantity > 1) {
                            product.quantity -= 1;
                            event.target.closest('.quantity').querySelector('span').textContent = product.quantity;
                        } else {
                            cartItems.splice(cartItems.indexOf(product), 1);
                            cartNumbers(false); 
                        }

                        localStorage.setItem('cartItems', JSON.stringify(cartItems));
                        updateCart();
                    }
                });
            });

            document.querySelectorAll('.increase').forEach(button => {
                button.addEventListener('click', event => {
                    const id = event.target.closest('button').dataset.id;
                    const cartItems = JSON.parse(localStorage.getItem('cartItems'));

                    const product = cartItems.find(item => item.id === id);
                    if (product) {
                        product.quantity += 1;
                        event.target.closest('.quantity').querySelector('span').textContent = product.quantity;

                        localStorage.setItem('cartItems', JSON.stringify(cartItems));
                        cartNumbers(); 
                        updateCart();
                    }
                });
            });

            document.querySelectorAll('.btn-remove').forEach(button => {
                button.addEventListener('click', event => {
                    const productId = event.target.dataset.id;
                    removeFromCart(productId);
                });
            });
        }
    }

    document.querySelectorAll('.add-cart').forEach(button => {
        button.addEventListener('click', event => {
            const productCard = event.target.closest('.product-card');
            const product = {
                id: parseInt(productCard.dataset.id),
                image: productCard.querySelector('img').src,
                name: productCard.querySelector('h1').textContent,
                description: productCard.querySelector('h3').textContent,
                price: parseFloat(productCard.querySelector('h2').textContent.replace('$', ''))
            };

            addToCart(product);
        });
    });

    const orderNowButton = document.querySelector('.order-now');
    const orderButton=document.querySelector('.btn-order');
    if (orderNowButton.innerText==='Place Order') {
        orderNowButton.addEventListener('click', () => {
            alert('Your order has been placed successfully!');
            localStorage.removeItem('cartItems');
            localStorage.removeItem('cartNumbers');
            updateCart();
            

            const headerIcon = document.querySelector('.header-icon span');
            if (headerIcon) {
                headerIcon.textContent = 0;
            }

            
        });
    }
    
    



    loadCartNumbers(); 
    updateCart();
});

