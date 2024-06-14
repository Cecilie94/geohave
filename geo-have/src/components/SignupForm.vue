<template>
  <div class="page-container">
    <div class="wrapper">
      <div class="top-section">
        <h2>Registrer</h2>
        <p>Registrer for at begynde skattejagten</p>
      </div>
      <form @submit.prevent="onSubmitForm" class="signup-form">
        <div class="form-container">
          <p>Email</p>
          <input
            type="email"
            v-model="email"
            id="email"
            placeholder="Email"
            required
          />
          <p>Password</p>
          <input
            type="password"
            v-model="password"
            id="password"
            placeholder="Password"
            required
          />
        </div>
        <button type="submit">Registrer</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from 'vue-router';
import { signUp } from "@/services/AuthService";

const email = ref("");
const password = ref("");
const router = useRouter();

const onSubmitForm = async () => {
  try {
    await signUp(email.value, password.value);
    // Redirect to landing page after successful signup
    router.push('/');
  } catch (error) {
    console.error("Error during sign up:", error);
    // Handle error (e.g., show a notification to the user)
  }
};
</script>

<style scoped>
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.wrapper {
  display: flex;
  flex-direction: column;
  padding: 2em;
  width: 100%;
  max-width: 400px;
}

.signup-form {
  align-items: center;
}

.top-section {
  display: flex;
  flex-direction: column;
  text-align: left;
  align-items: left;
  margin-bottom: 35px;
}

h2 {
  font-size: 40px;
  font-weight: bold;
}
p {
  font-size: 20px;
}

.form-container {
  margin-bottom: 15px;
  font-weight: bold;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  font-size: 20px;
  border-radius: 4px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  margin-top: 5px;
  margin-bottom: 30px;
  font-weight: bold;
  background-color: var(--soft-gray);
  color: var(--btn-on-click-grey);
}

button {
  width: 100%;
  padding: 10px;
  font-size: 20px;
  border-radius: 9px;
  border: 1px solid #ccc;
  background-color: var(--btn-soft-green);
  color: white;
  font-weight: bold;
}

button:hover {
  background-color: var(--btn-on-click-green);
}
</style>
