import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth, createUserProfileDocument } from "./firebase/firebase";
import { getDoc } from "firebase/firestore";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { login,logout } from "./state/userSlice";
import "./App.css";
import TodayTask from "./pages/TodayTask";

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (userAuth) => {
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);
        if (!userRef) return;
  
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const createdAt = userData.createdAt ? userData.createdAt.toDate().toISOString() : null;
          dispatch(login({ id: userSnap.id, ...userData, createdAt }));
        }
      } else {
        dispatch(logout());
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  return (
    <div>
      <Header />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/today" element={<TodayTask />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/signup" element={<Signup />}/>
        </Routes>
      <Footer />
    </div>
  )
}
