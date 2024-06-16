<template>
  <div class="overlay" id="overlay"></div>
  <div class="wrapper">
    <div class="pointshop-header">
      <img
        src="../assets/icons/dotted_black_background.svg"
        class="overlay-image"
      />

      <div class="pointshop-text">
        <h2>Points</h2>
        <p>Samlede optjente point</p>
        <h2>{{ UserPointsOnline }}</h2>
        <p>Optjen flere point for at få flere præmier</p>
        <p class="small-text">* indløs point før næste sæson</p>
      </div>
      <div class="icon">
        <img src="../assets/For-grid/trophy_Yellow.png" alt="trophy" />
      </div>
    </div>
  </div>
  <div class="pointshop-section2">
    <h2>Indløs</h2>
    <div class="container">
      <PointShopItem
        v-for="item in PointShopItemsOnline"
        :key="item.id"
        :icon="item.icon"
        :points="item.cost"
        :text="item.text"
        :uses="
          PointShopTransactionsOnline.filter(
            (x) => x.PointShopItemId === item.id
          ).length
        "
        :max="item.max"
        @click="makeTransaction(item.id, item.cost, item.max)"
      />
    </div>
  </div>

  <div v-if="displayPopup" class="popup-back-style">
    <div class="popup-window-style">
      <h2>Du har brugt alle dine points</h2>
      <div>
        <p class="popup-hint">Hint:</p>
        <p>Du kan først bruge eller optjene efter næste sæson.</p>
      </div>
      <button class="popup-button-style" @click="closePopup()">OK</button>
    </div>
  </div>

  <Modal @close="toggleModal" :modalActive="modalActive">
    <div class="modal-content">
      <h3 class="title">Gå ikke glip af dine point!</h3>
      <p class="modaltext">
        Opret en konto for at gemme dine point og få adgang til eksklusive
        tilbud
      </p>
      <div class="somebttn">
        <button @click="migrateAnonAccountToGoogle">Opret med Google</button>
        <button @click="signInWithFacebook">Opret med Facebook</button>
        <button @click="someformular">Opret med email</button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import PointShopItem from "./PointShopItem.vue";
import Modal from "./Modal.vue";
import { ref, onMounted } from "vue";
import { db } from "@/configs/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc, // Change this from getDocs to getDoc for single document retrieval
  getDocs,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { migrateAnonAccountToGoogle } from "@/services/migrateAnonAccount";

const PointShopItemsOnline = ref([
  {
    id: null,
    cost: 20,
    icon: "soda",
    text: "Sodavand eller egent valg",
    max: 5,
  },
  {
    id: null,
    cost: 50,
    icon: "icecream",
    text: "Gratis dessert efter valg",
    max: 3,
  },
  {
    id: null,
    cost: 150,
    icon: "ticket",
    text: "50% på næste besøg",
    max: 1,
  },
  {
    id: null,
    cost: 300,
    icon: "lego",
    text: "Gratis billet til Legoland",
    max: 1,
  },
]);
const PointShopTransactionsOnline = ref([]);
const UserPointsOnline = ref(0);
const UserId = ref("");
const UserInfoRefId = ref("");
const modalActive = ref(false);

const toggleModal = () => {
  modalActive.value = !modalActive.value;
};
onMounted(async () => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in
      UserId.value = user.uid;
      if (user.isAnonymous) {
        modalActive.value = true;
      }
    } else {
      // No user is signed in
      UserId.value = null;
    }
  });

  const querySnapshotPointShopItem = await getDocs(
    collection(db, "PointShopItem")
  );
  PointShopItemsOnline.value = [];
  querySnapshotPointShopItem.forEach((doc) => {
    //console.log(doc.id, "=>", doc.data());
    const item = doc.data();
    item.id = doc.id;
    PointShopItemsOnline.value.push(item);
  });
  const querySnapshotUserPoints = await getDocs(collection(db, "User"));
  querySnapshotUserPoints.forEach((doc) => {
    //console.log(doc.id, "=>", doc.data());
    if (doc.data().uid === UserId.value) {
      UserInfoRefId.value = doc.id;
      UserPointsOnline.value = doc.data().points;
    }
  });
  const querySnapshotPointShopTransactions = await getDocs(
    collection(db, "UserPointShopTransaction")
  );
  querySnapshotPointShopTransactions.forEach((doc) => {
    //console.log(doc.id, "=>", doc.data());
    if (doc.data().UserId === UserId.value) {
      PointShopTransactionsOnline.value.push(doc.data());
    }
  });
});

