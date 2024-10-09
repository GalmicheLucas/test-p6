const worksAPI = await fetch("http://localhost:5678/api/works");
const works = await worksAPI.json();


export function generateModal() {
    // Création de l'overlay de la modale
    const modalOverlay = document.createElement("div");
    modalOverlay.className = "modal-overlay";
    
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML =  ` `
    // En-tête de la modale avec le titre centré
    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";
    modalHeader.innerHTML = `
      <p style="text-align: center; width: 100%; font-family: work sans; color: black; font-weight: 400; font-size: 25px;">Galerie d'images</p><hr>
      <span class="close-modal" style="cursor: pointer;">&times;</span>
       
    `;
  
    // Corps de la modale
   
    const modalBody = document.createElement("div");
    modalBody.className = "modal-body";
    modalBody.id = "modal-body";
    
    function displayProjects(works) {
      works.forEach(project => { // Ici, on utilise 'project' et non 'works'
          const worksTile = document.createElement("figure");
          worksTile.dataset.id = project.id; // Utilise 'project' pour accéder aux propriétés de l'objet
          worksTile.dataset.cat = project.categoryId;
          worksTile.className = "modale-img"
  
          worksTile.innerHTML = `
              <img src="${project.imageUrl}" alt="${project.title}">
          `;
          document.querySelector("#modal-body").appendChild(worksTile);
  
          console.log(project); // Vérifie que les projets sont bien reçus
          console.log(worksTile); // Vérifie que chaque projet est bien créé
      });
  }
  
  
    // Ajout des sections dans la modale
    modal.appendChild(modalHeader);
    modal.appendChild(modalBody);
    modalOverlay.appendChild(modal);
    document.body.appendChild(modalOverlay);
  
     // Création du conteneur pour le bouton
const buttonContainer = document.createElement("div");
buttonContainer.className = "button-container";

// Création du bouton "Ajouter une photo"
const addImageButton = document.createElement("button");
addImageButton.className = "add-image-button";
addImageButton.innerText = "Ajouter une photo";

// Ajoute le bouton dans le conteneur
buttonContainer.appendChild(addImageButton);

// Ajoute le conteneur du bouton à la modale
modal.appendChild(buttonContainer);
      // Appel de la fonction pour afficher les projets
      displayProjects(works);


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

















//   function GenerateGalleryModale (){
//     document.querySelector()
//     .innerHTML = `
//     <div id="modal-window">
//     <i id=closingX" class="fa-solid fa-xmark"></i>
//     <h4 id="modale-title">Galerie photo</h4>
//     <div id="miniatures"></div>
//     <div class="separator"></div>
//     <button id="modal-btn" class"main-btn">Ajputer une photo</button>
//     <p id="modale-trash">Supprimer la galerie</p>
//     </div>`;
    
// //Bloc Projet
// function generateModalProject(Projet) {

//   Projet.forEach(projet => {

//     const minitile = document.createElement("div");
//     minitile.dataset.id = `miniature-${projet.id}`;
//     minitile.classList.add("miniature")
//     minitile.innerHTML = `
//     <figure id="modale-mini-fig-${projet.id}" class="miniature-fig">
//     <img src="${projet.imageUrl}" crossorigin="anonymous">
//     <i class="fa-solid fa-arrows-up-down-left-right"></i>
//     <i id="trash-${projet.id}" type="button" class="fa-solid fa-trash-can"></i>
//     </figure>
//     <p>éditer</p>
//     `;

//     document.querySelector("miniatures").appendChild(minitile);

//   })
// }


//   }