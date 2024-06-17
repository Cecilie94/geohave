import { GoogleAuthProvider, getAuth, linkWithPopup } from "firebase/auth";

// Function to migrate anonymous account to Google account using a popup
export const migrateAnonAccountToGoogle = async () => {
  const provider = new GoogleAuthProvider(); // Initialize Google Auth Provider
  const auth = getAuth(); // Get current authentication instance
  linkWithPopup(auth.currentUser, provider) // Link the current user with Google provider using a popup
    .then(async () => {
      location.reload(); // Reload the page on successful linking
    })
    .catch((error) => {
      console.log(error); // Log any errors
    });
};
