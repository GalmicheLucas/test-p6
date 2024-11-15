import { generateProjectsHead, generateProjects } from "./works.js"; 
import { generateModal, modalAdd } from "./modal.js";

// Récupération des données de l'API pour les projets avec gestion des erreurs
async function fetchProjects() {
  try {
    const projectsAPI = await fetch("http://localhost:5678/api/works");
    if (!projectsAPI.ok) {
      throw new Error("Erreur de récupération des projets");
    }
    return await projectsAPI.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
}

// Sélection de la zone HTML principale
const main = document.querySelector("main");

// Fonction principale pour générer la page en mode déconnecté par défaut
async function generateMainPage() {
  generateIntroduction();
  generateProjectsHead();
  const projects = await fetchProjects();
  generateProjects(projects);
  generateContactForm();
}

generateMainPage();

// Vérification de l'état de connexion de l'utilisateur
const userData = window.localStorage.getItem("userData");

if (userData) {
  console.log("Utilisateur connecté");

  // Affichage de la bannière d'édition
  const editBanner = document.createElement("div");
  editBanner.className = "edit";
  editBanner.innerHTML = '<p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p>';
  document.body.prepend(editBanner);

  // Événement pour ouvrir la modale en mode édition
  editBanner.addEventListener("click", async () => {
    try {
      const worksAPI = await fetch("http://localhost:5678/api/works");
      if (!worksAPI.ok) {
        throw new Error("Erreur lors de la récupération des données des travaux");
      }
      const works = await worksAPI.json();
      console.log(works);
      generateModal(works);
    } catch (error) {
      console.error("Erreur lors de l'ouverture de la modale:", error);
    }
  });

  // Cacher le filtre pour les utilisateurs connectés
  const filter = document.querySelector("#filtres-container");
  if (filter) {
    filter.style.display = "none";
  }

  // Ajouter le bouton de déconnexion
  const logout = document.createElement("li");
  logout.innerText = 'logout';
  logout.className = 'logout';
  const nav = document.querySelector("#nav ul");
  const lastLi = nav.lastElementChild;
  lastLi.insertAdjacentElement("beforebegin", logout);

  // Gérer la déconnexion
  logout.addEventListener("click", function (event) {
    event.preventDefault();
    window.localStorage.removeItem("userData"); // Supprime les données de l'utilisateur
    window.location.href = "index.html"; // Redirige vers la page d'accueil déconnectée
  });

  // Masquer l'option "login" pour les utilisateurs connectés
  const loginLi = nav.querySelector("li:nth-child(3)");
  if (loginLi) loginLi.style.display = "none";

  // Ajouter la section de modifications pour les projets
  const section = document.querySelector("#projets"); 
  const editProjectsSection = document.createElement("section");
  editProjectsSection.id = "portfolio";
  editProjectsSection.className = "projet-edition";
  editProjectsSection.innerHTML = `
    <div class="projets">
      <h2>Mes projets</h2>
      <i class="fa-regular fa-pen-to-square edition"></i>
      <p class="modification" id="edit-projects-button">modifier</p>
    </div>
  `;

  // Remplacer l'élément <section> existant par la nouvelle section en mode édition
  if (section) section.replaceWith(editProjectsSection);

  // Activer le bouton "modifier" pour ouvrir la modale
  const editButton = document.querySelector("#edit-projects-button");
  editButton.addEventListener("click", async () => {
    try {
      const worksAPI = await fetch("http://localhost:5678/api/works");
      if (!worksAPI.ok) {
        throw new Error("Erreur lors de la récupération des données des travaux");
      }
      const works = await worksAPI.json();
      generateModal(works);
    } catch (error) {
      console.error("Erreur lors de l'ouverture de la modale:", error);
    }
  });

} else {
  console.log("Utilisateur non connecté");
}

// Fonction pour générer l'introduction
function generateIntroduction() {
  const introSection = document.createElement("section");
  introSection.id = "introduction";
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  img.src = "./assets/images/sophie-bluel.png";
  img.alt = "Photo de Sophie Bluel";

  const article = document.createElement("article");
  article.innerHTML = `
    <h2>Designer d'espace</h2>
    <p>Je raconte votre histoire, je valorise vos idées. Je vous accompagne de la conception à la livraison finale du chantier.</p>
    <p>Chaque projet sera étudié en commun, de façon à mettre en valeur les volumes, les matières et les couleurs dans le respect de l’esprit des lieux et le choix adapté des matériaux. Le suivi du chantier sera assuré dans le souci du détail, le respect du planning et du budget.</p>
    <p>En cas de besoin, une équipe pluridisciplinaire peut-être constituée : architecte DPLG, décorateur(trice).</p>`;

  figure.appendChild(img);
  introSection.appendChild(figure);
  introSection.appendChild(article);
  main.appendChild(introSection);
}

// Fonction pour générer le formulaire de contact
function generateContactForm() {
  const contactSection = document.createElement("section");
  contactSection.id = "contact";

  const contactHeader = document.createElement("h2");
  contactHeader.innerText = "Contact";

  const para = document.createElement("p");
  para.innerText = "Vous avez un projet ? Discutons-en !";

  const form = document.createElement("form");
  form.action = "#";
  form.method = "post";
  form.innerHTML = ` 
    <label for="name">Nom</label>
    <input type="text" name="name" id="name">
    <label for="email">Email</label>
    <input type="email" name="email" id="email">
    <label for="message">Message</label>
    <textarea name="message" id="message" cols="30" rows="10"></textarea>
    <input type="submit" value="Envoyer">`;

  contactSection.appendChild(contactHeader);
  contactSection.appendChild(para);
  contactSection.appendChild(form);
  main.appendChild(contactSection);
}
