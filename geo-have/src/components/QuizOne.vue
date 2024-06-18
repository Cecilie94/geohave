<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuizStore } from '../stores/quizStore';

const router = useRouter();
const quizStore = useQuizStore();
const loading = ref(true);

onMounted(async () => {
  await quizStore.fetchQuestions();
  loading.value = false;
});

const quizCompleted = ref(false);
const currentQuestion = ref(0);

const score = computed(() => {
  let value = 0;
  quizStore.questions.forEach((q) => {
    if (q.selected === q.answer) {
      value += q.points;
    }
  });
  return value;
});

const getCurrentQuestion = computed(() => {
  if (quizStore.questions.length > 0) {
    let question = quizStore.questions[currentQuestion.value];
    question.index = currentQuestion.value;
    return question;
  }
  return { question: '', options: [], selected: null, index: 0, answer: null };
});

const setAnswer = (index) => {
  getCurrentQuestion.value.selected = index;
};

const finishQuiz = () => {
  const isCorrect = getCurrentQuestion.value.selected === getCurrentQuestion.value.answer;
  if (isCorrect) {
    router.push("/quiz/points");
  } else {
    router.push("/");
  }
};
</script>

<template>
  <main class="app">
    <h1>Quiz!</h1>
    <span v-if="!loading" class="score"> {{ score }}/{{ quizStore.questions.length }} </span>
    <section class="quiz" v-if="!quizCompleted && !loading">
      <div class="quiz-info">
        <span class="question">
          {{ getCurrentQuestion.question }}
        </span>
      </div>

      <div class="options">
        <label
          v-for="(option, index) in getCurrentQuestion.options"
          :key="index"
          :class="`option ${
              getCurrentQuestion.selected === index
              ? index === getCurrentQuestion.answer
                  ? 'correct'
                  : 'wrong'
              : ''
          }${
              getCurrentQuestion.selected != null &&
              index !== getCurrentQuestion.selected
              ? 'disabled'
              : ''
          }`"
          >
          <input
            type="radio"
            :name="'question' + getCurrentQuestion.index"
            :value="index"
            v-model="getCurrentQuestion.selected"
            @change="setAnswer(index)"
          />
          <span>{{ option }}</span>
        </label>
      </div>
      <button
        v-show="getCurrentQuestion.selected !== null || quizCompleted.value"
        @click="finishQuiz"
        :disabled="getCurrentQuestion.selected === null"
      >
        {{
          getCurrentQuestion.index === quizStore.questions.length - 1
            ? "Forsæt jagten"
            : getCurrentQuestion.selected === null
            ? "Fortsæt"
            : "Next question"
        }}
      </button>
    </section>

    <section v-else-if="!loading">
      <h2>You have finished the quiz!</h2>
      <p>Your score is {{ score }}/{{ quizStore.questions.length }}</p>
      <router-link to="/pointshop">
        <button>Gå til shop</button>
      </router-link>
    </section>

    <div class="box" v-if="getCurrentQuestion.index === 0 && getCurrentQuestion.selected !== null && getCurrentQuestion.selected !== getCurrentQuestion.answer">
      <p class="correct-answer">Det korrekte svar er <strong style="color: #2C5E36; font-weight: bold;">foråret</strong>.</p>
    </div>

    <div v-if="loading">
      <p>Loading quiz...</p>
    </div>
  </main>
</template>

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
