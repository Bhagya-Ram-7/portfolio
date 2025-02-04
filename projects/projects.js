import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects'); 
const projectsTitle = document.querySelector('.projects-title'); 
if (projectsTitle) {
    projectsTitle.textContent = `${projects.length} Projects`; 
}

const profileStats = document.querySelector('#profile-stats .stats-grid');
renderProjects(projects, projectsContainer, 'h2');

let rolledData = d3.rollups(
  projects,
  (v) => v.length,
  (d) => d.year,
);
let colors = d3.scaleOrdinal(d3.schemeTableau10);
let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));
arcs.forEach((arc, idx) => {
    d3.select('svg').append('path').attr('d', arc).attr('fill', colors(idx));
  })

let legend = d3.select('.legend');

data.forEach((d, idx) => {
      legend.append('li')
            .attr('style', `--color: ${colors(idx)}`) // set the style attribute while passing in parameters
            .html(`<span class="swatch"></span> ${d.label } <em> (${d.value})</em>`); // set the inner html of <li>
}) 


let query = '';
let filteredProjects = [];

function setQuery(newQuery) {
  query = newQuery;
  filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  return filteredProjects;
}

let searchInput = document.getElementsByClassName('searchBar')[0];

searchInput.addEventListener('change', (event) => {
  let updatedProjects = setQuery(event.target.value);
  console.log('Filtered:', updatedProjects);
  console.log('Container:', projectsContainer);
  renderProjects(updatedProjects, projectsContainer);
});


/* 
let query = '';
function setQuery(newQuery) {
    query = newQuery;
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
      });
  }
  
  let searchInput = document.getElementsByClassName('searchBar')[0];
  
  searchInput.addEventListener('change', (event) => {
    let updatedProjects = setQuery(event.target.value);
    renderProjects(updatedProjects, projectsContainer);
  }); */



