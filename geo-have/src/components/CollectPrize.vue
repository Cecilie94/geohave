<template>
  <div>
    <div v-for="prize in redemptionOptions" :key="prize.id">
      <h3>{{ prize.name }}</h3>
      <p>{{ prize.description }}</p>
    </div>
  </div>
  <div>
    <div class="backtostart-button" @click="goToHome">
      <img
        src="../assets/icons/back-button.png"
        alt="Back to Home"
        class="back-button"
      />
    </div>
    <div class="container">
      <img
        src="../assets/icons/White_V2.png"
        alt="Flower"
        class="black-image"
      />
      <h1>Tillykke med din præmie!</h1>
    </div>
    <div class="expiring-date">
      <p class="expiring-text">Udløber: 31/08/24</p>
      <p class="congrats-text">
        {{ redemptionOptions[rewardId - 1] }}
      </p>
    </div>
    <div class="qr-container">
      <img src="../assets/icons/qr-code.png" alt="QR code" class="QR-picture" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

const queryParams = new URLSearchParams(window.location.search);
// Accessing query parameter named 'paramName' as a number
const idInQuery = parseInt(queryParams.get("rewardId"));
const rewardId = ref(isNaN(idInQuery) ? 0 : idInQuery);

const router = useRouter();

onMounted(() => {
  //henter token fra local storage
  const item = sessionStorage.getItem("rewardToCollect");

  //hvis token ikke er sat eller at id'et ikke stemmer over ens, navigeres man til home
  if(item !== idInQuery + "") {
    router.push({ name: "home" });
  }
  //Ellers fjernes tokenen fra local storage da den nu er brugt op
  else {
    sessionStorage.removeItem("rewardToCollect");
  }
})

const goToHome = () => {
  router.push({ name: "home" });
};

const redemptionOptions = [
  " Tillykke! Du har vundet en gratis sodavand! Du kan indløse din præmie ved at vise denne besked til personalet i cafeen",
  "Tillykke! Du har vundet en gratis desssert! Du kan indløse din præmie ved at vise denne besked til personalet i cafeen",
  "Tillykke! Du har vundet en 50% på næste besøg! Du kan indløse din præmie ved at vise denne besked til personalet i cafeen",
  "Tillykke! Du har vundet en gratis billet til Legoland! Du kan indløse din præmie ved at vise denne besked til personalet i cafeen",
];
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap");

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.back-button {
  cursor: pointer;
}

.black-image {
  filter: invert(100%) grayscale(100%);
  width: 223px;
  height: 196px;
  margin-top: 10px;
}

h1 {
  font-family: "Kameron", serif;
  font-weight: 300;
  font-size: 32px;
  margin-top: 20px;
}

.backtostart-button {
  margin-top: 40px;
  margin-left: 20px;
}

.expiring-date {
  margin: auto;
  text-align: center;
  width: 90%;
}

hr {
  margin: 10px 0;
  height: 2px;
  background-color: black;
}

.expiring-text {
  font-family: "Open Sans", sans-serif;
  font-weight: 300;
  font-size: 20px;
  border-bottom: 1px solid black;
  padding-bottom: 10px;
  border-top: 1px solid black;
  padding-top: 10px;
  width: 291px;
  margin: 0 auto;
  margin-top: 15px;
}

.congrats-text {
  font-family: "Open Sans", sans-serif;
  font-weight: 300;
  font-size: 20px;
  margin-top: 30px;
}

.QR-picture {
  width: 185px;
  display: block;
  margin: 0 auto;
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>
