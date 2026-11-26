// views.js — one renderer per page of the statistics site.
// Every page is built from the published figures in data.js and drawn with the
// chart builders in charts.js. Controls that appear on a page all work: the year
// pills re-draw a chart, table headers sort the table, and every CSV link downloads
// a real data file from app/data/.

import * as D from './data.js';
import { lineChart, barChart, hbarChart, donutChart } from './charts.js';

const fmt = (n) => n.toLocaleString('en-GB');
const pct = (n) => `${n.toFixed(1)}%`;

function sourceNote(text) {
  return `<p class="source">Source: ${text}</p>`;
}

function kpiCard(k) {
  const arrow = k.direction === 'up' ? '▲' : '▼';
  const cls = (k.id === 'unemployment' || k.id === 'inflation')
    ? (k.direction === 'down' ? 'up' : 'down') : k.direction;
  return `<article class="kpi">
    <div class="kpi-label">${k.label}</div>
    <div class="kpi-value">${k.value}</div>
    <div class="kpi-change ${cls}">${arrow} ${k.change}</div>
    <div class="kpi-note">${k.note}. ${k.source}.</div>
  </article>`;
}

function chartCard(title, sub, svg, source) {
  return `<section class="card">
    <h2 class="chart-title">${title}</h2>
    <p class="chart-sub">${sub}</p>
    ${svg}${sourceNote(source)}
  </section>`;
}

export function renderHome() {
  const pop = lineChart({
    points: D.POPULATION_BY_YEAR.map((p) => ({ x: String(p.year), y: p.total })),
    yLabel: 'Population, thousands',
    format: (v) => `${fmt(v)}k`,
  });
  const gdp = barChart({
    bars: D.GDP_BY_YEAR.slice(-6).map((g) => ({ label: String(g.year), value: g.growth, alt: g.growth < 0 })),
    yLabel: 'Real GDP growth, %',
    format: (v) => `${v.toFixed(1)}%`,
  });
  const latest = D.RELEASES.slice(0, 4).map((r) => `
    <li><span class="date">${r.date}</span>
    <a href="#/releases">${r.title}</a>
    <span class="tag">${r.tag}</span></li>`).join('');
  return `
  <section class="hero">
    <h1>Statistics that describe Kalvara</h1>
    <p>The Kalvara National Statistics Office publishes the country's official figures —
    how many of us there are, how the economy is doing, who has work, how long we live
    and how our children learn. Every figure carries its source and year.</p>
    <p class="updated">Last updated ${D.META.updated} · Next release: consumer prices, 9 December 2026</p>
  </section>
  <div class="kpi-grid">${D.KEY_INDICATORS.map(kpiCard).join('')}</div>
  <div class="two-col">
    ${chartCard('Population, 2015–2025', 'Mid-year estimates, thousands of residents',
      pop, 'Population estimates 2025, KNSO')}
    ${chartCard('Real GDP growth, 2020–2025', 'Annual change in real GDP, %',
      gdp, 'National accounts 2025, KNSO')}
  </div>
  <section class="card">
    <h2>Latest releases</h2>
    <ul class="release-list">${latest}</ul>
    <p><a class="btn secondary" href="#/releases">All releases &amp; data downloads</a></p>
  </section>
  <section class="card">
    <h2>Explore by topic</h2>
    <ul class="link-list">
      <li><a href="#/population">Population</a> <span class="desc">— 4.81 million residents; 17.8% are under 15.</span></li>
      <li><a href="#/economy">Economy</a> <span class="desc">— GDP KLV 96.4 bn; services are 61.4% of value added.</span></li>
      <li><a href="#/labour">Labour</a> <span class="desc">— 5.2% unemployed; median wage KLV 2,340 a month.</span></li>
      <li><a href="#/health">Health</a> <span class="desc">— life expectancy 78.6 years; health spending 8.9% of GDP.</span></li>
      <li><a href="#/education">Education</a> <span class="desc">— 99.1% of children in primary school; 35.6% of adults hold a degree.</span></li>
      <li><a href="#/regions">Regions</a> <span class="desc">— eight regions, from Port Kalvara (1.18 m) to the Highlands (388,000).</span></li>
    </ul>
  </section>`;
}

