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
          <dl>
            <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
            <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
            <dt>Followers:</dt><dd>${githubData.followers}</dd>
            <dt>Following:</dt><dd>${githubData.following}</dd>
            <dt> URL:</dt><dd>${githubData.url}</dd>
          </dl>
      `;
  }


/*
const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects.slice(0, 3);
const projectsContainer = document.querySelector('.projects');

const githubData = await fetchGithubData('Bhagya-Ram-7');
const profileStats = document.querySelector('#profile-stats');
renderProjects(latestProjects, projectsContainer, 'h2');

if (profileStats) {
    profileStats.innerHTML = `
          <dl>
            <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
            <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
            <dt>Followers:</dt><dd>${githubData.followers}</dd>
            <dt>Following:</dt><dd>${githubData.following}</dd>
            <dt> URL:</dt><dd>${githubData.url}</dd>
          </dl>
      `;
  }
*/
