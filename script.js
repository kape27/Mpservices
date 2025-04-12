document.addEventListener('DOMContentLoaded', function() {
    // Vérifier et appliquer le thème sauvegardé
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
    }
    
    // Gestion du basculement du thème
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            updateThemeIcon(newTheme);
        });
    }
    
    // Fonction pour mettre à jour l'icône du thème
    function updateThemeIcon(theme) {
        const themeIcon = document.querySelector('.theme-toggle .icon');
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
    }
    
    // Gestion du menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
    
    // Animation des sections au défilement
    const sections = document.querySelectorAll('section');
    const cards = document.querySelectorAll('.card');
    
    function checkVisibility() {
        // Animation des sections
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const isVisible = (rect.top <= window.innerHeight * 0.8 && rect.bottom >= 0);
            
            if (isVisible) {
                section.classList.add('visible');
            }
        });
        
        // Animation des cartes avec délai progressif
        cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const isVisible = (rect.top <= window.innerHeight * 0.9 && rect.bottom >= 0);
            
            if (isVisible) {
                setTimeout(() => {
                    card.classList.add('fade-in');
                }, 100 * index);
            }
        });
    }
    
    // Navigation active
    function setActiveNavLink() {
        const navLinks = document.querySelectorAll('nav a');
        const scrollPosition = window.scrollY;
        
        // Trouver la section active
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Retirer la classe active de tous les liens
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Ajouter la classe active au lien correspondant à la section
                const activeLink = document.querySelector(`nav a[href*="${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    // Animation au survol des cartes
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 20px 30px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
        });
    });
    
    // Défilement fluide pour les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Vérifier la visibilité au chargement
    checkVisibility();
    setActiveNavLink();
    
    // Vérifier la visibilité au défilement
    window.addEventListener('scroll', function() {
        checkVisibility();
        setActiveNavLink();
    });
});