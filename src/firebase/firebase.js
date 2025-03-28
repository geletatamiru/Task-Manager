import { initializeApp } from "firebase/app";
import { getFirestore, getDoc, getDocs, doc,setDoc, addDoc, collection, query, where ,Timestamp, deleteDoc, updateDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};
console.log(import.meta.env.VITE_FIREBASE_API_KEY);
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



export const fetchTodaysTasksFromFirestore = async (userId) => {
  const today = new Date();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0); // Get the start of today

  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999); // Get the end of today

  try {
    // Query for tasks by userId and date range
    const tasksQuery = query(
      collection(db, "tasks"),
      where("userId", "==", userId),
      where("date", ">=", startOfDay),
      where("date", "<=", endOfDay)
    );

    const querySnapshot = await getDocs(tasksQuery);
    const tasks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return tasks;
  } catch (error) {
    throw new Error("Error fetching today's tasks: " + error.message);
  }
};
export const fetchUpcomingTasksFromFirestore = async (userId) => {
  try {
    const today = new Date();
    today.setHours(23, 59, 59, 999); // Ensure we compare only the date part
    const tasksRef = collection(db, "tasks");
    const q = query(
      tasksRef,
      where("userId", "==", userId),
      where("date", ">", Timestamp.fromDate(today)) // Fetch tasks with future dates
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching upcoming tasks:", error);
    throw error;
  }
};
export const fetchCompletedTasksFromFirestore = async (userId) => {
  try {
    const now = new Date();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999); // Today 23:59:59

    const lastWeekStart = new Date();
    lastWeekStart.setDate(lastWeekStart.getDate() - 7 - lastWeekStart.getDay() + 1); // Last week's Monday
    lastWeekStart.setHours(0, 0, 0, 0);
    const tasksRef = collection(db, "tasks");
    const q = query(
      tasksRef,
      where("userId", "==", userId),
      where("completed", "==", true),
      where("date", ">=", lastWeekStart),
      where("date", "<=", todayEnd)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      title: doc.data().title,
      date: doc.data().date
    }));
  } catch (error) {
    console.error("Error fetching completed tasks:", error);
    throw error;
  }
};
export const addTaskToFirestore = async (task) => {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), task);
    const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const taskData = { id: docSnapshot.id, ...docSnapshot.data() };

        // Convert date to milliseconds if it's a Timestamp
        if (taskData.date && typeof taskData.date.toMillis === 'function') {
          taskData.date = taskData.date.toMillis();
        }

        return taskData;
      } else {
        throw new Error('Failed to retrieve document data after adding.');
      }
  } catch (error) {
    console.error("Error adding task:", error);
    throw error;
  }
};

export const deleteTaskFromFirestore = async (taskId) => {
    try {
      const taskDocRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskDocRef);
      console.log(`Task with ID ${taskId} deleted successfully.`); // Optional success log
    } catch (error) {
      console.error(`Error deleting task with ID ${taskId}:`, error); // Log the error
      throw error; // Re-throw the error so the rejected case of the thunk is handled
    }
}
export const toggleCompletedInFirestore = async ({id, completed}) => {
  try {
    const taskDocRef = doc(db, 'tasks', id)
    await updateDoc(taskDocRef, { completed });
  } catch (error) {
    console.log(error.message);
    throw error;
  }
}
// Initialize Authentication
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
export { db, auth, googleProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, createUserProfileDocument };