export function renderPopulation(query) {
  const from = query.get('from') === '2020' ? 2020 : 2015;
  const series = D.POPULATION_BY_YEAR.filter((p) => p.year >= from);
  const pop = lineChart({
    points: series.map((p) => ({ x: String(p.year), y: p.total })),
    yLabel: 'Population, thousands',
    format: (v) => `${fmt(v)}k`,
  });
  const ages = barChart({
    bars: D.AGE_GROUPS.map((a) => ({ label: a.group, value: a.share })),
    yLabel: 'Share of population, %',
    format: (v) => pct(v),
  });
  const rows = [...D.REGIONS].sort((a, b) => b.population - a.population).map((r) => `
    <tr><td>${r.name}</td><td>${fmt(r.population)}</td><td>${r.density}</td></tr>`).join('');
  return `
  <h1>Population</h1>
  <p class="lede">Kalvara had 4,812,300 residents at mid-2025, up 0.6% on a year earlier.
  Growth has slowed since 2019 as births fell and net migration levelled off.</p>
  <div class="controls" role="group" aria-label="Chart range">
    <span>Show:</span>
    <span class="pill-row">
      <a class="pill" href="#/population?from=2015" aria-pressed="${from === 2015}">2015–2025</a>
      <a class="pill" href="#/population?from=2020" aria-pressed="${from === 2020}">2020–2025</a>
    </span>
  </div>
  <div class="two-col">
    ${chartCard('Population, mid-year estimates', `${from}–2025, thousands of residents`,
      pop, 'Population estimates 2025, KNSO')}
    ${chartCard('Age structure, 2025', 'Share of the population by age group, %',
      ages, 'Population estimates 2025, KNSO')}
  </div>
  <section class="card">
    <h2>Population by region, 2025</h2>
    <div class="table-wrap"><table class="data sortable">
      <thead><tr>
        <th><button data-sort="0" data-type="text">Region</button></th>
        <th><button data-sort="1" data-type="num">Population</button></th>
        <th><button data-sort="2" data-type="num">People per km²</button></th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    ${sourceNote('Regional statistics 2025, KNSO. Click a column heading to sort the table.')}
    <p><a class="btn" href="data/population-2025.csv" download>Download the data (CSV)</a></p>
  </section>`;
}

export function renderEconomy() {
  const gdp = lineChart({
    points: D.GDP_BY_YEAR.map((g) => ({ x: String(g.year), y: g.level })),
    yLabel: 'GDP, KLV billion',
    format: (v) => `KLV ${v} bn`,
  });
  const sectors = donutChart({
    slices: D.GDP_SECTORS.map((s) => ({ label: s.sector, value: s.share })),
    centre: '61.4%',
    centreSub: 'services',
  });
  const inflation = barChart({
    bars: D.INFLATION_BY_YEAR.map((i) => ({ label: String(i.year), value: i.rate })),
    yLabel: 'Consumer price inflation, %',
    format: (v) => pct(v),
  });
  const partners = D.TRADE_PARTNERS.map((t) => `
    <tr><td>${t.partner}</td><td>${pct(t.share)}</td></tr>`).join('');
  return `
  <h1>Economy</h1>
  <p class="lede">GDP reached KLV 96.4 billion in 2025, growing 3.1% in real terms.
  Inflation eased to 2.8% in October 2026, and the trade surplus was KLV 2.8 billion in 2025.</p>
  <div class="two-col">
    ${chartCard('GDP, 2015–2025', 'Gross domestic product, KLV billion, current prices',
      gdp, 'National accounts 2025, KNSO')}
    ${chartCard('What makes up GDP, 2025', 'Share of gross value added by sector, %',
      sectors, 'National accounts 2025, KNSO')}
  </div>
  <div class="two-col">
    ${chartCard('Consumer price inflation', 'Annual change in the consumer price index, %',
      inflation, 'Consumer price index, October 2026, KNSO')}
    <section class="card">
      <h2 class="chart-title">Trade in 2025</h2>
      <p class="chart-sub">Exports, imports and the balance, KLV billion</p>
      <div class="table-wrap"><table class="data">
        <tbody>
          <tr><td>Exports of goods</td><td>KLV ${D.TRADE.exports} bn</td></tr>
          <tr><td>Imports of goods</td><td>KLV ${D.TRADE.imports} bn</td></tr>
          <tr><td><strong>Trade balance</strong></td><td><strong>KLV +${D.TRADE.balance} bn</strong></td></tr>
        </tbody>
      </table></div>
      <h3>Exports by partner, % of exports</h3>
      <div class="table-wrap"><table class="data">
        <thead><tr><th>Partner</th><th>Share</th></tr></thead>
        <tbody>${partners}</tbody>
      </table></div>
      ${sourceNote('External trade statistics 2025, KNSO.')}
      <p><a class="btn" href="data/gdp-2025.csv" download>Download GDP data (CSV)</a></p>
    </section>
  </div>`;
}

