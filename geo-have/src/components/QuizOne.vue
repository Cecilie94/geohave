<template>
  <main class="app">
    <h1>Quiz!</h1>
    <span class="score"> {{ score }}/{{ currentQuestions.length }} </span>
    <section class="quiz" v-if="!quizCompleted">
      <div class="quiz-info">
        <span class="question">
          {{ getCurrentQuestion.question }}
        </span>
      </div>

      <div class="options">
        <label
            v-for="(option, index) in getCurrentQuestion.options"
            :key="index + 1" 
            :class="`option ${
                getCurrentQuestion.selected == index + 1 // Tilføj 1 for at matche det nye indeks
                ? index + 1 == getCurrentQuestion.answer
                    ? 'correct'
                    : 'wrong'
                : ''
            }${
                getCurrentQuestion.selected != null &&
                index + 1 != getCurrentQuestion.selected
                ? 'disabled'
                : ''
            }`"
            >
            <input
                type="radio"
                :name="getCurrentQuestion.index"
                :value="index + 1"
                v-model="getCurrentQuestion.selected"
                :disabled="getCurrentQuestion.selected"
                @change="setAnswer"
            />
            <span>{{ option }}</span>
        </label>

      </div>
      <button
        v-show="getCurrentQuestion.selected !== null || quizCompleted.value"
        @click="finishQuiz"
        :disabled="!getCurrentQuestion.selected"
      >
        {{
          getCurrentQuestion.index == currentQuestions.length - 1
            ? "Forsæt jagten"
            : getCurrentQuestion.selected == null
            ? "Select an option"
            : "Next question"
        }}
      </button>
    </section>

    <section v-else>
      <h2>You have finished the quiz!</h2>
      <p>Your score is {{ score }}/{{ currentQuestions.length }}</p>
      <router-link to="/pointshop">
        <button>Gå til shop</button>
      </router-link>
    </section>

    <div class="box" v-if="getCurrentQuestion.index === 0 && getCurrentQuestion.selected !== null && getCurrentQuestion.selected !== getCurrentQuestion.answer">
        <p class="correct-answer">Det korrekte svar er <strong style="color: #2C5E36; font-weight: bold;">foråret</strong>.</p>
      </div>

  </main>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// Define quiz questions with their options and correct answers
const questions = [
  {
    question: "Hvilken årstid blomstrer kinesisk Paradisæbletræ?",
    answer: 2, 
    options: ["Sommer", "Forår", "Efterår", "Vinter"], 
    selected: null, 
  },
];

// Define reactive variables to manage the quiz state
let currentQuestions = ref(questions); 
const quizCompleted = ref(false); 
const currentQuestion = ref(0); 

// Compute the user's score based on selected answers
const score = computed(() => {
  let value = 0;
  currentQuestions.value.forEach((q) => {
    if (q.selected === q.answer) {
      value++;
    }
  });
  return value;
});

// Compute the current question being displayed
const getCurrentQuestion = computed(() => {
  let question = currentQuestions.value[currentQuestion.value];
  question.index = currentQuestion.value;
  return question;
});

// Function to set the selected answer for the current question
const setAnswer = (e) => {
  currentQuestions.value[currentQuestion.value].selected = parseInt(
    e.target.value
  );
};

// Function to finish the quiz and navigate to the appropriate route
const finishQuiz = () => {
  const isCorrect =
    getCurrentQuestion.value.selected === getCurrentQuestion.value.answer;
  if (isCorrect) {
    sessionStorage.setItem("earnPoints", "true");
    router.push("/quiz/points");
  } else {
    router.push("/"); // Navigate to map 2 if answer is incorrect
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap");

.app {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  height: 100vh;
  margin-top: 60px;
}

h1 {
  font-family: "Kameron", serif;
  font-weight: 900;
  font-size: 36px;
  margin-bottom: 10px;
}

.quiz {
  width: 100%;
  max-width: 650px;
}

.quiz-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.quiz-info .question {
  color: #090909;
  font-family: "Open Sans", sans-serif;
  font-weight: 300;
  font-size: 24px;
}

.quiz-info .score {
  color: #fff;
  font-size: 1.25rem;
}

input[type="radio"] {
  display: none;
}

.options {
  margin-bottom: 1rem;
  font-size: 24px;
  margin-top: 2rem;
}

.option {
  padding: 1rem;
  display: block;
  background-color: #f1f1f1;
  margin-bottom: 15px;
  border-radius: 0.5rem;
  cursor: pointer;
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  text-align: center;
  box-shadow: -3px 6px 10px rgba(0, 0, 0, 0.3);
  user-select: none;
}

span {
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  font-size: 24px;
}

.option input[type="radio"]:checked + span {
  color: white;
}

.option.correct {
  background-color: #87a669;
}

.option.wrong {
  background-color: #cc807d;
}

.option:last-of-type {
  margin-bottom: 0;
}

.option.disabled {
  opacity: 0.5;
}

option.input {
  display: none;
}

button {
  appearance: none;
  outline: none;
  border: none;
  cursor: pointer;
  margin: 0 89px;
  margin-top: 15px;
  background-color: #f1f1f1;
  color: #000;
  font-size: 24px;
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  width: 189px;
  height: 55px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Tilføj skyggeeffekt */
}

button:disabled {
  width: 189px;
  height: 55px;
  text-align: center;
  box-shadow: none;
}

h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

p {
  color: #000;
  font-size: 1rem;
  text-align: center;
}

.correct-answer{
  font-size: 24px; 
  margin-top: 30px;
}
</style>
