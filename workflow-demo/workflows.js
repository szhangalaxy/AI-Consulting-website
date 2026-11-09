'use strict';

// Local, deterministic illustrations only. Never calls AI or an external system.
const byId = id => document.getElementById(id);
const tabs = [...document.querySelectorAll('[data-example]')];
let activeSample = 'enquiries';
let activeScenario = 'complete';
let simulationComplete = false;
const money = value => new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(value);
const decimal = value => value.toFixed(2);
const fields = rows => '<dl class="wf-fields">' + rows.map(([name, value]) => `<dt>${name}</dt><dd>${value}</dd>`).join('') + '</dl>';
const check = (text, warning) => `<p class="wf-check${warning ? ' is-warning' : ''}">${warning ? 'Needs attention' : 'Checks passed'} · ${text}</p>`;
const record = (title, body, owner, state) => `<div class="wf-record"><div><small>Record</small><strong>${title}</strong><p>${body}</p></div><div><small>Assigned to</small><strong>${owner}</strong></div><div><small>Status</small><strong>${state}</strong></div></div>`;
const configs = {
  enquiries: {
    context: '01 / Enquiry to follow-up · office cleaning',
    title: 'An enquiry becomes an assigned next step.',
    problem: 'Capture the enquiry once and give someone responsibility for the next step, so it does not get lost in the inbox.',
    mobileTitle: 'Enquiry follow-up',
    mobileProblem: 'Capture the details, draft a reply and assign the next step.',
    scenarios: ['Complete details', 'Missing site details'],
    audit: 'We would map who handles enquiries, which details a quote needs, access to the inbox and lead system, duplicate handling, and when a person must approve a response. Integrations depend on your tools and permissions.',
    measure: 'Time to first reviewed response, missed follow-ups and repeated data entry.'
  },
  documents: {
    context: '02 / Invoice to accounting draft · supplier admin',
    title: 'A document becomes a checked record.',
    problem: 'Reading an invoice is only the start. The useful work is matching it to an order, catching gaps and preparing a record someone can verify.',
    mobileTitle: 'Invoice checks',
    mobileProblem: 'Match the order, flag gaps and prepare a checked draft.',
    scenarios: ['Matched invoice', 'Missing references'],
    audit: 'We would assess document formats, source quality, access to purchase orders, tax rules, duplicate checks, accounting permissions and review responsibilities. Entry drafting and payment approval are separate boundaries.',
    measure: 'Handling time, correction rates and documents held for review. No payment is authorised in this example.'
  },
  reports: {
    context: '03 / Two sources to one weekly view · operations',
    title: 'Scattered records become a useful weekly view.',
    problem: 'Bring the right records together, check the numbers and show what needs attention in one weekly view.',
    mobileTitle: 'Weekly reporting',
    mobileProblem: 'Check two sample sources and prepare a weekly summary.',
    scenarios: ['Complete records', 'Missing quote value'],
    audit: 'We would agree metric definitions, reporting periods, source ownership, refresh timing and reliable join keys. We would also define which gaps should hold a report and who resolves them before it is shared.',
    measure: 'Preparation time, missing records, reconciliation failures and corrections before sharing. Any savings would need validation.'
  }
};

function enquiryView(exception) {
  const message = exception
    ? 'Hi, could you quote monthly cleaning for our two offices in Melbourne? Please let us know what details you need.'
    : 'Hi, could you quote monthly cleaning for two offices in Melbourne 3000? They are 120 m² and 180 m². We need floors, desks and kitchenettes cleaned. Could you advise available times?';
  const draft = exception
    ? 'Thanks for your enquiry. Could you share the size of each office, the postcode and which areas need cleaning? Our team can then review the scope and prepare a quote.'
    : 'Thanks for the details. We have noted two offices (120 m² and 180 m²) in Melbourne 3000 for monthly cleaning of floors, desks and kitchenettes. Our team will review the scope and get back to you with a quote and available times.';
  return {
    source: `<div class="wf-email-header"><strong>Monthly office cleaning</strong>From: Alex · Example Offices<br>To: enquiries@example.test</div><p class="wf-message">${message}</p>`,
    prepared: fields([['Lead reference', 'ENQ-1042'], ['Service', 'Monthly office cleaning'], ['Locations', exception ? '2 offices · sizes unknown' : '2 offices · 120 m² + 180 m²'], ['Area', exception ? 'Melbourne · postcode needed' : 'Melbourne 3000']])
      + check(exception ? 'Site sizes, cleaning scope and postcode are missing.' : 'Required scope details captured. Quote and availability still need a person.', exception)
      + `<div class="wf-draft"><p class="wf-label">Draft for a person to review</p><p>${draft}</p></div><p class="wf-human-note">A person verifies the scope and wording. No price, booking or availability is invented.</p>`,
    button: exception ? 'Preview clarification task' : 'Preview follow-up task',
    resultTitle: exception ? 'Clarification task created' : 'Follow-up task created',
    result: record('ENQ-1042 · ' + (exception ? 'Clarify scope' : 'Prepare quote'), exception ? 'Request missing site details. Hold the quote until the customer responds.' : 'Review the scope, check availability and prepare the quote. Due next business day.', 'Service coordinator', exception ? 'Awaiting customer details' : 'Follow-up queued'),
    status: exception ? 'Sample clarification queued. Nothing was sent.' : 'Sample lead and follow-up created. Nothing was sent.',
    pending: 'After review, a lead record and an assigned task will appear here.'
  };
}

