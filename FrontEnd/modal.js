//Une modal est une fenêtre qui s'ouvre par dessus la page, le reste de la page devient grisé/bloqué

// Sélection des éléments
const openModalBtn = document.querySelector(".btn-modifier"); //bouton "Modifier",quand on cliquera dessus = la modale s'ouvrira
const closeModalBtn = document.querySelector(".modal-close"); //on récupère le bouton croix, il sert à fermer la modale
const modalOverlay = document.querySelector(".modal-overlay"); // fond sombre + modale entière

const gallerySection = document.querySelector(".modal-gallery"); // zone galerie admin dans la modale (liste des projet miniatures)
const formSection = document.querySelector(".modal-form"); // zone formulaire, sert à ajouter un nouveau projet
const addPhotoBtn = document.querySelector(".modal-show-form"); // bouton "Ajouter une photo", il sert à passer de la galerie au fomulaire 
const backBtn = document.querySelector(".modal-back"); // flèche retour vers la galerie, sert à revenir du formulaire vers la galerie

// ------------------------
// Fonctions pour ouvrir/fermer/bascule
// ------------------------

// Ouvrir la modale
function openModal() { //Fonction appemée quand on clique sur Modifier 
    modalOverlay.style.display = "block"; // rendre la modale visible
    gallerySection.style.display = "block"; // afficher la galerie par defaut
    formSection.style.display = "none"; // cacher le formulaire
}

// Fermer la modale
function closeModal() { //fonction pour fermer la modale 
    modalOverlay.style.display = "none"; // cacher la modale (fond sombre + modale)
}

// Afficher le formulaire et cacher la galerie
function showForm() { // fonction appelée quand on clique sur Ajouter une photo
    gallerySection.style.display = "none"; // on cache la galerie
    formSection.style.display = "block"; // on affiche le formulaire 
}

// Retourner à la galerie
function showGallery() { //fonction appelée quand on clique sur la fléche retour 
    gallerySection.style.display = "block"; // on réaffiche la galerie 
    formSection.style.display = "none"; // On cache le formulaire
}

// ------------------------
// Événements
// ------------------------

// Clic sur le bouton "Modifier" pour ouvrir la modale
openModalBtn.addEventListener("click", openModal); // quand on clique sur modifier, on appelle openModal

// Clic sur la croix pour fermer
closeModalBtn.addEventListener("click", closeModal); // cliquer sur la croix = la modale se ferme 

// Clic sur le fond sombre pour fermer
modalOverlay.addEventListener("click", function(event) {
    // On ne ferme la modale que si on clique sur le fond et pas sur le contenu
    if (event.target === modalOverlay) {
        closeModal();
    }
});

// Clic sur "Ajouter une photo" pour afficher le formulaire
addPhotoBtn.addEventListener("click", showForm);

// Clic sur la flèche retour pour revenir à la galerie
backBtn.addEventListener("click", showGallery);




//étape 7 supprimez des travaux existants 
//1.Récupérer les projets dans la modale
// Zone où on affichera les projets dans la modale
const modalGalleryList = document.querySelector(".modal-gallery-list");
// Fonction pour charger les projets dans la modale On crée une fonction elle s’exécutera quand on l’appellera (ex : à l’ouverture de la modale)
function loadModalWorks() {
    //fetch envoie une requête à l'API "donne-moi la liste de tous les projets" C’est la même API que pour la galerie principale
    fetch("http://localhost:5678/api/works")
        .then(response => response.json()) //Quand l’API répond, la réponse arrive sous forme brute, .json() la transforme en objet JavaScript
        .then(works => { //works est la liste des projets reçus, c'est un tableau de projets
            displayModalWorks(works); //On envoie la liste des projets à une autre fonction, cette fonction va crée le HTML et afficher les projets dans la modale 
        });
}
//2.Afficher chaque projet avec une poubelle
function displayModalWorks(works) { //On crée une fonction, works est la liste des projets 
    modalGalleryList.innerHTML = ""; // On vide la modale avant d’ajouter les projets

    works.forEach(work => { //On parcourt chaque projet un par un
        const item = document.createElement("div");// on crée une div elle représentera un projet dans la modale
        item.classList.add("modal-item");//On ajoute une clase CSS, pour le style (taille, position, etc.)
        item.dataset.id = work.id; // stocke l’id du projet dans le HTML

        const img = document.createElement("img");//on crée une image 
        img.src = work.imageUrl;//On met l'image du projet dedans
        img.alt = work.title;//Texte alternatif(accessibilité)

        const deleteBtn = document.createElement("button");//On crée un bouton
        deleteBtn.textContent = "🗑️";//Le bouton affiche une poubelle 
        deleteBtn.classList.add("delete-btn");//Classe CSS pour styliser le bouton

        // clic sur la poubelle
        deleteBtn.addEventListener("click", () => { //On écoute le clic sur la poubelle
            deleteWork(work.id, item); //On appelle une fonction deleteWork, work.id => l'id du projet à supp, item => l'élément HTML à enlever du DOM
        });

        item.appendChild(img);// On met l'image dans la div du projet
        item.appendChild(deleteBtn);//On met la poubelle dans la div
        modalGalleryList.appendChild(item);//On ajoute le projet dans la modale
    });
}

