// ÉTAPE 1 : SÉLECTION DES ÉLÉMENTS HTML
// On récupère tous les éléments nécessaires au fonctionnement de la modale

// Fond sombre + contenu de la modale
const modalOverlay = document.querySelector(".modal-overlay");

// Bouton "Modifier" (ouvre la modale)
const openModalBtn = document.querySelector(".btn-modifier");

// Bouton croix (ferme la modale)
const closeModalBtn = document.querySelector(".modal-close");

// Section galerie dans la modale (liste des projets)
const gallerySection = document.querySelector(".modal-gallery");

// Section formulaire (ajout d’un projet)
const formSection = document.querySelector(".modal-form");

// Bouton "Ajouter une photo" (passe de la galerie au formulaire)
const addPhotoBtn = document.querySelector(".modal-show-form");

// Flèche retour (revient du formulaire vers la galerie)
const backBtn = document.querySelector(".modal-back");

// Conteneur qui affiche les projets dans la modale
const modalGalleryList = document.querySelector(".modal-gallery-list");


// ÉTAPE 2 : OUVERTURE / FERMETURE DE LA MODALE
// Fonctions pour afficher ou cacher la modale

// Fonction pour ouvrir la modale
function openModal() {

    // On affiche la modale
    modalOverlay.style.display = "block";

    // On affiche la galerie par défaut
    gallerySection.style.display = "block";

    // On cache le formulaire
    formSection.style.display = "none";

    // On charge les projets dans la modale
    loadModalWorks();
}

// Fonction pour fermer la modale
function closeModal() {

    // On cache complètement la modale
    modalOverlay.style.display = "none";
}

// Fonction pour afficher le formulaire d’ajout
function showForm() {

    // On cache la galerie
    gallerySection.style.display = "none";

    // On affiche le formulaire
    formSection.style.display = "block";
}

// Fonction pour revenir à la galerie
function showGallery() {

    // On affiche la galerie
    gallerySection.style.display = "block";

    // On cache le formulaire
    formSection.style.display = "none";
}


// ÉTAPE 3 : GALERIE DES PROJETS DANS LA MODALE
// Chargement et affichage des projets avec une icône poubelle

// Fonction pour charger les projets dans la modale
function loadModalWorks() {

    // On récupère les projets depuis l’API
    fetchWorks().then(displayModalWorks);
}

// Fonction qui crée UN projet dans la modale (HTML)
function createModalItem(work) {

    // Création du conteneur du projet
    const item = document.createElement("div");
    item.classList.add("modal-item");

    // On stocke l’id du projet dans le HTML
    item.dataset.id = work.id;

    // Création de l’image du projet
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    // Création du bouton de suppression
    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");

    // Icône poubelle
    const icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-trash-can");

    // On met l’icône dans le bouton
    deleteBtn.appendChild(icon);

    // Suppression du projet au clic
    deleteBtn.addEventListener("click", () => {
        deleteWork(work.id, item);
    });

    // Construction du projet dans la modale
    item.appendChild(img);
    item.appendChild(deleteBtn);

    return item;
}

// Fonction qui affiche tous les projets dans la modale
function displayModalWorks(works) {

    // On vide la galerie avant d’ajouter les projets
    modalGalleryList.innerHTML = "";

    // On ajoute chaque projet dans la modale
    works.forEach(work => {
        modalGalleryList.appendChild(createModalItem(work));
    });
}

// ÉTAPE 4 : SUPPRESSION D’UN PROJET
// Suppression côté API + mise à jour de l’interface