function invoiceView(exception) {
  const quantity = 12, unitPrice = 40;
  const subtotal = quantity * unitPrice, gst = subtotal * 0.1, total = subtotal + gst;
  const source = `<p class="wf-label">Example Supply Co. · fictional invoice</p><p class="wf-message"><strong>INV-1042</strong></p><dl class="wf-fields"><dt>Order</dt><dd data-source-id="invoice-order">${exception ? 'Not provided' : 'PO-208'}</dd><dt>Currency</dt><dd data-source-id="invoice-currency">${exception ? 'Not stated' : 'AUD'}</dd></dl>
    <table class="wf-data-table"><caption>Invoice line item</caption><thead><tr><th scope="col">Item</th><th scope="col">Qty</th><th scope="col">Unit</th><th scope="col">Amount</th></tr></thead><tbody><tr><td>Filters</td><td>${quantity}</td><td>${decimal(unitPrice)}</td><td>${decimal(subtotal)}</td></tr></tbody></table>
    <dl class="wf-fields"><dt>Subtotal</dt><dd>${decimal(subtotal)}</dd><dt>GST (10%)</dt><dd>${decimal(gst)}</dd></dl><div class="wf-invoice-total" data-source-id="invoice-total"><span>Total</span><span>${decimal(total)}${exception ? '' : ' AUD'}</span></div>
    <p class="wf-human-note">Sample order PO-208: 12 filters × AUD 40.00, plus 10% GST. ${exception ? 'No order reference is supplied for matching.' : 'Invoice reference and currency support the match.'}</p>`;
  return {
    source,
    prepared: fields([['Invoice', 'INV-1042'], ['Order match', `<button class="wf-source-link" data-source="invoice-order">${exception ? 'Unmatched' : 'PO-208 · matched'}<small>Show in invoice</small></button>`], ['Currency', `<button class="wf-source-link" data-source="invoice-currency">${exception ? 'Needs confirmation' : 'AUD'}<small>Show in invoice</small></button>`], ['Total', `<button class="wf-source-link" data-source="invoice-total">${decimal(total)}${exception ? ' · currency unknown' : ' AUD'}<small>Show invoice total</small></button>`]])
      + check(exception ? 'Order reference and currency need confirmation. Do not assume a match from the amount.' : `12 × ${decimal(unitPrice)} = ${decimal(subtotal)}; GST ${decimal(gst)}; total ${decimal(total)}. Order quantity and unit price match.`, exception)
      + `<p class="wf-human-note">A reviewer checks the source, supplier and tax treatment. ${exception ? 'This record stays out of the accounting draft queue.' : 'The next step prepares a draft only; it does not post the invoice or authorise payment.'}</p>`,
    button: exception ? 'Preview review queue' : 'Preview entry draft',
    resultTitle: exception ? 'Invoice held in review' : 'Draft accounting entry prepared',
    result: record('INV-1042', exception ? 'Confirm order reference and currency with the source. No accounting draft created.' : `PO-208 · 12 filters · ${decimal(total)} AUD including ${decimal(gst)} GST.`, 'Accounts reviewer', exception ? 'Held · missing information' : 'Draft · not posted'),
    status: exception ? 'Sample invoice held for review. Nothing was posted or paid.' : 'Sample entry draft saved. Nothing was posted or paid.',
    pending: 'After review, the invoice will become a draft accounting entry or stay in a visible exception queue.'
  };
}

