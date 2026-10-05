// GSAP and ScrollTrigger should be included in HTML

document.addEventListener('DOMContentLoaded', () => {
  // Menu Toggle
  const menuBtn = document.getElementById('menuBtn');
  const closeBtn = document.getElementById('closeMenuBtn');
  const menuOverlay = document.getElementById('menuOverlay');

  if (menuBtn && closeBtn && menuOverlay) {
    menuBtn.addEventListener('click', () => {
      menuOverlay.classList.add('open');
      gsap.fromTo('.menu-content-wrapper', { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, delay: 0.2, ease: 'power3.out' });
    });

    closeBtn.addEventListener('click', () => {
      menuOverlay.classList.remove('open');
    });
  }

  // Common animations for fade-in/slide-up elements
  const fadeElements = document.querySelectorAll('.fade-in, .slide-up');
  fadeElements.forEach(el => {
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: el,
        start: "top 80%",
      }
    });
  });

  // Home Page Specific Animations
  const heroSection = document.getElementById('heroSection');
  const heroBg = document.getElementById('heroBg');
  const heroTitle = document.getElementById('heroTitle');

  if (heroSection && heroBg && heroTitle) {
    // Parallax
    gsap.to(heroBg, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: heroSection,
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Title entrance
    gsap.fromTo(heroTitle,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, ease: "power3.out", delay: 0.5 }
    );
  }

  // Signature Suites Gallery ScrollTrigger
  const galleryWrapper = document.getElementById('galleryWrapper');
  const galleryContainer = document.getElementById('galleryContainer');
  const panels = gsap.utils.toArray('.suite-panel');

  if (galleryWrapper && galleryContainer && panels.length > 0) {
    gsap.to(panels, {
      xPercent: -100 * (panels.length - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: galleryWrapper,
        pin: true,
        scrub: 1,
        snap: 1 / (panels.length - 1),
        end: () => '+=' + galleryContainer.offsetWidth,
      }
    });
  }

  // Booking Form Submission with Email & WhatsApp Notification
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.textContent : 'Request Reservation';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing & Sending Notifications...';
      }

      const formData = {
        arrival: document.getElementById('arrival')?.value,
        departure: document.getElementById('departure')?.value,
        room: document.getElementById('room')?.value,
        guests: document.getElementById('guests')?.value,
        name: document.getElementById('name')?.value,
        email: document.getElementById('email')?.value,
        phone: document.getElementById('phone')?.value,
        requests: document.getElementById('requests')?.value,
      };

      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          const bookingId = data.booking?.bookingId || 'BK-CONFIRMED';
          const whatsappUrl = data.whatsappUrl || `https://wa.me/919897960822?text=Booking%20ID%20${bookingId}`;

          // Automatically open WhatsApp in new tab for direct notification
          window.open(whatsappUrl, '_blank');

          // Show confirmation toast / alert
          alert(
            `✅ RESERVATION CONFIRMED! (${bookingId})\n\n` +
            `✉️ Email notification sent to: aniruddhranag143@gmail.com & ${formData.email}\n` +
            `📱 WhatsApp alert generated for: 9897960822\n\n` +
            `Click OK to view your booking summary.`
          );

          bookingForm.reset();
        } else {
          alert('⚠️ Booking failed: ' + (data.error || 'Please check your inputs and try again.'));
        }
      } catch (err) {
        console.error('Booking submission error:', err);
        alert('⚠️ Unable to connect to the server. Please ensure the backend is running.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  }

  // Suite Page Logic
  if (window.location.pathname.includes('suite.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const suiteId = urlParams.get('id');

    const suitesData = {
      vanguard: {
        name: 'The Elite Vanguard',
        price: '$5,000 / Night',
        description: 'Skyline views, smart-glass transparency controls, and automated climate scheduling. Filter your experience by mood: Dark & Moody, Bright & Minimalist, or Golden Hour.',
        specs: { size: '1,200 sq. ft.', occupancy: '2 Adults', view: 'Panoramic City Skyline' },
        images: [
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
        ]
      },
      heritage: {
        name: 'The Heritage Prime',
        price: '$4,200 / Night',
        description: 'Classic luxury, premium textures, and curated art pieces for the modern aristocrat. Experience unparalleled luxury with our immersive 360° VR tour.',
        specs: { size: '1,450 sq. ft.', occupancy: '2 Adults, 2 Children', view: 'Historic Gardens' },
        images: [
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
          'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
        ]
      },
      future: {
        name: 'The Orbital Oasis',
        price: '$8,500 / Night',
        description: 'Futuristic minimalist luxury hotel suite, smart glass, glowing accents, cinematic lighting. A Floating, glowing gold orb AI awaits your every command.',
        specs: { size: '2,000 sq. ft.', occupancy: '4 Adults', view: 'Oceanic Horizon' },
        images: [
          'https://images.unsplash.com/photo-1590490359683-658d3d23f972?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
          'https://images.unsplash.com/photo-1533633310920-cc9bf1e7f9b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
          'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
        ]
      }
    };

    const suite = suitesData[suiteId];
    if (suite) {
      document.getElementById('suiteName').textContent = suite.name;
      document.getElementById('suiteDescription').textContent = suite.description;
      document.getElementById('suitePrice').textContent = suite.price;
      document.getElementById('specSize').textContent = suite.specs.size;
      document.getElementById('specOccupancy').textContent = suite.specs.occupancy;
      document.getElementById('specView').textContent = suite.specs.view;

      const galleryGrid = document.getElementById('suiteGalleryGrid');
      galleryGrid.innerHTML = '';
      suite.images.forEach((img, idx) => {
        const item = document.createElement('div');
        item.className = 'suite-gallery-item group';
        item.innerHTML = `
          <img src="${img}" alt="${suite.name} - View ${idx + 1}" class="suite-gallery-img" />
          <div class="suite-gallery-overlay"></div>
        `;
        galleryGrid.appendChild(item);
      });
      document.title = `${suite.name} | Hotel MOMents`;
    } else {
      document.querySelector('.suite-detail-main').innerHTML = '<div class="container" style="text-align: center; margin-top: 100px;"><h2>Suite not found</h2><a href="index.html" class="btn-primary" style="margin-top: 20px;">Return Home</a></div>';
    }
  }

});
