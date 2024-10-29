// Récupération des catégories depuis l'API 
const catApi = await fetch("http://localhost:5678/api/categories");
const categories = await catApi.json();

// Fonction pour afficher les projets
function displayProjects(works) {
  const modalBody = document.querySelector("#modal-body");
  
  // Vérification que modalBody est bien trouvé
  if (!modalBody) {
    console.error("Élément modalBody introuvable !");
    return;
  }

  // Vider l'élément modalBody avant de réafficher les projets
  modalBody.innerHTML = "";

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

    const trashIcon = worksTile.querySelector(`#trash-${project.id}`);
    trashIcon.addEventListener("click", () => {
      console.log(`Suppression du projet ID: ${project.id}`);

      const tokenData = window.localStorage.getItem("userData");
      if (!tokenData) {
        console.error("Utilisateur non connecté.");
        return;
      }

      const token = JSON.parse(tokenData).token;
      const url = `http://localhost:5678/api/works/${project.id}`;

      fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            console.log(`Projet ID ${project.id} supprimé avec succès`);
            refreshProjects(); // Rafraîchit la liste des projets
          } else {
            console.error("Erreur lors de la suppression :", response.status);
          }
        })
        .catch((error) => console.error("Error:", error));
    });
  });
}

export function generateModal() {
  const modalOverlay = document.createElement("div");
  modalOverlay.className = "modal-overlay";

  const modal = document.createElement("div");
  modal.className = "modal";

  const modalHeader = document.createElement("div");
  modalHeader.className = "modal-header";
  modalHeader.innerHTML = `
      <p>Galerie d'images</p>
      <span class="close-modal" style="cursor: pointer;">&times;</span>
    `;

  const modalBody = document.createElement("div");
  modalBody.className = "modal-body";
  modalBody.id = "modal-body";

  modal.appendChild(modalHeader);
  modal.appendChild(modalBody);
  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);

  const separator = document.createElement("div");
  separator.className = "separator";
  modal.appendChild(separator);

  const buttonContainer = document.createElement("div");
  buttonContainer.className = "button-container";
  const addImageButton = document.createElement("button");
  addImageButton.className = "add-image-button";
  addImageButton.innerText = "Ajouter une photo";
  buttonContainer.appendChild(addImageButton);
  modal.appendChild(buttonContainer);

  // Événement pour afficher la modale d'ajout
  addImageButton.addEventListener("click", () => {
    modalAdd();
  });

  // Fermeture de la modale
  modalHeader.querySelector(".close-modal").addEventListener("click", () => {
    modalOverlay.remove();
  });

  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      modalOverlay.remove();
    }
  });

  // Appel de refreshProjects pour charger les projets au premier affichage
  refreshProjects();
}

async function refreshProjects() {
  console.log("Rafraîchissement des projets...");

  try {
    const worksAPI = await fetch("http://localhost:5678/api/works");
    if (!worksAPI.ok) {
      throw new Error(`Erreur API: ${worksAPI.status}`);
    }
    const updatedWorks = await worksAPI.json();
    console.log("Projets actualisés :", updatedWorks);
    
    // Affichage des projets actualisés
    displayProjects(updatedWorks);
  } catch (error) {
    console.error("Erreur lors du rafraîchissement des projets :", error);
  }
}





export async function modalAdd() {
  const modalOverlay = document.querySelector(".modal");

  if (modalOverlay) {
    modalOverlay.innerHTML = `
   
      <div>
          <i id="modal-back" class="fa-solid fa-arrow-left"></i><i id="closingX" class="fa-solid fa-xmark"></i>
      </div>
      <div class="titre-ajout">
      <h4 id="modale-title">Ajout photo</h4>
      </div>

      <form id="form-ajout-photo" enctype="multipart/form-data" action="http://localhost:5678/api/works" method="post"> 
          <div id="upload-img-area"> 
              <div id="img-preview-area"> 
                  <img id="show-img-preview" style="display:none;">
              </div>
              <div class="upload-section">
              <i class="fa-regular fa-image img"></i>
              <label for="upload-img-html" id="upload-img">Choisir une image</label>
              <input type="file" id="upload-img-html" name="image" accept="image/*">
              <div class="img-size"><span >jpg, png : 4mo max</span></div>
          </div>
          <label for="titre">Titre</label>
          <input type="text" id="new-project" placeholder="">
          <label for="categorie">Catégorie</label>
          <select id="modale-categorie-add">
          <option></option>
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
          return;
        }

        // Récupération du titre et de la catégorie
        formData.append("title", document.querySelector("#new-project").value);
        formData.append(
          "category",
          document.querySelector("#modale-categorie-add").value
        );
        console.log(formData);

        console.log(document.querySelector("#modale-categorie-add").value);
        console.log(document.querySelector("#new-project").value);
        console.log(document.querySelector("#modale-categorie-add").value);

        const token = JSON.parse(window.localStorage.getItem("userData")).token;
          console.log(token);


        const response = await fetch("http://localhost:5678/api/works", {
          method : "POST",
          body : formData,
          headers: {
            Authorization:`Bearer ${token}`,
            "accept": "application/json"
          }
        });

        if (response.ok) {
          alert("projet ajouté avec succés");
          generateEditionMode();
          await refreshProjects(); // Rafraîchit la liste des projets
        } else {
          alert("Le projet n'a pas pu être ajouté");
        }



        //}

        /*catch (error) {
          // console.error("Erreur lors de l'ajout du projet : ", error);
          // alert("Une erreur est survenue lors de l'ajout du projet.");
        }*/
      });

      const Modalclose = () =>
        document.querySelector(".modal-overlay").remove();
      document.querySelector("#closingX").addEventListener("click", Modalclose);

      const Goback = document.querySelector("#modal-back");

      Goback.addEventListener("click",() => {
        document.querySelector(".modal-overlay").remove();
        generateModal();
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
          console.log("Fichier sélectionné : ", file); // Ajout de log pour vérifier le fichier
          const reader = new FileReader();
          reader.onload = function (e) {
            imgPreview.src = e.target.result;
            imgPreview.style.display = "block";
            uploadSection.classList.add("hidden");
            console.log("Aperçu de l'image généré avec succès");
          };
          reader.readAsDataURL(file); // Lire le fichier comme URL de données
        }
      }
      

      /// Fonction pour vérifier la validité du formulaire
      function checkFormValidity() {
        const categorySelect = document.querySelector("#modale-categorie-add");
        const isFormValid =
          fileInput.files.length > 0 &&
          titleInput.value.trim() !== "" &&
          categorySelect.value.trim() !== "";
      
        console.log("Formulaire valide : ", isFormValid); // Vérification de la validité du formulaire
      
        if (isFormValid) {
          validateButton.classList.add("active");
          validateButton.disabled = false;
        } else {
          validateButton.classList.remove("active");
          validateButton.disabled = true;
        }
      }
      

      // Ajouter un écouteur d'événement sur la sélection de la catégorie
      const categorySelect = document.querySelector("#modale-categorie-add");
      categorySelect.addEventListener("change", checkFormValidity);

      // Ajouter un écouteur d'événements sur l'input de type file pour déclencher l'aperçu
      fileInput.addEventListener("change", showImagePreview);
      fileInput.addEventListener("change", checkFormValidity);
      titleInput.addEventListener("input", checkFormValidity);
    }
  }
}