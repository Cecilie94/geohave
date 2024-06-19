import {
  getAuth,
  signInAnonymously as firebaseSignInAnonymously,
} from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const signInAnonymously = async () => {
  const auth = getAuth();
  const db = getFirestore();

  try {
    // sign in anonymously
    const userCredential = await firebaseSignInAnonymously(auth);

    // Get the anon user's UID
    const { uid } = userCredential.user;

    // add the anon user to Firestore
    const userRef = collection(db, "User");
    await addDoc(userRef, {
      uid: uid,
      points: 0,
      anonymous: true,
    });

    console.log("Anonymous login successful");
  } catch (error) {
    console.error("Error signing in anonymously:", error);
    // Handle error here
  }
};

export default signInAnonymously;
