/* ===========================================================
   MARMOR DESIGNS — shared script
   Product data (from price list) + swatch rendering + chatbot
=========================================================== */

const PRODUCTS = [
  { name:"White Quartz", cat:"Quartz", price:1200, jointless:1800, grad:"linear-gradient(135deg,#fbfaf7,#e8e4da 40%,#f4f1ea 70%,#dcd6c8)", note:"Bright, near-white base — a clean canvas for minimal interiors." },
  { name:"Yellow Agate", cat:"Agate", price:1200, jointless:null, grad:"linear-gradient(120deg,#e8b542,#f6d98a,#c98a2b,#f0c862)", note:"Warm honeyed bands, beautiful when backlit." },
  { name:"Smoky Quartz", cat:"Quartz", price:1200, jointless:1800, grad:"linear-gradient(135deg,#6b5f52,#8f8071,#4a4038,#7a6c5d)", note:"Muted grey-brown tones for understated luxury." },
  { name:"Crystal Agate", cat:"Agate", price:1200, jointless:null, grad:"linear-gradient(135deg,#dce6e6,#b9cdd0,#eef4f3,#a7bcc0)", note:"Cool, translucent grey — reads soft under light." },
  { name:"Banded Agate", cat:"Agate", price:1200, jointless:null, grad:"repeating-linear-gradient(100deg,#8a6a45,#8a6a45 10px,#c9a876 10px,#c9a876 20px,#6b4f30 20px,#6b4f30 30px)", note:"Classic concentric banding in warm earth tones." },
  { name:"Black Agate", cat:"Agate", price:1200, jointless:null, grad:"linear-gradient(135deg,#0d0c0b,#2b2825,#141210,#38332d)", note:"Deep, near-black base for dramatic contrast." },
  { name:"Rose Quartz Indian", cat:"Quartz", price:1600, jointless:2000, grad:"linear-gradient(135deg,#f3c9c9,#f6dcdc,#e1a3ab,#f0cfd2)", note:"Soft blush pink, gentle and romantic." },
  { name:"Rose Quartz African", cat:"Quartz", price:2600, jointless:3300, grad:"linear-gradient(135deg,#e88fa0,#f2b8c4,#d46e83,#eda3b3)", note:"A deeper, more saturated rose — the premium grade." },
  { name:"Crystal Quartz", cat:"Quartz", price:1600, jointless:2500, grad:"linear-gradient(135deg,#eef6f7,#cfe4e6,#ffffff,#bcd6d9)", note:"Icy, glass-like clarity with a cool undertone." },
  { name:"Citrine Yellow Quartz", cat:"Quartz", price:1300, jointless:2000, grad:"linear-gradient(135deg,#f2c14e,#f8dd8b,#d99a1f,#f6cf6e)", note:"Sunlit golden yellow, full of warmth." },
  { name:"Yellow Quartz Dark", cat:"Quartz", price:1200, jointless:1900, grad:"linear-gradient(135deg,#c99a1f,#a97a17,#e0b846,#8f6512)", note:"A deeper mustard-gold, rich and grounded." },
  { name:"Golden Quartz", cat:"Quartz", price:1500, jointless:2300, grad:"linear-gradient(135deg,#d9a83c,#f0c96a,#b5811f,#e8bd55)", note:"Amber-gold with a soft inner glow." },
  { name:"Petrified Wood Brown", cat:"Rare", price:2700, jointless:null, grad:"repeating-radial-gradient(circle at 50% 50%,#6b4a2c,#6b4a2c 6px,#8a6440 6px,#8a6440 12px,#573a20 12px,#573a20 18px)", note:"Fossilised timber rings — nature's own woodgrain in stone." },
  { name:"Indian Blue Eye Agate", cat:"Agate", price:1700, jointless:null, grad:"radial-gradient(circle at 35% 35%,#e9eef2,#8fa8bb 40%,#3d5a72 70%,#25384a)", note:"Layered blue-grey eyes, calm and contemplative." },
  { name:"Brazilian Blue Eye Agate", cat:"Rare", price:3300, jointless:null, grad:"radial-gradient(circle at 40% 40%,#cfe0f0,#5b8fc4 45%,#22528c 75%,#12315c)", note:"Vivid ocean blue with striking depth." },
  { name:"Salenite", cat:"Rare", price:2800, jointless:null, grad:"linear-gradient(135deg,#f7f5ee,#e7e1d0,#fbfaf5,#dcd5c2)", note:"Pale, luminous selenite — glows beautifully backlit." },
  { name:"Lapis", cat:"Rare", price:5250, priceLabel:"₹4,000 – ₹6,500", jointless:null, grad:"radial-gradient(circle at 30% 30%,#3454a0,#1c2f6e 45%,#0f1c47 80%)", note:"Regal midnight blue flecked with gold — a true statement stone." },
  { name:"Tiger Eye", cat:"Rare", price:3000, jointless:null, grad:"repeating-linear-gradient(100deg,#7a4c17,#7a4c17 8px,#c9902f 8px,#c9902f 16px,#3d2610 16px,#3d2610 24px)", note:"Chatoyant gold-brown stripes that shimmer as light moves." },
  { name:"Malachite", cat:"Rare", price:8000, jointless:null, grad:"repeating-radial-gradient(circle at 50% 50%,#0d3d24,#0d3d24 5px,#1c6b3f 5px,#1c6b3f 10px,#2f8f57 10px,#2f8f57 15px)", note:"Our most sought-after rare stone — bold emerald swirls." },
  { name:"Brazilian Agate", cat:"Agate", price:2500, jointless:null, grad:"linear-gradient(120deg,#b95d3e,#e0966a,#7a3a24,#c97848)", note:"Rich terracotta banding, full of character." },
  { name:"Amathyst", cat:"Rare", price:2500, jointless:null, grad:"linear-gradient(135deg,#8a5fa8,#c39fd9,#5c3a78,#a878c4)", note:"Regal violet crystal — a favourite for feature walls." },
  { name:"Mix Agate", cat:"Agate", price:1300, jointless:null, grad:"linear-gradient(120deg,#d98c5a,#8ab0a0,#c95f6f,#e0c26a)", note:"A blend of natural agate tones for an artisanal look." },
  { name:"Blue Lace Agate", cat:"Agate", price:1300, jointless:null, grad:"repeating-linear-gradient(95deg,#cfe0ec,#cfe0ec 8px,#eef5fa 8px,#eef5fa 16px,#a9c4d6 16px,#a9c4d6 24px)", note:"Delicate powder-blue lace banding, light and airy." },
  { name:"Sodalite", cat:"Rare", price:3000, jointless:null, grad:"radial-gradient(circle at 40% 30%,#3a4f8a,#1f2c5c 50%,#12193a 85%)", note:"Deep royal blue with soft white veining." },
  { name:"Cream Agate", cat:"Agate", price:1500, jointless:null, grad:"linear-gradient(135deg,#efe3c8,#f7f0dd,#d9c6a0,#f0e2bd)", note:"Warm neutral cream — pairs with almost any palette." },
  { name:"Green Agate", cat:"Agate", price:1500, jointless:null, grad:"repeating-linear-gradient(100deg,#3f5c3f,#3f5c3f 8px,#6f9268 8px,#6f9268 16px,#2a3f2a 16px,#2a3f2a 24px)", note:"Fresh forest-green banding for a natural, earthy feel." }
];

