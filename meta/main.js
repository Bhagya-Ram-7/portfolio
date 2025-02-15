let yScale;
let xScale;
let data = [];

document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  processCommits();
  createScatterplot();
  displayStats();
  brushSelector();
});

let commits = [];
function processCommits() {
    commits = d3
      .groups(data, (d) => d.commit)
      .map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
        let ret = {
          id: commit,
          url: 'https://github.com/vis-society/lab-7/commit/' + commit,
          author,
          date,
          time,
          timezone,
          datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
          totalLines: lines.length,
        };
  
        Object.defineProperty(ret, 'lines', {
          value: lines,
          enumerable: false,
          writable: false,
          configurable: false,
        });
  
        return ret;
      });
  }

async function loadData() {
  data = await d3.csv('loc.csv', (row) => ({
      ...row,
      line: Number(row.line), // or just +row.line
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + 'T00:00' + row.timezone),
      datetime: new Date(row.datetime),
  }));

}

function createScatterplot() {
  const width = 1000;
  const height = 600;
  const margin = { top: 10, right: 10, bottom: 30, left: 20 };
  const sortedCommits = d3.sort(commits, (d) => -d.totalLines);
  
  const svg = d3
    .select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible');
  
  xScale = d3
    .scaleTime()
    .domain(d3.extent(commits, (d) => d.datetime))
    .range([0, width])
    .nice();
  
  yScale = d3.scaleLinear().domain([0, 24]).range([height, 0]);
  const usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };
  
  xScale.range([usableArea.left, usableArea.right]);
  yScale.range([usableArea.bottom, usableArea.top]);

  // Gridlines
  const gridlines = svg
    .append('g')
    .attr('class', 'gridlines')
    .attr('transform', `translate(${usableArea.left}, 0)`);
  
  gridlines.call(d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width));

  // Axes
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale).tickFormat((d) => String(d % 24).padStart(2, '0') + ':00');

  svg
    .append('g')
    .attr('transform', `translate(0, ${usableArea.bottom})`)
    .call(xAxis);

  svg
    .append('g')
    .attr('transform', `translate(${usableArea.left}, 0)`)
    .call(yAxis);

  // Improved radius scale
  const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);
  const rScale = d3.scaleSqrt()
    .domain([minLines, maxLines])
    .range([3, 40]); // Increased range for more dramatic size differences

  // Draw circles
  const dots = svg.append('g').attr('class', 'dots');
  
  dots
    .selectAll('circle')
    .data(sortedCommits)
    .join('circle')
    .attr('cx', (d) => xScale(d.datetime))
    .attr('cy', (d) => yScale(d.hourFrac))
    .attr('r', (d) => rScale(d.totalLines))
    .attr('fill', 'steelblue')
    .style('fill-opacity', 0.6)
    .style('stroke', 'white')
    .style('stroke-width', 0.5)
    .on('mouseenter', (event, d) => {
      d3.select(event.currentTarget)
        .style('fill-opacity', 1)
        .style('stroke-width', 1);
      updateTooltipContent(d);
      updateTooltipVisibility(true);
      updateTooltipPosition(event);
    })
    .on('mouseleave', (event) => {
      d3.select(event.currentTarget)
        .style('fill-opacity', 0.6)
        .style('stroke-width', 0.5);
      updateTooltipVisibility(false);
    });
}

function brushSelector() {
  const svg = document.querySelector('svg');
  d3.select(svg).call(d3.brush().on('start brush end', brushed));

  // Raise dots and everything after overlay
  d3.select(svg).selectAll('.dots, .overlay ~ *').raise();
}

let brushSelection = null;

function brushed(event) {
  console.log(event);
  brushSelection = event.selection;
  updateSelection();
  updateSelectionCount();
  updateLanguageBreakdown();
  }

function isCommitSelected(commit) {
  if (!brushSelection) {
    return false;
  }
  const min = { x: brushSelection[0][0], y: brushSelection[0][1] }; 
  const max = { x: brushSelection[1][0], y: brushSelection[1][1] }; 
  const x = xScale(commit.date); 
  const y = yScale(commit.hourFrac); 
  return x >= min.x && x <= max.x && y >= min.y && y <= max.y; 

}

