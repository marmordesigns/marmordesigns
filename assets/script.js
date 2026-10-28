/* =======================================================
   MARMOR DESIGNS — LUXURY NATURAL STONE & AGATE SLABS
   Complete Interactive JavaScript Engine with Three.js 3D
   NITCO-Inspired Dual Filtering (Colour / Collection)
   ======================================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. PRELOADER ANIMATION
  // ==========================================
  const preloader = document.getElementById('preloader');
  const preFill = document.getElementById('pre-fill');
  const preText = document.getElementById('pre-text');

  if (preloader) {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 25) + 12;
      if (progress > 100) progress = 100;
      if (preFill) preFill.style.width = progress + '%';
      if (preText) preText.textContent = `Loading Gallery Slabs... ${progress}%`;

      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          preloader.classList.add('fade-out');
        }, 300);
      }
    }, 50);
  }

  // ==========================================
  // 2. STICKY HEADER & SCROLL BEHAVIOR
  // ==========================================
  const siteHeader = document.getElementById('site-header');
  const topbar = document.getElementById('topbar');
  const bttBtn = document.getElementById('btt');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (siteHeader) {
      if (scrollY > 40) {
        siteHeader.classList.add('scrolled');
        if (topbar) topbar.style.transform = `translateY(-${Math.min(scrollY, 38)}px)`;
      } else {
        siteHeader.classList.remove('scrolled');
        if (topbar) topbar.style.transform = 'translateY(0)';
      }
    }

    if (bttBtn) {
      bttBtn.classList.toggle('visible', scrollY > 500);
    }
  });

  if (bttBtn) {
    bttBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ==========================================
  // 3. MOBILE MENU HAMBURGER
  // ==========================================
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
    });

    document.querySelectorAll('.mob-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
      });
    });
  }

  // ==========================================
  // 4. HERO SLIDESHOW
  // ==========================================
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hdot');
  let currentSlide = 0;
  let slideTimer;

  function setSlide(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index));
    dots.forEach((d, i) => d.classList.toggle('active', i === index));
    currentSlide = index;
  }

  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    setSlide(next);
  }

  if (slides.length > 0) {
    slideTimer = setInterval(nextSlide, 5500);

    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        clearInterval(slideTimer);
        const target = parseInt(dot.getAttribute('data-s'), 10);
        setSlide(target);
        slideTimer = setInterval(nextSlide, 5500);
      });
    });
  }

  // ==========================================
  // 5. THREE.JS 3D HERO VISUALIZER
  // ==========================================
  const canvas3D = document.getElementById('hero-3d-canvas');
  if (canvas3D && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas3D, alpha: true, antialias: true });
    renderer.setSize(canvas3D.parentElement.offsetWidth, canvas3D.parentElement.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Outer Faceted Crystal / Gem Wireframe
    const gemGeometry = new THREE.IcosahedronGeometry(2.2, 0);
    const gemWireframe = new THREE.WireframeGeometry(gemGeometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xC8A96E,
      transparent: true,
      opacity: 0.38,
      linewidth: 1.5
    });
    const gemMesh = new THREE.LineSegments(gemWireframe, lineMaterial);
    scene.add(gemMesh);

    // Inner Glowing Polyhedron
    const innerGeo = new THREE.DodecahedronGeometry(1.4, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x967B46,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    scene.add(innerMesh);

    // Golden Floating Mineral Dust Particles
    const particleCount = 220;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 14;
      positions[i + 1] = (Math.random() - 0.5) * 10;
      positions[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const pCanvas = document.createElement('canvas');
    pCanvas.width = 16;
    pCanvas.height = 16;
    const pCtx = pCanvas.getContext('2d');
    const grad = pCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, '#FFE8B0');
    grad.addColorStop(0.5, 'rgba(200, 169, 110, 0.6)');
    grad.addColorStop(1, 'rgba(200, 169, 110, 0)');
    pCtx.fillStyle = grad;
    pCtx.beginPath();
    pCtx.arc(8, 8, 8, 0, Math.PI * 2);
    pCtx.fill();

    const pTexture = new THREE.CanvasTexture(pCanvas);
    const particleMat = new THREE.PointsMaterial({
      size: 0.18,
      map: pTexture,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('resize', () => {
      const w = canvas3D.parentElement.offsetWidth;
      const h = canvas3D.parentElement.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });

    let clock = new THREE.Clock();
    function animate3D() {
      requestAnimationFrame(animate3D);
      const elapsedTime = clock.getElapsedTime();

      targetX += (mouseX - targetX) * 0.05;
      targetY += (mouseY - targetY) * 0.05;

      gemMesh.rotation.x = elapsedTime * 0.12 + targetY * 0.4;
      gemMesh.rotation.y = elapsedTime * 0.18 + targetX * 0.4;

      innerMesh.rotation.x = -elapsedTime * 0.18;
      innerMesh.rotation.y = -elapsedTime * 0.22;

      gemMesh.position.x = 2.2 + targetX * 0.4;
      gemMesh.position.y = targetY * 0.4;
      innerMesh.position.x = gemMesh.position.x;
      innerMesh.position.y = gemMesh.position.y;

      particles.rotation.y = elapsedTime * 0.03;
      particles.rotation.x = elapsedTime * 0.02;

      renderer.render(scene, camera);
    }
    animate3D();
  }

  // ==========================================
  // 6. ANIMATED STATS COUNTER
  // ==========================================
  const statNumbers = document.querySelectorAll('.sn[data-count]');
  let statsDone = false;

  function countUp() {
    statNumbers.forEach(el => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      let current = 0;
      const step = Math.ceil(target / 45);
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target;
          clearInterval(timer);
        } else {
          el.textContent = current;
        }
      }, 35);
    });
  }

  const statsSection = document.getElementById('stats-row');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !statsDone) {
        statsDone = true;
        countUp();
      }
    }, { threshold: 0.3 });
    observer.observe(statsSection);
  }

  // ==========================================
  // 7. COMPREHENSIVE STONE DATASET (+₹300 Rate Adjustment)
  // ==========================================
      const allStones = [
    // Quartz Collection
    { id: 'white-quartz', name: 'White Quartz', color: 'white', cat: 'Quartz', price: '₹1,500', orig: '₹1,200', desc: 'Pristine pure white crystalline body with micro-reflectors. Non-porous stain-proof surface for kitchen islands and counters.', img: 'https://i.pinimg.com/736x/48/e4/f0/48e4f0469fb2bd902649b6a93435a86f.jpg', backlit: false },
    { id: 'rose-quartz', name: 'Rose Quartz', color: 'rare', cat: 'Quartz', price: '₹1,800', orig: '₹1,500', desc: 'Natural soft blush pink gemstone with crystalline fracture veining. Calming aura for luxury master bath vanities.', img: 'https://i.pinimg.com/736x/14/21/23/142123f612722c10850fabafdd8d57bc.jpg', backlit: true },
    { id: 'ivory-quartz', name: 'Ivory Quartz', color: 'beige', cat: 'Quartz', price: '₹1,700', orig: '₹1,400', desc: 'Warm vanilla and cream undertones with subtle golden quartz grains. Complements warm brass and wood millwork.', img: 'https://i.pinimg.com/736x/57/01/70/5701706e45c15428126eda5955e4eb82.jpg', backlit: false },
    { id: 'beige-quartz', name: 'Beige Quartz', color: 'beige', cat: 'Quartz', price: '₹1,600', orig: '₹1,300', desc: 'Earthy desert sand stone tone with harmonious mineral flecks. High resistance to heavy culinary traffic.', img: 'https://i.pinimg.com/736x/c8/5a/01/c85a01b073d4e37f2685c49df48a4c45.jpg', backlit: false },
    { id: 'grey-veined-quartz', name: 'Grey Veined Quartz', color: 'grey', cat: 'Quartz', price: '₹2,100', orig: '₹1,800', desc: 'Dramatic smoky grey striations dancing across an alabaster base. The architects choice for modern minimalist kitchens.', img: 'https://i.pinimg.com/736x/26/f0/29/26f02954a66eec797bfc2d0d13c08a3b.jpg', backlit: false },
    { id: 'black-quartz', name: 'Black Quartz', color: 'black', cat: 'Quartz', price: '₹2,300', orig: '₹2,000', desc: 'Obsidian black stone with subtle starlight silver micro-crystallites. Unmatched bold presence for bar counters.', img: 'https://i.pinimg.com/736x/05/68/b8/0568b872582ecbf6eea2a896d74a7011.jpg', backlit: false },
    { id: 'golden-quartz', name: 'Golden Quartz', color: 'gold', cat: 'Quartz', price: '₹2,600', orig: '₹2,300', desc: 'Rich amber-gold crystal webbing over warm ivory. Sourced & finished at our Kishangarh yard with palace-grade polish.', img: 'https://i.pinimg.com/736x/f8/49/ed/f849ed0807c1ecf8ea3c009c8b1048f6.jpg', backlit: true },
    { id: 'calacatta-quartz', name: 'Calacatta Quartz', color: 'white', cat: 'Quartz', price: '₹2,900', orig: '₹2,600', desc: 'Iconic feather veining inspired by finest Italian Calacatta marble. Zero maintenance luxury for statement waterfalls.', img: 'https://i.pinimg.com/736x/27/f7/fe/27f7fea910b7f5bec48de29ed6525883.jpg', backlit: false },

    // Agate Collection
    { id: 'blue-agate', name: 'Blue Agate', color: 'blue', cat: 'Agate', price: '₹1,500', orig: '₹1,200', desc: 'Deep cobalt and celestial blue concentric rings. Translucent gem grade that radiates breathtaking light when backlit.', img: 'https://i.pinimg.com/736x/a2/d6/ce/a2d6ce2f163f65ed84131ae133fe0892.jpg', backlit: true },
    { id: 'green-agate', name: 'Green Agate', color: 'green', cat: 'Agate', price: '₹1,700', orig: '₹1,400', desc: 'Rich forest and jade rings with translucent quartz heart. Brings tranquility into boutique hotel lobbies and spas.', img: 'https://i.pinimg.com/736x/ad/4c/26/ad4c26febaca2138be172be8556df8ab.jpg', backlit: true },
    { id: 'brown-agate', name: 'Brown Agate', color: 'beige', cat: 'Agate', price: '₹1,600', orig: '₹1,300', desc: 'Warm mocha, cinnamon and chocolate banded structure. Creates rich organic depth for fireplace claddings.', img: 'https://i.pinimg.com/736x/85/f5/7d/85f57d6a13428be68b988aa3e871d9e4.jpg', backlit: true },
    { id: 'white-agate', name: 'White Agate', color: 'white', cat: 'Agate', price: '₹1,800', orig: '₹1,500', desc: 'Ethereal translucent milky quartz rings. Radiates clean white light, giving an otherworldly glow to vanity backdrops.', img: 'https://i.pinimg.com/736x/ab/50/77/ab5077872cb922a61dab7d1607d2d49d.jpg', backlit: true },
    { id: 'red-agate', name: 'Red Agate', color: 'rare', cat: 'Agate', price: '₹2,000', orig: '₹1,700', desc: 'Crimson, carnelian and fire-hued crystalline bands. A dramatic showpiece slab for luxury dining feature walls.', img: 'https://i.pinimg.com/736x/56/c6/2b/56c62b08ee3a3125658c2f63be6d7194.jpg', backlit: true },
    { id: 'black-agate', name: 'Black Agate', color: 'black', cat: 'Agate', price: '₹2,300', orig: '₹2,000', desc: 'Jet black gemstone banded with sharp translucent white quartz fractures. Striking architectural contrast.', img: 'https://i.pinimg.com/736x/d1/0e/72/d10e7266764335390daaa7f084cbd2c0.jpg', backlit: true },
    { id: 'honey-agate', name: 'Honey Agate', color: 'gold', cat: 'Agate', price: '₹2,500', orig: '₹2,200', desc: 'Glowing golden syrup and amber crystals. Illuminates warm evening light for cocktail bars and powder rooms.', img: 'https://i.pinimg.com/736x/f8/49/ed/f849ed0807c1ecf8ea3c009c8b1048f6.jpg', backlit: true },
    { id: 'purple-agate', name: 'Purple Agate', color: 'rare', cat: 'Agate', price: '₹3,300', orig: '₹3,000', desc: 'Royal violet and lavender lace agate. Ultra-rare cut reserved for bespoke luxury headboards and art niches.', img: 'https://i.pinimg.com/736x/0a/99/55/0a99556e43f2dc7616f2f4030363cce2.jpg', backlit: true },

    // Rare & Statement Collection
    { id: 'malachite', name: 'Malachite', color: 'green', cat: 'Rare', price: '₹2,800', orig: '₹2,500', desc: 'Deep emerald-green banding forming concentric velvet eyes. The stone of Russian and European royalty.', img: 'https://i.pinimg.com/736x/7a/27/96/7a27964cde771dc315727d255fe1b1c4.jpg', backlit: false },
    { id: 'lapis-lazuli', name: 'Lapis Lazuli', color: 'blue', cat: 'Rare', price: '₹3,800', orig: '₹3,500', desc: 'Intense celestial ultramarine with sparkling golden pyrite veins. A 6,000-year symbol of timeless luxury.', img: 'https://i.pinimg.com/736x/ee/b9/0f/eeb90f60ecc95daeed81675d0aacbd79.jpg', backlit: false },
    { id: 'amethyst', name: 'Amethyst Slab', color: 'rare', cat: 'Rare', price: '₹3,300', orig: '₹3,000', desc: 'Natural violet quartz crystal clusters meticulously assembled. Mystical translucency and jewel-like radiance.', img: 'https://i.pinimg.com/736x/e4/71/63/e47163bbd9d0638e16d5a56b85ca61c3.jpg', backlit: true },
    { id: 'tiger-eye', name: 'Tiger Eye', color: 'gold', cat: 'Rare', price: '₹3,100', orig: '₹2,800', desc: 'Chatoyant golden-yellow and dark brown bands that shimmer with a silky optical luster as light moves.', img: 'https://i.pinimg.com/736x/60/19/07/601907e1e79163a70b26a42cf6b1234b.jpg', backlit: false },
    { id: 'onyx-white', name: 'Onyx White', color: 'white', cat: 'Rare', price: '₹4,300', orig: '₹4,000', desc: 'Semi-translucent calcite stone with honey-gold strata. Soft, glowing luminescence across entire wall panels.', img: 'https://i.pinimg.com/736x/16/71/4a/16714a84ce4792d3565845cf35610682.jpg', backlit: true },
    { id: 'onyx-black', name: 'Onyx Black', color: 'black', cat: 'Rare', price: '₹4,800', orig: '₹4,500', desc: 'Pure midnight black onyx with sharp white calcitic lightning veins. Monumental elegance.', img: 'https://i.pinimg.com/736x/57/3d/a5/573da5d6e8a89ea79bdade3c97d99aa9.jpg', backlit: false },
    { id: 'labradorite', name: 'Labradorite Slab', color: 'grey', cat: 'Rare', price: '₹5,300', orig: '₹5,000', desc: 'Feldspar mineral displaying labradorescence — iridescent peacock blue, green and copper flashes.', img: 'https://i.pinimg.com/736x/db/6c/7c/db6c7c80ab6837d7c05119aad874dbf2.jpg', backlit: false },
    { id: 'pyrite-slab', name: 'Pyrite Slab', color: 'gold', cat: 'Rare', price: '₹6,300', orig: '₹6,000', desc: 'Metallic brass-yellow mineral with bright cubic reflections. Creates an unforgettable metallic accent wall.', img: 'https://i.pinimg.com/736x/60/19/07/601907e1e79163a70b26a42cf6b1234b.jpg', backlit: false },
    { id: 'ocean-jasper', name: 'Ocean Jasper', color: 'green', cat: 'Rare', price: '₹7,800', orig: '₹7,500', desc: 'Orbicular pattern stone with swirling circles of sea green, pink, yellow and cream. Truly one-of-a-kind.', img: 'https://i.pinimg.com/736x/3e/8a/aa/3e8aaa3426b6d2b31b677a47964bd25b.jpg', backlit: true },
    { id: 'galaxy-black-granite', name: 'Galaxy Black Statement', color: 'black', cat: 'Rare', price: '₹8,300', orig: '₹8,000', desc: 'Deep jet black base filled with golden bronzite stellar flecks. The pinnacle of statement stone craftsmanship.', img: 'https://i.pinimg.com/736x/57/3d/a5/573da5d6e8a89ea79bdade3c97d99aa9.jpg', backlit: false }
  ];

  // ==========================================
  // 8. DUAL BROWSER ENGINE (NITCO-STYLE)
  // ==========================================
  const prodGrid = document.getElementById('prod-grid');
  const colourSwatches = document.getElementById('colour-swatches');
  const collectionTabs = document.getElementById('collection-tabs');
  const modeColourBtn = document.getElementById('mode-colour-btn');
  const modeCollBtn = document.getElementById('mode-coll-btn');

  function renderSlabs(stonesToRender) {
    if (!prodGrid) return;
    prodGrid.innerHTML = '';

    stonesToRender.forEach(p => {
      const card = document.createElement('div');
      card.className = 'prod-c';
      card.innerHTML = `
        <div class="prod-media">
          <img src="${p.img}" alt="${p.name} - Marmor Designs" loading="lazy" />
          <span class="prod-cat-badge">${p.cat}</span>
          ${p.backlit ? `<button class="prod-backlit-toggle" title="Click to test backlit glow">✦ Test Backlit</button>` : ''}
        </div>
        <div class="prod-body">
          <h3 class="prod-title">${p.name}</h3>
          <p class="prod-desc">${p.desc}</p>
          <div class="prod-footer">
            <div class="prod-rate-wrap">
              <span class="prate">${p.price}</span>
              <span class="punit"> / sq. ft.</span>
            </div>
            <a href="contact.html?stone=${encodeURIComponent(p.name)}" class="prod-action">Enquire Now →</a>
          </div>
        </div>
      `;

      // Backlit toggle
      const backlitBtn = card.querySelector('.prod-backlit-toggle');
      if (backlitBtn) {
        backlitBtn.addEventListener('click', (e) => {
          e.preventDefault();
          card.classList.toggle('is-backlit');
          backlitBtn.textContent = card.classList.contains('is-backlit') ? '✦ Normal View' : '✦ Test Backlit';
        });
      }

      prodGrid.appendChild(card);
    });
  }

  // Initial render: show top 6 featured stones
  if (prodGrid) {
    renderSlabs(allStones.slice(0, 6));
  }

  // Dual Mode Tabs (By Colour vs By Collection)
  if (modeColourBtn && modeCollBtn) {
    modeColourBtn.addEventListener('click', () => {
      modeColourBtn.classList.add('active');
      modeCollBtn.classList.remove('active');
      if (colourSwatches) colourSwatches.style.display = 'flex';
      if (collectionTabs) collectionTabs.style.display = 'none';
      // Trigger first active color
      const firstActiveColor = document.querySelector('.color-circle-btn.active') || document.querySelector('.color-circle-btn');
      if (firstActiveColor) firstActiveColor.click();
    });

    modeCollBtn.addEventListener('click', () => {
      modeCollBtn.classList.add('active');
      modeColourBtn.classList.remove('active');
      if (colourSwatches) colourSwatches.style.display = 'none';
      if (collectionTabs) collectionTabs.style.display = 'flex';
      // Trigger first active collection tab
      const firstActiveTab = document.querySelector('.col-tab-btn.active') || document.querySelector('.col-tab-btn');
      if (firstActiveTab) firstActiveTab.click();
    });
  }

  // Color Swatch Click Handler
  const colorButtons = document.querySelectorAll('.color-circle-btn');
  colorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      colorButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetColor = btn.getAttribute('data-color');

      if (targetColor === 'all') {
        renderSlabs(allStones);
      } else {
        const filtered = allStones.filter(s => s.color === targetColor);
        renderSlabs(filtered.length > 0 ? filtered : allStones);
      }
    });
  });

  // Collection Tab Click Handler
  const collectionButtons = document.querySelectorAll('.col-tab-btn');
  collectionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      collectionButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const targetCat = btn.getAttribute('data-cat');

      if (targetCat === 'all') {
        renderSlabs(allStones);
      } else {
        const filtered = allStones.filter(s => s.cat === targetCat);
        renderSlabs(filtered);
      }
    });
  });

  // ==========================================
  // 9. QUOTE FORM SUBMISSION
  // ==========================================
  const quoteForm = document.getElementById('quote-form');
  const formSuccess = document.getElementById('form-ok');
  const submitBtn = document.getElementById('qsubmit');

  if (quoteForm) {
    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('fn');
      const phoneInput = document.getElementById('fp');

      let valid = true;
      if (!nameInput.value.trim()) {
        nameInput.style.borderColor = '#E74C3C';
        valid = false;
      } else {
        nameInput.style.borderColor = '';
      }

      if (!phoneInput.value.trim()) {
        phoneInput.style.borderColor = '#E74C3C';
        valid = false;
      } else {
        phoneInput.style.borderColor = '';
      }

      if (!valid) return;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'Submitting Enquiry...';
      }

      setTimeout(() => {
        quoteForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.querySelector('span').textContent = 'Send My Enquiry';
        }
        if (formSuccess) {
          formSuccess.style.display = 'flex';
          setTimeout(() => {
            formSuccess.style.display = 'none';
          }, 7000);
        }
      }, 1200);
    });
  }


  // ==========================================
  // 5B. INTERACTIVE 3D SLAB STUDIO ENGINE
  // ==========================================
  const studioCanvas = document.getElementById('studio-3d-canvas');
  if (studioCanvas && typeof THREE !== 'undefined') {
    const sScene = new THREE.Scene();
    sScene.background = new THREE.Color(0x0c0b09);

    const sCamera = new THREE.PerspectiveCamera(40, studioCanvas.clientWidth / studioCanvas.clientHeight, 0.1, 100);
    sCamera.position.set(0, 0, 5.2);

    const sRenderer = new THREE.WebGLRenderer({ canvas: studioCanvas, antialias: true, alpha: false });
    sRenderer.setSize(studioCanvas.clientWidth, studioCanvas.clientHeight);
    sRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    sRenderer.toneMapping = THREE.ACESFilmicToneMapping;
    sRenderer.toneMappingExposure = 1.1;

    // Lighting
    const sAmbientLight = new THREE.AmbientLight(0xffffff, 0.85);
    sScene.add(sAmbientLight);

    const sKeyLight = new THREE.DirectionalLight(0xfff3db, 1.4);
    sKeyLight.position.set(4, 5, 4);
    sScene.add(sKeyLight);

    const sFillLight = new THREE.DirectionalLight(0xd4e5ff, 0.8);
    sFillLight.position.set(-4, -2, 3);
    sScene.add(sFillLight);

    // Internal Backlit Point Light (simulates light panel behind translucent stone)
    const sBacklight = new THREE.PointLight(0xffcc77, 0, 8);
    sBacklight.position.set(0, 0, -0.6);
    sScene.add(sBacklight);

    // Slab Group
    const slabGroup = new THREE.Group();
    sScene.add(slabGroup);

    // Texture Loader
    const texLoader = new THREE.TextureLoader();
    texLoader.setCrossOrigin('anonymous');

    // Create Slab Mesh
    // Dimensions: 2.6m wide, 1.6m tall, 0.08m thick (calibrated architectural ratio)
    const slabGeo = new THREE.BoxGeometry(2.6, 1.6, 0.08);

    function createSlabMaterial(texUrl) {
      const tex = texLoader.load(texUrl);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;

      return new THREE.MeshStandardMaterial({
        map: tex,
        roughness: 0.12,
        metalness: 0.04,
        emissive: new THREE.Color(0x000000),
        emissiveIntensity: 0.0
      });
    }

    const defaultMat = createSlabMaterial('https://i.pinimg.com/736x/27/f7/fe/27f7fea910b7f5bec48de29ed6525883.jpg');
    const slabMesh1 = new THREE.Mesh(slabGeo, defaultMat);
    slabGroup.add(slabMesh1);

    // Second slab for Bookmatch
    const bookmatchMat = defaultMat.clone();
    const slabMesh2 = new THREE.Mesh(slabGeo, bookmatchMat);
    slabMesh2.position.set(2.7, 0, 0);
    slabMesh2.scale.set(-1, 1, 1); // Mirrored UV
    slabMesh2.visible = false;
    slabGroup.add(slabMesh2);

    // Gold Bevel Edge Trim
    const edgeGeo = new THREE.EdgesGeometry(slabGeo);
    const edgeMat = new THREE.LineBasicMaterial({ color: 0xC8A96E, linewidth: 1.5, transparent: true, opacity: 0.4 });
    const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
    slabMesh1.add(edgeLine);

    // State Variables
    let isAutoRotating = true;
    let isBacklit = false;
    let isBookmatched = false;
    let currentPolish = 'High Mirror Polish';
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let rotationVelocity = { x: 0, y: 0 };

    // Mouse / Touch Orbit Controls
    studioCanvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouse.x;
      const deltaY = e.clientY - prevMouse.y;
      prevMouse = { x: e.clientX, y: e.clientY };

      rotationVelocity.x = deltaX * 0.008;
      rotationVelocity.y = deltaY * 0.008;
      slabGroup.rotation.y += rotationVelocity.x;
      slabGroup.rotation.x += rotationVelocity.y;
      slabGroup.rotation.x = Math.max(-1.1, Math.min(1.1, slabGroup.rotation.x));
    });

    // Touch support
    studioCanvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - prevMouse.x;
      const deltaY = e.touches[0].clientY - prevMouse.y;
      prevMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      slabGroup.rotation.y += deltaX * 0.008;
      slabGroup.rotation.x += deltaY * 0.008;
    });

    // Texture Switcher
    const textureButtons = document.querySelectorAll('.stexture-btn');
    const badgeStoneName = document.getElementById('sbadge-stone-name');
    const studioPrice = document.getElementById('studio-price');

    textureButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        textureButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const imgUrl = btn.getAttribute('data-img');
        const name = btn.getAttribute('data-name');
        const price = btn.getAttribute('data-price');
        const canBacklight = btn.getAttribute('data-backlit') === 'true';

        if (badgeStoneName) badgeStoneName.textContent = name;
        if (studioPrice) studioPrice.textContent = `${price} / sq. ft.`;

        // Load new texture onto slab
        texLoader.load(imgUrl, (newTex) => {
          newTex.wrapS = THREE.RepeatWrapping;
          newTex.wrapT = THREE.RepeatWrapping;
          slabMesh1.material.map = newTex;
          slabMesh1.material.needsUpdate = true;
          slabMesh2.material.map = newTex;
          slabMesh2.material.needsUpdate = true;
        });

        // Auto-enable backlight if translucent stone
        if (canBacklight && !isBacklit) {
          document.getElementById('sbtn-backlit')?.click();
        }
      });
    });

    // Backlit Toggle
    const btnBacklit = document.getElementById('sbtn-backlit');
    const stateBacklit = document.getElementById('sstate-backlit');
    const badgeLighting = document.getElementById('sbadge-lighting');

    if (btnBacklit) {
      btnBacklit.addEventListener('click', () => {
        isBacklit = !isBacklit;
        btnBacklit.classList.toggle('active', isBacklit);
        if (stateBacklit) stateBacklit.textContent = isBacklit ? 'ON (Translucent Glow)' : 'OFF';
        if (badgeLighting) badgeLighting.textContent = isBacklit ? 'Translucent LED Backlight (3500K)' : 'Ambient Day Studio';

        if (isBacklit) {
          sBacklight.intensity = 4.2;
          slabMesh1.material.emissive = new THREE.Color(0xffcf80);
          slabMesh1.material.emissiveIntensity = 0.55;
          slabMesh2.material.emissive = new THREE.Color(0xffcf80);
          slabMesh2.material.emissiveIntensity = 0.55;
        } else {
          sBacklight.intensity = 0;
          slabMesh1.material.emissiveIntensity = 0.0;
          slabMesh2.material.emissiveIntensity = 0.0;
        }
      });
    }

    // Bookmatch Toggle
    const btnBookmatch = document.getElementById('sbtn-bookmatch');
    const stateBookmatch = document.getElementById('sstate-bookmatch');

    if (btnBookmatch) {
      btnBookmatch.addEventListener('click', () => {
        isBookmatched = !isBookmatched;
        btnBookmatch.classList.toggle('active', isBookmatched);
        if (stateBookmatch) stateBookmatch.textContent = isBookmatched ? 'ON (Twin Butterfly)' : 'OFF';

        if (isBookmatched) {
          slabMesh1.position.x = -1.35;
          slabMesh2.position.x = 1.35;
          slabMesh2.visible = true;
          sCamera.position.z = 6.4;
        } else {
          slabMesh1.position.x = 0;
          slabMesh2.visible = false;
          sCamera.position.z = 5.2;
        }
      });
    }

    // Auto-Rotate Toggle
    const btnRotate = document.getElementById('sbtn-autorotate');
    const stateRotate = document.getElementById('sstate-rotate');

    if (btnRotate) {
      btnRotate.addEventListener('click', () => {
        isAutoRotating = !isAutoRotating;
        btnRotate.classList.toggle('active', isAutoRotating);
        if (stateRotate) stateRotate.textContent = isAutoRotating ? 'ON' : 'OFF';
      });
    }

    // Finish Toggle (Polish vs Honed)
    const btnFinish = document.getElementById('sbtn-finish');
    const stateFinish = document.getElementById('sstate-finish');

    if (btnFinish) {
      btnFinish.addEventListener('click', () => {
        if (currentPolish === 'High Mirror Polish') {
          currentPolish = 'Satin Honed';
          slabMesh1.material.roughness = 0.45;
          slabMesh2.material.roughness = 0.45;
        } else if (currentPolish === 'Satin Honed') {
          currentPolish = 'Leathered Matte';
          slabMesh1.material.roughness = 0.75;
          slabMesh2.material.roughness = 0.75;
        } else {
          currentPolish = 'High Mirror Polish';
          slabMesh1.material.roughness = 0.12;
          slabMesh2.material.roughness = 0.12;
        }
        if (stateFinish) stateFinish.textContent = currentPolish;
      });
    }

    // Window Resize
    window.addEventListener('resize', () => {
      const w = studioCanvas.clientWidth;
      const h = studioCanvas.clientHeight;
      if (w > 0 && h > 0) {
        sCamera.aspect = w / h;
        sCamera.updateProjectionMatrix();
        sRenderer.setSize(w, h);
      }
    });

    // Studio Render Loop with Dynamic Specular Lighting & Smooth Inertia
    let sClock = new THREE.Clock();
    function animateStudio() {
      requestAnimationFrame(animateStudio);
      const delta = sClock.getDelta();
      const elapsed = sClock.getElapsedTime();

      // Dynamic studio keylight sweeping across slab surface
      sKeyLight.position.x = Math.sin(elapsed * 0.6) * 5.5;
      sKeyLight.position.z = Math.cos(elapsed * 0.6) * 4.5 + 2.0;

      if (isAutoRotating && !isDragging) {
        slabGroup.rotation.y += delta * 0.35;
      } else if (!isDragging) {
        // Inertia damping
        slabGroup.rotation.y += rotationVelocity.x;
        slabGroup.rotation.x += rotationVelocity.y;
        slabGroup.rotation.x = Math.max(-1.1, Math.min(1.1, slabGroup.rotation.x));
        rotationVelocity.x *= 0.92;
        rotationVelocity.y *= 0.92;
      }

      // Smooth bookmatch butterfly angling
      if (isBookmatched) {
        slabMesh1.rotation.y = THREE.MathUtils.lerp(slabMesh1.rotation.y, 0.12, 0.08);
        slabMesh2.rotation.y = THREE.MathUtils.lerp(slabMesh2.rotation.y, -0.12, 0.08);
      } else {
        slabMesh1.rotation.y = THREE.MathUtils.lerp(slabMesh1.rotation.y, 0, 0.08);
        slabMesh2.rotation.y = THREE.MathUtils.lerp(slabMesh2.rotation.y, 0, 0.08);
      }

      sRenderer.render(sScene, sCamera);
    }
    animateStudio();
  }

  // ==========================================
  // 5C. 3D CARD PARALLAX TILT ANIMATION
  // ==========================================
  const tiltCards = document.querySelectorAll('.prod-c, .tech-card, .offer-card, .space-card, .spot-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = (-y / rect.height) * 10;
      const rotateY = (x / rect.width) * 10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  console.log('%c✦ MARMOR DESIGNS | LUXURY MARBLE & AGATE ARCHITECTURE', 'color: #C8A96E; font-size: 14px; font-weight: bold;');
});
