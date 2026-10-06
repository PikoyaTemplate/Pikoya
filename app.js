const services={
  subscriptions:{
    name:"Subscriptions",
    mark:"S",
    desc:"Recurring digital subscriptions with simple plan selection.",
    plans:[["1 Month","$4.99"],["3 Months","$11.99"],["6 Months","$20.99"],["12 Months","$36.99"]]
  },
  credits:{
    name:"Credits",
    mark:"C",
    desc:"Flexible credit packages for digital products and services.",
    plans:[["50 Credits","$4.99"],["100 Credits","$8.99"],["250 Credits","$19.99"],["500 Credits","$34.99"]]
  },
  boosts:{
    name:"Boosts",
    mark:"B",
    desc:"Promotion packages with flexible quantities and durations.",
    plans:[["1 Day","$2.99"],["7 Days","$12.99"],["30 Days","$29.99"],["90 Days","$69.99"]]
  },
  digital:{
    name:"Digital Goods",
    mark:"D",
    desc:"A clean storefront flow for downloadable or delivered digital products.",
    plans:[["Basic","$5.99"],["Standard","$12.99"],["Premium","$24.99"],["Custom","$49.99"]]
  }
};

let cart=load("pikoya-cart");
let orders=load("pikoya-orders");
let favorites=load("pikoya-favorites");
const appRoot=document.getElementById("app");

