const GST_RATE = 0.18; const PLATFORM_RATE = 0.10; const ENTRY_FEE = 10; const UPI = "mrhabulseikh1.wallet@phonepe";
let products = JSON.parse(localStorage.getItem('products')) || [];
let adminData = JSON.parse(localStorage.getItem('adminData')) || {listing:0, platform:0, gst:0};

function showPage(id){
  document.getElementById('home-page').classList.add('hidden');
  document.getElementById('sell-page').classList.add('hidden');
  document.getElementById(id+'-page').classList.remove('hidden');
  loadProducts();
}

function calcSell(){
  let sp = parseFloat(document.getElementById('pPrice').value) || 0;
  if(sp<=0) return document.getElementById('calcBox').classList.add('hidden');
  let platform = sp * PLATFORM_RATE; 
  let gst = sp * GST_RATE; 
  let gstSplit = gst/2; 
  let buyerPrice = sp + platform + gst; 
  let sellerIncome = sp - gstSplit; 
  document.getElementById('calcBox').innerHTML = `<b>হিসাব:</b><br>Buyer Price: <b>৳${buyerPrice.toFixed(0)}</b><br>আপনি পাবেন: <b>৳${sellerIncome.toFixed(0)}</b><br>Admin পাবে: <b>৳${(platform+gstSplit).toFixed(0)}</b>`; 
  document.getElementById('calcBox').classList.remove('hidden');
}

function payListingFee(){
  document.getElementById('listingQR').innerHTML = `<p>10 টাকা UPI করুন</p><img src="https://upiqr.in/api/qr?name=ASKBAJAR&vpa=${UPI}&amount=10">`; 
  document.getElementById('listingQR').classList.remove('hidden'); 
  document.getElementById('submitProductBtn').classList.remove('hidden');
}

function submitProduct(){
  let sp = parseFloat(document.getElementById('pPrice').value);
  let platform = sp * PLATFORM_RATE; 
  let gst = sp * GST_RATE; 
  let buyerPrice = sp + platform + gst; 
  products.push({
    id:Date.now(), 
    cat:document.getElementById('pCat').value,
    title:document.getElementById('pTitle').value, 
    sp, buyerPrice, 
    desc:document.getElementById('pDesc').value, 
    imei:document.getElementById('pIMEI').value, 
    contact:document.getElementById('pContact').value
  }); 
  adminData.listing += ENTRY_FEE; 
  saveData(); 
  alert('Product Submit হলো!'); 
  showPage('home');
}

function loadProducts(){
  let html = ''; 
  products.forEach(p=>{
    html += `<div class="card" data-cat="${p.cat}">
      <img src="https://placehold.co/300x180/0d6efd/fff?text=${p.title}">
      <h3>${p.title}</h3>
      <p class="price">৳${p.buyerPrice.toFixed(0)}</p>
      <p>${p.desc}</p>
      <button class="btn" onclick="buyNow(${p.buyerPrice})">Buy Now</button>
      <button class="btn btn-blue" onclick="contactSeller('${p.contact}')">Contact - Pay 10</button>
    </div>`;
  }); 
  document.getElementById('productList').innerHTML = html; 
  document.getElementById('totalProducts').innerText = products.length; 
  let total = adminData.listing+adminData.platform+adminData.gst;
  document.getElementById('totalIncome').innerText = '৳'+total; 
  document.getElementById('totalGST').innerText = '৳'+adminData.gst;
}

function filterCat(cat){
  document.querySelectorAll('nav button').forEach(b=>b.classList.remove('active'));
  event.target.classList.add('active');
  document.querySelectorAll('.card').forEach(c=>{
    c.style.display = (cat=='all' || c.dataset.cat==cat) ? 'block' : 'none';
  })
}

function buyNow(amount){
  window.open(`https://upiqr.in/api/qr?name=ASKBAJAR&vpa=${UPI}&amount=${amount}`, '_blank'); 
  alert(`Total: ৳${amount}\nBill এ 3 টে লাইন: Product + 10% Fee + 18% GST`);
}

function contactSeller(num){
  window.open(`https://upiqr.in/api/qr?name=ASKBAJAR&vpa=${UPI}&amount=10`, '_blank'); 
  window.open(`https://wa.me/91${num}`, '_blank');
}

function saveData(){
  localStorage.setItem('products', JSON.stringify(products));
  localStorage.setItem('adminData', JSON.stringify(adminData));
}

showPage('home');
