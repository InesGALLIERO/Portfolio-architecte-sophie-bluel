// Sélection de la galerie dans le HTML
// On sélectionne l'élément <div class="gallery"> où les projets seront affichés
const gallery = document.querySelector(".gallery");

// Fonction principale qui démarre tout
async function getWorks() {

    // 1. Récupérer les projets depuis l'API
    const projets = await fetch("http://localhost:5678/api/works")
        .then(response => response.json());
        // fetch envoie une requête à l'API pour récupérer tous les projets
        // .then(response => response.json()) transforme la réponse JSON en tableau d'objets JavaScript

    // 2. Afficher les projets dans le DOM
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

// Lancement de la récupération des projets
getWorks();


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
    const allFigures = document.querySelectorAll(".gallery figure");
     // récupère tous les projets affichés dans la galerie

    allFigures.forEach(projet => {
        const idCategorie = parseInt(projet.dataset.categoryId);
        // récupère l'id de catégorie du projet depuis le DOM

        if (categoryId === 0 || idCategorie === categoryId) {
            projet.style.display = "block"; // si la catégorie correspond ou "Tous", on affiche
        } else {
            projet.style.display = "none"; // sinon on cache
        }
    });
}
// Lancer le programme

getWorks();

// on rappelle getWorks() pour s'assurer que les projets s'affichent au chargement