export function renderLabour() {
  const unemp = lineChart({
    points: D.UNEMPLOYMENT_BY_YEAR.map((u) => ({ x: String(u.year), y: u.rate })),
    yLabel: 'Unemployment rate, %',
    format: (v) => pct(v),
  });
  const byAge = hbarChart({
    bars: D.UNEMPLOYMENT_BY_AGE.map((a) => ({ label: a.group, value: a.rate })),
    format: (v) => pct(v),
  });
  const sectors = hbarChart({
    bars: D.EMPLOYMENT_BY_SECTOR.map((s) => ({ label: s.sector, value: s.share })),
    format: (v) => pct(v),
  });
  return `
  <h1>Labour</h1>
  <p class="lede">Unemployment stood at 5.2% in the third quarter of 2026, the lowest since 2019.
  Young people still face the hardest market: 11.8% of 15–24 year olds are unemployed.</p>
  <div class="two-col">
    ${chartCard('Unemployment rate, 2019–2026', 'Labour force survey, % of the labour force',
      unemp, 'Labour force survey Q3 2026, KNSO')}
    ${chartCard('Unemployment by age, Q3 2026', '% of the labour force in each age group',
      byAge, 'Labour force survey Q3 2026, KNSO')}
  </div>
  <div class="two-col">
    ${chartCard('Where people work, 2025', 'Share of employment by sector, %',
      sectors, 'Labour force survey Q3 2026, KNSO')}
    <section class="card">
      <h2 class="chart-title">Wages in 2025</h2>
      <p class="chart-sub">Full-time employees, gross monthly pay</p>
      <div class="table-wrap"><table class="data">
        <tbody>
          <tr><td>Median monthly wage</td><td>KLV ${fmt(D.WAGES.medianMonthly)}</td></tr>
          <tr><td>Mean monthly wage</td><td>KLV ${fmt(D.WAGES.meanMonthly)}</td></tr>
          <tr><td>Change on 2024 (nominal)</td><td>+4.2%</td></tr>
          <tr><td>Change on 2024 (real)</td><td>+1.1%</td></tr>
        </tbody>
      </table></div>
      ${sourceNote('Earnings survey 2025, KNSO.')}
      <p><a class="btn" href="data/labour-2026.csv" download>Download labour data (CSV)</a></p>
    </section>
  </div>`;
}

export function renderHealth() {
  const life = lineChart({
    points: D.LIFE_EXPECTANCY.map((l) => ({ x: String(l.year), y: l.all })),
    yLabel: 'Life expectancy, years',
    format: (v) => `${v.toFixed(1)} yrs`,
  });
  const causes = donutChart({
    slices: D.CAUSES_OF_DEATH.map((c) => ({ label: c.cause, value: c.share })),
    centre: '31.2%',
    centreSub: 'circulatory',
  });
  const rows = D.LIFE_EXPECTANCY.map((l) => `
    <tr><td>${l.year}</td><td>${l.all.toFixed(1)}</td><td>${l.female.toFixed(1)}</td><td>${l.male.toFixed(1)}</td></tr>`).join('');
  return `
  <h1>Health</h1>
  <p class="lede">A child born in Kalvara in 2025 can expect to live 78.6 years — 81.3 for girls,
  76.0 for boys. Health spending was 8.9% of GDP in 2025.</p>
  <div class="two-col">
    ${chartCard('Life expectancy at birth', 'Years, 2015–2025',
      life, 'Life tables 2025, KNSO')}
    ${chartCard('Causes of death, 2025', 'Share of all deaths, % — circulatory diseases first',
      causes, 'Health statistics 2025, KNSO')}
  </div>
  <section class="card">
    <h2>Life expectancy by sex</h2>
    <div class="table-wrap"><table class="data sortable">
      <thead><tr>
        <th><button data-sort="0" data-type="num">Year</button></th>
        <th><button data-sort="1" data-type="num">All (years)</button></th>
        <th><button data-sort="2" data-type="num">Female</button></th>
        <th><button data-sort="3" data-type="num">Male</button></th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    ${sourceNote('Life tables 2025, KNSO. Click a column heading to sort the table.')}
    <p>Health system, 2025: ${D.HEALTH.doctorsPer1000} doctors and ${D.HEALTH.bedsPer1000} hospital
    beds per 1,000 residents; health spending ${D.HEALTH.spendingShareGdp}% of GDP.</p>
    <p><a class="btn" href="data/health-2025.csv" download>Download health data (CSV)</a></p>
  </section>`;
}

