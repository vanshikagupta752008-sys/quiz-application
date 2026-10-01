/* =============================================
   QUIZ APPLICATION — script.js
   Pure vanilla JavaScript, no dependencies.
   ============================================= */

// -----------------------------------------------
// 1. QUIZ DATA
//    Each question object contains:
//      text        – the question string
//      options     – array of 4 answer strings
//      correct     – index (0-3) of correct option
//      explanation – short explanation shown at result
// -----------------------------------------------
const quizData = [
  {
    text: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correct: 2,
    explanation: "'Au' comes from the Latin word 'Aurum', meaning gold."
  },
  {
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correct: 1,
    explanation: "Mars appears red due to iron oxide (rust) on its surface."
  },
  {
    text: "Who painted the Mona Lisa?",
    options: ["Michelangelo", "Raphael", "Leonardo da Vinci", "Caravaggio"],
    correct: 2,
    explanation: "Leonardo da Vinci painted the Mona Lisa between 1503 and 1519."
  },
  {
    text: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correct: 3,
    explanation: "The Pacific Ocean covers more than 165 million square kilometers."
  },
  {
    text: "How many continents are there on Earth?",
    options: ["5", "6", "7", "8"],
    correct: 2,
    explanation: "Earth has 7 continents: Africa, Antarctica, Asia, Australia, Europe, North America, and South America."
  },
  {
    text: "In which country did the Olympic Games originate?",
    options: ["Rome", "Egypt", "China", "Greece"],
    correct: 3,
    explanation: "The ancient Olympic Games began in Olympia, Greece, around 776 BC."
  },
  {
    text: "What is the speed of light in a vacuum (approximately)?",
    options: ["300,000 km/s", "150,000 km/s", "1,080,000 km/h", "30,000 km/s"],
    correct: 0,
    explanation: "Light travels at approximately 299,792 km/s (~300,000 km/s) in a vacuum."
  },
  {
    text: "Which element has the atomic number 1?",
    options: ["Helium", "Oxygen", "Carbon", "Hydrogen"],
    correct: 3,
    explanation: "Hydrogen (H) is the lightest and most abundant element in the universe, with atomic number 1."
  },
  {
    text: "Who wrote the play 'Romeo and Juliet'?",
    options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Oscar Wilde"],
    correct: 1,
    explanation: "William Shakespeare wrote 'Romeo and Juliet' around 1594–1596."
  },
  {
    text: "What is the capital city of Australia?",
    options: ["Sydney", "Melbourne", "Brisbane", "Canberra"],
    correct: 3,
    explanation: "Canberra has been Australia's capital since 1913. Sydney is the largest city but not the capital."
  }
];

// -----------------------------------------------
// 2. STATE
//    Tracks which question the user is on and
//    which answer (if any) they have selected for
//    each question.  selectedAnswers[i] stores the
//    chosen option index for question i, or -1 if
//    unanswered.
// -----------------------------------------------
let currentQuestionIndex = 0;
let selectedAnswers = new Array(quizData.length).fill(-1); // -1 = unanswered

// -----------------------------------------------
// 3. DOM REFERENCES
// -----------------------------------------------
const welcomeScreen   = document.getElementById("welcome-screen");
const quizScreen      = document.getElementById("quiz-screen");
const resultsScreen   = document.getElementById("results-screen");

const startBtn        = document.getElementById("start-btn");
const prevBtn         = document.getElementById("prev-btn");
const nextBtn         = document.getElementById("next-btn");
const submitBtn       = document.getElementById("submit-btn");
const restartBtn      = document.getElementById("restart-btn");

const questionCounter = document.getElementById("question-counter");
const scoreLive       = document.getElementById("score-live");
const progressBar     = document.getElementById("progress-bar");
const questionNumber  = document.getElementById("question-number");
const questionText    = document.getElementById("question-text");
const optionsGrid     = document.getElementById("options-grid");
const validationMsg   = document.getElementById("validation-msg");

