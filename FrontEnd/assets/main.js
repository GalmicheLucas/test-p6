import { generateProjectsHead, generateProjects } from "./works.js";

// const backEnd_URL = ""

const projectsAPI = await fetch("http://localhost:5678/api/works");
const projects = await projectsAPI.json();

// selection la zone html main
const main = document.querySelector("main");

function generateMainPage() {
  //appel de la fonction

  generateIntroduction();
  generateProjectsHead();
  generateProjects(projects);
  generateContactForm();
}

generateMainPage();

const localStorage = window.localStorage.getItem("userData");
// Vérifier si l'utilisateur est connecté
if (localStorage) {
  console.log("Utilisateur connecté");

  // Création de la bannière d'édition
  const editBanner = document.createElement("div");
  editBanner.className = "edit";
  editBanner.innerHTML =
    '<p><i class="fa-regular fa-pen-to-square"></i>Mode édition</p>';
  document.body.prepend(editBanner);

  // Cacher le filtre si l'utilisateur est connecté
  const filter = document.querySelector("#filtres-container");
  if (filter) {
    filter.style.display = "none";
  }

 const logout = document.createElement("li");
 logout.innerText = 'logout';
 logout.className = 'logout';

  // Cibler l'élément <nav> actuel
  const nav = document.querySelector("#nav");

  // Création d'un nouvel élément <nav> avec le menu pour l'utilisateur connecté
  const ul = document.querySelector("#nav ul");
  const listLi = ul.getElementsByTagName("li"); // recuperation des Li 
  console.log(listLi);
  const lastLi = listLi[listLi.length - 1];
  lastLi.insertAdjacentElement("beforebegin", logout);


  // Ajouter un gestionnaire d'événement pour le logout
  logout.addEventListener("click", function (event) {
    event.preventDefault();
    // Supprimer correctement les données de l'utilisateur
    window.localStorage.removeItem("userData"); // Supprimer les données du localStorage
    window.location.href = "index.html"; // Rediriger vers la page de connexion
  });

  //
  const loginLi = ul.querySelector("li:nth-child(3)");// recuperation du li numero 3 "login"
  loginLi.style.display = "none";

  // Cibler l'élément <section> actuel
const section = document.querySelector("#projets"); 

// Création des modifications projets
const projects = document.createElement("section");
projects.id = "portfolio"; // Utilisation de 'projects' comme ID
projects.className = "projet-edition";
projects.innerHTML = `
 <h2> Mes projets</h2>
 <div class="projets">
   <i class="fa-regular fa-pen-to-square edition"></i>
   <p class="modification" id="edit-projects-button">modifier</p>
 </div>
`;

// Remplacer l'élément <section> existant par la nouvelle section
section.replaceWith(projects);

// Rendre le bouton "modifier" actif pour ouvrir la modale
const editButton = document.querySelector("#edit-projects-button");
editButton.addEventListener("click", function () {
  generateModal(); // Appelle la fonction pour afficher la modale
}); 

function generateModal() {
  // Création de l'overlay de la modale
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";
  
  const modal = document.createElement("div");
  modal.className = "modal";
  
  // En-tête de la modale avec le titre centré
  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  modalHeader.innerHTML = `
    <h2 style="text-align: center; width: 100%;">Galerie d'images</h2>
    <span class="close-modal" style="cursor: pointer;">&times;</span>
  `;

  // Corps de la modale
  const modalBody = document.createElement("div");
  modalBody.className = "modal-body";
  
  // (Contenu de la modale : Galerie d'images et bouton "Ajouter" ici)
  const addImageButton = document.createElement("button");
  addImageButton.className = "add-image-button";
  addImageButton.innerText = "Ajouter une photo";
  
  modalBody.appendChild(addImageButton);

  // Ajout des sections dans la modale
  modal.appendChild(modalHeader);
  modal.appendChild(modalBody);
  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

  // Événement pour fermer la modale via la croix
  const closeModalBtn = modalHeader.querySelector(".close-modal");
  closeModalBtn.addEventListener("click", () => {
    modalOverlay.remove(); // Ferme la modale
  });

  // Événement pour fermer la modale en cliquant sur l'overlay
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {  // Vérifie si le clic est sur l'overlay
      modalOverlay.remove(); // Ferme la modale
    }
  });
}





} else {
  console.log("Utilisateur non connecté");
}

// Create introduction section
function generateIntroduction() {
  // Create intro elements
  const introSection = document.createElement("section");
  introSection.id = "introduction";
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  img.src = "./assets/images/sophie-bluel.png";
  img.alt = "Photo de Sophie Bluel";

  let article = document.createElement("article");
  article.innerHTML = `
    <h2>Designer d'espace</h2>
    <p>Je raconte votre histoire, je valorise vos idées. Je vous accompagne de la conception à la livraison finale du chantier.</p>
    <p>Chaque projet sera étudié en commun, de façon à mettre en valeur les volumes, les matières et les couleurs dans le respect de l’esprit des lieux et le choix adapté des matériaux. Le suivi du chantier sera assuré dans le souci du détail, le respect du planning et du budget.</p>
    <p>En cas de besoin, une équipe pluridisciplinaire peut-être constituée : architecte DPLG, décorateur(trice)</p>`;

  // Append elements to the main
  figure.appendChild(img);
  introSection.appendChild(figure);
  introSection.appendChild(article);
  main.appendChild(introSection);
}

function generateContactForm() {
  const contactSection = document.createElement("section");
  contactSection.id = "contact";

  const contactHeader = document.createElement("h2");
  contactHeader.innerText = "Contact";

  const para = document.createElement("p");
  para.innerText = "Vous avez un projet ? Discutons-en !";

  //         //Creation des forms

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
            <input type="submit" value="Envoyer"> `;

  contactSection.appendChild(contactHeader);
  contactSection.appendChild(para);
  contactSection.appendChild(form);
  main.appendChild(contactSection);
}



