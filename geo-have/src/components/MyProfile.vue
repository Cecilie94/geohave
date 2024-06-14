<template>
  <div>
    <NavBar />
    <button @click="deleteUser">Delete User</button>
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
</style>
