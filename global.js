console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

//let navLinks = $$("nav a"); 

//let currentLink = navLinks.find(
  //  (a) => a.host === location.host && a.pathname === location.pathname
  //);

//if (currentLink) {
    // or if (currentLink !== undefined)
   // currentLink.classList.add('current');
//  }

  
let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/index.html', title: 'Projects' },
    { url: 'contact/index.html', title: 'Contact' },
    { url: 'resume.html', title: 'Resume' },
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

    //a.classList.toggle(
      //  'current',
        //a.host === location.host && a.pathname === location.pathname
    //);

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
    //containerElement.innerHTML = '';
    if (!containerElement){
        console.error("container element error")
        return;
    }
    projects.forEach(project=> {
        const article = document.createElement('article');
        article.innerHTML = `
        <${headingLevel}>${project.title}</${headingLevel}>
        <img src="${project.image}" alt="${project.title}">
        <p>${project.description}</p>`;
        containerElement.appendChild(article);
    })
}

export async function fetchGitHubData(username) {
    console.log("Fetching GitHub Data");
    return fetchJSON(`https://api.github.com/users/${username}`);
  }


  







  





  