const displayPopup = ref(false);

function makeTransaction(pointShopItemId, cost, max) {
  if (pointShopItemId === null) {
    return;
  }

  if (
    UserPointsOnline.value > cost &&
    PointShopTransactionsOnline.value.filter(
      (x) => x.pointShopItemId === pointShopItemId
    ).length < max
  ) {
    UserPointsOnline.value = UserPointsOnline.value - cost;

    const userRef = doc(db, "User", UserInfoRefId.value);
    updateDoc(userRef, {
      points: UserPointsOnline.value,
    });

    PointShopTransactionsOnline.value.push({
      userId: UserId.value,
      pointShopItemId: pointShopItemId,
    });
    addDoc(collection(db, "UserPointShopTransaction"), {
      PointShopItemId: pointShopItemId,
      UserId: UserId.value,
    });

    // Assuming you have a router set up and imported correctly.
    // router.push({ name: "Collect", query: { rewardId: pointShopItemId } });
  } else {
    displayPopup.value = true;
  }
}

function closePopup() {
  displayPopup.value = false;
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap");
.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pointshop-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 20px 10px 0px 10px;
  position: relative;
  background-color: var(--primary-green);
  padding: 20px;
  border-radius: 4px;

  h2 {
    font-family: "Open Sans", sans-serif;
    font-size: 36px;
    color: var(--primary-yellow);
    z-index: 1;
  }
}

.overlay-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.2;
}

.pointshop-text {
  position: relative; /* Ensure text remains on top of the overlay */
  z-index: 1;
  p {
    color: white;
  }
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  z-index: 1;
  margin-left: 20px;
  img {
    color: var(--primary-yellow);
    height: 160px;
    width: 315px;
    margin: 0px;
  }
}

.small-text {
  font-size: 10px;
  margin-top: 5px;
}

.pointshop-section2 {
  h2 {
    font-family: "Open Sans", sans-serif;
    font-weight: 700;
    cursor: pointer;
    outline: none;
    font-size: 36px;
    color: black;
    margin: 10px 30px 10px 30px;
  }
}

.container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
  margin-right: 20px;
  margin-left: 20px;
  justify-content: center;
  place-items: center;
}
.popup-back-style {
  z-index: 1;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.popup-window-style {
  background-image: linear-gradient(
    to bottom,
    var(--color1, #87a669),
    var(--color2, #2c5e36)
  );
  width: 100%;
  margin: 20px;
  justify-content: center;
  padding: 50px;
  border-radius: 3px;
  color: white;
  align-items: center;
  display: flex;
  flex-direction: column;
  h2 {
    font-family: "Open Sans", sans-serif;
    font-weight: 500;
    line-height: 24px;
    margin-bottom: 20px;
  }
}
.popup-hint {
  font-family: "Open Sans", sans-serif;
  font-weight: bold;
}

.popup-button-style {
  background-color: var(--primary-yellow);
  height: 50px;
  width: 80%;
  justify-content: center;
  border: none;
  font-family: "Open Sans", sans-serif;
  font-weight: 500;
  border-radius: 5px;
  font-size: 17px;
  margin-top: 20px;
}

button {
  width: 80px;
  height: 44px;
  background-color: var(--primary-yellow);
  font-weight: bold;
  border: none;
  border-radius: 4px;
  font-family: "Kameron", serif;
  font-size: 12px;
  margin: auto;
  display: block;
}

button:hover {
  background-color: var(--btn-on-click-yellow);
}

.somebttn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-top: 5%;
}

.title {
  text-align: center;
  font-family: Kameron, serif;
}

.modaltext {
  text-align: center;
  font-family: "Open Sans", sans-serif;
  font-weight: 300;
  font-size: 15px;
}
</style>
