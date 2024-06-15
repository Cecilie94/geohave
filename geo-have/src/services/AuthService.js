import "@/configs/firebase";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import router from "@/router";

const auth = getAuth();
const db = getFirestore();

export const onSignOut = async () => {
  try {
    await signOut(auth);
  } catch (e) {
    console.log(e);
  }
};

// state change to display logout instead of login
export const stateChange = (callback) => {
  onAuthStateChanged(auth, callback);
};

// sign in function
export const signIn = async (email, password, errMsg) => {
  try {
    const userData = await signInWithEmailAndPassword(auth, email, password);
    console.log("Succesful sign in!");
    router.push("/"); // redirects to home after succesful sign in
    console.log(userData);

    await addUserToFirestore(userData.user.uid, userData.user.email);

    return {
      uid: userData.user.uid,
    };
  } catch (error) {
    console.log(error.code);
    switch (error.code) {
      case "auth-invalid-email":
        errMsg.value = "Forkert email.";
        break;
      case "auth/wrong-password":
        errMsg.value = "Forkert adgangskode.";
        break;
      default:
        errMsg.value = "Forkert adgangskode eller email";
        break;
    }
    alert(error.message);
    return null;
  }
};

// sign up function
export const signUp = async (email, password) => {
  try {
    const userData = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await addUserToFirestore(userData.user.uid, email);

    console.log("Succesful signup!");
    router.push("/");
  } catch (error) {
    console.log(error.code);
    alert(error.message);
  }
};

// Function to add user data to Firestore
const addUserToFirestore = async (uid, email) => {
  try {
    let createNewUserInfo = true;

    const querySnapshotUserPoints = await getDocs(collection(db, "User"));
    querySnapshotUserPoints.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
      if (doc.data().uid === uid) {
        createNewUserInfo = false;
      }
    });

    if (createNewUserInfo) {
      const userRef = collection(db, "User");
      await addDoc(userRef, {
        uid: uid,
        email: email,
        firstname: "",
        lastname: "",
        phone: "",
        points: 0,
      });
      console.log("User data added to Firestore");
    }
  } catch (error) {
    console.error("Error adding user to Firestore: ", error);
    throw error; //
  }
};

// sign in with google
export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user;
      await addUserToFirestore(user.uid, user.email);
      console.log(result);
      router.push("/");
    })
    .catch((error) => {
      console.log(error);
    });
};

// sign in with facebook
export const signInWithFacebook = () => {
  const provider = new FacebookAuthProvider();
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user;
      await addUserToFirestore(user.uid, user.email);
      console.log(result);
      router.push("/");
    })
    .catch((error) => {
      console.log(error);
    });
};
