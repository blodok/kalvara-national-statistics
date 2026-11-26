// main.js — the site's router and page wiring.
// Hash routes: #/ (home), #/population, #/economy, #/labour, #/health,
// #/education, #/regions, #/releases, #/methods. A query string after the route
// (e.g. #/population?from=2020, or #/releases?q=wages from the search box) is
// passed to the renderer. Table headers with [data-sort] sort their table in
// place; the search form routes to the releases page with the query attached.

import * as views from './views.js';

const viewEl = document.getElementById('view');
const navEl = document.getElementById('main-nav');
const searchForm = document.getElementById('site-search');
const searchInput = document.getElementById('search-input');

const ROUTES = {
  '': views.renderHome,
  population: views.renderPopulation,
  economy: views.renderEconomy,
  labour: views.renderLabour,
  health: views.renderHealth,
  education: views.renderEducation,
  regions: views.renderRegions,
  releases: views.renderReleases,
  methods: views.renderMethods,
};

function parseHash() {
  const raw = window.location.hash.replace(/^#\/?/, '');
  const [path, queryString] = raw.split('?');
  return { route: path, query: new URLSearchParams(queryString ?? '') };
}

function render() {
  const { route, query } = parseHash();
  const renderPage = ROUTES[route] ?? views.renderHome;
  viewEl.innerHTML = renderPage(query);
  for (const link of navEl.querySelectorAll('a')) {
    link.classList.toggle('active', link.dataset.route === route);
  }
  const titles = {
    '': 'Kalvara National Statistics Office',
    population: 'Population — Kalvara National Statistics',
    economy: 'Economy — Kalvara National Statistics',
    labour: 'Labour — Kalvara National Statistics',
    health: 'Health — Kalvara National Statistics',
    education: 'Education — Kalvara National Statistics',
    regions: 'Regions — Kalvara National Statistics',
    releases: 'Releases & data — Kalvara National Statistics',
    methods: 'Sources & methods — Kalvara National Statistics',
  };
  document.title = titles[route] ?? titles[''];
  window.scrollTo(0, 0);
}

function sortTable(table, column, type, ascending) {
  const body = table.querySelector('tbody');
  const rows = [...body.querySelectorAll('tr')];
  const valueOf = (row) => {
    const text = row.children[column].textContent.trim().replace(/[^0-9.,-]/g, '').replace(/,/g, '');
    return type === 'num' ? Number.parseFloat(text) || 0 : row.children[column].textContent.trim();
  };
  rows.sort((a, b) => {
    const va = valueOf(a), vb = valueOf(b);
    const cmp = va < vb ? -1 : va > vb ? 1 : 0;
    return ascending ? cmp : -cmp;
  });
  for (const row of rows) body.appendChild(row);
}

viewEl.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-sort]');
  if (!button) return;
  const table = button.closest('table');
  const column = Number(button.dataset.sort);
  const ascending = button.dataset.dir !== 'asc';
  button.dataset.dir = ascending ? 'asc' : 'desc';
  sortTable(table, column, button.dataset.type, ascending);
});

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const q = searchInput.value.trim();
  window.location.hash = q ? `#/releases?q=${encodeURIComponent(q)}` : '#/releases';
});

window.addEventListener('hashchange', render);
render();