// 3. Supprimer le projet via l’API (DELETE)
// DELETE /works/{id}
function deleteWork(workId, domElement) { 
    // On crée une fonction deleteWork
    // workId = l’id du projet à supprimer
    // domElement = l’élément HTML à retirer de la page

    const token = localStorage.getItem("token"); 
    // On récupère le token stocké dans le localStorage
    // Le token prouve que l'utilisateur est connecté (admin)

    fetch(`http://localhost:5678/api/works/${workId}`, {
        // On envoie une requête vers l’API
        // ${workId} permet de viser exactement le projet à supprimer

        method: "DELETE", 
        // DELETE = méthode HTTP pour supprimer une donnée

        headers: {
            Authorization: `Bearer ${token}` 
            // On envoie le token dans les headers
            // "Bearer" signifie : "voici mon autorisation"
        }
    })
    .then(response => {
        // On récupère la réponse du serveur

        if (!response.ok) {
            // Si la suppression a échoué
            throw new Error("Erreur lors de la suppression");
            // On déclenche une erreur
        }

        // Si la suppression a réussi :

        domElement.remove(); 
        // On supprime le projet de la modale (DOM)

        removeFromMainGallery(workId); 
        // On supprime aussi le projet de la galerie principale
    })
    .catch(error => {
        // Si une erreur survient (token invalide, serveur, etc.)

        alert(error.message); 
        // On affiche un message d’erreur à l’utilisateur
    });
}
// 4. Supprimer aussi dans la galerie principale
function removeFromMainGallery(workId) {
    // On crée une fonction removeFromMainGallery
    // workId = l’id du projet qui vient d’être supprimé côté API

    const figures = document.querySelectorAll(".gallery figure");
    // On sélectionne toutes les balises <figure> dans la galerie principale
    // Chaque <figure> représente un projet affiché sur la page

    figures.forEach(figure => {
        // On parcourt chaque figure une par une

        if (figure.dataset.id == workId) {
            // On compare l’id stocké dans le HTML (data-id)
            // avec l’id du projet supprimé

            figure.remove();
            // Si les ids correspondent :
            // → on supprime ce projet du DOM (de la page)
        }
    });
}
// 5. Charger la modale quand elle s’ouvre
function openModal() {
    // On crée une fonction openModal
    // Son rôle : ouvrir la fenêtre modale

    modalOverlay.style.display = "block";
    // On affiche le fond sombre + la modale
    // "block" = visible à l’écran

    gallerySection.style.display = "block";
    // On affiche la partie "galerie" de la modale
    // (celle avec les projets et les poubelles)

    formSection.style.display = "none";
    // On cache la partie "formulaire"
    // (celle pour ajouter un nouveau projet)

    loadModalWorks(); // ← très important
    // On appelle la fonction loadModalWorks
    // Elle va :
    // 1. Récupérer les projets depuis l’API
    // 2. Les afficher dans la modale
}

//étape 8 ajout d'un projet

// Sélection des éléments du formulaire
const form = document.querySelector(".modal-form form"); 
// On récupère le formulaire d’ajout de projet dans la modale
const imageInput = form.querySelector('input[type="file"]'); 
// Champ pour sélectionner une image
const titleInput = form.querySelector('input[name="title"]'); 
// Champ pour le titre du projet
const categorySelect = form.querySelector('select[name="category"]'); 
// Liste déroulante des catégories
const previewContainer = document.createElement("div"); 
// Div qui contiendra la preview de l’image
imageInput.parentNode.insertBefore(previewContainer, imageInput.nextSibling);
// On place la preview juste après le champ image