const finalScore      = document.getElementById("final-score");
const finalPercentage = document.getElementById("final-percentage");
const finalGrade      = document.getElementById("final-grade");
const resultsMessage  = document.getElementById("results-message");
const resultsIcon     = document.getElementById("results-icon");
const reviewList      = document.getElementById("review-list");

// -----------------------------------------------
// 4. HELPERS
// -----------------------------------------------

/** Show one screen and hide the others. */
function showScreen(screenEl) {
  [welcomeScreen, quizScreen, resultsScreen].forEach(s => {
    s.classList.add("hidden");
  });
  screenEl.classList.remove("hidden");
}

/** Convert a zero-based index to a letter label: 0 → "A", 1 → "B", etc. */
function indexToLetter(i) {
  return String.fromCharCode(65 + i); // 65 = "A"
}

/** Calculate the number of answered questions so far (for live score). */
function calculateLiveScore() {
  let score = 0;
  selectedAnswers.forEach((answer, i) => {
    if (answer === quizData[i].correct) score++;
  });
  return score;
}

/** Assign a letter grade based on percentage. */
function getGrade(pct) {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B";
  if (pct >= 60) return "C";
  if (pct >= 50) return "D";
  return "F";
}

/** Return an encouraging message based on percentage. */
function getResultsMessage(pct) {
  if (pct === 100) return "🎉 Perfect score! You're a true knowledge champion!";
  if (pct >= 80)  return "🌟 Excellent work! You really know your stuff.";
  if (pct >= 60)  return "👍 Good effort! A little more study and you'll ace it.";
  if (pct >= 40)  return "📚 Keep learning! Every attempt makes you smarter.";
  return "💪 Don't give up! Try again to improve your score.";
}

// -----------------------------------------------
// 5. RENDER QUESTION
//    Populates the quiz screen for the question at
//    currentQuestionIndex.
// -----------------------------------------------
function renderQuestion() {
  const q     = quizData[currentQuestionIndex];
  const total = quizData.length;
  const idx   = currentQuestionIndex;

  // --- Header / progress ---
  questionCounter.textContent = `Question ${idx + 1} of ${total}`;
  scoreLive.textContent       = `Score: ${calculateLiveScore()}`;
  progressBar.style.width     = `${((idx + 1) / total) * 100}%`;

  // --- Question text ---
  questionNumber.textContent = `Q${idx + 1}`;
  questionText.textContent   = q.text;

  // --- Options ---
  optionsGrid.innerHTML = ""; // clear old options

  q.options.forEach((optionText, optIndex) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.setAttribute("aria-label", `Option ${indexToLetter(optIndex)}: ${optionText}`);

    // Mark as selected if user already picked this option
    if (selectedAnswers[idx] === optIndex) {
      btn.classList.add("selected");
    }

    btn.innerHTML = `
      <span class="option-letter">${indexToLetter(optIndex)}</span>
      <span class="option-text">${optionText}</span>
    `;

    // When an option is clicked, record the selection
    btn.addEventListener("click", () => selectOption(optIndex));

    optionsGrid.appendChild(btn);
  });

  // --- Navigation buttons ---
  // Show Previous only if not on the first question
  prevBtn.style.visibility = idx === 0 ? "hidden" : "visible";

  // On the last question: hide Next, show Submit
  if (idx === total - 1) {
    nextBtn.classList.add("hidden");
    submitBtn.classList.remove("hidden");
  } else {
    nextBtn.classList.remove("hidden");
    submitBtn.classList.add("hidden");
  }

  // Hide the validation message whenever we switch questions
  hideValidation();
}

// -----------------------------------------------
// 6. OPTION SELECTION
// -----------------------------------------------
function selectOption(optIndex) {
  selectedAnswers[currentQuestionIndex] = optIndex;

  // Visually update all option buttons
  const allOptions = optionsGrid.querySelectorAll(".option-btn");
  allOptions.forEach((btn, i) => {
    btn.classList.toggle("selected", i === optIndex);
  });

  // Update live score display
  scoreLive.textContent = `Score: ${calculateLiveScore()}`;

  // Hide any validation warning
  hideValidation();
}

