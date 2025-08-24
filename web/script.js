import { project } from './project.js';

const initialAmountInput = document.getElementById('initialAmount');
const annualReturnRateInput = document.getElementById('annualReturnRate');
const annualContributionInput = document.getElementById('annualContribution');
const withdrawStartYearInput = document.getElementById('withdrawStartYear');
const withdrawTypeSelect = document.getElementById('withdrawType');
const withdrawPercentInput = document.getElementById('withdrawPercent');
const withdrawAmountInput = document.getElementById('withdrawAmount');
const withdrawPercentGroup = document.getElementById('withdrawPercentGroup');
const withdrawAmountGroup = document.getElementById('withdrawAmountGroup');
const calculateButton = document.getElementById('calculateButton');
const saveButton = document.getElementById('saveButton');
const loadButton = document.getElementById('loadButton');
const resultsTableBody = document.querySelector('#resultsTable tbody');
const plotOptions = document.querySelectorAll('.plot-option input');
let chart;

function updateWithdrawFields() {
  if (withdrawTypeSelect.value === 'percent') {
    withdrawPercentGroup.classList.remove('hidden');
    withdrawAmountGroup.classList.add('hidden');
  } else {
    withdrawPercentGroup.classList.add('hidden');
    withdrawAmountGroup.classList.remove('hidden');
  }
}

withdrawTypeSelect.addEventListener('change', updateWithdrawFields);
updateWithdrawFields();

function getScenario() {
  return {
    initialAmount: Number(initialAmountInput.value) || 0,
    annualReturnRate: Number(annualReturnRateInput.value) || 0,
    annualContribution: Number(annualContributionInput.value) || 0,
    withdrawStartYear: parseInt(withdrawStartYearInput.value, 10) || 0,
    withdrawType: withdrawTypeSelect.value,
    withdrawPercent: Number(withdrawPercentInput.value) || 0,
    withdrawAmount: Number(withdrawAmountInput.value) || 0,
  };
}

function calculate() {
  const scenario = getScenario();
  const rows = project(
    scenario.initialAmount,
    scenario.annualReturnRate,
    scenario.annualContribution,
    scenario.withdrawStartYear,
    scenario.withdrawType === 'percent' ? scenario.withdrawPercent : 0,
    scenario.withdrawType === 'amount' ? scenario.withdrawAmount : undefined
  );
  renderTable(rows);
  renderChart(rows);
}

calculateButton.addEventListener('click', calculate);

function renderTable(rows) {
  resultsTableBody.innerHTML = '';
  rows.forEach((r) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${r.year}</td>
      <td>${r.startBalance.toFixed(2)}</td>
      <td>${r.contribution.toFixed(2)}</td>
      <td>${r.withdrawal.toFixed(2)}</td>
      <td>${r.growth.toFixed(2)}</td>
      <td>${r.endBalance.toFixed(2)}</td>
    `;
    resultsTableBody.appendChild(tr);
  });
}

function getSelectedColumns() {
  const cols = [];
  plotOptions.forEach((chk) => {
    if (chk.checked) cols.push(chk.dataset.column);
  });
  return cols;
}

plotOptions.forEach((chk) => chk.addEventListener('change', () => {
  if (chart) calculate();
}));

function renderChart(rows) {
  const labels = rows.map((r) => r.year);
  const selected = getSelectedColumns();
  const datasets = selected.map((col) => ({
    label: col,
    data: rows.map((r) => r[col]),
    borderWidth: 2,
    fill: false,
  }));
  if (chart) chart.destroy();
  chart = new Chart(document.getElementById('chart'), {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

const STORAGE_KEY = 'fire-calculator-scenario';

saveButton.addEventListener('click', () => {
  const name = prompt('Enter scenario name');
  if (!name) return;
  const scenario = { ...getScenario(), name };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scenario));
});

loadButton.addEventListener('click', () => {
  const json = localStorage.getItem(STORAGE_KEY);
  if (!json) return;
  const scenario = JSON.parse(json);
  initialAmountInput.value = scenario.initialAmount ?? '';
  annualReturnRateInput.value = scenario.annualReturnRate ?? '';
  annualContributionInput.value = scenario.annualContribution ?? '';
  withdrawStartYearInput.value = scenario.withdrawStartYear ?? '';
  withdrawTypeSelect.value = scenario.withdrawType === 'amount' ? 'amount' : 'percent';
  withdrawPercentInput.value = scenario.withdrawPercent ?? '';
  withdrawAmountInput.value = scenario.withdrawAmount ?? '';
  updateWithdrawFields();
});
