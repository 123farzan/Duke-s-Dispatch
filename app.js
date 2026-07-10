/* DUKES DISPATCH — INTERACTIONS */

// Live clock in cockpit
(function clock(){
  const el = document.getElementById('cockpit-time');
  if(!el) return;
  const tick = () => {
    const d = new Date();
    const hh = String(d.getHours()).padStart(2,'0');
    const mm = String(d.getMinutes()).padStart(2,'0');
    const ss = String(d.getSeconds()).padStart(2,'0');
    el.textContent = `${hh}:${mm}:${ss}`;
  };
  tick();
  setInterval(tick, 1000);
})();

// Animate route figures on the money card
(function moneyJitter(){
  const big = document.querySelector('.money__big');
  if(!big) return;
  setInterval(() => {
    const d = new Date();
    const min = d.getMinutes();
    const small = ((min * 7) % 100).toString().padStart(2,'0');
    big.innerHTML = `<span class="money__cur">$</span>4,7${(18 + (min%2))}<small>.${small}</small>`;
  }, 6000);
})();

// Mobile nav toggle
(function mobileNav(){
  const burger = document.querySelector('.nav__burger');
  const links = document.querySelector('.nav__links');
  if(!burger || !links) return;
  let open = false;
  const closeMenu = () => {
    open = false;
    links.style.cssText = '';
    burger.textContent = '☰';
  };
  burger.addEventListener('click', () => {
    open = !open;
    if(open){
      links.style.cssText = `
        display:flex;flex-direction:column;gap:14px;position:absolute;
        top:100%;left:0;right:0;background:rgba(10,14,20,.98);
        padding:20px 24px 24px;border-bottom:1px solid var(--line);
        box-shadow:0 16px 28px rgba(0,0,0,.24);
        backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
      `;
      burger.textContent = '✕';
    } else {
      closeMenu();
    }
  });
  links.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => { if(window.innerWidth > 1100) closeMenu(); });
})();

// Reveal-on-scroll
(function reveal(){
  const targets = document.querySelectorAll('.section-head, .op, .step, .eq, .plan, .quote, .faq-item, .detail-block, .team, .contact-info, .form, .about-card');
  targets.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity .8s ease, transform .8s ease';
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  targets.forEach(el => io.observe(el));
})();

// Count-up for hero trust metrics & rate stats
(function counters(){
  const stats = document.querySelectorAll('[data-count]');
  if(!stats.length) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        const el = e.target;
        const target = parseFloat(el.dataset.count);
        const dur = 1400;
        const start = performance.now();
        const step = (now) => {
          const p = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          const v = (target * eased);
          el.textContent = (target % 1 === 0 ? Math.round(v) : v.toFixed(2)).toLocaleString();
          if(p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        io.unobserve(el);
      }
    });
  }, { threshold: .6 });
  stats.forEach(s => io.observe(s));
})();

// Cursor-reactive cockpit tilt
(function tilt(){
  const wrap = document.querySelector('.cockpit');
  const frame = document.querySelector('.cockpit__frame');
  if(!wrap || !frame) return;
  if(matchMedia('(hover: none)').matches) return;
  wrap.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top)  / rect.height - .5;
    frame.style.transform = `rotateX(${-y * 6}deg) rotateY(${x * 8}deg)`;
  });
  wrap.addEventListener('mouseleave', () => {
    frame.style.transform = '';
  });
})();

// FAQ: smooth open/close hint (default behavior is fine, but ensure styling holds)
document.querySelectorAll('.faq-item summary')?.forEach(s => {
  s.addEventListener('click', () => {
    // close siblings when one opens
    const parent = s.parentElement.parentElement;
    parent.querySelectorAll('.faq-item[open]').forEach(o => {
      if(o !== s.parentElement) o.removeAttribute('open');
    });
  });
});

// Navbar phone CTA → WhatsApp chat
(function whatsappCTA(){
  const a = document.getElementById('nav-whatsapp');
  if(!a) return;
  const targetUrl = a.getAttribute('href') || 'https://wa.me/15732988254';
  a.addEventListener('click', (e) => {
    e.preventDefault();
    try {
      const popup = window.open(targetUrl, '_blank', 'noopener,noreferrer');
      if(!popup){
        window.location.href = targetUrl;
      }
    } catch (err) {
      window.location.href = targetUrl;
    }
  });
})();

// Contact form → mailto:info@dukesdispatchservices.com
(function contactForm(){
  const form = document.getElementById('contact-form');
  if(!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const get = (k) => (data.get(k) || '').toString().trim();
    const name     = get('name')     || 'Not provided';
    const phone    = get('phone')    || 'Not provided';
    const email    = get('email')    || 'Not provided';
    const equip    = get('equipment')|| 'Not provided';
    const plan     = get('plan')     || 'Not provided';
    const message  = get('message')  || 'No additional details provided.';

    const subject = `New Dispatch Inquiry — ${name} (${equip})`;
    const body =
`Name: ${name}
Phone: ${phone}
Email: ${email}
Equipment: ${equip}
Plan: ${plan}

Operation details:
${message}

—
Sent from dukesdispatchservices.com contact form`;

    const mailto = `mailto:info@dukesdispatchservices.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;

    // Show the existing success card and hide the form
    form.style.display = 'none';
    const ok = document.getElementById('form-ok');
    if(ok) ok.style.display = 'block';
  });
})();