// -----------------------------------------------
// 7. VALIDATION
// -----------------------------------------------
function showValidation() {
  const msg = document.getElementById("validation-msg");
  msg.classList.remove("hidden");
}

function hideValidation() {
  const msg = document.getElementById("validation-msg");
  if (msg) msg.classList.add("hidden");
}

// -----------------------------------------------
// 8. NAVIGATION — NEXT / PREVIOUS
// -----------------------------------------------
function goNext() {
  // Must have answered before advancing
  if (selectedAnswers[currentQuestionIndex] === -1) {
    document.getElementById("validation-msg").classList.remove("hidden");
    return;
  }
  if (currentQuestionIndex < quizData.length - 1) {
    currentQuestionIndex++;
    renderQuestion();
  }
}

function goPrev() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    renderQuestion();
  }
}

// -----------------------------------------------
// 9. SUBMIT QUIZ
// -----------------------------------------------
function submitQuiz() {
  // Block submission if the last question is unanswered
  if (selectedAnswers[currentQuestionIndex] === -1) {
    document.getElementById("validation-msg").classList.remove("hidden");
    return;
  }

  // Confirm before submitting
  const confirmed = window.confirm(
    "Are you sure you want to submit the quiz?\nYou won't be able to change your answers after this."
  );
  if (!confirmed) return;

  showResults();
}

// -----------------------------------------------
// 10. RESULTS SCREEN
// -----------------------------------------------
function showResults() {
  const total   = quizData.length;
  const score   = calculateLiveScore();
  const pct     = Math.round((score / total) * 100);
  const grade   = getGrade(pct);

  // Fill summary boxes
  finalScore.textContent      = `${score} / ${total}`;
  finalPercentage.textContent = `${pct}%`;
  finalGrade.textContent      = grade;
  resultsMessage.textContent  = getResultsMessage(pct);

  // Choose emoji icon based on score
  resultsIcon.textContent =
    pct === 100 ? "🏆" :
    pct >= 80   ? "🌟" :
    pct >= 60   ? "👍" :
    pct >= 40   ? "📚" : "💪";

  // Build the detailed review list
  reviewList.innerHTML = "";
  quizData.forEach((q, i) => {
    const userAnswer    = selectedAnswers[i];
    const isCorrect     = userAnswer === q.correct;
    const userAnswerTxt = userAnswer >= 0 ? q.options[userAnswer] : "No answer given";
    const correctTxt    = q.options[q.correct];

    const item = document.createElement("div");
    item.className = `review-item ${isCorrect ? "correct" : "wrong"}`;

    item.innerHTML = `
      <p class="review-q">${i + 1}. ${q.text}</p>
      <div class="review-answers">
        <span class="review-your-answer ${isCorrect ? "was-correct" : ""}">
          ${isCorrect ? "✅" : "❌"} Your answer: ${userAnswerTxt}
        </span>
        ${!isCorrect ? `<span class="review-correct-answer">✅ Correct answer: ${correctTxt}</span>` : ""}
      </div>
      <p class="review-explanation">💡 ${q.explanation}</p>
    `;

    reviewList.appendChild(item);
  });

  showScreen(resultsScreen);
}

// -----------------------------------------------
// 11. RESTART QUIZ
// -----------------------------------------------
function restartQuiz() {
  currentQuestionIndex = 0;
  selectedAnswers      = new Array(quizData.length).fill(-1);
  renderQuestion();
  showScreen(quizScreen);
}

// -----------------------------------------------
// 12. START QUIZ
// -----------------------------------------------
function startQuiz() {
  currentQuestionIndex = 0;
  selectedAnswers      = new Array(quizData.length).fill(-1);
  renderQuestion();
  showScreen(quizScreen);
}

// -----------------------------------------------
// 13. EVENT LISTENERS
// -----------------------------------------------
startBtn.addEventListener("click",   startQuiz);
prevBtn.addEventListener("click",    goPrev);
nextBtn.addEventListener("click",    goNext);
submitBtn.addEventListener("click",  submitQuiz);
restartBtn.addEventListener("click", restartQuiz);
