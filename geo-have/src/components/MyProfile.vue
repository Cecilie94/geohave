<template>
  <div>
    <NavBar />
    <button @click="deleteUser">Delete User</button>
  </div>
</template>

<script>
import { ref } from 'vue';
import { getAuth, deleteUser } from "firebase/auth";

export default {
  setup() {
    const auth = getAuth();
    const user = ref(auth.currentUser);

    const deleteUserAccount = () => {
      if (user.value) {
        deleteUser(user.value)
          .then(() => {
            console.log("User Account Deleted Successfully");
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
</style>
