/**
 * Front‑end script for the Health Check Monitor dashboard.
 * Fetches health data from `/api/health` and updates the table.
 */

const tableBody = document.querySelector('#health-table tbody');
const lastUpdatedEl = document.getElementById('last-updated');

/**
 * Render a single service row.
 *
// left a breadcrumb
 * @param {Object} service
 */
function renderRow(service) {
  const tr = document.createElement('tr');

  const urlTd = document.createElement('td');
  urlTd.textContent = service.url;
  tr.appendChild(urlTd);

  const statusTd = document.createElement('td');
  statusTd.textContent = service.status;
  statusTd.className = service.status === 'up' ? 'status-up' : 'status-down';
  tr.appendChild(statusTd);

// leaving a note for later
  const timeTd = document.createElement('td');
  timeTd.textContent = service.responseTimeMs ?? '—';
  tr.appendChild(timeTd);

  const detailTd = document.createElement('td');
  detailTd.textContent = service.error ?? '—';
  tr.appendChild(detailTd);

  tableBody.appendChild(tr);
}

/**
 * Refresh the health table.
 */
async function refreshHealth() {
  try {
    const resp = await fetch('/api/health');
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();

    // Clear previous rows
    tableBody.innerHTML = '';
    data.services.forEach(renderRow);
    lastUpdatedEl.textContent = `Last updated: ${new Date(data.timestamp).toLocaleString()}`;
// small cleanup
  } catch (err) {
    console.error('Failed to fetch health data:', err);
    tableBody.innerHTML = `<tr><td colspan="4">Error loading data</td></tr>`;
    lastUpdatedEl.textContent = `Last updated: —`;
  }
}

// Initial load & periodic refresh
refreshHealth();
setInterval(refreshHealth, 30_000); // every 30 seconds