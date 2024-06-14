<template>
  <div v-if="user">
    <NavBar />
    <div class="container">
      <button @click="showModal = true" class="delete-button">
        <img src="../assets/icons/delete_icon.png" alt="Delete User" class="delete-icon">
      </button>    
    </div>

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Bekræft</h2>
        <p>Er du sikker på du vil slette din bruger?</p>
        <button @click="confirmDelete" class="confirm-button">Ja, slet</button>
        <button @click="showModal = false" class="cancel-button">Fortryd</button>
      </div>
    </div>

    <div v-if="showReauthModal" class="modal">
      <div class="modal-content">
        <h2>Reauthenticering påkrævet</h2>
        <p>Indtast din adgangskode for at bekræfte din identitet.</p>
        <input type="password" v-model="reauthPassword" placeholder="Adgangskode">
        <button @click="reauthenticate" class="confirm-button">Bekræft</button>
        <button @click="showReauthModal = false" class="cancel-button">Fortryd</button>
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
import { getAuth, deleteUser, signOut, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useRouter } from 'vue-router';

export default {
  setup() {
    const auth = getAuth();
    const user = ref(auth.currentUser);
    const router = useRouter();
    const showModal = ref(false);
    const showReauthModal = ref(false);
    const reauthPassword = ref('');

    // Check authentication state on component mount
    if (!user.value) {
      router.push('/'); // Redirect to landing page if not authenticated
    }

    const reauthenticate = () => {
      if (user.value && reauthPassword.value) {
        const credential = EmailAuthProvider.credential(user.value.email, reauthPassword.value);
        reauthenticateWithCredential(user.value, credential)
          .then(() => {
            showReauthModal.value = false;
            confirmDelete();
          })
          .catch((error) => {
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
            if (error.code === 'auth/requires-recent-login') {
              showReauthModal.value = true;
            } else {
              console.error("Error deleting user:", error);
            }
          });
      } else {
        console.error("No user is currently signed in");
      }
      showModal.value = false;
    };

    return {
      user,
      showModal,
      showReauthModal,
      reauthPassword,
      confirmDelete,
      reauthenticate,
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
.container {
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
  background-color: #FEF9EA;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  max-width: 400px;
  width: 80%;
}

.confirm-button {
  background-color: #e74c3c;
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
}

</style>