function updateSelection() {
  d3.selectAll('circle').classed('selected', (d) => isCommitSelected(d));
}

function updateSelectionCount() {
  const selectedCommits = brushSelection
    ? commits.filter(isCommitSelected)
    : [];

  const countElement = document.getElementById('selection-count');
  countElement.textContent = `${
    selectedCommits.length || 'No'
  } commits selected`;

  return selectedCommits;
}



function displayStats() {
  // Process commits first
  processCommits();
  
  // Select the stats container
  const statsContainer = d3.select("#stats");

  // Clear previous content
  statsContainer.html("");

  // Create function to append label-value pairs in the desired format
  function appendStat(label, value) {
      const statBlock = statsContainer.append("div");
      statBlock.append("p").attr("class", "label").html(label);
      statBlock.append("p").attr("class", "value").text(value);
  }

  // Add stats (keeping your existing variable structure)
  appendStat("Commits", commits.length);
  appendStat("Files", new Set(data.map(d => d.file)).size);
  appendStat('Total Lines of Code', data.length);

  // Most active period calculation (keeping existing logic)
  const workByPeriod = d3.rollups(
      data,
      (v) => v.length,
      (d) => new Date(d.datetime).toLocaleString('en', { dayPeriod: 'short' })
  );
  const maxPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];
  appendStat("Most active period", maxPeriod);

  // Average file length
  const fileLengths = d3.rollups(
      data,
      (v) => d3.max(v, (v) => v.line),
      (d) => d.file
  );
  const averageFileLength = d3.mean(fileLengths, (d) => d[1]).toFixed(2);
  appendStat("Average file length (in lines)", averageFileLength);

  // Longest line length
  const longestLine = d3.max(data, (d) => d.length);
  appendStat("Longest line", longestLine);

  // Max file length in lines
  const maxFileLength = d3.max(commits, (d) => d.lines.length);
  appendStat("Max Lines", maxFileLength);
}

function updateTooltipContent(commit) {
  /*console.log('Commit object:', commit);*/
  const link = document.getElementById('commit-link');
  const date = document.getElementById('commit-date');
  const time = document.getElementById('commit-time');
  const author = document.getElementById('commit-author');
  const lines = document.getElementById('commit-lines');
  /*console.log(commit.author);*/

  if (Object.keys(commit).length === 0) return;

  link.href = commit.url;
  link.textContent = commit.id;
  /*console.log(commit.id);*/
  date.textContent = commit.datetime?.toLocaleString('en', {
    dateStyle: 'full',
  });
  /*console.log(commit.datetime);*/

  time.textContent = commit.time?.toLocaleString('en', { timeStyle: 'short' });
  /*console.log(commit.time);*/

  author.textContent = commit.author;
  /*console.log(commit.author);*/
  lines.textContent = commit.totalLines;
  /*console.log(commit.totalLines);*/
 
}

function updateTooltipVisibility(isVisible) {
  const tooltip = document.getElementById('commit-tooltip');
  //tooltip.hidden = !isVisible;
  tooltip.style.display = isVisible ? 'block' : 'none';
}

function updateTooltipPosition(event) {
  const tooltip = document.getElementById('commit-tooltip');
  tooltip.style.left = `${event.clientX}px`;
  tooltip.style.top = `${event.clientY}px`;
}

function updateLanguageBreakdown() {
  const selectedCommits = brushSelection
    ? commits.filter(isCommitSelected)
    : [];
  const container = document.getElementById('language-breakdown');

  if (selectedCommits.length === 0) {
    container.innerHTML = '';
    return;
  }
  const requiredCommits = selectedCommits.length ? selectedCommits : commits;
  const lines = requiredCommits.flatMap((d) => d.lines);

  // Use d3.rollup to count lines per language
  const breakdown = d3.rollup(
    lines,
    (v) => v.length,
    (d) => d.type
  );

  // Update DOM with breakdown
  container.innerHTML = '';

  for (const [language, count] of breakdown) {
    const proportion = count / lines.length;
    const formatted = d3.format('.1~%')(proportion);

    container.innerHTML += `
            <dt>${language}</dt>
            <dd>${count} lines (${formatted})</dd>
        `;
  }

  return breakdown;
}
