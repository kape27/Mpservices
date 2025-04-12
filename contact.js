document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Récupération des valeurs du formulaire
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const secteur = document.getElementById('secteur').value;
            const message = document.getElementById('message').value;
            
            // Validation simple
            if (!name || !email || !secteur || !message) {
                alert('Veuillez remplir tous les champs obligatoires.');
                return;
            }
            
            // Création d'un objet message avec la date actuelle
            const newMessage = {
                date: new Date().toISOString(),
                name: name,
                email: email,
                phone: phone,
                secteur: secteur,
                message: message
            };
            
            // Récupération des messages existants
            let messages = [];
            const storedMessages = localStorage.getItem('contactMessages');
            
            if (storedMessages) {
                messages = JSON.parse(storedMessages);
            }
            
            // Ajout du nouveau message
            messages.push(newMessage);
            
            // Sauvegarde dans le localStorage
            localStorage.setItem('contactMessages', JSON.stringify(messages));
            
            // Confirmation et réinitialisation du formulaire
            alert('Merci pour votre message, ' + name + ' ! Nous vous contacterons bientôt.');
            contactForm.reset();
        });
    }
});