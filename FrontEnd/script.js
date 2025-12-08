// Sélection de la galerie dans le HTML
const gallery = document.querySelector(".gallery");

// Fonction principale qui démarre tout
async function init() {

    // 1. Récupérer les projets depuis l'API
    const projets = await fetch("http://localhost:5678/api/works")
        .then(response => response.json());

    // 2. Afficher les projets dans le DOM
    displayProjects(projets);
}

// Fonction d’affichage des projets
function displayProjects(listeDeProjets) {

    gallery.innerHTML = ""; // on vide la galerie

    listeDeProjets.forEach(projet => {

        // Création des éléments
        const figure = document.createElement("figure");

        const img = document.createElement("img");
        img.src = projet.imageUrl;
        img.alt = projet.title;

        const caption = document.createElement("figcaption");
        caption.textContent = projet.title;

        // Construction
        figure.appendChild(img);
        figure.appendChild(caption);

        gallery.appendChild(figure);
    });
}

// Lancement de init()
init();