export function renderEducation() {
  const enrol = hbarChart({
    bars: D.ENROLMENT.map((e) => ({ label: e.level, value: e.rate })),
    format: (v) => pct(v),
  });
  const attain = hbarChart({
    bars: D.ATTAINMENT.map((a) => ({ label: a.level, value: a.share })),
    format: (v) => pct(v),
  });
  return `
  <h1>Education</h1>
  <p class="lede">Nearly every child is in school: 99.1% at primary level and 98.4% at lower
  secondary. 58.3% of young people go on to tertiary education, and 35.6% of adults
  aged 25–64 hold a tertiary qualification.</p>
  <div class="two-col">
    ${chartCard('Enrolment rates, 2025', 'Net enrolment by level, % of the age group',
      enrol, 'Education statistics 2025, KNSO')}
    ${chartCard('Highest qualification, adults 25–64', 'Share of adults by attainment, %',
      attain, 'Education statistics 2025, KNSO')}
  </div>
  <section class="card">
    <h2>Schooling in numbers, 2025</h2>
    <div class="table-wrap"><table class="data">
      <tbody>
        <tr><td>Education spending</td><td>${D.EDUCATION.spendingShareGdp}% of GDP</td></tr>
        <tr><td>Pupils per teacher (primary)</td><td>${D.EDUCATION.pupilsPerTeacher}</td></tr>
        <tr><td>Tertiary enrolment</td><td>58.3% of 18–24 year olds</td></tr>
        <tr><td>Adults with a tertiary qualification</td><td>35.6% of 25–64 year olds</td></tr>
      </tbody>
    </table></div>
    ${sourceNote('Education statistics 2025, KNSO; Ministry of Education.')}
    <p><a class="btn" href="data/education-2025.csv" download>Download education data (CSV)</a></p>
  </section>`;
}

export function renderRegions() {
  const popBars = hbarChart({
    bars: [...D.REGIONS].sort((a, b) => b.population - a.population)
      .map((r) => ({ label: r.name, value: r.population })),
    format: (v) => fmt(v),
  });
  const rows = D.REGIONS.map((r) => `
    <tr><td>${r.name}</td><td>${fmt(r.population)}</td><td>KLV ${fmt(r.gdpPerCapita)}</td><td>${pct(r.unemployment)}</td><td>${r.density}</td></tr>`).join('');
  return `
  <h1>Regions</h1>
  <p class="lede">Kalvara has eight regions. Port Kalvara holds a quarter of the population;
  the Highlands are the most sparsely settled and have the highest unemployment at 7.1%.</p>
  ${chartCard('Population by region, 2025', 'Residents per region',
    popBars, 'Regional statistics 2025, KNSO')}
  <section class="card">
    <h2>Regional indicators, 2025</h2>
    <div class="table-wrap"><table class="data sortable">
      <thead><tr>
        <th><button data-sort="0" data-type="text">Region</button></th>
        <th><button data-sort="1" data-type="num">Population</button></th>
        <th><button data-sort="2" data-type="num">GDP per head</button></th>
        <th><button data-sort="3" data-type="num">Unemployment</button></th>
        <th><button data-sort="4" data-type="num">People per km²</button></th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table></div>
    ${sourceNote('Regional statistics 2025, KNSO. Click a column heading to sort the table.')}
    <p><a class="btn" href="data/regions-2025.csv" download>Download regional data (CSV)</a></p>
  </section>`;
}

