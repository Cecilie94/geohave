<script setup>
import { ref, onMounted, watch } from "vue";
import ConfettiExplosion from "vue-confetti-explosion";
import { db } from "@/configs/firebase";
import { collection, updateDoc, doc, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";

const UserId = ref("");
const UserInfoRefId = ref("");
const UserPointsOnline = ref(0);

const router = useRouter();

const goToNextTask = async () => {
  try {
    console.log("Navigating to next task...");
    console.log("UserInfoRefId:", UserInfoRefId.value);
    console.log("UserPointsOnline:", UserPointsOnline.value);

    const userRef = doc(db, "User", UserInfoRefId.value);
    await updateDoc(userRef, {
      points: UserPointsOnline.value + points.value,
    });

    console.log("Update successful, redirecting...");
    router.push("/skattejagt/kort");
  } catch (error) {
    console.error("Error updating document:", error);
  }
};

const points = ref(0);

// Simulating points increment over time
const targetPoints = 20;
const animationDuration = 1000; // milliseconds
const pointsPerSecond = targetPoints / (animationDuration / 1000);
let currentPoints = 0;

const updatePoints = async () => {
  if (currentPoints < targetPoints) {
    currentPoints += pointsPerSecond / 60; // assuming 60 FPS
    points.value = Math.min(Math.ceil(currentPoints), targetPoints);
    requestAnimationFrame(updatePoints);
  }
};

onMounted(() => {
  const item = sessionStorage.getItem("earnPoints");

  //hvis modtag point token ikke er sat navigeres man til home
  if(item !== "true") {
    router.push({ name: "skattejagt" });
  }
  //Ellers fjernes tokenen fra local storage da den nu er brugt op
  else {
    sessionStorage.removeItem("earnPoints");
  }

  // Start the animation
  updatePoints();
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      UserId.value = user.uid;
    } else {
      // No user is signed in
      UserId.value = null;
    }
  });

  (async () => {
    const querySnapshotUserPoints = await getDocs(collection(db, "User"));
    querySnapshotUserPoints.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
      if (doc.data().uid === UserId.value) {
        UserInfoRefId.value = doc.id;
        UserPointsOnline.value = doc.data().points;
      }
    });
  })(); // Immediately invoke the async function
});

const maxPointsReached = ref(false);

// Watching for points reaching the maximum
const checkMaxPoints = () => {
  if (points.value === targetPoints && !maxPointsReached.value) {
    maxPointsReached.value = true;
    const circle = document.querySelector(".circle");
    circle.classList.add("pop-out");
    setTimeout(() => {
      circle.classList.remove("pop-out");
    }, 500);
  }
};

// Watch for points changes and trigger the animation if max points reached
watch(points, () => {
  checkMaxPoints();
});
</script>

<template>
  <div class="wrapper" :class="{ 'confetti-active': maxPointsReached }">
    <h1>Quiz!</h1>
    <div class="container">
      <div class="point-obtained">
        <h2>Point Optjent</h2>
      </div>
      <div class="points-counter">
        <div class="confetti-container">
          <confettiExplosion
            :particleCount="300"
            :force="0.5"
            :particleSize="10"
            class="confetti"
            v-if="maxPointsReached"
          />
        </div>
        <div class="circle" :class="{ 'pop-out': maxPointsReached }">
          <span class="points">{{ points }}</span>
        </div>
      </div>
      <button @click="goToNextTask">Næste</button>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  height: 100vh;
  margin-top: 60px;
  overflow: hidden; /* Ensure no overflow */
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

h1 {
  font-family: "Kameron", serif;
  font-weight: bold;
  font-size: 36px;
  margin-bottom: 2em;
}

.quiz {
  font-family: "Kamaron", serif;
  font-weight: 700;
  font-style: bold;
  font-size: 34px;
}

h2 {
  font-family: "Kameron", serif;
  font-weight: 600;
  font-style: normal;
  text-align: center;
  font-size: 36px;
}

.points {
  font-family: "Kameron", serif;
  font-style: bold;
  font-weight: 500;
  font-size: 1.5em;
}

.points-counter {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative; /* Ensure absolute positioning of confetti stays within this */
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden; /* Contain confetti explosion */
  z-index: inherit;
}

.circle {
  margin-top: 1em;
  margin-bottom: 6em;
  position: relative;
  width: 234px;
  height: 234px;
  border-radius: 50%;
  background-color: var(--primary-yellow);
  color: black;
  font-size: 24px;
  z-index: 999; /* Ensure circle is above confetti */
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2); /* Adjust values as needed */
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

.circle span {
  z-index: 1;
  transition: 0.5s ease-in-out;
}

@keyframes pop-out {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.pop-out {
  animation: pop-out 0.5s ease;
}
</style>
