import { fetchJSON, renderProjects } from '../global.js';
const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects'); 
const projectsTitle = document.querySelector('.projects-title'); 
if (projectsTitle) {
    projectsTitle.textContent = `${projects.length} Projects`; 
}

const profileStats = document.querySelector('#profile-stats .stats-grid');
renderProjects(projects, projectsContainer, 'h2');