export function renderReleases(query) {
  const q = (query.get('q') ?? '').trim();
  let body;
  if (q) {
    const hits = D.SEARCH_INDEX.filter((e) => `${e.title} ${e.text}`.toLowerCase().includes(q.toLowerCase()));
    body = `<h1>Search results for “${q}”</h1>
    ${hits.length ? `<ul class="link-list">${hits.map((h) => `<li><a href="${h.route}">${h.title}</a></li>`).join('')}</ul>`
      : `<p>No indicator or release matches “${q}”. Try “unemployment”, “GDP” or “regions”.</p>`}
    <p><a class="btn secondary" href="#/releases">Browse all releases</a></p>`;
  } else {
    const items = D.RELEASES.map((r) => `
      <li><span class="date">${r.date}</span>
      <a href="${r.file}" download>${r.title}</a>
      <span class="tag">${r.tag}</span></li>`).join('');
    body = `<h1>Releases &amp; data</h1>
    <p class="lede">Every release below is a CSV file of the figures behind the charts on this
    site, free to download and reuse with attribution. Releases come out at 09:00 on the
    date shown.</p>
    <section class="card"><h2>Latest releases</h2>
    <ul class="release-list">${items}</ul></section>
    <section class="card"><h2>Release calendar</h2>
    <div class="table-wrap"><table class="data">
      <thead><tr><th>Release</th><th>Date</th></tr></thead>
      <tbody>
        <tr><td>Consumer prices, November 2026</td><td>9 December 2026</td></tr>
        <tr><td>Labour force survey, Q3 2026 (full tables)</td><td>16 December 2026</td></tr>
        <tr><td>National accounts, Q3 2026 (revised)</td><td>18 December 2026</td></tr>
        <tr><td>Population estimates, end-2026</td><td>20 January 2027</td></tr>
      </tbody>
    </table></div></section>`;
  }
  return body;
}

export function renderMethods() {
  return `
  <h1>Sources &amp; methods</h1>
  <p class="lede">How the Office produces the figures on this site, what they mean, and how
  they are revised.</p>
  <section class="card">
    <h2>Where the figures come from</h2>
    <ul class="link-list">
      <li><strong>Population estimates</strong> <span class="desc">— civil register and census 2021, updated with births, deaths and migration. Mid-year estimates, 2025.</span></li>
      <li><strong>National accounts</strong> <span class="desc">— business surveys, tax records and government accounts, compiled to the Kalvara System of National Accounts. 2025.</span></li>
      <li><strong>Consumer price index</strong> <span class="desc">— prices collected monthly in 42 towns for a basket of 620 goods and services. October 2026.</span></li>
      <li><strong>Labour force survey</strong> <span class="desc">— quarterly household survey of 12,000 households. Q3 2026.</span></li>
      <li><strong>Life tables</strong> <span class="desc">— deaths register and population estimates. 2025.</span></li>
      <li><strong>Education statistics</strong> <span class="desc">— school census and Ministry of Education records. 2025.</span></li>
    </ul>
  </section>
  <section class="card">
    <h2>Definitions</h2>
    <p><strong>Unemployment rate:</strong> unemployed people as a share of the labour force
    (employed plus unemployed), ages 15 and over, following the international standard.</p>
    <p><strong>Real GDP growth:</strong> change in GDP after removing price changes, using
    2020 as the base year.</p>
    <p><strong>Median wage:</strong> the wage of the middle employee when all full-time
    employees are ranked by gross monthly pay.</p>
    <p><strong>Life expectancy at birth:</strong> the average years a newborn would live if
    death rates at each age stayed as they are in the reference year.</p>
  </section>
  <section class="card">
    <h2>Revisions</h2>
    <p>Figures are revised when better data arrive. National accounts are revised each
    quarter; population estimates once a year. Every revision is flagged on the release
    page and the previous value is kept in the downloadable CSV.</p>
    <p class="small muted">Contact: statistics@kalvara.example — Kalvara National Statistics Office,
    14 Merdeka Square, Port Kalvara.</p>
  </section>`;
}
