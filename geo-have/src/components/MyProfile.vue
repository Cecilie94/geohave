<template>
  <div v-if="user">
    <NavBar />
    <div class="container">
      <h1>Min Profil</h1>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p><strong>Oprettet:</strong> {{ creationTime }}</p>
      <button @click="showModal = true" class="delete-button">Slet Bruger</button>
    </div>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Bekræft</h2>
        <p>Er du sikker på du vil slette din bruger?</p>
        <button @click="confirmDelete" class="confirm-button">Ja, slet</button>
        <button @click="showModal = false" class="cancel-button">Fortryd</button>
      </div>
    </div>
  </div>
  <div v-else>
    <p>Du skal være logget ind for at se denne side.</p>
    <!-- Optionally, you can add a login link or button here -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAuth, deleteUser, signOut } from "firebase/auth";
import { useRouter } from 'vue-router';

const auth = getAuth();
const user = ref(auth.currentUser);
const router = useRouter();
const showModal = ref(false);
let creationTime = '';

// Check authentication state on component mount
onMounted(() => {
  if (!user.value) {
    router.push('/'); // Redirect to landing page if not authenticated
  } else {
    // Get user metadata to get creation time
    auth.currentUser.getIdTokenResult()
      .then((idTokenResult) => {
        creationTime = new Date(idTokenResult.creationTime).toLocaleString();
      })
      .catch((error) => {
        console.error("Error getting user metadata:", error);
      });
  }
});

const confirmDelete = () => {
  if (user.value) {
    deleteUser(user.value)
      .then(() => {
        console.log("User Account Deleted Successfully");
        // Log out the user
        signOut(auth)
          .then(() => {
            router.push('/');
          })
          .catch((signOutError) => {
            console.error("Error signing out:", signOutError);
          });
      })
      .catch((error) => {
        console.error("Error deleting user:", error);
      });
  } else {
    console.error("No user is currently signed in");
  }
  showModal.value = false;
};

</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap");

h1 {
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
  margin-top: 50px;
  font-size: 24px;
}

p{
  font-size: 12px;
  font-family: "Open Sans", sans-serif;
  font-weight: 300;
  font-size: 12px;
  space-between: 10px;
}


.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 25px;
}

.delete-button {
  background-color: #e74c3c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  margin-top: 20px;
}

.delete-button:hover {
  background-color: #c0392b;
}

.delete-button:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(231, 76, 60, 0.5);
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
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  max-width: 400px;
  width: 80%;
}

.confirm-button {
  background-color: #e74c3c;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
  transition: background-color 0.3s ease;
}

.confirm-button:hover {
  background-color: #c0392b;
}

.cancel-button {
  background-color: #95a5a6;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.cancel-button:hover {
  background-color: #7f8c8d;
}
</style>