function reportingView(exception) {
  const quotes = [
    { id: 'Q-201', status: 'Accepted', amount: 1250 },
    { id: 'Q-202', status: 'Open · 3 days', amount: 950, age: 3 },
    { id: 'Q-203', status: 'Accepted', amount: exception ? null : 1800 },
    { id: 'Q-204', status: 'Open · 8 days', amount: 700, age: 8 }
  ];
  const jobs = [{ id: 'J-301', quote: 'Q-201' }, { id: 'J-302', quote: 'Q-203' }];
  const accepted = quotes.filter(row => row.status === 'Accepted');
  const missing = accepted.filter(row => row.amount === null);
  const total = missing.length ? null : accepted.reduce((sum, row) => sum + row.amount, 0);
  const previous = 2600;
  const change = total === null ? null : total - previous;
  const percent = total === null ? null : (change / previous * 100).toFixed(1);
  const matched = accepted.filter(quote => jobs.some(job => job.quote === quote.id)).length;
  const overdue = quotes.filter(row => row.age > 7);
  const summary = total === null
    ? 'Accepted quote value is incomplete: Q-203 has no amount. The total and comparison with the previous week are withheld. Q-204 still needs follow-up.'
    : `Accepted quote value is ${money(total)}, up ${money(change)} (${percent}%) from the previous sample week. Both accepted quotes match a job. Q-204 has been open for 8 days and needs follow-up.`;
  return {
    source: `<p class="wf-label">Sample week · 12–16 October 2026</p><table class="wf-data-table"><caption>Source 1 · quote register</caption><thead><tr><th scope="col">Quote</th><th scope="col">State / age</th><th scope="col">AUD</th></tr></thead><tbody>${quotes.map(row => `<tr${row.amount === null ? ' class="is-missing"' : ''}><td>${row.id}</td><td>${row.status}</td><td>${row.amount === null ? 'Missing' : money(row.amount)}</td></tr>`).join('')}</tbody></table>
      <table class="wf-data-table"><caption>Source 2 · confirmed job register</caption><thead><tr><th scope="col">Job</th><th scope="col">Quote reference</th></tr></thead><tbody>${jobs.map(row => `<tr><td>${row.id}</td><td>${row.quote}</td></tr>`).join('')}</tbody></table><p class="wf-human-note">Previous sample week (5–9 Oct): accepted quote value ${money(previous)}, 2 accepted quotes. Both weeks count quotes by their acceptance date. Values exclude GST; quote value is not revenue.</p>`,
    prepared: `<div class="wf-stat-grid"><div class="wf-stat${exception ? ' is-warning' : ''}"><span>Accepted quote value</span><strong>${total === null ? 'Incomplete' : money(total)}</strong><small>${total === null ? 'Comparison withheld' : `+${money(change)} · +${percent}% vs prior week`}</small></div><div class="wf-stat"><span>Accepted quotes matched</span><strong>${matched} of ${accepted.length}</strong><small>to confirmed jobs</small></div></div>`
      + check(exception ? `${missing[0].id} is missing its accepted value. Resolve before sharing.` : 'Accepted values complete. Both accepted quote IDs match confirmed jobs.', exception)
      + `<div class="wf-draft"><p class="wf-label">Draft weekly summary</p><p>${summary}</p></div><p class="wf-human-note">Action: follow up ${overdue.map(row => row.id).join(', ')} (open longer than 7 days). A person checks definitions, source freshness and commentary before sharing.</p>`,
    button: exception ? 'Preview held report' : 'Preview weekly report',
    resultTitle: exception ? 'Report held · data needs attention' : 'Weekly report preview ready',
    result: exception
      ? record('Weekly view · 12–16 Oct', 'Complete the accepted value on Q-203, then rerun the checks. No total or growth figure published.', 'Reporting owner', 'Held · missing quote value')
      : record('Weekly view · 12–16 Oct', `${money(total)} accepted quote value · ${accepted.length} accepted quotes matched to jobs · ${overdue.length} overdue follow-up (${overdue[0].id}).`, 'Operations lead', 'Reviewed · ready to share'),
    status: exception ? 'Sample report held. Missing values were not filled in or published.' : 'Sample weekly report prepared. Nothing was shared externally.',
    pending: 'After review, a report preview will appear here. Incomplete data will hold the report instead.'
  };
}

function getView() {
  const exception = activeScenario === 'exception';
  return ({ enquiries: enquiryView, documents: invoiceView, reports: reportingView })[activeSample](exception);
}

