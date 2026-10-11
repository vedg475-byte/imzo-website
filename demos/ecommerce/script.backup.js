const products = [
  {id:1,name:"Sculpted Everyday Bottle",category:"Lifestyle",price:1250,label:"BESTSELLER",symbol:"N°01"},
  {id:2,name:"Soft Form Ceramic Vase",category:"Home",price:1850,label:"NEW",symbol:"FORM"},
  {id:3,name:"Minimal Carry Pouch",category:"Accessories",price:950,label:"ESSENTIAL",symbol:"N"},
  {id:4,name:"Quiet Morning Cup",category:"Home",price:780,label:"",symbol:"AM"},
  {id:5,name:"Everyday Tote",category:"Accessories",price:1450,label:"POPULAR",symbol:"DAY"},
  {id:6,name:"Desk Companion",category:"Lifestyle",price:2100,label:"",symbol:"WORK"},
  {id:7,name:"Stoneware Tray",category:"Home",price:1100,label:"",symbol:"ST"},
  {id:8,name:"Travel Organiser",category:"Accessories",price:1600,label:"NEW",symbol:"GO"}
];
const cart = [];
const productsEl = document.querySelector("#products");
const countEl = document.querySelector("#cartCount");
const dialog = document.querySelector("#cartDialog");
const money = n => "₹" + n.toLocaleString("en-IN");
function renderProducts(category="All"){
  productsEl.innerHTML = products.filter(p=>category==="All"||p.category===category).map(p=>`
    <article class="product-card">
      <div class="product-visual">${p.label?`<span class="product-tag">${p.label}</span>`:""}<div class="shape">${p.symbol}</div></div>
      <div class="product-info"><div><h3>${p.name}</h3><p>${p.category}</p></div><span class="price">${money(p.price)}</span></div>
      <button class="add-button" data-add="${p.id}">＋ Add to bag</button>
    </article>`).join("");
}
document.querySelector("#filters").addEventListener("click",e=>{
  const button=e.target.closest("[data-category]");
  if(!button)return;
  document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===button));
  renderProducts(button.dataset.category);
});
function renderCart(){
  countEl.textContent=cart.reduce((sum,p)=>sum+p.qty,0);
  document.querySelector("#cartItems").innerHTML=cart.length?cart.map(p=>`
    <div class="cart-row"><span>${p.name} × ${p.qty}</span><span>${money(p.price*p.qty)} <button data-remove="${p.id}">Remove</button></span></div>`).join(""):"<p>Your bag is waiting for something lovely.</p>";
  document.querySelector("#cartTotal").textContent=money(cart.reduce((sum,p)=>sum+p.price*p.qty,0));
}
productsEl.addEventListener("click",e=>{
  const button=e.target.closest("[data-add]");
  if(!button)return;
  const product=products.find(p=>p.id===Number(button.dataset.add));
  const existing=cart.find(p=>p.id===product.id);
  if(existing)existing.qty++;else cart.push({...product,qty:1});
  renderCart();showToast(`${product.name} added to your bag`);
});
document.querySelector("#cartItems").addEventListener("click",e=>{
  const button=e.target.closest("[data-remove]");
  if(!button)return;
  const i=cart.findIndex(p=>p.id===Number(button.dataset.remove));
  if(i>=0){cart.splice(i,1);renderCart();}
});
document.querySelector("#cartButton").addEventListener("click",()=>{renderCart();dialog.showModal();});
document.querySelector("#closeCart").addEventListener("click",()=>dialog.close());
document.querySelector("#checkoutButton").addEventListener("click",()=>showToast("Demo checkout only — no payment is collected."));
let toastTimer;
function showToast(message){
  const toast=document.querySelector("#toast");
  toast.textContent=message;toast.classList.add("show");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2400);
}
renderProducts();renderCart();