// Récupérer les catégories depuis l'API 
function loadCategories() { //Cette fonction sert à récupérer la liste des catégories
    fetch("http://localhost:5678/api/categories") // fetch envoie une requête à l’API pour demander les catégories
        .then(response => response.json())//Quand l’API répond, la réponse arrive au format "brut",.json() permet de transformer cette réponse en objet JavaScript
        .then(categories => {//"categories" est maintenant un tableau de catégories
            categorySelect.innerHTML = "";// On vide le select avant d’ajouter
            
            categories.forEach(category => {// On parcourt chaque catégorie une par une
                const option = document.createElement("option");// On crée une balise <option> pour le <select>
                option.value = category.id; // // value = id de la catégorie (ce que l’API attend)
                option.textContent = category.name; // Texte affiché à l’utilisateur
                categorySelect.appendChild(option);  // On ajoute l’option dans le select
            });
        });
}
loadCategories();// On appelle la fonction pour charger les catégories dès le chargement

// Preview de l’image sélectionnée
// ------------------------
imageInput.addEventListener("change", () => {// On écoute le changement sur le champ "image"
    const file = imageInput.files[0];// On récupère le fichier choisi par l’utilisateur
    if (!file) return;// S’il n’y a pas de fichier, on arrête

    const reader = new FileReader();// FileReader permet de lire un fichier image

    reader.onload = function (event) {// Cette fonction s’exécute quand le fichier est lu
        previewContainer.innerHTML = "";// On vide l’ancienne preview

        const img = document.createElement("img");// On crée une balise <img>
        img.src = event.target.result;// src = contenu de l’image lue
        img.style.maxWidth = "100%";// On limite la taille pour éviter les images trop grandes

        previewContainer.appendChild(img);// On affiche l’image dans la modale
    };

    reader.readAsDataURL(file);// On transforme le fichier en image lisible
});

// Envoi du formulaire
// ------------------------
form.addEventListener("submit", function (event) {// On écoute l’envoi du formulaire
    event.preventDefault();// Empêche le rechargement de la page

    // Récupération des valeurs du formulaire
    const image = imageInput.files[0];
    const title = titleInput.value.trim();// trim enlève les espaces inutiles
    const category = categorySelect.value;

    // Vérification : tous les champs doivent être remplis
    if (!image || !title || !category) {
        alert("Veuillez remplir tous les champs");
        return;
    }

    const token = localStorage.getItem("token");// On récupère le token de l’utilisateur connecté
    

    const formData = new FormData();// FormData permet d’envoyer des fichiers

     // On ajoute chaque information attendue par l’API
    formData.append("image", image);
    formData.append("title", title);
    formData.append("category", category);

    fetch("http://localhost:5678/api/works", {// Envoi des données vers l’API
        method: "POST",// POST = ajouter un nouvel élément
        headers: {
            Authorization: `Bearer ${token}`// Autorisation avec le token (obligatoire)
        },
        body: formData
    })
    // Vérification de la réponse du serveur
    .then(response => {
        if (!response.ok) {
            throw new Error("Erreur lors de l’ajout");
        }
        // On transforme la réponse en objet JavaScript
        return response.json();
    })
    .then(newWork => {
        // Étape 8.2 → mise à jour dynamique
        addWorkToMainGallery(newWork);// Ajout du projet dans la galerie principale
        addWorkToModalGallery(newWork);// Ajout du projet dans la galerie de la modale

        form.reset();// Réinitialisation du formulaire

        previewContainer.innerHTML = "";// Suppression de la preview
        showGallery(); // retour à la galerie de la modale
    })
    // Gestion des erreurs
    .catch(error => {
        alert(error.message);
    });
});

function addWorkToMainGallery(work) {
    const gallery = document.querySelector(".gallery");// On récupère la galerie principale

    const figure = document.createElement("figure");// Création de la balise <figure>

    // On stocke les informations utiles dans le HTML
    figure.dataset.id = work.id;
    figure.dataset.categoryId = work.categoryId;

    // Création de l’image
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    // Création du titre
    const caption = document.createElement("figcaption");
    caption.textContent = work.title;

    // Construction du <figure>
    figure.appendChild(img);
    figure.appendChild(caption);

    // Ajout à la galerie
    gallery.appendChild(figure);
}
// Ajouter le projet dans la galerie de la modale
function addWorkToModalGallery(work) {

    // Création du conteneur du projet
    const item = document.createElement("div");
    item.classList.add("modal-item");
    item.dataset.id = work.id;

    // Image du projet
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    // Bouton poubelle
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.classList.add("delete-btn");

    // Suppression du projet au clic
    deleteBtn.addEventListener("click", () => {
        deleteWork(work.id, item);
    });

    // Construction du bloc
    item.appendChild(img);
    item.appendChild(deleteBtn);

    // Ajout dans la galerie de la modale
    modalGalleryList.appendChild(item);
}