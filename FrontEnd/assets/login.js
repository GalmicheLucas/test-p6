// Sélection des éléments du DOM nécessaires
const email = document.querySelector("form #email"); 
const password = document.querySelector("form #password"); 
const form = document.querySelector("form"); 
const errorMessage = document.querySelector("#login p"); // Sélectionne le paragraphe d'erreur dans l'élément avec l'ID login

// Ajout d'un écouteur d'événement au formulaire
form.addEventListener("submit", (event) => { // Attache un gestionnaire d'événements qui répondra à l'événement submit du formulaire
    
  // Prévention de l'action par défaut du formulaire (rechargement de la page)
  event.preventDefault(); // Empêche le rechargement de la page

  // Récupération des valeurs des champs email et mot de passe
  const userEmail = email.value; 
  const userPassword = password.value; 

  // Création de l'objet contenant les données du formulaire
  const loginData = { // Crée un objet avec les clés email et password
      email: userEmail, // la clé email a la valeur de userEmail
      password: userPassword, // defini password avec la valeur de userPassword
  };

  // Envoi de la requête à l'API avec fetch
  fetch("http://localhost:5678/api/users/login", { 
      method: "POST", 
      headers: {
          "Content-Type": "application/json", 
      },
      body: JSON.stringify(loginData), 
  })
  .then((response) => { // Gère la réponse de la requête fetch

      // Vérification de la réponse du serveur
      if (!response.ok) { // Si la réponse n'est pas OK (par exemple, si le statut HTTP est autre que  2xx)
          // Si la réponse n'est pas ok, retourner une promesse rejetée avec une erreur
          return Promise.reject(new Error("Erreur HTTP : " + response.status)); // Crée une nouvelle erreur avec le statut HTTP et la rejette
      }
      // Si la réponse est ok, retourner la réponse convertie en JSON
      return response.json(); // réponse en JSON
  })
  .then((data) => { // données de la réponse
      const userId = data.userId; 
      const userToken = data.token; 
      //  informations dans sessionStorage
      sessionStorage.setItem("token", userToken); // Stocke le token dans sessionStorage
      sessionStorage.setItem("userId", userId); // Stocke l'identifiant de l'utilisateur dans sessionStorage
      // Redirige vers index.html
      location.href = "index.html"; 
  })
  .catch((error) => { // Gère les erreurs éventuelles
      // Affichage de l'erreur dans la console
      console.error("Erreur : ", error); 
     
      errorMessage.textContent = "Une erreur est survenue lors de la connexion."; 
      errorMessage.style.color = "red"; // Turn the color in red
  });
});