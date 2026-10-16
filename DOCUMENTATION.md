# GPA Calculator Project Documentation

**Student:** Dennis Camara

My project is a GPA Calculator built with three files: `index.html` (the structure and the form for entering subjects), `style.css` (the look and layout), and `script.js` (all of the calculation logic).

---

## 1. Letter Grade Conversion

My program uses 13 letter grades: **A+, A, A−, B+, B, B−, C+, C, C−, D+, D, D−, and F**.

Instead of writing a long chain of `if`/`else if` statements, I store the conversion in a JavaScript object called `GRADE_VALUES`. Each letter grade is a **key** and its numerical grade value is the **value**:

| Letter Grade | Numerical Grade (Grade Value) |
| ------------ | ----------------------------- |
| A+           | 4.0                           |
| A            | 4.0                           |
| A−           | 3.7                           |
| B+           | 3.3                           |
| B            | 3.0                           |
| B−           | 2.7                           |
| C+           | 2.3                           |
| C            | 2.0                           |
| C−           | 1.7                           |
| D+           | 1.3                           |
| D            | 1.0                           |
| D−           | 0.7                           |
| F            | 0.0                           |

```js
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
```

When the user picks a letter grade from the drop-down menu on the page, my program looks that letter up in this object (for example, `GRADE_VALUES["B+"]` gives `3.3`). Using an object is much cleaner than an `if`/`else` chain because I can change or add a grade in one place, and the drop-down menu itself is even built from this same object, so the letters and their values can never disagree with each other.

---

## 2. Grade Points

The formula I use for each subject is:

**Grade Points = Grade Value × Credit Hours**

- **Grade Value** is the numerical grade for the letter (for example, B+ = 3.3). It answers the question "how well did I do in this course?"
- **Credit Hours** is how much the course counts (for example, a math class worth 4 credits). It answers the question "how big is this course?"
- **Grade Points** is the result of multiplying them. It combines both "how good" and "how big" into one number.

For example, a B+ in a 3-credit course gives `3.3 × 3 = 9.9` grade points. A B+ in a 1-credit course gives only `3.3 × 1 = 3.3` grade points. Same grade, but the bigger course produces more grade points, which is exactly what should happen.

In my code, this happens in the `calculateGPA` function:

```js
subject.gradePoints = subject.gradeValue * subject.credits;
```

---

## 3. Weighted Grades

Yes, my subjects do **not** all have the same weight. Each subject is weighted by its **credit hours**, which the user types into the "Credits" box for every course.

The credit hours work as the weight in the calculation:

- A 4-credit course counts **more** toward the GPA than a 2-credit course, because its grade points (Grade Value × Credits) are multiplied by a bigger number.
- A 1-credit course counts **less**, so even a low grade there will barely move the final GPA.

A simple example: a B (3.0) in a 4-credit course adds `3.0 × 4 = 12.0` grade points, while an A (4.0) in a 1-credit course adds only `4.0 × 1 = 4.0` grade points. Even though the A is a better grade, the 4-credit B pulls the GPA more because it has a bigger weight.

This is why my GPA formula divides by the **total credits** instead of dividing by the number of subjects. Dividing by the number of subjects would treat a 4-credit class the same as a 1-credit class, which would not be a weighted GPA.

---

## 4. GPA Formula

The formula my program uses is:

**GPA = Σ(Grade Value × Credit Hours) ÷ Σ(Credit Hours)**

Or in words: **Total Grade Points ÷ Total Credit Hours**.

- **Σ(Grade Value × Credit Hours)** is the **total grade points**. I add up the grade points of every subject. This number comes from step 2 above.
- **Σ(Credit Hours)** is the **total credits**. I add up the credit hours of every subject, no matter what grade the subject received. This number tells the GPA how much total weight it should be spread across.
- Dividing the total grade points by the total credits "averages out" the points per credit, which is the GPA.

**Worked example:**

| Subject | Letter | Grade Value | Credits | Grade Points |
| ------- | ------ | ----------- | ------- | ------------ |
| Subject 1 | A    | 4.0         | 3       | 12.0         |
| Subject 2 | B    | 3.0         | 4       | 12.0         |
| Subject 3 | C    | 2.0         | 2       | 4.0          |
| **Total** |      |             | **9**   | **28.0**     |

GPA = 28.0 ÷ 9 = 3.111… which the program displays as **3.11**.

In my code the final division is:

```js
const gpa = totalGradePoints / totalCredits;
```

and the answer is shown rounded to two decimal places with `gpa.toFixed(2)`, because that is the standard way GPAs are written.

