'use strict';

// Deterministic examples only. No API, AI, or messaging service is used.
const samples = {
  enquiries: {
    title: 'Give every enquiry a clear next step.',
    input: 'Hi, we need monthly maintenance for two offices. Can you send a quote and let us know your availability next week?',
    output: 'Request: recurring office maintenance\nLocations: 2\nMissing: office sizes and service requirements\n\nDraft reply: Thanks for your enquiry. Could you share the size of each office and the services you need so our team can prepare a quote?',
    review: 'A person checks the draft. Availability and pricing are not invented or confirmed automatically.',
    done: 'Simulation complete: the reviewed draft would move to the sending step and a follow-up task would be created. Nothing was sent.',
    measure: 'response time, missed follow-ups, and time spent handling each enquiry.'
  },
  documents: {
    title: 'Turn incoming documents into useful information.',
    input: 'SAMPLE SUPPLIER INVOICE\nReference: INV-1042\nOrder reference: not provided\nDescription: 12 replacement filters\nTotal: 480.00\nCurrency: not stated',
    output: 'Invoice reference: INV-1042\nQuantity: 12 filters\nAmount: 480.00\nReview flags: missing order reference and currency\n\nNext step: request missing details before entry.',
    review: 'A person resolves missing details and verifies the source document. This example never authorises payment.',
    done: 'Simulation complete: a request for missing details would enter the review queue. No invoice was posted and no payment was made.',
    measure: 'handling time, correction rates, and the number of documents needing manual review.'
  },
  reports: {
    title: 'Spend less time putting the report together.',
    input: 'SAMPLE WEEKLY SALES RECORDS\nNew enquiries: 18\nQuotes issued: 7\nQuotes accepted: 3\nValue of accepted quotes: not recorded',
    output: 'Weekly summary: 18 new enquiries, 7 quotes issued, and 3 quotes accepted.\n\nData gap: accepted quote value is missing.\nReview prompt: check outstanding follow-ups and complete the missing value before sharing.',
    review: 'A person checks the source records. The summary does not infer revenue or a conversion rate from unmatched weekly totals.',
    done: 'Simulation complete: the checked summary would be queued for internal sharing. No report was sent.',
    measure: 'report preparation time, missing data, and corrections needed before sharing.'
  }
};

const byId = id => document.getElementById(id);
const tabs = [...document.querySelectorAll('[data-example]')];
let activeSample = 'enquiries';

function renderSample(key) {
  const sample = samples[key];
  activeSample = key;
  tabs.forEach(tab => {
    const selected = tab.dataset.example === key;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  byId('demo-panel').setAttribute('aria-labelledby', `tab-${key}`);
  byId('demo-title').textContent = sample.title;
  byId('sample-input').textContent = sample.input;
  byId('sample-output').textContent = sample.output;
  byId('sample-review').textContent = sample.review;
  byId('demo-measure').textContent = sample.measure;
  byId('sample-status').textContent = 'Waiting for a person to review this sample.';
  const approve = byId('sample-approve');
  approve.textContent = key === 'documents' ? 'Simulate requesting details' : 'Simulate approval';
  approve.disabled = false;
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
byId('sample-approve').addEventListener('click', () => {
  byId('sample-status').textContent = samples[activeSample].done;
  byId('sample-approve').disabled = true;
});
byId('sample-reset').addEventListener('click', () => renderSample(activeSample));
renderSample('enquiries');

const menuToggle = document.querySelector('.menu-toggle');
const navigation = byId('main-navigation');
function closeMenu() {
  navigation.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
    closeMenu();
    menuToggle.focus();
  }
});
window.matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);

let dialogTrigger;
function openDialog(id, trigger) {
  dialogTrigger = trigger;
  closeMenu();
  const dialog = byId(id);
  if (id === 'example-dialog') renderSample(activeSample);
  dialog.showModal();
  document.body.classList.add('dialog-open');
  if (id === 'contact-dialog' && !byId('brief-form').hidden) byId('brief-task').focus();
}
document.querySelectorAll('[data-open]').forEach(button => {
  button.addEventListener('click', () => {
    if (button.dataset.open === 'example-dialog') activeSample = 'enquiries';
    openDialog(button.dataset.open, button);
  });
});
document.querySelectorAll('[data-example-link]').forEach(button => {
  button.addEventListener('click', () => {
    activeSample = button.dataset.exampleLink;
    openDialog('example-dialog', button);
  });
});
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('dialog-open');
    if (dialogTrigger && dialogTrigger.isConnected) dialogTrigger.focus();
  });
});

const briefForm = byId('brief-form');
byId('brief-task').addEventListener('input', () => byId('brief-task').setCustomValidity(''));
briefForm.addEventListener('submit', event => {
  event.preventDefault();
  const task = byId('brief-task').value.trim();
  if (!task) {
    byId('brief-task').setCustomValidity('Please describe the task you would like to improve.');
    byId('brief-task').reportValidity();
    return;
  }
  const lines = ['WORKFLOW BRIEF', '', 'The repetitive task:', task];
  const tools = byId('brief-tools').value.trim();
  const goal = byId('brief-goal').value.trim();
  if (tools) lines.push('', 'Tools involved:', tools);
  if (goal) lines.push('', 'What a better outcome would look like:', goal);
  byId('prepared-brief').value = lines.join('\n');
  briefForm.hidden = true;
  byId('brief-result').hidden = false;
  byId('brief-status').textContent = 'Your brief is ready to copy. Nothing has been sent.';
  byId('prepared-brief').focus();
});
byId('copy-brief').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(byId('prepared-brief').value);
    byId('brief-status').textContent = 'Brief copied. Nothing has been sent.';
  } catch {
    byId('prepared-brief').focus();
    byId('prepared-brief').select();
    byId('brief-status').textContent = 'Copy is unavailable here. Your brief is selected so you can copy it manually.';
  }
});
byId('edit-brief').addEventListener('click', () => {
  briefForm.hidden = false;
  byId('brief-result').hidden = true;
  byId('brief-task').focus();
});

const policies = {
  privacy: {
    title: 'Privacy information',
    copy: 'This preview has no analytics or enquiry service. Workflow briefs stay in this page and are not stored or submitted. A reviewed privacy policy will be added before launch once the business details, hosting, and contact tools are confirmed.'
  },
  terms: {
    title: 'Website terms',
    copy: 'Business website terms will be added before launch. Service scope, deliverables, fees, ownership, and support arrangements will be agreed separately for each engagement. The workflow examples use fictional data and do not connect to external systems.'
  }
};
document.querySelectorAll('[data-policy]').forEach(button => button.addEventListener('click', () => {
  const policy = policies[button.dataset.policy];
  byId('policy-heading').textContent = policy.title;
  byId('policy-copy').textContent = policy.copy;
  openDialog('policy-dialog', button);
}));
byId('year').textContent = new Date().getFullYear();
