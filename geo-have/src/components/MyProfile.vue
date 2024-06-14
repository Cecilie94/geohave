<template>
  <div v-if="user">
    <NavBar />
    <div class="information-box">
      <h1>Min profil</h1>

    </div>
    <div class="delete-container">
      <button @click="showModal = true" class="delete-button">
        <img src="../assets/icons/delete_icon.png" alt="Delete User" class="delete-icon">
      </button>    </div>

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

<script>
import { ref } from 'vue';
import { getAuth, deleteUser, signOut } from "firebase/auth";
import { useRouter } from 'vue-router';

export default {
  setup() {
    const auth = getAuth();
    const user = ref(auth.currentUser);
    const router = useRouter();
    const showModal = ref(false);

    // Check authentication state on component mount
    // This ensures that the user is redirected if not authenticated
    if (!user.value) {
      router.push('/'); // Redirect to landing page if not authenticated
    }

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

    return {
      user,
      showModal,
      confirmDelete,
    };
  },
  mounted() {
    // Ensure the user is authenticated when component mounts
    const auth = getAuth();
    if (!auth.currentUser) {
      this.$router.push('/'); // Redirect to landing page if not authenticated
    }
  }
};
</script>

<style scoped>

.information-box{
  margin-left: 20px;
  margin-top: 20px;

}

h1{
  color: #000;
  font-size: 24px;
  font-family: "Open Sans", sans-serif;
  font-weight: 700;
}

.delete-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed; /* Fixed positioning to make it relative to the viewport */
  bottom: 0; /* Align to the bottom */
  padding: 20px; /* Add padding for content spacing */
}

.delete-button {
  background-color: #e74c3c;
  padding: 0; /* Remove default padding */
  border: none;
  border-radius: 15px;
  position: relative; /* Ensure relative positioning for absolute positioning of image */
  overflow: hidden; /* Ensure overflow is hidden */
  width: 50px; /* Set desired width */
  height: 50px; /* Set desired height */
}

.delete-icon {
  width: 100%; /* Ensure image takes full width of button */
  object-fit: cover; /* Maintain aspect ratio and cover the button */
  position: absolute; /* Position image absolutely */
  bottom: 0; /* Position at bottom */
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
</style>