---

## 5. Program Logic

Here is the step-by-step process my program follows from the moment the user enters a letter grade until the final GPA is displayed:

1. **The page loads.** JavaScript runs and creates three starting subject rows. Each row gets a drop-down menu that is filled with all 13 letter grades, plus a text box for the course name and a number box for the credits.
2. **The user fills in the schedule.** For every subject the user can type a course name (optional), choose a letter grade from the drop-down, and type the number of credit hours. The user can press **+ Add Subject** to create more rows or the **✕** button to remove a row.
3. **The user presses Calculate GPA.** The `calculateGPA` function starts and first clears any old error messages.
4. **The program reads every row.** It loops through all of the subject rows in the page. For each row it reads the name, the letter grade, and the credits, and it looks up the numerical grade value in `GRADE_VALUES`.
5. **The program validates the input.** If the credit hours are missing or are 0 or less, the program shows an error message, highlights the problem row in red, and stops so the user can fix it. It does not calculate a wrong answer.
6. **The program calculates each subject's grade points.** Grade Points = Grade Value × Credits, and it adds both the credits and the grade points to running totals.
7. **The program divides.** GPA = Total Grade Points ÷ Total Credits.
8. **The program displays the results.** A results section appears with a table showing every subject's letter grade, grade value, credits, and grade points, a totals row, and the final GPA shown in large text, rounded to two decimal places.
9. **The user can start over** at any time with the **Reset** button, which removes all rows, puts back one empty row, and hides the results.

---

## 6. Your Code

One part of the code I wrote and want to explain is the loop inside `calculateGPA` that reads the rows and builds the totals:

```js
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
```

This is the "engine" of the calculator. It takes all of the subject rows from the page, turns each one into a JavaScript object with `readSubject`, checks that the credits are a real number greater than 0, and then applies the formula from step 2 (Grade Points = Grade Value × Credits). It keeps two running totals using `+=`, one for credits and one for grade points, and it saves every subject in an array so the results table can be drawn later.

I used a `for` loop instead of `reduce()` or `forEach()` because I needed to be able to **stop early** with `return` if one of the rows has bad input. That would be much harder to do inside `reduce()`, and it also lets me point at the exact row that has the problem. The `Number.isFinite` check catches both empty inputs (which become `NaN`) and text that is not a number, and the `<= 0` check stops things like negative credits, which would corrupt the GPA.

---

## 7. Problem-Solving

The most difficult part of creating my GPA Calculator was handling the **dynamic subject rows**.

At first I pictured a fixed form with a set number of subjects already written in the HTML. But then I decided the user should be able to add and remove subjects, because not every semester has the same number of classes. The problem was that rows created by JavaScript do not exist when the page first loads, so I could not attach click events or read them the normal way.

I solved this with two ideas:

1. I put one hidden `<template>` in the HTML that contains the structure of a single subject row. When the user presses **+ Add Subject**, JavaScript clones the template with `cloneNode(true)` instead of building the row from scratch with strings. This keeps the HTML in the HTML file and the logic in the JS file.
2. I attach each row's remove-button click event **inside the `addSubjectRow` function**, so every row gets its own listener at the moment it is created.

A smaller problem was user mistakes. If someone leaves the credits blank or types a negative number, dividing by the total credits would give `NaN` or a nonsense GPA. I solved that by validating every row before doing any math: `Number.isFinite(subject.credits)` catches empty or non-numeric input, and the `<= 0` check catches zero or negative credits. The program then highlights the bad row with the `.invalid` CSS class and shows a helpful message instead of calculating a wrong answer.

---

## 8. Understanding Your Program

If I had to explain my GPA Calculator to a classmate who has never seen the code, the three most important things I would explain are:

1. **The grade conversion is a lookup table, not a calculator.** Every letter grade is matched to a number (A = 4.0, B = 3.0, and so on) inside the `GRADE_VALUES` object. The whole program just looks letters up in that object. If you understand that object, you understand half the program.

2. **The GPA formula is a weighted average.** For each subject: Grade Points = Grade Value × Credits. Then GPA = Total Grade Points ÷ Total Credits. The credit hours are the weights, so a 4-credit class counts twice as much as a 2-credit class. The results table shows exactly this: each subject's points, the two totals, and the final division.

3. **The rows are created dynamically.** The page starts by cloning a `<template>` row three times, and the same function runs again every time someone presses **+ Add Subject**. The calculation doesn't care how many rows exist: it reads whatever rows are on the page, checks them, and adds up the totals in a loop. That is why the calculator works for any number of subjects without changing the code.
