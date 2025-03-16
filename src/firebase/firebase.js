import { initializeApp } from "firebase/app";
import { getFirestore, getDoc, doc,setDoc, collection } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDTL_knHUO93IEYsRBURPqM4R7XPUxuUEY",
  authDomain: "ecommerce-527bf.firebaseapp.com",
  projectId: "ecommerce-527bf",
  storageBucket: "ecommerce-527bf.firebasestorage.app",
  messagingSenderId: "224178638293",
  appId: "1:224178638293:web:f521b94ca1c7fefa16415c",
  measurementId: "G-DE9HLZD9F2"
};
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);
const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return null;

  const userRef = doc(db, 'users', userAuth.uid); // Create a reference to the 'users' collection with user UID

  // Check if the user document exists
  const userSnap = await getDoc(userRef);

  // If the user doesn't exist, create the document
  if (!userSnap.exists()) {
    try {
      // Create a new user document with the user's authentication data
      await setDoc(userRef, {
        uid: userAuth.uid,
        displayName: userAuth.displayName || 'Anonymous',
        email: userAuth.email,
        createdAt: Timestamp.now(), // Add a createdAt timestamp
        ...additionalData, // Additional data can be added from the arguments
      });
    } catch (error) {
      console.error("Error creating user document: ", error.message);
    }
  }

  return userRef;
};
// Initialize Authentication
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export { db, auth, googleProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, createUserProfileDocument };