import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

//let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects'); 
const projectsTitle = document.querySelector('.projects-title'); 
if (projectsTitle) {
    projectsTitle.textContent = `${projects.length} Projects`; 
}

const profileStats = document.querySelector('#profile-stats .stats-grid');
renderProjects(projects, projectsContainer, 'h2');

/*
// Refactor all plotting into one function
function renderPieChart(projectsGiven) {
    // re-calculate rolled data
    let newRolledData = d3.rollups(
      projectsGiven,
      (v) => v.length,
      (d) => d.year,
    );
    // re-calculate data
    let newData = newRolledData.map(([year, count]) => {
        return { value: count, label: year }; 
    });
    // re-calculate slice generator, arc data, arc, etc.
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let newArcs = newArcData.map((d) => arcGenerator(d));
    newArcs.forEach((arc, idx) => {
        d3.select('svg').append('path').attr('d', arc).attr('fill', colors(idx));
      })
    
    let legend = d3.select('.legend');
    // update paths and legends, refer to steps 1.4 and 2.2

  }
  // Call this function on page load
  renderPieChart(projects);
*/


let rolledData = d3.rollups(
  projects,
  (v) => v.length,
  (d) => d.year,
);
let colors = d3.scaleOrdinal(d3.schemeTableau10);
let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));
//let svg = d3.select('svg');
arcs.forEach((arc, idx) => {
    d3.select('svg').append('path').attr('d', arc).attr('fill', colors(idx));
  })

let legend = d3.select('.legend');

data.forEach((d, idx) => {
      legend.append('li')
            .attr('style', `--color: ${colors(idx)}`) // set the style attribute while passing in parameters
            .html(`<span class="swatch"></span> ${d.label } <em> (${d.value})</em>`); // set the inner html of <li>
}) 


/* 
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
searchInput.addEventListener('input', (event) => {
  let updatedProjects = setQuery(event.target.value);
  console.log('Filtered:', updatedProjects);
  console.log('Container:', projectsContainer);
  renderProjects(updatedProjects, projectsContainer);
  renderPieChart(filteredProjects);
});

let newSVG = d3.select('svg'); 
newSVG.selectAll('path').remove();
*/

function renderPieChart(projectsGiven) {
    // re-calculate rolled data
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year,
      );
      // re-calculate data
      let newData = newRolledData.map(([year, count]) => {
          return { value: count, label: year }; 
      });
      // re-calculate slice generator, arc data, arc, etc.
      let newSliceGenerator = d3.pie().value((d) => d.value);
      let newArcData = newSliceGenerator(newData);
      let newArcs = newArcData.map((d) => arcGenerator(d));
      let newSVG = d3.select('svg');
      newSVG.selectAll('path').remove();
      legend.selectAll('li').remove()
    
    
      newArcs.forEach((arc, idx) => {
          newSVG.append('path').attr('d', arc).attr('fill', colors(idx));
        })
      
      newData.forEach((d, idx) =>{
        legend.append('li')
        .attr('style', `--color: ${colors(idx)}`) // set the style attribute while passing in parameters
        .html(`<span class="swatch"></span> ${d.label } <em> (${d.value})</em>`); // set the inner html of <li>
    }) 
  }
  
  // Call this function on page load
renderPieChart(projects);


let query = '';
function setQuery(newQuery) {
    query = newQuery;
    let filteredProjects = projects.filter((project) => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query.toLowerCase());
      });
    return filteredProjects;
  }
  
let searchInput = document.getElementsByClassName('searchBar')[0];
  
searchInput.addEventListener('input', (event) => {
    //let updatedProjects = setQuery(event.target.value);
    let filteredProjects =  setQuery(event.target.value);
    renderProjects(filteredProjects, projectsContainer);
    renderPieChart(filteredProjects);
  }); 



// Call this function on page load
renderPieChart(projects);

let selectedIndex = -1;
let svg = d3.select('svg');
svg.selectAll('path').remove();
arcs.forEach((arc, i) => {
    svg.append('path')
      .attr('d', arc)
      .attr('fill', colors(i))
      .on('click', () => {
       selectedIndex = selectedIndex === i ? -1 : i;
       svg.selectAll('path')
        .attr('class', (_, idx) => ((idx === selectedIndex ? 'selected' : ' ')));
    
    legend.selectAll('li').attr('class', (_, idx) => ((idx === selectedIndex ? 'selected' : ' ')));

    if (selectedIndex === -1) {
    console.log('selectedIndex:', selectedIndex)
    renderProjects(projects, projectsContainer, 'h2');
    } 

    else {
    console.log('selectedIndex:', selectedIndex)
    const selectedYear = data[selectedIndex].label;
    const filteredProjects = projects.filter((project) => project.year === selectedYear);
    renderProjects(filteredProjects, projectsContainer, 'h2');
    }

      });
  });








