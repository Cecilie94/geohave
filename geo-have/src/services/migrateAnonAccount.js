import {
  EmailAuthProvider,
  FacebookAuthProvider,
  GoogleAuthProvider,
  getAuth,
  linkWithCredential,
  linkWithPopup,
} from "firebase/auth";

export const migrateAnonAccountToGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  linkWithPopup(auth.currentUser, provider)
    .then(async () => {
      location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
};

export const migrateAnonAccount = async (provider, data) => {
  let credential = null;

  switch (provider) {
    case "google":
      // Google sign-in provider
      credential = GoogleAuthProvider.credential(data.idToken);
      break;
    case "email":
      // Email sign-in provider
      credential = EmailAuthProvider.credential(data.email, data.password);
      break;
    case "facebook":
      // Facebook sign-in provider
      credential = FacebookAuthProvider.credential(data.accessToken);
      break;
    default: {
      console.error("Invalid provider");
      return;
    }
  }
  const auth = getAuth();
  linkWithCredential(auth.currentUser, credential)
    .then((usercred) => {
      const user = usercred.user;
      console.log("Anonymous account successfully upgraded", user);
    })
    .catch((error) => {
      console.log("Error upgrading anonymous account", error);
    });
};
