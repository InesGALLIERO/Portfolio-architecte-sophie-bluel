// Sélection de la galerie dans le HTML
// On sélectionne l'élément <div class="gallery"> où les projets seront affichés
const gallery = document.querySelector(".gallery");

// Fonction principale qui démarre tout
async function getWorks() {

    // 1. Récupérer les projets depuis l'API
    const response = await fetch("http://localhost:5678/api/works");
    const projets = await response.json();
        // fetch envoie une requête à l'API pour récupérer tous les projets
        // .then(response => response.json()) transforme la réponse JSON en tableau d'objets JavaScript

    // 2. Afficher les projets dans le DOM
    allProjects = projets; // on garde tous les projets en mémoire
    displayProjects(projets);
     // On appelle la fonction displayProjects pour créer les éléments HTML et les ajouter à la galerie}
}
// Fonction d’affichage des projets
function displayProjects(listeDeProjets) {

    gallery.innerHTML = ""; // on vide la galerie avant d’ajouter les nouveaux projets

    listeDeProjets.forEach(projet => {
        // On parcourt chaque projet un par un

        // Création des éléments
        const figure = document.createElement("figure");
        figure.dataset.categoryId = projet.categoryId; 
        // On stocke l'id de la catégorie dans l'attribut data-category-id
        // Cela servira pour le filtrage plus tard

        const img = document.createElement("img");
        img.src = projet.imageUrl; // source de l'image
        img.alt = projet.title; // texte alternatif pour l'image

        const caption = document.createElement("figcaption");
        caption.textContent = projet.title; // titre du projet

        // Construction : on met l'image et le titre dans le <figure>
        figure.appendChild(img);
        figure.appendChild(caption);

        // On ajoute le <figure> complet dans la galerie
        gallery.appendChild(figure);
    });
}


// Sélection des filtres dans le HTML
const filters = document.querySelector(".filters")
// On sélectionne l'élément <div class="filters"> où les boutons seront ajouté


// Récupérer les catégories depuis l'API
function Categories(){
    fetch("http://localhost:5678/api/categories")
    .then(response => response.json())
    .then(categories => {
        console.log(categories); // pour vérifier dans la console que les catégories sont bien récupérées
        displayBouton(categories); // on appelle la fonction pour créer les boutons de filtre 
    });  
}
Categories(); // on lance la récupération des catégories

//Fonction pour créer les boutons de filtre
function displayBouton (categories){

    //creation du bouton tous 
    const btnTous = document.createElement("button");
    btnTous.textContent = "tous";
    filters.appendChild(btnTous); // on ajoute le bouton à la div des filtres

    //Ajouter le clic pour afficher tous le projet
     btnTous.addEventListener("click", () => {
        filterProjects(0); // // 0 signifie "afficher tous les projets"
    });


    //Création des boutons pour chaque catégorie 
    categories.forEach(categorie => {
        const button = document.createElement("button");
        button.textContent = categorie.name; // nom de la catégorie
        filters.appendChild(button);  // ajout du bouton à la div des filtres

    
    // Ajouter le clic pour filtrer les projets
        button.addEventListener("click", () => {
            filterProjects(categorie.id); // envoie l'id de la catégorie à la fonction de filtrage
        });
       
    })
}

// Fonction pour filtrer les projets affichés

function filterProjects(categoryId) {

    // Cas 1 : bouton "Tous"
    if (categoryId === 0) {
        displayProjects(allProjects);
        return;
    }

    // Cas 2 : filtrer par catégorie
    const projetsFiltres = allProjects.filter(projet => {
        return projet.categoryId === categoryId;
    });

    // Afficher uniquement les projets filtrés
    displayProjects(projetsFiltres);
}

// Lancer le programme

getWorks();

// on rappelle getWorks() pour s'assurer que les projets s'affichent au chargement


// Vérifier si l'utilisateur est connecté
//localStorage = mémoie du navigateur // "token" le nom sous lequel on a sauvegarder le token 
// cette ligne récupère le token s’il existe sinon elle renvoie null
// token = clé secrete donnée par le serveur quand l'utilisateur se connecte 
const token = localStorage.getItem("token");

// si token existe => l'utilisateur est connecte si le token n'existe pas on ne fait rien 
if (token) {
    // 1. Cacher les filtres
    //on cherche la div qui contient les boutons de filtres
    const filters = document.querySelector(".filters");

    if (filters) { //on vérifie que la div existe 
        filters.style.display = "none"; // on cache les filtres, en mode admin les filtres ne doivent pas s'afficher
    }

    // 2. Changer "login" en "logout"
    const loginLink = document.querySelector('a[href="login.html"]'); //selection du lien qui méne à lapage login
    if (loginLink) { // on vérifie qu'il existe 
        loginLink.textContent = "logout"; // on change le texte du lien, l'utilisateur voit maintenant logout

        // 3. Gérer la déconnexion
        loginLink.addEventListener("click", (event) => { //on écoute le clic sur logout
            event.preventDefault(); // empêce d'aller sur la page login 
            localStorage.removeItem("token"); // suppression du token, l'utilisateur est déconnecté 
            window.location.reload(); // on recharge la page, il n'y a plus de token donc les filtres reviennent, logout redevient login le mode édition disparait
        });
    }

    // 4. Afficher le bandeau "mode édition"
    const header = document.querySelector("header"); //on récupère le header du site 

    const editBanner = document.createElement("div"); //on crée une nouvelle div
    editBanner.textContent = "Mode édition"; //Texte affiché 
    editBanner.style.backgroundColor = "black"; //fond noir
    editBanner.style.color = "white"; //texte blanc
    editBanner.style.textAlign = "center"; //centré
    editBanner.style.padding = "10px";

    document.body.insertBefore(editBanner, header); //On place le bandeau au-dessus du header
}
