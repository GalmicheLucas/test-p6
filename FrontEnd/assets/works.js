//


// works
const projectsAPI = await fetch("http://localhost:5678/api/works");
const projects = await projectsAPI.json();

console.log(projects);


//categories
const categoriesAPI = await fetch("http://localhost:5678/api/categories");
const categories = await categoriesAPI.json();
console.log(categories);


const main = document.querySelector("main");



export function generateProjectsHead() {
    const projectSection = document.createElement("section");
    projectSection.id = "portfolio";
    projectSection.innerHTML = `
        <h2 id="projets">Mes projets</h2>
        <div id="filtres-container">
            <button id="0" class="filtre-cat">Tous</button>
        </div>
        <div class="gallery">  `;
    main.appendChild(projectSection);

    // filtre catégories


    categories.forEach(category => {
        const filtreCat = document.createElement("button");
        filtreCat.id = category.id;
        filtreCat.classList.add("filtre-cat");
        filtreCat.innerText = category.name;
        document.querySelector("#filtres-container").appendChild(filtreCat);
    });

    // génération des boutons de filtres


    const filtersBtns = document.querySelectorAll(".filtre-cat");

    filtersBtns.forEach(filterCat => {
        filterCat.addEventListener("click", ()=> {

            const filteredProjects = projects.filter((project)=> {return project.categoryId == filterCat.id});
           !!+filterCat.id? generateProjects(filteredProjects) : generateProjects(projects);
        });
    });


}



// creation des projets dans le gallerie
export function generateProjects(projects) {

    document.querySelector(".gallery").innerHTML = "";
    projects.forEach(project => {
        const projectsGallery = document.querySelector(".gallery");
        const projectTile = document.createElement("figure");
        projectTile.dataset.id = project.id;
        projectTile.dataset.cat = project.categoryId;

        projectTile.innerHTML = `
            <img src="${project.imageUrl}" alt="${project.title}">
            <figcaption>${project.title}</figcaption>
        `;
        projectsGallery.appendChild(projectTile);


    })

}