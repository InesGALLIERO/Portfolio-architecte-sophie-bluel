// ===============================
// ÉTAPE 1 : VARIABLES GLOBALES
// Ces variables sont utilisées dans tout le fichier
// ===============================

// On sélectionne la galerie principale dans le HTML
// C’est ici que les projets seront affichés
const gallery = document.querySelector(".gallery");

// On sélectionne la div qui contient les boutons de filtres
const filters = document.querySelector(".filters");

// Tableau qui va contenir TOUS les projets récupérés depuis l’API
// On le garde en mémoire pour pouvoir filtrer plus tard
let allProjects = [];


// ===============================
// ÉTAPE 2 : FONCTIONS API PARTAGÉES
// Ces fonctions servent à communiquer avec le serveur (API)
// ===============================

// Fonction qui récupère tous les projets depuis l’API
async function fetchWorks() {
    // fetch envoie une requête à l’API pour demander les projets
    const response = await fetch("http://localhost:5678/api/works");

    // On transforme la réponse du serveur en JavaScript (JSON)
    return await response.json();
}

// Fonction qui récupère toutes les catégories depuis l’API
async function fetchCategories() {
    // Requête vers l’API pour récupérer les catégories
    const response = await fetch("http://localhost:5678/api/categories");

    // Transformation de la réponse en tableau JavaScript
    return await response.json();
}

// Fonction qui récupère le token stocké dans le navigateur
// Le token permet de savoir si l’utilisateur est connecté
function getToken() {
    return localStorage.getItem("token");
}


// ===============================
// ÉTAPE 3 : GALERIE PRINCIPALE
// Affichage des projets sur la page d’accueil
// ===============================

// Fonction principale pour charger les projets
async function getWorks() {
    // On récupère tous les projets depuis l’API
    allProjects = await fetchWorks();

    // On affiche tous les projets dans la galerie
    displayProjects(allProjects);
}

// Fonction qui affiche les projets dans le HTML
function displayProjects(projects) {

    // On vide la galerie avant d’ajouter les projets
    // Cela évite les doublons
    gallery.innerHTML = "";

    // On parcourt chaque projet un par un
    projects.forEach(project => {

        // Création de la balise <figure> pour un projet
        const figure = document.createElement("figure");

        // On stocke l’id du projet dans le HTML (utile pour la suppression)
        figure.dataset.id = project.id;

        // On stocke l’id de la catégorie (utile pour le filtrage)
        figure.dataset.categoryId = project.categoryId;

        // Création de l’image du projet
        const img = document.createElement("img");
        img.src = project.imageUrl; // image venant de l’API
        img.alt = project.title;    // texte alternatif (accessibilité)

        // Création du titre du projet
        const caption = document.createElement("figcaption");
        caption.textContent = project.title;

        // On ajoute l’image et le titre dans le <figure>
        figure.appendChild(img);
        figure.appendChild(caption);

        // On ajoute le <figure> complet dans la galerie
        gallery.appendChild(figure);
    });
}

// ===============================
// FONCTION POUR CRÉER UN PROJET
// DANS LA GALERIE PRINCIPALE
// ===============================

function createMainFigure(work) {

    // Création de la balise <figure>
    const figure = document.createElement("figure");

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

    // On retourne le <figure> prêt à être ajouté
    return figure;
}


// ===============================
// ÉTAPE 4 : FILTRES PAR CATÉGORIE
// Création et gestion des boutons de filtres
// ===============================

// Fonction qui crée les boutons de filtres
function displayButtons(categories) {

    // On vide les filtres avant d’en ajouter
    filters.innerHTML = "";

    // Création du bouton "Tous"
    const btnAll = document.createElement("button");
    btnAll.textContent = "Tous";

    // On met le bouton "Tous" actif par défaut
    btnAll.classList.add("active");

    // On ajoute le bouton dans la div des filtres
    filters.appendChild(btnAll);

    // Au clic sur "Tous", on affiche tous les projets
    btnAll.addEventListener("click", () => {
        displayProjects(allProjects);
        setActiveButton(btnAll);
    });

    // Création d’un bouton pour chaque catégorie
    categories.forEach(category => {

        const button = document.createElement("button");
        button.textContent = category.name; // nom de la catégorie

        // Ajout du bouton dans la div des filtres
        filters.appendChild(button);

        // Filtrage des projets au clic
        button.addEventListener("click", () => {

            // On filtre les projets selon l’id de la catégorie
            const filtered = allProjects.filter(project => {
                return project.categoryId === category.id;
            });

            // On affiche uniquement les projets filtrés
            displayProjects(filtered);

            // On met le bouton actif
            setActiveButton(button);
        });
    });
}

// Fonction pour gérer le bouton actif (style CSS)
function setActiveButton(activeButton) {

    // On sélectionne tous les boutons de filtres
    const buttons = document.querySelectorAll(".filters button");

    // On enlève la classe active de tous les boutons
    buttons.forEach(btn => {
        btn.classList.remove("active");
    });

    // On ajoute la classe active au bouton cliqué
    activeButton.classList.add("active");
}


// ===============================
// ÉTAPE 5 : MODE ADMIN
// Affichage des éléments réservés à l’admin
// ===============================

// On récupère le token pour savoir si l’utilisateur est connecté
const token = getToken();

// Si le token existe, alors l’utilisateur est connecté
if (token) {

    // On cache les filtres (non visibles en mode admin)
    if (filters) {
        filters.style.display = "none";
    }

    // On sélectionne le lien "login"
    const loginLink = document.querySelector('a[href="login.html"]');

    if (loginLink) {

        // On change le texte "login" en "logout"
        loginLink.textContent = "logout";

        // Gestion de la déconnexion
        loginLink.addEventListener("click", (e) => {
            e.preventDefault(); // empêche la redirection
            localStorage.removeItem("token"); // suppression du token
            window.location.reload(); // recharge la page
        });
    }

    // Création du bandeau "Mode édition"
    const header = document.querySelector("header");
    const banner = document.createElement("div");

    banner.innerHTML = `
        <i class="fa-regular fa-pen-to-square"></i>
        <span>Mode édition</span>
    `;

    // Styles du bandeau
    banner.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        background: black;
        color: white;
        padding: 10px;
    `;

    // On ajoute le bandeau au-dessus du header
    document.body.insertBefore(banner, header);

    // Affichage du bouton "Modifier"
    const editBtn = document.querySelector(".btn-modifier");
    if (editBtn) {
        editBtn.style.display = "block";
    }
}


// ===============================
// ÉTAPE 6 : LANCEMENT DU SCRIPT
// ===============================

// Chargement des catégories et création des filtres
fetchCategories().then(displayButtons);

// Chargement et affichage des projets
getWorks();