function fmtPrice(p){
  return p.priceLabel ? p.priceLabel : "₹" + p.price.toLocaleString("en-IN");
}

function stoneCardHTML(p){
  return `
  <div class="stone-card" data-cat="${p.cat}" data-name="${p.name.toLowerCase()}">
    <div class="stone-face" style="background:${p.grad}">
      <span class="stone-tag">${p.cat}</span>
    </div>
    <div class="stone-body">
      <span class="stone-cat">${p.cat} Collection</span>
      <h4>${p.name}</h4>
      <p style="font-size:.85rem;margin-bottom:0;">${p.note}</p>
      <div class="stone-price">
        <strong>${fmtPrice(p)}</strong><span>/ sq. ft</span>
      </div>
      ${p.jointless ? `<div class="stone-price-jl">Jointless finish: ₹${p.jointless.toLocaleString("en-IN")} / sq. ft</div>` : `<div class="stone-price-jl">Jointless finish on request</div>`}
      <a class="stone-enquire" href="contact.html?stone=${encodeURIComponent(p.name)}">Enquire about this stone →</a>
    </div>
  </div>`;
}

function renderSwatches(targetId, list){
  const el = document.getElementById(targetId);
  if(!el) return;
  el.innerHTML = list.map(stoneCardHTML).join("");
}

