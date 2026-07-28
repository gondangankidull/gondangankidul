// ---------------------------------------------------------
    // 1. Mobile Navbar Toggle
    // ---------------------------------------------------------
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close mobile menu after clicking a link (better UX)
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });

    // ---------------------------------------------------------
    // 2. Reusable "Selengkapnya" Toggle
    //    Dipakai oleh section UMKM & Lokasi Penting (dan section
    //    lain di masa depan) tanpa duplikasi kode.
    // ---------------------------------------------------------
    function setupToggle(buttonId, extraContainerId) {
      const btn = document.getElementById(buttonId);
      const extra = document.getElementById(extraContainerId);

      // Guard clause: lewati kalau salah satu elemen tidak ditemukan
      // di halaman (misal section tersebut belum/tidak dipakai).
      if (!btn || !extra) return;

      btn.addEventListener('click', () => {
        const isOpen = extra.classList.toggle('open');
        btn.classList.toggle('active', isOpen);
        btn.querySelector('.label').textContent = isOpen
          ? 'Tampilkan Lebih Sedikit'
          : 'Selengkapnya';
      });
    }

    // Daftarkan setiap pasangan tombol & container extra di sini
    setupToggle('umkmToggleBtn', 'umkmExtra');
    setupToggle('lokasiToggleBtn', 'lokasiExtra');
    setupToggle('kegiatanToggleBtn', 'kegiatanExtra');

    // ---------------------------------------------------------
    // 3. Animate Horizontal Bar Charts on Scroll (IntersectionObserver)
    // ---------------------------------------------------------
    const barRows = document.querySelectorAll('.bar-row');

    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const row = entry.target;
          const value = parseFloat(row.dataset.value);
          const max = parseFloat(row.dataset.max);
          const percent = (value / max) * 100;
          const fill = row.querySelector('.bar-fill');
          // Slight delay for a staggered "grow" effect
          requestAnimationFrame(() => {
            fill.style.width = percent + '%';
          });
          barObserver.unobserve(row);
        }
      });
    }, { threshold: 0.3 });

    barRows.forEach(row => barObserver.observe(row));

    // ---------------------------------------------------------
    // 4. Generic Scroll Reveal for Sections
    // ---------------------------------------------------------
    const revealEls = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach(el => revealObserver.observe(el));

    // ---------------------------------------------------------
    // 5. Smooth Scroll Offset Correction for Sticky Navbar
    //    (native scroll-behavior handles smoothness; this keeps
    //     anchored sections from hiding under the sticky navbar)
    // ---------------------------------------------------------
    const navbarHeight = document.querySelector('.navbar').offsetHeight;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId.length > 1) {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            const top = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight - 10;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }
      });
    });