function load(key){
  try{
    const value=JSON.parse(localStorage.getItem(key)||"[]");
    return Array.isArray(value)?value:[];
  }catch(e){return []}
}
function save(){
  localStorage.setItem("pikoya-cart",JSON.stringify(cart));
  localStorage.setItem("pikoya-orders",JSON.stringify(orders));
  localStorage.setItem("pikoya-favorites",JSON.stringify(favorites));
  updateCount();
}
function updateCount(){
  const el=document.getElementById("cart-count");
  if(el)el.textContent=cart.length;
}
function money(value){
  return Number(value||0).toLocaleString("en-US",{style:"currency",currency:"USD",minimumFractionDigits:2});
}
function shell(title,body){
  return '<section class="page"><div class="wrap"><div class="eyebrow">Pikoya</div><h1>'+title+'</h1>'+body+'</div></section>';
}
function home(){
  return '<div class="wrap"><section class="hero"><div class="hero-card"><div class="hero-copy"><span>Digital Services Marketplace</span><strong>Simple. Warm. Ready to customize.</strong><p>A polished storefront template for modern digital businesses.</p></div></div></section><h2 class="section-title">The collection</h2><div class="services">'+Object.entries(services).map(([key,service])=>card(key,service)).join("")+'</div><section class="home-info"><h2>Built for digital storefronts</h2><p>Use the included pages, cart, order flow and account UI as a starting point for subscriptions, credits, promotions, digital goods and other online services.</p></section></div>';
}
function card(key,service){
  const liked=favorites.includes(key);
  return '<article class="service service-'+key+'"><a class="service-link" href="#service/'+key+'"><div class="service-banner"><span class="service-mark">'+service.mark+'</span><div><small>PIKOYA</small><strong>'+service.name+'</strong></div></div></a><div class="service-info"><div><h3>'+service.name+'</h3><p>'+service.desc+'</p></div><div class="service-actions"><button class="icon-btn" data-favorite="'+key+'" aria-label="'+(liked?"Remove from":"Add to")+' favorites">'+(liked?"♥":"♡")+'</button><a class="btn alt" href="#service/'+key+'">View service</a></div></div></article>';
}
function servicePage(key){
  const service=services[key];
  if(!service)return home();
  return shell(service.name,
    '<div class="product-layout"><div class="product-art product-art-'+key+'"><span>'+service.mark+'</span></div><div class="product-box purchase-box"><h2 class="purchase-title">'+service.name+'</h2><p class="sub">'+service.desc+'</p><label>Choose a plan</label><div class="plans">'+service.plans.map((plan,i)=>'<button class="plan" data-plan="'+i+'"><strong>'+plan[0]+'</strong><br><span class="price">'+plan[1]+'</span></button>').join("")+'</div><label for="serviceId">Customer ID / Username</label><input id="serviceId" placeholder="Enter customer ID or username"><label for="quantity">Quantity</label><input id="quantity" type="number" min="1" value="1"><label for="note">Order note (optional)</label><textarea id="note" rows="3" placeholder="Anything we should know?"></textarea><br><br><button class="btn gold" id="addCart">Add to cart</button></div></div>');
}
function search(){
  return shell("Search",'<div class="product-box"><input id="searchInput" placeholder="Search services..."></div><div class="services" id="searchResults" style="margin-top:20px">'+Object.entries(services).map(([key,service])=>card(key,service)).join("")+'</div>');
}
function cartPage(){
  if(!cart.length)return shell("Cart",'<div class="empty">Your cart is empty.<br><br><a class="btn gold" href="#home">Browse services</a></div>');
  const total=cart.reduce((sum,item)=>sum+Number(item.total||0),0);
  return shell("Cart",'<div class="product-box"><div class="cart-list">'+cart.map((item,i)=>'<div class="cart-row"><div><strong>'+item.name+'</strong><br><small>'+item.plan+' × '+item.quantity+' • '+(item.customer||"No customer ID")+'</small><br><b>'+money(item.total)+'</b></div><button class="btn alt" data-remove="'+i+'">Remove</button></div>').join("")+'</div><div class="cart-total"><strong>Total</strong><strong>'+money(total)+'</strong></div><div class="cart-actions"><button class="btn alt" id="clearCart">Clear cart</button><button class="btn gold" id="checkout">Continue to checkout</button></div></div>');
}
function account(){
  return shell("My Account",'<div class="product-box"><div class="notice">This is a front-end account demo. Connect your preferred authentication provider or backend for production use.</div><label>Email or phone</label><input placeholder="you@example.com"><label>Password</label><input type="password" placeholder="••••••••"><br><br><button class="btn gold">Sign in</button> <button class="btn alt">Create account</button></div>');
}
function ordersPage(){
  if(!orders.length)return shell("My Orders",'<div class="empty">No orders yet.<br><br><a class="btn gold" href="#home">Shop services</a></div>');
  return shell("My Orders",'<div class="product-box"><table class="table"><thead><tr><th>Order</th><th>Details</th><th>Amount</th><th>Status</th></tr></thead><tbody>'+orders.map(order=>'<tr><td>'+order.id+'</td><td>'+order.details+'</td><td>'+order.amount+'</td><td><span class="status">'+order.status+'</span></td></tr>').join("")+'</tbody></table></div>');
}
function adminPage(){
  return shell("Admin Demo",'<div class="product-box"><div class="notice">Demo admin interface. Orders are stored only in this browser. Add a secure backend and database for real multi-user management.</div>'+(orders.length?'<div class="admin-list">'+orders.map((order,i)=>'<div class="admin-order"><div><strong>'+order.id+'</strong><br><small>'+order.details+'</small><br><b>'+order.amount+'</b></div><select data-status="'+i+'"><option value="pending"'+(order.status==="pending"?" selected":"")+'>Pending</option><option value="in progress"'+(order.status==="in progress"?" selected":"")+'>In progress</option><option value="completed"'+(order.status==="completed"?" selected":"")+'>Completed</option><option value="problem"'+(order.status==="problem"?" selected":"")+'>Problem</option></select></div>').join("")+'</div>':'<div class="empty">No orders to manage yet.</div>')+'</div>');
}
function guide(){
  return shell("Help / Guide",'<div class="faq"><details open><summary>How do I order?</summary><p>Choose a service, select a plan, enter the customer details and add the item to your cart.</p></details><details><summary>What happens after checkout?</summary><p>The demo creates a local order number and marks it as pending.</p></details><details><summary>How do I customize the template?</summary><p>Edit the service data in app.js, visual styles in style.css, and global copy in index.html.</p></details></div>');
}
function simple(title,content){
  return shell(title,'<div class="product-box"><p class="sub">'+content+'</p></div>');
}
function render(){
  const hash=location.hash.slice(1)||"home";
  const [route,arg]=hash.split("/");
  let html=route==="home"?home():
    route==="search"?search():
    route==="service"?servicePage(arg):
    route==="cart"?cartPage():
    route==="account"?account():
    route==="orders"?ordersPage():
    route==="admin"?adminPage():
    route==="guide"?guide():
    route==="settings"?simple("Settings","Add your storefront preferences and customer-facing settings here."):
    route==="favorites"?favoritesPage():
    route==="support"?simple("Support","Replace this copy with your support email, contact form or help center."):
    home();
  appRoot.innerHTML=html;
  bind();
  updateCount();
}
function favoritesPage(){
  const items=Object.entries(services).filter(([key])=>favorites.includes(key));
  return shell("Favorites",items.length?'<div class="services">'+items.map(([key,service])=>card(key,service)).join("")+'</div>':'<div class="empty">No favorites yet.<br><br><a class="btn gold" href="#home">Browse services</a></div>');
}
function bind(){
  document.querySelectorAll(".plan").forEach(button=>{
    button.onclick=()=>{
      document.querySelectorAll(".plan").forEach(item=>item.classList.remove("selected"));
      button.classList.add("selected");
    };
  });
  document.querySelectorAll("[data-favorite]").forEach(button=>{
    button.onclick=event=>{
      event.preventDefault();
      event.stopPropagation();
      const key=button.dataset.favorite;
      favorites=favorites.includes(key)?favorites.filter(item=>item!==key):[...favorites,key];
      save();
      render();
    };
  });
  const add=document.getElementById("addCart");
  if(add)add.onclick=()=>{
    const selected=document.querySelector(".plan.selected");
    if(!selected)return alert("Choose a plan first.");
    const key=location.hash.split("/")[1];
    const service=services[key];
    const index=Number(selected.dataset.plan);
    const quantity=Math.max(1,Number(document.getElementById("quantity").value||1));
    const unit=Number(String(service.plans[index][1]).replace(/[^0-9.]/g,""));
    const customer=document.getElementById("serviceId").value.trim();
    cart.push({
      name:service.name,
      plan:service.plans[index][0],
      quantity,
      unit,
      total:unit*quantity,
      customer,
      note:document.getElementById("note").value.trim()
    });
    save();
    alert("Added to cart.");
    location.hash="#cart";
  };
  document.querySelectorAll("[data-remove]").forEach(button=>button.onclick=()=>{
    cart.splice(Number(button.dataset.remove),1);
    save();
    render();
  });
  const clear=document.getElementById("clearCart");
  if(clear)clear.onclick=()=>{cart=[];save();render()};
  const checkout=document.getElementById("checkout");
  if(checkout)checkout.onclick=()=>{
    const total=cart.reduce((sum,item)=>sum+Number(item.total||0),0);
    const id="PKY-"+Date.now().toString().slice(-7);
    orders.unshift({
      id,
      details:cart.map(item=>item.name+" / "+item.plan+" × "+item.quantity).join(", "),
      amount:money(total),
      status:"pending"
    });
    cart=[];
    save();
    alert("Order created: "+id);
    location.hash="#orders";
  };
  document.querySelectorAll("[data-status]").forEach(select=>select.onchange=()=>{
    const index=Number(select.dataset.status);
    if(orders[index]){orders[index].status=select.value;save();render();}
  });
  const searchInput=document.getElementById("searchInput");
  if(searchInput)searchInput.oninput=()=>{
    const query=searchInput.value.toLowerCase().trim();
    document.getElementById("searchResults").innerHTML=Object.entries(services)
      .filter(([key,service])=>(key+" "+service.name+" "+service.desc).toLowerCase().includes(query))
      .map(([key,service])=>card(key,service)).join("");
    bind();
  };
}
window.addEventListener("hashchange",render);
render();

const drawer=document.getElementById("drawer");
const backdrop=document.getElementById("backdrop");
document.getElementById("menuBtn").onclick=()=>{drawer.classList.add("open");backdrop.classList.add("open")};
document.getElementById("drawerClose").onclick=()=>{drawer.classList.remove("open");backdrop.classList.remove("open")};
backdrop.onclick=()=>{drawer.classList.remove("open");backdrop.classList.remove("open")};
document.querySelectorAll(".drawer a").forEach(link=>link.onclick=()=>{drawer.classList.remove("open");backdrop.classList.remove("open")});