/* ---------- Featured picks for homepage ---------- */
function featuredProducts(){
  const names = ["Malachite","Lapis","Amathyst","Rose Quartz African","Tiger Eye","Sodalite"];
  return PRODUCTS.filter(p => names.includes(p.name));
}

/* ---------- Products page: filter + search ---------- */
function initProductsPage(){
  const grid = document.getElementById("swatchGrid");
  if(!grid) return;
  renderSwatches("swatchGrid", PRODUCTS);

  const buttons = document.querySelectorAll(".filter-btn");
  const search = document.getElementById("stoneSearch");
  let activeCat = "All";

  function applyFilters(){
    const q = (search && search.value || "").trim().toLowerCase();
    const filtered = PRODUCTS.filter(p=>{
      const catOk = activeCat === "All" || p.cat === activeCat;
      const qOk = !q || p.name.toLowerCase().includes(q);
      return catOk && qOk;
    });
    renderSwatches("swatchGrid", filtered);
    const empty = document.getElementById("noResults");
    if(empty) empty.style.display = filtered.length ? "none" : "block";
  }

  buttons.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      buttons.forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
      activeCat = btn.dataset.cat;
      applyFilters();
    });
  });
  if(search) search.addEventListener("input", applyFilters);
}

/* ---------- Mobile nav ---------- */
function initNav(){
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if(toggle && nav){
    toggle.addEventListener("click", ()=> nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach(a=> a.addEventListener("click", ()=> nav.classList.remove("open")));
  }
}

/* ---------- Reveal on scroll ---------- */
function initReveal(){
  const items = document.querySelectorAll(".reveal");
  if(!items.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold:.15 });
  items.forEach(i=> io.observe(i));
}

/* ---------- Blog read more ---------- */
function initBlogToggles(){
  document.querySelectorAll(".read-toggle").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const full = btn.parentElement.querySelector(".blog-full");
      const open = full.classList.toggle("open");
      btn.textContent = open ? "Show less −" : "Read full article →";
    });
  });
}

/* ---------- Contact form pre-fill from ?stone= ---------- */
function prefillStone(){
  const field = document.getElementById("interestField");
  if(!field) return;
  const params = new URLSearchParams(window.location.search);
  const stone = params.get("stone");
  if(stone) field.value = stone;
}

