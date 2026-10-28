/**
 * Muskan - Modern Portfolio JavaScript
 * Includes Theme Toggle, Mobile Drawer, Project Filters, Scrollspy, Form Validation & Clipboard
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Dynamic Footer Year
  // --------------------------------------------------------------------------
  const yearSpan = document.getElementById('current-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 2. Theme Toggle (Dark & Light Mode) with LocalStorage
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlElement = document.documentElement;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  htmlElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme');
      const targetTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      htmlElement.setAttribute('data-theme', targetTheme);
      localStorage.setItem('portfolio-theme', targetTheme);
    });
  }

  // --------------------------------------------------------------------------
  // 3. Mobile Navigation Menu Toggle
  // --------------------------------------------------------------------------
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleNavMenu = () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburgerBtn.classList.toggle('active', isOpen);
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
  };

  const closeNavMenu = () => {
    navMenu.classList.remove('open');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  };

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', toggleNavMenu);

    // Close menu when clicking nav links
    navLinks.forEach(link => {
      link.addEventListener('click', closeNavMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target) && navMenu.classList.contains('open')) {
        closeNavMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeNavMenu();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. Scrollspy (Highlight active nav link on scroll)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const handleScrollspy = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (matchingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          matchingLink.classList.add('active');
        } else {
          matchingLink.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', handleScrollspy, { passive: true });

  // --------------------------------------------------------------------------
  // 5. Project Category Filtering
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      // Filter project cards with animation
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 6. Copy Email to Clipboard
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const emailText = document.getElementById('email-text');
  const copyTooltip = document.getElementById('copy-tooltip');

  if (copyEmailBtn && emailText && copyTooltip) {
    copyEmailBtn.addEventListener('click', async () => {
      const textToCopy = emailText.textContent.trim();
      try {
        await navigator.clipboard.writeText(textToCopy);
        copyTooltip.textContent = 'Copied!';
        copyTooltip.classList.add('active');
        setTimeout(() => {
          copyTooltip.classList.remove('active');
        }, 2200);
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        copyTooltip.textContent = 'Copied!';
        copyTooltip.classList.add('active');
        setTimeout(() => {
          copyTooltip.classList.remove('active');
        }, 2200);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. Interactive Contact Form with Validation
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');
  const formFeedback = document.getElementById('form-feedback');

  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const validateFields = () => {
    let isValid = true;

    // Name validation
    if (!nameInput.value.trim()) {
      nameError.textContent = 'Please enter your name.';
      isValid = false;
    } else {
      nameError.textContent = '';
    }

    // Email validation
    if (!emailInput.value.trim()) {
      emailError.textContent = 'Please enter your email address.';
      isValid = false;
    } else if (!validateEmail(emailInput.value.trim())) {
      emailError.textContent = 'Please provide a valid email format.';
      isValid = false;
    } else {
      emailError.textContent = '';
    }

    // Subject validation
    if (!subjectInput.value.trim()) {
      subjectError.textContent = 'Please provide a subject.';
      isValid = false;
    } else {
      subjectError.textContent = '';
    }

    // Message validation
    if (!messageInput.value.trim()) {
      messageError.textContent = 'Please write a brief message.';
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      messageError.textContent = 'Message should be at least 10 characters.';
      isValid = false;
    } else {
      messageError.textContent = '';
    }

    return isValid;
  };

  // Real-time input clearing
  [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => {
        const errorEl = document.getElementById(`${input.id}-error`);
        if (errorEl) errorEl.textContent = '';
      });
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!validateFields()) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please fill out all required fields correctly.';
        return;
      }

      // Simulate sending state
      const btnText = submitBtn.querySelector('.btn-text');
      const originalText = btnText.textContent;
      btnText.textContent = 'Sending...';
      submitBtn.disabled = true;

      setTimeout(() => {
        btnText.textContent = originalText;
        submitBtn.disabled = false;

        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = 'Thank you! Your message has been sent successfully. I will get back to you soon.';
        contactForm.reset();

        setTimeout(() => {
          formFeedback.style.display = 'none';
          formFeedback.className = 'form-feedback';
        }, 6000);
      }, 1000);
    });
  }

  // --------------------------------------------------------------------------
  // 8. Resume / CV Button Action
  // --------------------------------------------------------------------------
  const cvBtn = document.getElementById('cv-btn');
  if (cvBtn) {
    cvBtn.addEventListener('click', (e) => {
      // In production, user can replace with their actual resume PDF link: e.g. href="assets/resume.pdf" target="_blank"
      // If href is still #about, let's notify the user
      if (cvBtn.getAttribute('href') === '#about') {
        e.preventDefault();
        alert('Resume file placeholder: You can link your actual PDF resume by setting href="resume.pdf" on the resume button in index.html!');
      }
    });
  }
});

