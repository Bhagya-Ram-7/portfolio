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
    { url: '/portfolio/projects/', title: 'Projects' },
    { url: '/portfolio/contact/', title: 'Contact' },
    { url: '/portfolio/resume.html', title: 'Resume' },
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
      <label class="color-scheme">    
          Theme:
          <select>    
          <option value="light dark" selected>Automatic</option>        
          <option value="light">Light</option>
          <option value="dark">Dark</option>  
          </select>
      </label>`
  );
  





  

