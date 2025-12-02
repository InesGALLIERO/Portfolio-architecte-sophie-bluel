//Sélection de la div galerie
const gallery = document.querySelector(".gallery");

//Sélection du conteneur de filtres
const filters = document.querySelector(".filters");

//Récupération des projets depuis le back-end
fetch("http://localhost:5678/api/works")
  .then(response => response.json())
  .then(galerieProjets => {

    // Affichage initial des projets
    displayProjects(galerieProjets);

    // Récupération des catégories pour créer les filtres
    fetch("http://localhost:5678/api/categories")
      .then(res => res.json())
      .then(categories => {
        displayFilters(categories, galerieProjets);
      });
  })
  .catch(error => console.error("Erreur :", error));


//Fonction pour afficher les projets dans la galerie
function displayProjects(galerieProjets) {
  gallery.innerHTML = ""; // vide la galerie avant d'ajouter

  galerieProjets.forEach(projet => {
    const figure = document.createElement("figure");
    figure.dataset.categoryId = projet.categoryId; // relie le projet à sa catégorie

    const img = document.createElement("img");
    img.src = projet.imageUrl;
    img.alt = projet.title;

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = projet.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
  });
}


//Fonction pour créer les boutons de filtre
function displayFilters(categories, galerieProjets) {
  filters.innerHTML = ""; // vide les anciens boutons

  // Bouton "Tous"
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.dataset.id = 0; // 0 = toutes les catégories
  allButton.addEventListener("click", () => filterProjects(0));
  filters.appendChild(allButton);

  // Boutons pour chaque catégorie
  categories.forEach(category => {
    const button = document.createElement("button");
    button.textContent = category.name;
    button.dataset.id = category.id;
    button.addEventListener("click", () => filterProjects(category.id));
    filters.appendChild(button);
  });
}


//Fonction pour filtrer les projets
function filterProjects(categoryId) {
  const allProjects = document.querySelectorAll(".gallery figure");

  allProjects.forEach(project => {
    const projectCategoryId = parseInt(project.dataset.categoryId);

    if (categoryId === 0 || projectCategoryId === categoryId) {
      project.style.display = "block"; // on affiche
    } else {
      project.style.display = "none";  // on cache
    }
  });
}
