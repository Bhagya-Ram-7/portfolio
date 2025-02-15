import { fetchJSON, renderProjects, fetchGitHubData } from './global.js'; //given: fetchGithubData

const projects = await fetchJSON('./lib/projects.json');
console.log(projects)
const latestProjects = projects.slice(0, 3);
console.log(latestProjects)
const projectsContainer = document.querySelector('.projects');
renderProjects(latestProjects, projectsContainer, 'h2');
const githubData = await fetchGitHubData('Bhagya-Ram-7');
const profileStats = document.querySelector('#profile-stats');
if (profileStats) {
    profileStats.innerHTML = `
    <div class="stat"><span class="label"> Public Repos: </span><span class="value">${githubData.public_repos}</span></div>
    <div class="stat"><span class="label"> Public Gists: </span><span class="value">${githubData.public_gists}</span></div>
    <div class="stat"><span class="label"> Followers: </span><span class="value">${githubData.followers}</span></div>
    <div class="stat"><span class="label"> Following: </span><span class="value">${githubData.following}</span></div>
    <div class="stat"><span class="label"> URL: </span><span class="value">${githubData.url}</span></div>
        `;
}

