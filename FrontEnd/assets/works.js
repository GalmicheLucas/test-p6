// Fetch des projets
let projects = [];
let categories = [];

try {
  const projectsAPI = await fetch("http://localhost:5678/api/works");
  if (!projectsAPI.ok) throw new Error(`Erreur HTTP ${projectsAPI.status}`);
  projects = await projectsAPI.json();
  console.log(projects);
} catch (error) {
  console.error("Erreur lors du chargement des projets :", error);
}

// Fetch des catégories
try {
  const categoriesAPI = await fetch("http://localhost:5678/api/categories");
  if (!categoriesAPI.ok) throw new Error(`Erreur HTTP ${categoriesAPI.status}`);
  categories = await categoriesAPI.json();
  console.log(categories);
} catch (error) {
  console.error("Erreur lors du chargement des catégories :", error);
}

// Sélection de l'élément principal
const main = document.querySelector("main");

export function generateProjectsHead() {
  // Création de la section pour les projets
  const projectSection = document.createElement("section");
  projectSection.id = "portfolio";
  projectSection.innerHTML = `
        <h2 id="projets">Mes projets</h2>
        <div id="filtres-container">
            <button id="0" class="filtre-cat">Tous</button>
        </div>
        <div class="gallery">  
        </div>`;
  main.appendChild(projectSection);

  // Génération des boutons de filtres pour les catégories
  if (categories.length > 0) {
    categories.forEach((category) => {
      const filtreCat = document.createElement("button");
      filtreCat.id = category.id;
      filtreCat.classList.add("filtre-cat");
      filtreCat.innerText = category.name;
      document.querySelector("#filtres-container").appendChild(filtreCat);
    });
  } else {
    console.warn("Aucune catégorie trouvée.");
  }

  // Ajout des événements pour les filtres
  const filtersBtns = document.querySelectorAll(".filtre-cat");

  filtersBtns.forEach((filterCat) => {
    filterCat.addEventListener("click", () => {
      const filteredProjects = projects.filter((project) => {
        return project.categoryId == filterCat.id;
      });
      !!+filterCat.id
        ? generateProjects(filteredProjects)
        : generateProjects(projects);
    });
  });
}

// Création des projets dans la galerie
export function generateProjects(projects) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // Réinitialiser la galerie

  if (projects.length > 0) {
    projects.forEach((project) => {
      const projectTile = document.createElement("figure");
      projectTile.id = `work-${project.id}`;
      projectTile.dataset.id = project.id;
      projectTile.dataset.cat = project.categoryId;

      projectTile.innerHTML = `
                <img src="${project.imageUrl}" alt="${project.title}">
                <figcaption>${project.title}</figcaption>`;
      gallery.appendChild(projectTile);
    });
  } else {
    gallery.innerHTML = `<p>Aucun projet disponible.</p>`;
  }
}