const workflowMobileQuery = window.matchMedia('(max-width: 700px)');
function updateWorkflowIntro() {
  const config = configs[activeSample];
  byId('example-heading').textContent = workflowMobileQuery.matches ? 'Workflow demo' : 'See the work move.';
  byId('wf-context').textContent = config.context;
  byId('demo-title').textContent = workflowMobileQuery.matches ? config.mobileTitle : config.title;
  byId('wf-problem').textContent = workflowMobileQuery.matches ? config.mobileProblem : config.problem;
  // Keep the DOM/keyboard order in step with the visual order on each layout.
  const workspace = document.querySelector('.wf-workspace');
  const first = workspace.querySelector(workflowMobileQuery.matches ? '.wf-prepared' : '.wf-source');
  if (workspace.firstElementChild !== first) {
    const focused = document.activeElement;
    const restoreFocus = first.contains(focused);
    workspace.prepend(first);
    if (restoreFocus) focused.focus({ preventScroll: true });
  }
}
// Resizing changes presentation only. Preserve the selected scenario and result.
workflowMobileQuery.addEventListener('change', updateWorkflowIntro);

function renderSample(key, scenario = 'complete') {
  activeSample = key;
  activeScenario = scenario;
  simulationComplete = false;
  const config = configs[key], view = getView();
  tabs.forEach(tab => {
    const selected = tab.dataset.example === key;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  byId('demo-panel').setAttribute('aria-labelledby', `tab-${key}`);
  updateWorkflowIntro();
  document.querySelectorAll('[data-scenario]').forEach((button, index) => {
    button.textContent = config.scenarios[index];
    button.setAttribute('aria-pressed', String(button.dataset.scenario === scenario));
  });
  byId('wf-source-body').innerHTML = view.source;
  byId('wf-prepared-body').innerHTML = view.prepared;
  const badge = byId('wf-review-badge');
  badge.textContent = scenario === 'exception' ? 'Needs attention' : 'Ready for review';
  badge.className = 'wf-badge' + (scenario === 'exception' ? ' is-warning' : '');
  byId('wf-audit-copy').textContent = config.audit;
  byId('demo-measure').textContent = config.measure;
  byId('sample-approve').textContent = view.button;
  byId('sample-approve').disabled = false;
  byId('sample-status').textContent = scenario === 'exception' ? 'Missing information: try routing the exception.' : 'Review the prepared work, then simulate the next step.';
  byId('wf-result').className = 'wf-result';
  byId('wf-result-title').textContent = 'What happens next';
  byId('wf-result-body').innerHTML = `<p>${view.pending}</p>`;
  document.querySelector('.wf-source-details').open = !window.matchMedia('(max-width: 700px)').matches;
  document.querySelector('.wf-scroll').scrollTop = 0;
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => renderSample(tab.dataset.example));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      renderSample(tabs[next].dataset.example);
      tabs[next].focus();
    }
  });
});
document.querySelectorAll('[data-scenario]').forEach(button => button.addEventListener('click', () => renderSample(activeSample, button.dataset.scenario)));
byId('sample-reset').addEventListener('click', () => renderSample(activeSample, activeScenario));
byId('sample-approve').addEventListener('click', () => {
  if (simulationComplete) return;
  simulationComplete = true;
  const view = getView();
  const result = byId('wf-result');
  result.className = 'wf-result ' + (activeScenario === 'exception' ? 'is-held' : 'is-complete');
  byId('wf-result-title').textContent = view.resultTitle;
  byId('wf-result-body').innerHTML = view.result + '<p class="wf-result-note">Local simulation only. No external record, message, invoice or report was created or sent.</p>';
  byId('sample-status').textContent = view.status;
  byId('sample-approve').disabled = true;
  result.focus({ preventScroll: true });
  result.scrollIntoView({ block: 'nearest', behavior: 'instant' });
});
byId('wf-prepared-body').addEventListener('click', event => {
  const button = event.target.closest('[data-source]');
  if (!button) return;
  document.querySelector('.wf-source-details').open = true;
  document.querySelectorAll('.wf-spotlight').forEach(node => node.classList.remove('wf-spotlight'));
  const source = document.querySelector(`[data-source-id="${button.dataset.source}"]`);
  source.classList.add('wf-spotlight');
  source.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  source.setAttribute('tabindex', '-1');
  source.focus({ preventScroll: true });
  byId('sample-status').textContent = 'Highlighted the source field. Check it against the prepared record.';
});
renderSample('enquiries');
