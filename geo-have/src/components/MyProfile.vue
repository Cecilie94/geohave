<template>
  <div v-if="user">
    <div class="information-container">
      <h1 class="overskrift">Min profil</h1>
      <p class="info-title">E-mail:</p>
      <p>{{ user.email }}</p>
      <p class="info-title">Oprettet:</p>
      <p>{{ formatDate(user.metadata.creationTime) }}</p>
      <p class="info-title">Købs oversigt:</p>
      <a @click="showPointsModal = true">Klik her</a>
    </div>
    <div class="container">
      <button @click="showEditEmailModal = true" class="edit-button">
        <img src="../assets/icons/settings-edit.png" alt="Edit Email" class="edit-icon">
      </button>
      <button @click="showModal = true" class="delete-button">
        <img src="../assets/icons/delete_icon.png" alt="Delete User" class="delete-icon">
      </button>
    </div>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Bekræft</h2>
        <p class="modal-text">Er du sikker på du vil slette din bruger?</p>
        <button @click="confirmDelete" class="confirm-button">Ja, slet</button>
        <button @click="showModal = false" class="cancel-button">Fortryd</button>
      </div>
    </div>

    <div v-if="showReauthModal" class="modal">
      <div class="modal-content">
        <h2>Adgangskode påkrævet</h2>
        <p class="modal-text">Indtast din adgangskode for at bekræfte din identitet.</p>
        <input type="password" v-model="reauthPassword" placeholder="Adgangskode" class="input-felt">
        <button @click="reauthenticate" class="confirm-button">Bekræft</button>
        <button @click="showReauthModal = false" class="cancel-button">Fortryd</button>
      </div>
    </div>

    <div v-if="showPointsModal" class="modal">
      <div class="modal-content">
        <h2>Købs oversigt</h2>
        <ul class="points-list">
          <li v-for="transaction in pointTransactions" :key="transaction.date">
            <span>{{ formatDate(transaction.date) }}</span>
            <span>{{ transaction.item }}</span>
            <span :class="{'points-spent': transaction.points > 0}">
              {{ transaction.points > 0 ? '-' : '' }}{{ transaction.points }}
            </span>
          </li>
        </ul>
        <button @click="showPointsModal = false" class="cancel-button">Luk</button>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Du skal være logget ind for at se denne side.</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { getAuth, deleteUser, signOut, reauthenticateWithCredential, EmailAuthProvider, onAuthStateChanged } from "firebase/auth";
import { useRouter } from 'vue-router';
import { getFirestore, collection, getDocs, doc, onSnapshot } from "firebase/firestore";

const auth = getAuth();
const db = getFirestore();
const router = useRouter();
const user = ref(null);
const showModal = ref(false);
const showReauthModal = ref(false);
const showPointsModal = ref(false);
const reauthPassword = ref('');
const pointTransactions = ref([]);
let unsubscribe = null;
const UserId = ref("");

const watchUserPoints = () => {
  if (user.value) {
    const userDoc = doc(db, "users", user.value.uid);
    return onSnapshot(userDoc, doc => {
      if (doc.exists()) {
        user.value.points = doc.data().points || 0;
      } else {
        console.error("No such document for user:", user.value.uid);
      }
    });
  }
};

const fetchPointTransactions = async (userId) => {
  const querySnapshot = await getDocs(collection(db, 'UserPointShopTransaction'));
  pointTransactions.value = querySnapshot.docs
    .filter(doc => doc.data().UserId === userId)
    .map(doc => ({
      date: new Date(doc.data().TransactionDate),
      item: doc.data().Name, // Assuming pointShopItemId is the field name in your Firestore
      points: doc.data().Price
    }));
};

const reauthenticate = () => {
  if (user.value && reauthPassword.value) {
    const credential = EmailAuthProvider.credential(user.value.email, reauthPassword.value);
    reauthenticateWithCredential(user.value, credential)
      .then(() => {
        showReauthModal.value = false;
        confirmDelete();
      })
      .catch(error => {
        console.error("Error reauthenticating user:", error);
      });
  } else {
    console.error("Reauthentication failed: no user or password");
  }
};

const confirmDelete = () => {
  if (user.value) {
    deleteUser(user.value)
      .then(() => {
        console.log("User Account Deleted Successfully");
        signOut(auth)
          .then(() => router.push('/'))
          .catch(signOutError => console.error("Error signing out:", signOutError));
      })
      .catch(error => {
        if (error.code === 'auth/requires-recent-login') {
          showReauthModal.value = true;
        } else {
          console.error("Error deleting user:", error);
        }
      });
    showModal.value = false;
  } else {
    console.error("No user is currently signed in");
  }
};

const formatDate = timestamp => {
  const date = new Date(timestamp);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${day}-${month}-${year}`;
};

onMounted(() => {
  onAuthStateChanged(auth, currentUser => {
    if (currentUser) {
      user.value = currentUser;
      UserId.value = currentUser.uid;

      if (unsubscribe) unsubscribe();
      unsubscribe = watchUserPoints();
      fetchPointTransactions(currentUser.uid);
    } else {
      router.push('/');
    }
  });
});

onUnmounted(() => {
  if (unsubscribe) unsubscribe();
});
</script>

<style scoped>
.input-felt{
  width: 100%;
}

.points-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.points-list li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.points-spent {
  color: red;
}

h2{
  margin-bottom: 20px;
}

.info-title {
  color: #000;
  font-size: 16px;
  font-family: "Open Sans", sans-serif;
  font-weight: 600;
  margin-top: 20px;
}

.overskrift {
  color: #000;
  font-family: "Kameron", serif;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 20px;
  margin-top: 35px;
}

.information-container {
  margin-left: 20px;
  margin-top: 20px;
}

.container {
  display: flex;
  flex-direction: row; 
  align-items: center;
  position: fixed; 
  bottom: 0; 
  padding: 20px; 
}

.edit-button,
.delete-button {
  padding: 0; 
  border: none;
  border-radius: 15px;
  position: relative; 
  overflow: hidden; 
  width: 50px; 
  height: 50px; 
  margin: 5px;
}

.edit-button {
  background-color: #72A6FF; 
}

.delete-button {
  background-color: #FF7272; 
}

.edit-icon,
.delete-icon {
  width: 100%; 
  object-fit: cover; 
  position: absolute; 
  bottom: 0; 
  right: 0;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background-color: #FEF9EA;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  max-width: 400px;
  width: 80%;
}

.modal-text {
  margin-bottom: 15px;
}

.confirm-button {
  background-color: #FF7272;
  color: white;
  padding: 7px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
}

.cancel-button {
  background-color: #95a5a6;
  color: white;
  padding: 7px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}
</style>
