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