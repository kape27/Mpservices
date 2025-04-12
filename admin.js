document.addEventListener('DOMContentLoaded', function() {
    // Éléments du DOM
    const loginForm = document.getElementById('login-form');
    const loginSection = document.getElementById('login-section');
    const messagesSection = document.getElementById('messages-section');
    const logoutBtn = document.getElementById('logout-btn');
    const messagesList = document.getElementById('messages-list');
    const noMessages = document.getElementById('no-messages');
    const filterSecteur = document.getElementById('filter-secteur');
    const searchInput = document.getElementById('search-input');
    const sortBy = document.getElementById('sort-by');
    const exportCsvBtn = document.getElementById('export-csv');
    const showStatsBtn = document.getElementById('show-stats');
    const advancedSearchBtn = document.getElementById('advanced-search');
    const changePasswordBtn = document.getElementById('change-password-btn');
    const passwordChangeSection = document.getElementById('password-change-section');
    const passwordChangeForm = document.getElementById('password-change-form');
    const cancelPasswordChangeBtn = document.getElementById('cancel-password-change');
    
    // Récupérer les informations d'identification depuis le localStorage ou utiliser les valeurs par défaut
    let adminCredentials = JSON.parse(localStorage.getItem('adminCredentials')) || {
        username: 'admin',
        password: 'admin123'
    };
    
    // Sauvegarder les identifiants par défaut s'ils n'existent pas encore
    if (!localStorage.getItem('adminCredentials')) {
        localStorage.setItem('adminCredentials', JSON.stringify(adminCredentials));
    }
    
    // Vérifier si l'utilisateur est déjà connecté
    checkLoginStatus();
    
    // Gestion du formulaire de connexion
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            // Récupérer les identifiants actuels du localStorage
            const currentCredentials = JSON.parse(localStorage.getItem('adminCredentials'));
            
            // Vérification des identifiants
            if (username === currentCredentials.username && password === currentCredentials.password) {
                // Stocker l'état de connexion
                localStorage.setItem('adminLoggedIn', 'true');
                
                // Afficher la section des messages
                loginSection.style.display = 'none';
                messagesSection.style.display = 'block';
                
                // Charger les messages
                loadMessages();
            } else {
                alert('Identifiants incorrects. Veuillez réessayer.');
            }
        });
    }
    
    // Gestion de la déconnexion
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('adminLoggedIn');
            messagesSection.style.display = 'none';
            loginSection.style.display = 'block';
        });
    }
    
    // Filtrage par secteur
    if (filterSecteur) {
        filterSecteur.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    // Recherche dans les messages
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            applyFilters();
        });
    }
    
    // Tri des messages
    if (sortBy) {
        sortBy.addEventListener('change', function() {
            applyFilters();
        });
    }
    
    // Exportation CSV
    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', function() {
            exportToCSV();
        });
    }
    
    // Affichage des statistiques
    if (showStatsBtn) {
        showStatsBtn.addEventListener('click', function() {
            showStatistics();
        });
    }
    
    // Recherche avancée
    if (advancedSearchBtn) {
        advancedSearchBtn.addEventListener('click', function() {
            showAdvancedSearch();
        });
    }
    
    // Gestion du changement de mot de passe
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', function() {
            passwordChangeSection.style.display = 'block';
        });
    }
    
    // Annulation du changement de mot de passe
    if (cancelPasswordChangeBtn) {
        cancelPasswordChangeBtn.addEventListener('click', function() {
            passwordChangeSection.style.display = 'none';
            passwordChangeForm.reset();
        });
    }
    
    // Soumission du formulaire de changement de mot de passe
    if (passwordChangeForm) {
        passwordChangeForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const currentPassword = document.getElementById('current-password').value;
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            // Vérifier que le mot de passe actuel est correct
            if (currentPassword !== adminCredentials.password) {
                alert('Le mot de passe actuel est incorrect.');
                return;
            }
            
            // Vérifier que les nouveaux mots de passe correspondent
            if (newPassword !== confirmPassword) {
                alert('Les nouveaux mots de passe ne correspondent pas.');
                return;
            }
            
            // Vérifier que le nouveau mot de passe est suffisamment fort
            if (newPassword.length < 6) {
                alert('Le nouveau mot de passe doit contenir au moins 6 caractères.');
                return;
            }
            
            // Mettre à jour le mot de passe
            adminCredentials.password = newPassword;
            localStorage.setItem('adminCredentials', JSON.stringify(adminCredentials));
            
            alert('Mot de passe modifié avec succès.');
            passwordChangeSection.style.display = 'none';
            passwordChangeForm.reset();
        });
    }
    
    // Vérifier l'état de connexion
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        
        if (isLoggedIn) {
            loginSection.style.display = 'none';
            messagesSection.style.display = 'block';
            loadMessages();
        } else {
            loginSection.style.display = 'block';
            messagesSection.style.display = 'none';
        }
    }
    
    // Charger les messages depuis le localStorage
    function loadMessages() {
        // Récupérer les messages stockés
        const messages = getStoredMessages();
        
        // Appliquer les filtres actuels
        applyFilters();
    }
    
    // Récupérer les messages stockés
    function getStoredMessages() {
        const storedMessages = localStorage.getItem('contactMessages');
        return storedMessages ? JSON.parse(storedMessages) : [];
    }
    
    // Appliquer les filtres et la recherche
    function applyFilters() {
        const messages = getStoredMessages();
        const secteurFilter = filterSecteur.value;
        const searchTerm = searchInput.value.toLowerCase();
        const sortOption = sortBy.value;
        
        // Filtrer les messages
        const filteredMessages = messages.filter(message => {
            // Filtre par secteur
            const matchesSecteur = !secteurFilter || message.secteur === secteurFilter;
            
            // Filtre par recherche
            const matchesSearch = !searchTerm || 
                message.name.toLowerCase().includes(searchTerm) ||
                message.email.toLowerCase().includes(searchTerm) ||
                message.message.toLowerCase().includes(searchTerm) ||
                (message.phone && message.phone.toLowerCase().includes(searchTerm));
            
            return matchesSecteur && matchesSearch;
        });
        
        // Trier les messages selon l'option sélectionnée
        sortMessages(filteredMessages, sortOption);
        
        // Afficher les messages filtrés
        displayMessages(filteredMessages);
    }
    
    // Afficher les messages dans le tableau
    function displayMessages(messages) {
        // Vider le tableau
        messagesList.innerHTML = '';
        
        if (messages.length === 0) {
            // Aucun message à afficher
            messagesList.innerHTML = '';
            noMessages.style.display = 'block';
            return;
        }
        
        // Masquer le message "aucun message"
        noMessages.style.display = 'none';
        
        // Ajouter chaque message au tableau
        messages.forEach((message, index) => {
            const row = document.createElement('tr');
            
            // Formater la date
            const messageDate = new Date(message.date);
            const formattedDate = messageDate.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Créer le contenu de la ligne
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${message.name}</td>
                <td>${message.email}</td>
                <td>${message.phone || '-'}</td>
                <td>${getSecteurLabel(message.secteur)}</td>
                <td>${truncateText(message.message, 50)}</td>
                <td class="message-actions">
                    <button class="view-btn" data-index="${index}">Voir</button>
                    <button class="delete-btn" data-index="${index}">Supprimer</button>
                </td>
            `;
            
            messagesList.appendChild(row);
        });
        
        // Ajouter les écouteurs d'événements pour les boutons d'action
        addActionListeners(messages);
    }
    
    // Ajouter les écouteurs d'événements pour les boutons d'action
    function addActionListeners(messages) {
        // Boutons "Voir"
        document.querySelectorAll('.view-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                viewMessage(messages[index]);
            });
        });
        
        // Boutons "Supprimer"
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                deleteMessage(index);
            });
        });
    }
    
    // Afficher les détails d'un message
    function viewMessage(message) {
        // Créer une modal pour afficher les détails du message
        const modal = document.createElement('div');
        modal.className = 'message-modal';
        modal.style.display = 'flex';
        
        // Formater la date
        const messageDate = new Date(message.date);
        const formattedDate = messageDate.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        // Contenu de la modal
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                <h3>Message de ${message.name}</h3>
                <div class="message-details">
                    <p><strong>Date:</strong> ${formattedDate}</p>
                    <p><strong>Nom:</strong> ${message.name}</p>
                    <p><strong>Email:</strong> ${message.email}</p>
                    <p><strong>Téléphone:</strong> ${message.phone || '-'}</p>
                    <p><strong>Secteur:</strong> ${getSecteurLabel(message.secteur)}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message.message.replace(/\n/g, '<br>')}</p>
                </div>
            </div>
        `;
        
        // Ajouter la modal au document
        document.body.appendChild(modal);
        
        // Fermer la modal
        modal.querySelector('.close-modal').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        // Fermer la modal en cliquant en dehors du contenu
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    // Supprimer un message
    function deleteMessage(index) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
            // Récupérer les messages
            const messages = getStoredMessages();
            
            // Supprimer le message
            messages.splice(index, 1);
            
            // Mettre à jour le localStorage
            localStorage.setItem('contactMessages', JSON.stringify(messages));
            
            // Recharger l'affichage
            applyFilters();
        }
    }
    
    // Obtenir le libellé d'un secteur
    function getSecteurLabel(secteurValue) {
        const secteurs = {
            'industrie': 'Industrie et Production',
            'batiment': 'Bâtiment et Travaux Publics',
            'logistique': 'Logistique et Transport',
            'tertiaire': 'Tertiaire et Administratif',
            'hotellerie': 'Hôtellerie-Restauration'
        };
        
        return secteurs[secteurValue] || secteurValue;
    }
    
    // Tronquer un texte
    function truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }
    
    // Trier les messages selon l'option sélectionnée
    function sortMessages(messages, sortOption) {
        switch (sortOption) {
            case 'date-desc':
                messages.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'date-asc':
                messages.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'name':
                messages.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'secteur':
                messages.sort((a, b) => a.secteur.localeCompare(b.secteur));
                break;
            default:
                messages.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
    }
    
    // Exporter les messages en CSV
    function exportToCSV() {
        const messages = getStoredMessages();
        if (messages.length === 0) {
            alert('Aucun message à exporter.');
            return;
        }
        
        // Entêtes CSV
        let csvContent = 'Date,Nom,Email,Téléphone,Secteur,Message\n';
        
        // Ajouter chaque message
        messages.forEach(message => {
            const messageDate = new Date(message.date);
            const formattedDate = messageDate.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            // Échapper les virgules et les guillemets dans les champs
            const escapedMessage = message.message.replace(/"/g, '""').replace(/\n/g, ' ');
            const phone = message.phone || '';
            const secteur = getSecteurLabel(message.secteur);
            
            csvContent += `"${formattedDate}","${message.name}","${message.email}","${phone}","${secteur}","${escapedMessage}"\n`;
        });
        
        // Créer un objet Blob et un lien de téléchargement
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        // Configurer le lien de téléchargement
        link.setAttribute('href', url);
        link.setAttribute('download', 'messages_contacts.csv');
        link.style.visibility = 'hidden';
        
        // Ajouter le lien au document, cliquer dessus, puis le supprimer
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Afficher les statistiques des messages
    function showStatistics() {
        const messages = getStoredMessages();
        if (messages.length === 0) {
            alert('Aucun message disponible pour générer des statistiques.');
            return;
        }
        
        // Calculer les statistiques par secteur
        const secteurStats = {};
        const secteurs = {
            'industrie': 'Industrie et Production',
            'batiment': 'Bâtiment et Travaux Publics',
            'logistique': 'Logistique et Transport',
            'tertiaire': 'Tertiaire et Administratif',
            'hotellerie': 'Hôtellerie-Restauration'
        };
        
        // Initialiser les compteurs
        Object.keys(secteurs).forEach(key => {
            secteurStats[key] = 0;
        });
        
        // Compter les messages par secteur
        messages.forEach(message => {
            if (secteurStats[message.secteur] !== undefined) {
                secteurStats[message.secteur]++;
            }
        });
        
        // Créer la modal pour afficher les statistiques
        const modal = document.createElement('div');
        modal.className = 'message-modal';
        modal.style.display = 'flex';
        
        // Préparer le contenu HTML pour les statistiques
        let statsHTML = '<h3>Statistiques des messages</h3>';
        statsHTML += '<div class="stats-container">';
        statsHTML += `<p><strong>Nombre total de messages :</strong> ${messages.length}</p>`;
        statsHTML += '<h4>Répartition par secteur :</h4>';
        statsHTML += '<ul class="stats-list">';
        
        Object.keys(secteurs).forEach(key => {
            const percentage = messages.length > 0 ? (secteurStats[key] / messages.length * 100).toFixed(1) : 0;
            statsHTML += `<li>
                <div class="stat-label">${secteurs[key]}</div>
                <div class="stat-bar-container">
                    <div class="stat-bar" style="width: ${percentage}%;"></div>
                    <div class="stat-value">${secteurStats[key]} (${percentage}%)</div>
                </div>
            </li>`;
        });
        
        statsHTML += '</ul>';
        statsHTML += '</div>';
        
        // Contenu de la modal
        modal.innerHTML = `
            <div class="modal-content stats-modal-content">
                <button class="close-modal">&times;</button>
                ${statsHTML}
            </div>
        `;
        
        // Ajouter la modal au document
        document.body.appendChild(modal);
        
        // Fermer la modal
        modal.querySelector('.close-modal').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        // Fermer la modal en cliquant en dehors du contenu
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }
    
    // Afficher la recherche avancée
    function showAdvancedSearch() {
        // Créer la modal pour la recherche avancée
        const modal = document.createElement('div');
        modal.className = 'message-modal';
        modal.style.display = 'flex';
        
        // Contenu de la modal
        modal.innerHTML = `
            <div class="modal-content search-modal-content">
                <button class="close-modal">&times;</button>
                <h3>Recherche avancée</h3>
                <form id="advanced-search-form">
                    <div>
                        <label for="adv-name">Nom :</label>
                        <input type="text" id="adv-name" name="name">
                    </div>
                    <div>
                        <label for="adv-email">Email :</label>
                        <input type="text" id="adv-email" name="email">
                    </div>
                    <div>
                        <label for="adv-phone">Téléphone :</label>
                        <input type="text" id="adv-phone" name="phone">
                    </div>
                    <div>
                        <label for="adv-secteur">Secteur :</label>
                        <select id="adv-secteur" name="secteur">
                            <option value="">Tous les secteurs</option>
                            <option value="industrie">Industrie et Production</option>
                            <option value="batiment">Bâtiment et Travaux Publics</option>
                            <option value="logistique">Logistique et Transport</option>
                            <option value="tertiaire">Tertiaire et Administratif</option>
                            <option value="hotellerie">Hôtellerie-Restauration</option>
                        </select>
                    </div>
                    <div>
                        <label for="adv-date-from">Date de début :</label>
                        <input type="date" id="adv-date-from" name="dateFrom">
                    </div>
                    <div>
                        <label for="adv-date-to">Date de fin :</label>
                        <input type="date" id="adv-date-to" name="dateTo">
                    </div>
                    <div>
                        <label for="adv-keywords">Mots-clés dans le message :</label>
                        <input type="text" id="adv-keywords" name="keywords">
                    </div>
                    <button type="submit" class="search-btn">Rechercher</button>
                </form>
            </div>
        `;
        
        // Ajouter la modal au document
        document.body.appendChild(modal);
        
        // Fermer la modal
        modal.querySelector('.close-modal').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        // Fermer la modal en cliquant en dehors du contenu
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // Gérer la soumission du formulaire de recherche avancée
        const advancedSearchForm = document.getElementById('advanced-search-form');
        advancedSearchForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Récupérer les valeurs du formulaire
            const name = document.getElementById('adv-name').value.toLowerCase();
            const email = document.getElementById('adv-email').value.toLowerCase();
            const phone = document.getElementById('adv-phone').value.toLowerCase();
            const secteur = document.getElementById('adv-secteur').value;
            const dateFrom = document.getElementById('adv-date-from').value;
            const dateTo = document.getElementById('adv-date-to').value;
            const keywords = document.getElementById('adv-keywords').value.toLowerCase();
            
            // Récupérer tous les messages
            const messages = getStoredMessages();
            
            // Filtrer les messages selon les critères avancés
            const filteredMessages = messages.filter(message => {
                // Vérifier le nom
                if (name && !message.name.toLowerCase().includes(name)) {
                    return false;
                }
                
                // Vérifier l'email
                if (email && !message.email.toLowerCase().includes(email)) {
                    return false;
                }
                
                // Vérifier le téléphone
                if (phone && (!message.phone || !message.phone.toLowerCase().includes(phone))) {
                    return false;
                }
                
                // Vérifier le secteur
                if (secteur && message.secteur !== secteur) {
                    return false;
                }
                
                // Vérifier la date de début
                if (dateFrom) {
                    const messageDate = new Date(message.date);
                    const fromDate = new Date(dateFrom);
                    fromDate.setHours(0, 0, 0, 0);
                    
                    if (messageDate < fromDate) {
                        return false;
                    }
                }
                
                // Vérifier la date de fin
                if (dateTo) {
                    const messageDate = new Date(message.date);
                    const toDate = new Date(dateTo);
                    toDate.setHours(23, 59, 59, 999);
                    
                    if (messageDate > toDate) {
                        return false;
                    }
                }
                
                // Vérifier les mots-clés dans le message
                if (keywords && !message.message.toLowerCase().includes(keywords)) {
                    return false;
                }
                
                return true;
            });
            
            // Fermer la modal
            document.body.removeChild(modal);
            
            // Afficher les résultats
            displayMessages(filteredMessages);
            
            // Afficher un message indiquant le nombre de résultats
            alert(`${filteredMessages.length} message(s) trouvé(s).`);
        });
    }
});