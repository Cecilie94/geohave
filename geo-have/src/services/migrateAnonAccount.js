import {
  EmailAuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAuth,
  linkWithCredential,
  linkWithPopup,
} from "firebase/auth";

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

// Function to migrate anonymous account to a specified provider (Google, email, Facebook)
export const migrateAnonAccount = async (provider, data) => {
  let credential = null;

  switch (provider) {
    case "google":
      // Google sign-in provider
      credential = GoogleAuthProvider.credential(data.idToken); // Create Google credential using ID token
      break;
    case "email":
      // Email sign-in provider
      credential = EmailAuthProvider.credential(data.email, data.password); // Create email credential using email and password
      break;
    case "facebook":
      // Facebook sign-in provider
      credential = FacebookAuthProvider.credential(data.accessToken); // Create Facebook credential using access token
      break;
    default: {
      console.error("Invalid provider"); // Handle invalid provider case
      return;
    }
  }
  const auth = getAuth(); // Get current authentication instance
  linkWithCredential(auth.currentUser, credential) // Link the current user with the created credential
    .then((usercred) => {
      const user = usercred.user; // Get the upgraded user
      console.log("Anonymous account successfully upgraded", user); // Log success message
    })
    .catch((error) => {
      console.log("Error upgrading anonymous account", error); // Log any errors
    });
};
