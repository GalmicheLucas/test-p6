// Récupération des catégories depuis l'API
const catApi = await fetch("http://localhost:5678/api/categories");
const categories = await catApi.json(); // Changement de 'cat' à 'categories' pour plus de clarté

// Récupération des projets depuis l'API
const worksAPI = await fetch("http://localhost:5678/api/works");
const works = await worksAPI.json();

export function generateModal() {
  // Création de l'overlay de la modale
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal";

  // En-tête de la modale avec le titre centré
  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  modalHeader.innerHTML = `
      <p>Galerie d'images</p>
      <span class="close-modal" style="cursor: pointer;">&times;</span>
    `;

  // Corps de la modale
  const modalBody = document.createElement("div");
  modalBody.className = "modal-body";
  modalBody.id = "modal-body";

  // Fonction pour afficher les projets
  function displayProjects(works) {
    works.forEach((project) => {
      const worksTile = document.createElement("figure");
      worksTile.dataset.id = project.id;
      worksTile.dataset.cat = project.categoryId;
      worksTile.className = "modale-img";

      worksTile.innerHTML = `
                <div class="image-container" style="position: relative;">
                    <img src="${project.imageUrl}" alt="${project.title}" style="width: 100%; display: block;">
                    <i id="trash-${project.id}" type="button" class="fa-solid fa-trash-can trash-icon"></i>
                </div>
            `;
      modalBody.appendChild(worksTile);

      // Ajout de l'event listener sur l'icône de la corbeille après la création de l'élément
      const localStorage = window.localStorage.getItem("userData");
      const trashIcon = worksTile.querySelector(`#trash-${project.id}`);
      trashIcon.addEventListener("click",  () => {
        console.log(project.id);
        

        const url = `http://localhost:5678/api/works/${project.id}`;
        const token = JSON.parse(window.localStorage.getItem("userData")).token;

        // Remove image
        const requestInfos = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        };
        fetch(url, requestInfos)
          .then((response) => {
            if (response.ok) {
              console.log(
                `Projet avec l'ID ${project.id} supprimé avec succès.`
              );
              // Supprimer l'élément du DOM après une suppression réussie
              worksTile.remove();
            } else {
              throw new Error(`Http error: ${response.status}`);
            }
          })
          .catch((error) => {
            console.log("Error:", error);
          });
      });
    });
  }

  // Appel de la fonction pour afficher les projets
  displayProjects(works);

  // Ajout des sections dans la modale
  modal.appendChild(modalHeader);
  modal.appendChild(modalBody);
  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

const separator = document.createElement("div");
separator.className = "separator";
modal.appendChild(separator);

  // Création du conteneur pour le bouton "Ajouter une photo"
  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  const addImageButton = document.createElement("button");
  addImageButton.className = "add-image-button";
  addImageButton.innerText = "Ajouter une photo";
  buttonContainer.appendChild(addImageButton);
  modal.appendChild(buttonContainer);

  // Ajoutez un écouteur d'événement pour ouvrir la modale d'ajout de photo
  addImageButton.addEventListener("click", () => {
    modalAdd(); // Appelle la fonction pour afficher la modale d'ajout
  });

  // Événement pour fermer la modale via la croix
  const closeModalBtn = modalHeader.querySelector(".close-modal");
  closeModalBtn.addEventListener("click", () => {
    modalOverlay.remove(); // Ferme la modale
  });

  // Événement pour fermer la modale en cliquant sur l'overlay
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      modalOverlay.remove(); // Ferme la modale
    }
  });
}

export function modalAdd() {
  const modalOverlay = document.querySelector(".modal");
  
  if (modalOverlay) {
    modalOverlay.innerHTML = `
   
      <div>
          <i id="modal-back" class="fa-solid fa-arrow-left"></i><i id="closingX" class="fa-solid fa-xmark"></i>
      </div>
      <div class="titre-ajout">
      <h4 id="modale-title">Ajout photo</h4>
      </div>

      <form id="form-ajout-photo" enctype="multipart/form-data" action="#" method="post"> 
          <div id="upload-img-area"> 
              <div id="img-preview-area"> 
                  <img id="show-img-preview" style="display:none;">
              </div>
              <div class="upload-section">
              <i class="fa-regular fa-image img"></i>
              <label for="upload-img-html" id="upload-img">Choisir une image</label>
              <input type="file" id="upload-img-html" name="image">
              <div class="img-size"><span >jpg, png : 4mo max</span></div>
          </div>
          <label for="titre">Titre</label>
          <input type="text" id="new-project" placeholder="">
          <label for="categorie">Catégorie</label>
          <select id="modale-categorie-add">
              ${categories
                .map(
                  (category) =>
                    `<option value="${category.id}">${category.name}</option>`
                )
                .join("")}
          </select>
          <div class="separator"></div>
         <div class="btn-modal"> <button id="modale-add-btn" class="main-btn btn-add-project unfilled">Valider</button></div>
      </form>
      `;

    // Ajouter ici l'écouteur d'événement pour la soumission du formulaire
    const formulaire = document.querySelector("#form-ajout-photo");
    if (formulaire) {
      formulaire.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData();
        const fileInput = document.querySelector("#upload-img-html");

        // Vérifiez si un fichier a été sélectionné
        if (fileInput.files.length > 0) {
          formData.append("image", fileInput.files[0]);
        } else {
          alert("Veuillez sélectionner une image.");
          return; // Sortir si aucune image n'est sélectionnée
        }

        // Récupération du titre et de la catégorie
        formData.append("title", document.querySelector("#new-project").value);
        formData.append(
          "category",
          document.querySelector("#modale-categorie-add").value
        );

        try {
          const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${localStorage.tokenID}`,
              Accept: "application/json",
            },
          });

          if (response.ok) {
            alert("Projet ajouté avec succès");
            generateModal(); // Actualise la vue après ajout
          } else {
            alert("Le projet n'a pas pu être ajouté");
          }
        } catch (error) {
          console.error("Erreur lors de l'ajout du projet :", error);
          alert("Une erreur est survenue lors de l'ajout du projet.");
        }
      });

      // Vérification de la validité du formulaire pour activer le bouton Valider
      const fileInput = document.querySelector("#upload-img-html");
      const imgPreview = document.querySelector("#show-img-preview");
const uploadSection = document.querySelector(".upload-section");
      const titleInput = document.querySelector("#new-project");
      const validateButton = document.querySelector("#modale-add-btn");


// Fonction pour afficher l'aperçu de l'image
function showImagePreview(event) {
  const file = event.target.files[0];
  if (file) {
    console.log("Selected file:", file); // Debug: Log the selected file
    const reader = new FileReader();
    reader.onload = function(e) {
      imgPreview.src = e.target.result; // Set the image source
      imgPreview.style.display = "block"; // Display the image preview
      uploadSection.classList.add("hidden"); // Hide the upload section
      console.log("Image preview source set"); // Debug: Log image setting
    };
    reader.readAsDataURL(file); // Read the file as a data URL
  }
}


// Fonction pour vérifier la validité du formulaire
function checkFormValidity() {
  if (fileInput.files.length > 0 && titleInput.value.trim() !== "") {
      validateButton.classList.add("active");
      validateButton.disabled = false; // Activer le bouton
  } else {
      validateButton.classList.remove("active");
      validateButton.disabled = true; // Désactiver le bouton
  }
}

// Ajouter un écouteur d'événements sur l'input de type file pour déclencher l'aperçu
fileInput.addEventListener("change", showImagePreview);
fileInput.addEventListener("change", checkFormValidity);
titleInput.addEventListener("input", checkFormValidity);

}
}}
