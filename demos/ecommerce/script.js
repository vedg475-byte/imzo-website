
const products = [
  {id:1,name:"Sculpted Everyday Bottle",category:"Lifestyle",price:1250,label:"BESTSELLER",symbol:"N°01",image:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=85",description:"A refined reusable bottle for everyday hydration."},
  {id:2,name:"Soft Form Ceramic Vase",category:"Home",price:1850,label:"NEW",symbol:"FORM",image:"https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=900&q=85",description:"A sculptural ceramic accent for a calmer space."},
  {id:3,name:"Minimal Carry Pouch",category:"Accessories",price:950,label:"ESSENTIAL",symbol:"N",image:"https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=85",description:"A versatile carry essential with a clean silhouette."},
  {id:4,name:"Quiet Morning Cup",category:"Home",price:780,label:"",symbol:"AM",image:"https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85",description:"A simple cup for slow mornings and daily rituals."},
  {id:5,name:"Everyday Tote",category:"Accessories",price:1450,label:"POPULAR",symbol:"DAY",image:"https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85",description:"A roomy everyday bag designed to go everywhere."},
  {id:6,name:"Desk Companion",category:"Lifestyle",price:2100,label:"",symbol:"WORK",image:"https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=85",description:"A considered desk accessory for a more focused day."},
  {id:7,name:"Stoneware Tray",category:"Home",price:1100,label:"",symbol:"ST",image:"https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=900&q=85",description:"A minimal tray for organising your favourite objects."},
  {id:8,name:"Travel Organiser",category:"Accessories",price:1600,label:"NEW",symbol:"GO",image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85",description:"Keep your travel essentials together in one place."}
];

const cart = [];

const productsEl = document.querySelector("#products");
const countEl = document.querySelector("#cartCount");
const dialog = document.querySelector("#cartDialog");

const money = n => "₹" + n.toLocaleString("en-IN");

// Responsive product popup styles
const productStyle = document.createElement("style");

productStyle.textContent = `
  #productDetail {
    box-sizing: border-box;
    width: min(760px, calc(100% - 28px));
    max-width: calc(100vw - 28px);
    max-height: 90vh;
    max-height: 90dvh;
    border: 1px solid #e5dfd4;
    padding: 0;
    background: #f8f6f1;
    color: #24231f;
    overflow-x: hidden;
    overflow-y: auto;
    margin: auto;
  }

  #productDetail::backdrop {
    background: #17161380;
  }

  #productDetail .product-detail-layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: stretch;
    position: relative;
  }

  #productDetail .detail-image {
    min-width: 0;
    min-height: 300px;
    padding: 16px;
    box-sizing: border-box;
    background: #eee9df;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  #productDetail .detail-image img {
    display: block;
    width: 100%;
    height: auto;
    max-height: 65vh;
    max-height: 65dvh;
    object-fit: contain;
    object-position: center;
  }

  #productDetail .detail-info {
    min-width: 0;
    box-sizing: border-box;
    padding: 32px 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 14px;
  }

  #productDetail .detail-close {
    position: absolute;
    right: 12px;
    top: 12px;
    z-index: 2;
    border: 0;
    background: #f8f6f1;
    padding: 8px 11px;
    font-size: 18px;
    cursor: pointer;
  }

  #productDetail .detail-name {
    font-family: 'Playfair Display', serif;
    font-size: 30px;
    font-weight: 500;
    margin: 0;
    overflow-wrap: anywhere;
  }

  #productDetail .detail-description {
    font-size: 13px;
    line-height: 1.8;
    color: #77756f;
    margin: 0;
  }

  #productDetail .detail-add {
    background: #24231f;
    color: white;
    border: 0;
    padding: 14px 18px;
    width: 100%;
    cursor: pointer;
  }

  @media (max-width: 560px) {
    #productDetail .product-detail-layout {
      grid-template-columns: minmax(0, 1fr);
    }

    #productDetail .detail-image {
      min-height: 0;
      padding: 12px;
    }

    #productDetail .detail-image img {
      width: 100%;
      height: auto;
      max-height: 42vh;
      max-height: 42dvh;
      object-fit: contain;
    }

    #productDetail .detail-info {
      padding: 22px 18px;
      gap: 12px;
    }

    #productDetail .detail-name {
      font-size: 25px;
      padding-right: 24px;
    }
  }
`;

document.head.appendChild(productStyle);

function renderProducts(category = "All") {
  productsEl.innerHTML = products
    .filter(p => category === "All" || p.category === category)
    .map(p => `
      <article class="product-card">
        <button
          class="product-open"
          data-product="${p.id}"
          aria-label="View ${p.name}"
          style="display:block;width:100%;padding:0;border:0;background:transparent;text-align:left;color:inherit"
        >
          <div class="product-visual" style="background:#eee9df">
            ${p.label ? `<span class="product-tag">${p.label}</span>` : ""}
            <img
              src="${p.image}"
              alt="${p.name}"
              loading="lazy"
              style="width:100%;height:100%;object-fit:contain;display:block"
              onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"
            >
            <div class="shape" style="display:none">${p.symbol}</div>
          </div>

          <div class="product-info">
            <div>
              <h3>${p.name}</h3>
              <p>${p.category}</p>
            </div>
            <span class="price">${money(p.price)}</span>
          </div>
        </button>

        <button class="add-button" data-add="${p.id}">
          ＋ Add to bag
        </button>
      </article>
    `).join("");
}

document.querySelector("#filters").addEventListener("click", e => {
  const button = e.target.closest("[data-category]");
  if (!button) return;

  document.querySelectorAll(".filter").forEach(b => {
    b.classList.toggle("active", b === button);
  });

  renderProducts(button.dataset.category);
});

function renderCart() {
  countEl.textContent = cart.reduce((sum, p) => sum + p.qty, 0);

  document.querySelector("#cartItems").innerHTML = cart.length
    ? cart.map(p => `
      <div class="cart-row">
        <span>${p.name} × ${p.qty}</span>
        <span>
          ${money(p.price * p.qty)}
          <button data-remove="${p.id}">Remove</button>
        </span>
      </div>
    `).join("")
    : "<p>Your bag is waiting for something lovely.</p>";

  document.querySelector("#cartTotal").textContent =
    money(cart.reduce((sum, p) => sum + p.price * p.qty, 0));
}

function addToCart(id) {
  const product = products.find(p => p.id === Number(id));
  if (!product) return;

  const existing = cart.find(p => p.id === product.id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  renderCart();
  showToast(`${product.name} added to your bag`);
}

productsEl.addEventListener("click", e => {
  const addButton = e.target.closest("[data-add]");

  if (addButton) {
    e.stopPropagation();
    addToCart(addButton.dataset.add);
    return;
  }

  const productButton = e.target.closest("[data-product]");
  if (!productButton) return;

  const product = products.find(
    p => p.id === Number(productButton.dataset.product)
  );

  if (!product) return;

  document.querySelector("#productDetail")?.remove();

  const detail = document.createElement("dialog");
  detail.id = "productDetail";

  detail.innerHTML = `
    <div class="product-detail-layout">
      <div class="detail-image">
        <img
          src="${product.image}"
          alt="${product.name}"
          onerror="this.alt='Product image unavailable';this.style.display='none';"
        >
      </div>

      <div class="detail-info">
        <button
          class="detail-close"
          data-detail-close
          aria-label="Close"
        >✕</button>

        <p style="font-size:10px;letter-spacing:2px;color:#8b7b60;margin:0">
          ${product.category.toUpperCase()}
        </p>

        <h2 class="detail-name">${product.name}</h2>

        <strong style="font-size:18px">
          ${money(product.price)}
        </strong>

        <p class="detail-description">${product.description}</p>

        <button class="detail-add" data-detail-add="${product.id}">
          ＋ Add to bag
        </button>

        <small style="color:#77756f">
          Demo product · No real purchase
        </small>
      </div>
    </div>
  `;

  document.body.appendChild(detail);
  detail.showModal();

  detail.addEventListener("click", ev => {
    if (ev.target === detail || ev.target.closest("[data-detail-close]")) {
      detail.close();
      return;
    }

    const add = ev.target.closest("[data-detail-add]");

    if (add) {
      addToCart(add.dataset.detailAdd);
      detail.close();
    }
  });

  detail.addEventListener("close", () => {
    detail.remove();
  }, { once: true });
});

document.querySelector("#cartItems").addEventListener("click", e => {
  const button = e.target.closest("[data-remove]");
  if (!button) return;

  const i = cart.findIndex(p => p.id === Number(button.dataset.remove));

  if (i >= 0) {
    cart.splice(i, 1);
    renderCart();
  }
});

document.querySelector("#cartButton").addEventListener("click", () => {
  renderCart();
  dialog.showModal();
});

document.querySelector("#closeCart").addEventListener("click", () => {
  dialog.close();
});

document.querySelector("#checkoutButton").addEventListener("click", () => {
  showToast("Demo checkout only — no payment is collected.");
});

let toastTimer;

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

renderProducts();
renderCart();
