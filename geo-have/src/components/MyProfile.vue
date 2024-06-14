<template>
  <div>
    <NavBar />
  </div>
  <div class="container">
    <button @click="deleteUser" class="delete-button">Delete User</button>
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

    const deleteUserAccount = () => {
      if (user.value) {
        deleteUser(user.value)
          .then(() => {
            console.log("User Account Deleted Successfully");
            // Log out the user
            signOut(auth)
              .then(() => {
                // Redirect to landing page
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
    };

    return {
      deleteUser: deleteUserAccount,
    };
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh; 
  text-align: center;
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
}

.delete-button:hover {
  background-color: #c0392b;
}

.delete-button:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(231, 76, 60, 0.5);
}
</style>