/* ===========================================================
   Chatbot — rule-based assistant grounded in the price list
=========================================================== */
function initChatbot(){
  const launcher = document.getElementById("chatLauncher");
  const panel = document.getElementById("chatPanel");
  const closeBtn = document.getElementById("chatClose");
  const body = document.getElementById("chatBody");
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("chatSend");
  const quickWrap = document.getElementById("chatQuick");
  if(!launcher || !panel) return;

  let greeted = false;

  launcher.addEventListener("click", ()=>{
    panel.classList.toggle("open");
    if(!greeted){
      addMsg("Namaste! I'm the Marmor Designs assistant. Ask me about a stone, pricing, jointless slabs, or how to get a quote.", "bot");
      greeted = true;
    }
  });
  closeBtn && closeBtn.addEventListener("click", ()=> panel.classList.remove("open"));

  function addMsg(text, who){
    const div = document.createElement("div");
    div.className = "msg " + who;
    div.textContent = text;
    body.appendChild(div);
    body.scrollTop = body.scrollHeight;
  }

  function findStone(text){
    return PRODUCTS.find(p => text.includes(p.name.toLowerCase()));
  }

  function reply(raw){
    const text = raw.toLowerCase();

    if(/hi|hello|hey|namaste/.test(text) && text.length < 20){
      return "Hello! Are you looking for a specific stone, its price, or help placing an enquiry?";
    }
    if(/jointless/.test(text)){
      return "Jointless slabs give a seamless, unbroken surface — ideal for large feature walls, reception counters and backlit panels. Not every material offers a jointless option; check the individual stone's card on our Products page, or ask me e.g. \"jointless price for rose quartz\".";
    }
    const stone = findStone(text);
    if(stone && /price|cost|rate|₹|rs\b/.test(text)){
      let msg = `${stone.name}: ${fmtPrice(stone)} per sq. ft.`;
      msg += stone.jointless ? ` Jointless finish is ₹${stone.jointless.toLocaleString("en-IN")}/sq. ft.` : ` Jointless finish is available on request for this stone.`;
      return msg;
    }
    if(stone){
      return `${stone.name} — ${stone.note} Starting at ${fmtPrice(stone)}/sq. ft. Want the jointless price too, or shall I note this down for a quote?`;
    }
    if(/quote|enquire|enquiry|order|buy|purchase/.test(text)){
      return "I'd be glad to help. Please share your requirement on our Contact page — include the stone name, approximate area in sq. ft, and your city — and our team will send a formal quote within 24 hours.";
    }
    if(/malachite|lapis|rare|premium|expensive/.test(text)){
      return "Our rare & statement collection includes Malachite, Lapis, Amethyst, Tiger Eye, Sodalite, Salenite and Brazilian Blue Eye Agate — beautiful for backlit feature walls. Prices range roughly ₹2,500–₹8,000 per sq. ft depending on the stone.";
    }
    if(/agate/.test(text)){
      return "Our Agate collection ranges from ₹1,200–₹3,300/sq. ft and includes Yellow, Black, Banded, Blue Eye, Brazilian, Cream and Green Agate. See the full range on the Products page.";
    }
    if(/quartz/.test(text) && !stone){
      return "Our Quartz collection ranges from ₹1,200–₹2,600/sq. ft, including White, Smoky, Rose, Crystal, Citrine and Golden Quartz — most are available in a jointless finish.";
    }
    if(/deliver|shipping|ship|pan.?india|location|where/.test(text)){
      return "We supply and install across India, and can arrange export shipments on request. Share your city on the Contact page and we'll confirm delivery timelines.";
    }
    if(/install|fabricat|thickness|size|slab size/.test(text)){
      return "Slabs are custom-fabricated to your site dimensions with professional installation. Share your area and application (wall, counter, tabletop) via the Contact page for a tailored fabrication plan.";
    }
    if(/contact|phone|number|email|whatsapp|call/.test(text)){
      return "You can reach us via the Contact page — phone, email and a quick enquiry form are all there, or tap 'Get a Quote' in the menu.";
    }
    if(/about|company|who are you|history/.test(text)){
      return "Marmor Designs is a curated supplier of natural agate and quartz stone slabs for walls, counters and statement interiors. Read our full story on the About page.";
    }
    if(/thank/.test(text)){
      return "You're most welcome! Anything else about our stones or pricing?";
    }
    return "I can help with stone prices, the jointless option, categories (Quartz / Agate / Rare), or connecting you to our team for a quote. Try asking e.g. \"price of malachite\" or \"jointless rose quartz\".";
  }

  function handleSend(){
    const val = input.value.trim();
    if(!val) return;
    addMsg(val, "user");
    input.value = "";
    setTimeout(()=> addMsg(reply(val), "bot"), 380);
  }

  sendBtn && sendBtn.addEventListener("click", handleSend);
  input && input.addEventListener("keydown", (e)=>{ if(e.key === "Enter") handleSend(); });
  quickWrap && quickWrap.querySelectorAll("button").forEach(b=>{
    b.addEventListener("click", ()=>{
      addMsg(b.textContent, "user");
      setTimeout(()=> addMsg(reply(b.textContent.toLowerCase()), "bot"), 380);
    });
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  initNav();
  initReveal();
  initProductsPage();
  initBlogToggles();
  prefillStone();
  initChatbot();
});
