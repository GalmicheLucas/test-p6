import { generateProjectsHead , generateProjects } from "./works" ;


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
    contactSection.id = 'contact';

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

