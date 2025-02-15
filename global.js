console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}
  
let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/index.html', title: 'Projects' },
    { url: 'contact/index.html', title: 'Contact' },
    { url: 'resume.html', title: 'Resume' },
    { url: 'meta/index.html', title: 'Meta' },
    { url: 'https://github.com/Bhagya-Ram-7', title: 'GitHub' },
];

const ARE_WE_HOME = document.documentElement.classList.contains('home');
let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    url = !ARE_WE_HOME && !url.startsWith('https') ? '../' + url : url;

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a)

    if (a.host === location.host && a.pathname === location.pathname) {
        a.classList.add('current');
    }

    if (a.host != location.host){
        a.target = "_blank"; 
    }
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
      <label class="color-scheme" position: absolute>    
          Theme:
          <select>    
          <option value="light dark" selected>Automatic</option>        
          <option value="light">Light</option>
          <option value="dark">Dark</option>  
          </select>
      </label>`
  );

  let select = document.querySelector('select');
  if (localStorage.getItem("colorScheme")) {
      const storedColorScheme = localStorage.getItem("colorScheme");
      document.documentElement.style.setProperty('color-scheme', storedColorScheme);
      select.value = storedColorScheme;
      
  }
  select.addEventListener('input', function (event) {
      const newColorScheme = event.target.value;
      document.documentElement.style.setProperty('color-scheme', newColorScheme);
      console.log('color scheme changed to', newColorScheme);
      localStorage.setItem("colorScheme", newColorScheme);
      console.log(localStorage);
  });


export async function fetchJSON(url) {
    try {
        // Fetch the JSON file from the given URL
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data)
        return data; 


    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

export function renderProjects(projects, containerElement,  headingLevel = 'h2') {
    containerElement.innerHTML = '';

    projects.forEach(project=> {
        const article = document.createElement('article');
        article.innerHTML = `

        <${headingLevel}>${project.title}</${headingLevel}>
        <img src="${project.image}" alt="${project.title}">

        <div class="project-deets">
            <p class="description">${project.description}</p>
            <p class="year">${project.year}</p>

        </div>
        `;
        containerElement.appendChild(article);
    })
}

export async function fetchGitHubData(username) {
    console.log("Fetching GitHub Data");
    return fetchJSON(`https://api.github.com/users/${username}`);
  }


  







  





  

