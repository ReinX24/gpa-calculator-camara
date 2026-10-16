const GRADE_VALUES = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  "D-": 0.7,
  F: 0.0
};

const subjectsContainer = document.getElementById("subjects");
const rowTemplate = document.getElementById("subject-row-template");
const resultsSection = document.getElementById("results");
const resultsBody = document.getElementById("results-body");
const resultsFoot = document.getElementById("results-foot");
const gpaValue = document.getElementById("gpa-value");
const errorMessage = document.getElementById("error-message");
const addButton = document.getElementById("add-row");
const calculateButton = document.getElementById("calculate");
const resetButton = document.getElementById("reset-button");

function buildGradeOptions(select, selectedGrade) {
  for (const [letter, value] of Object.entries(GRADE_VALUES)) {
    const option = document.createElement("option");
    option.value = letter;
    option.textContent = `${letter} (${value.toFixed(1)})`;
    select.appendChild(option);
  }
  select.value = selectedGrade;
}

function addSubjectRow({ name = "", grade = "A", credits = 3 } = {}) {
  const row = rowTemplate.content.firstElementChild.cloneNode(true);
  buildGradeOptions(row.querySelector(".grade-select"), grade);
  row.querySelector(".course-name").value = name;
  row.querySelector(".course-credits").value = credits;
  row.querySelector(".remove-row").addEventListener("click", () => removeSubjectRow(row));
  row.addEventListener("input", () => row.classList.remove("invalid"));
  subjectsContainer.appendChild(row);
  return row;
}

function removeSubjectRow(row) {
  if (subjectsContainer.children.length === 1) {
    showError("Your schedule needs at least one subject.");
    return;
  }
  row.remove();
  clearError();
}

function showError(message, row) {
  errorMessage.textContent = message;
  if (row) {
    row.classList.add("invalid");
  }
}

function clearError() {
  errorMessage.textContent = "";
  subjectsContainer.querySelectorAll(".invalid").forEach((row) => row.classList.remove("invalid"));
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatNumber(value) {
  return Number.isInteger(value) ? value.toString() : value.toFixed(2);
}

function readSubject(row, index) {
  const nameField = row.querySelector(".course-name");
  const gradeField = row.querySelector(".grade-select");
  const creditField = row.querySelector(".course-credits");
  const name = nameField.value.trim() || `Subject ${index + 1}`;
  return {
    name,
    grade: gradeField.value,
    credits: parseFloat(creditField.value),
    gradeValue: GRADE_VALUES[gradeField.value]
  };
}

function calculateGPA() {
  clearError();

  const rows = Array.from(subjectsContainer.children);
  const subjects = [];
  let totalCredits = 0;
  let totalGradePoints = 0;

  for (let i = 0; i < rows.length; i++) {
    const subject = readSubject(rows[i], i);

    if (!Number.isFinite(subject.credits) || subject.credits <= 0) {
      showError(`Enter credit hours greater than 0 for "${subject.name}".`, rows[i]);
      return;
    }

    subject.gradePoints = subject.gradeValue * subject.credits;
    totalCredits += subject.credits;
    totalGradePoints += subject.gradePoints;
    subjects.push(subject);
  }

  const gpa = totalGradePoints / totalCredits;
  renderResults(subjects, totalCredits, totalGradePoints, gpa);
}

function renderResults(subjects, totalCredits, totalGradePoints, gpa) {
  resultsBody.innerHTML = "";

  subjects.forEach((subject) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(subject.name)}</td>
      <td>${subject.grade}</td>
      <td>${subject.gradeValue.toFixed(1)}</td>
      <td>${formatNumber(subject.credits)}</td>
      <td>${formatNumber(subject.gradePoints)}</td>
    `;
    resultsBody.appendChild(row);
  });

  resultsFoot.innerHTML = `
    <tr>
      <td colspan="3">Total</td>
      <td>${formatNumber(totalCredits)}</td>
      <td>${formatNumber(totalGradePoints)}</td>
    </tr>
  `;

  gpaValue.textContent = gpa.toFixed(2);
  resultsSection.classList.remove("hidden");
  resultsSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function resetCalculator() {
  subjectsContainer.innerHTML = "";
  addSubjectRow();
  resultsSection.classList.add("hidden");
  clearError();
}

addButton.addEventListener("click", () => {
  addSubjectRow();
  clearError();
});

calculateButton.addEventListener("click", calculateGPA);
resetButton.addEventListener("click", resetCalculator);

addSubjectRow();
addSubjectRow();
addSubjectRow();