// Fonction pour supprimer un projet
function deleteWork(id, element) {

    // Envoi de la requête DELETE vers l’API
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${getToken()}`
        }
    })
    .then(response => {

        // Si la suppression échoue
        if (!response.ok) {
            throw new Error("Erreur lors de la suppression");
        }

        // Suppression du projet dans la modale
        element.remove();

        // Suppression du projet dans la galerie principale
        const figure = document.querySelector(`figure[data-id="${id}"]`);
        if (figure) {
            figure.remove();
        }
    })
    .catch(error => {
        alert(error.message);
    });
}

// ÉTAPE 5 : AJOUT D’UN NOUVEAU PROJET
// Gestion du formulaire d’ajout

// Sélection du formulaire d’ajout
const form = document.querySelector(".add-photo-form");

// Champ image
const imageInput = form.querySelector('input[type="file"]');

// Champ titre
const titleInput = form.querySelector('input[name="title"]');

// Liste déroulante des catégories
const categorySelect = form.querySelector('select[name="category"]');

// Bouton valider
const submitBtn = form.querySelector(".submit-btn");

// PRÉVISUALISATION DE L’IMAGE
// ===============================

imageInput.addEventListener("change", () => {

    // On récupère le fichier sélectionné
    const file = imageInput.files[0];

    // Si aucun fichier n’est sélectionné, on arrête
    if (!file) return;

    // Zone d’upload dans le formulaire
    const uploadZone = form.querySelector(".upload-zone");

    // Création de l’image
    const img = document.createElement("img");

    // Affichage temporaire de l’image
    img.src = URL.createObjectURL(file);

    // Nettoyage de l’ancienne image si elle existe
    const existingImg = uploadZone.querySelector("img");
    if (existingImg) {
        existingImg.remove();
    }
    
    // Ajout dans la zone
    uploadZone.appendChild(img);

    // Activation du style CSS
    uploadZone.classList.add("has-image");

    // On vérifie le formulaire
    checkForm();
});

// Le bouton est désactivé par défaut
submitBtn.disabled = true;

// Fonction qui vérifie si le formulaire est valide
function checkForm() {

    // Vérification des champs
    const imageOk = imageInput.files.length > 0;
    const titleOk = titleInput.value.trim() !== "";
    const categoryOk = categorySelect.value !== "";

     // Si tout est valide
    if (imageOk && titleOk && categoryOk) {

        // Activation du bouton
        submitBtn.disabled = false;

        // Changement du style (bouton vert)
        submitBtn.classList.remove("disabled");
        submitBtn.classList.add("enabled");

    } else {

        // Désactivation du bouton
        submitBtn.disabled = true;

        // Bouton gris
        submitBtn.classList.remove("enabled");
        submitBtn.classList.add("disabled");
    }
}

// Vérification du formulaire à chaque changement
imageInput.addEventListener("change", checkForm);
titleInput.addEventListener("input", checkForm);
categorySelect.addEventListener("change", checkForm);

// Chargement des catégories dans le select
fetchCategories().then(categories => {

    // Option vide par défaut
    categorySelect.innerHTML = `<option value=""></option>`;

    // Ajout des catégories dans le select
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
});

// Envoi du formulaire
form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Création de l’objet FormData
    const formData = new FormData();
    formData.append("image", imageInput.files[0]);
    formData.append("title", titleInput.value);
    formData.append("category", categorySelect.value);

    // Envoi vers l’API
    fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${getToken()}`
        },
        body: formData
    })
    .then(response => response.json())
    .then(work => {

        // Ajout du projet dans la galerie principale
        document.querySelector(".gallery")
            .appendChild(createMainFigure(work));

        // Ajout du projet dans la modale
        modalGalleryList.appendChild(createModalItem(work));

        // Réinitialisation du formulaire
        form.reset();
        submitBtn.disabled = true;

        // Retour à la galerie de la modale
        showGallery();
    });
});


// ===============================
// ÉTAPE 6 : GESTION DES ÉVÉNEMENTS
// ===============================

// Ouvrir la modale
openModalBtn.addEventListener("click", openModal);

// Fermer la modale avec la croix
closeModalBtn.addEventListener("click", closeModal);

// Passer au formulaire
addPhotoBtn.addEventListener("click", showForm);

// Retour à la galerie
backBtn.addEventListener("click", showGallery);

// Fermer la modale en cliquant sur le fond sombre
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) {
        closeModal();
    }
});