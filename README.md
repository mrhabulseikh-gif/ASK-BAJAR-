index.html
<!DOCTYPE html>
<html lang="bn">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ashadul Mobile & Laptop Bazaar</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:'Nirmala UI',Arial,sans-serif}
body{background:#f0f2f5;color:#333}
header{background:linear-gradient(90deg,#0d6efd,#0a58ca);color:#fff;padding:12px 20px;display:flex;justify-content:space-between;align-items:center;position:sticky;top:0;z-index:10}
header .logo{font-size:22px;font-weight:bold}
nav{background:#fff;padding:10px;display:flex;gap:10px;overflow-x:auto;box-shadow:0 2px 5px rgba(0,0,0,.1)}
nav button{border:none;background:#0d6efd;color:#fff;padding:8px 16px;border-radius:20px;cursor:pointer;white-space:nowrap}
.hero{background:linear-gradient(90deg,#0d6efd,#6610f2);color:#fff;padding:30px 20px;border-radius:12px;margin:15px;text-align:center}
.hero h2{font-size:24px;margin-bottom:10px}
.stats{display:flex;gap:10px;padding:0 15px;flex-wrap:wrap}
.stats .card{flex:1;background:#fff;padding:15px;border-radius:10px;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.1)}
.stats .card h3{font-size:22px;color:#0d6efd}
.container{padding:15px;max-width:1200px;margin:auto}
.card{background:#fff;padding:15px;border-radius:12px;margin-bottom:15px;box-shadow:0 2px 8px rgba(0,0,0,.1)}
input,textarea{width:100%;padding:10px;margin:8px 0;border:1px solid #ddd;border-radius:8px}
.btn{background:#25D366;color:#fff;border:none;padding:12px;border-radius:8px;cursor:pointer;width:100%;font-size:16px;font-weight:bold}
.btn-blue{background:#0d6efd}
.product-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:15px}
.product-card img{width:100%;height:180px;object-fit:cover;border-radius:8px}
.price{color:#dc3545;font-size:18px;font-weight:bold}
.price-box{background:#e7f1ff;padding:12px;border-radius:8px;margin:10px 0}
.qr-box{text-align:center;padding:10px}
.qr-box img{max-width:200px;margin:10px auto}
footer{background:#222;color:#fff;text-align:center;padding:15px;margin-top:20px;font-size:13px}
.hidden{display:none}
@media(max-width:768px){.hero h2{font-size:18px}}
</style>
</head>
<body>

<header>
  <div class="logo">ASK Market</div>
  <div>WhatsApp: [ADMIN_WHATSAPP]</div>
</header>

<nav>
  <button onclick="showPage('home')">হোম</button>
  <button onclick="showPage('sell')">বিক্রি করুন</button>
  <button onclick="showPage('buy')">কিনুন</button>
  <button onclick="showPage('admin')">Admin Panel</button>
</nav>

<div class="container">

<!-- HOME -->
<div id="home" class="page">
  <div class="hero">
    <h2>কিনুন ও বিক্রি করুন</h2>
    <p>সহজে, নিরাপদে, বিশ্বাসের সাথে</p>
  </div>
  <div class="stats">
    <div class="card"><h3 id="totalProducts">0</h3><p>মোট Listing</p></div>
    <div class="card"><h3 id="totalAdmin">৳0</h3><p>Admin Income</p></div>
    <div class="card"><h3 id="totalGST">৳0</h3><p>GST Collection</p></div>
  </div>
  <h2 style="margin:20px 0 10px">নতুন যোগ হওয়া প্রোডাক্ট</h2>
  <div id="productList" class="product-grid"></div>
</div>

<!-- SELL -->
<div id="sell" class="page hidden">
  <div class="card">
    <h2>প্রোডাক্ট বিক্রি করুন</h2>
    <input id="pTitle" placeholder="Product Name - যেমন: iPhone 13">
    <input id="pPrice" type="number" placeholder="আপনার চাওয়া দাম" oninput="calcSell()">
    <textarea id="pDesc" placeholder="Description + Condition"></textarea>
    <input id="pIMEI" placeholder="IMEI No">
    <input id="pContact" placeholder="আপনার WhatsApp নম্বর">
    <div id="calcBox" class="price-box hidden"></div>
    <button class="btn" onclick="payListingFee()">Pay 10 টাকা Listing Fee</button>
    <div id="listingQR" class="qr-box hidden"></div>
    <button class="btn btn-blue hidden" id="submitProductBtn" onclick="submitProduct()">Fee Paid - Submit করুন</button>
  </div>
</div>

<!-- BUY -->
<div id="buy" class="page hidden">
  <h2>সব Product</h2>
  <div id="allProducts" class="product-grid"></div>
</div>

<!-- ADMIN -->
<div id="admin" class="page hidden">
  <div class="card">
    <h2>Admin Dashboard</h2>
    <p>Listing Fee: <b id="adminListing">৳0</b></p>
    <p>Platform Fee: <b id="adminPlatform">৳0</b></p>
    <p>GST Collection: <b id="adminGST">৳0</b></p>
    <p><b>মোট Income: <span id="adminTotal">৳0</span></b></p>
  </div>
</div>

</div>

<footer>
  <p>*সকল দামে 18% GST ও 10% Platform Fee অন্তর্ভুক্ত*</p>
  <p>হেল্পলাইন (WhatsApp): [ADMIN_WHATSAPP]</p>
</footer>

<script>
const GST_RATE = 0.18; const PLATFORM_RATE = 0.10; const ENTRY_FEE = 10;
let products = JSON.parse(localStorage.getItem('products')) || [];
let adminData = JSON.parse(localStorage.getItem('adminData')) || {listing:0, platform:0, gst:0};

function showPage(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
  loadProducts();
}

function calcSell(){
  let sp = parseFloat(document.getElementById('pPrice').value) || 0;
  if(sp<=0) return document.getElementById('calcBox').classList.add('hidden');
  let platform = sp * PLATFORM_RATE; let gst = sp * GST_RATE; let gstSplit = gst/2;
  let buyerPrice = sp + platform + gst; let sellerIncome = sp - gstSplit;
  document.getElementById('calcBox').innerHTML = `
    <b>হিসাব:</b><br>
    Buyer Price: <b>৳${buyerPrice.toFixed(0)}</b> = ${sp} + ${platform.toFixed(0)} + ${gst.toFixed(0)}<br>
    আপনি পাবেন: <b>৳${sellerIncome.toFixed(0)}</b><br>
    Admin পাবে: <b>৳${(platform+gstSplit).to
