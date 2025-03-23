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
import TodayTask from "./pages/TodayTask";
import UpcomingTasks from "./pages/UpcomingTasks";
import CompletedTasks from "./pages/CompletedTasks";
import "./App.css";

export default function App() {
  const dispatch = useDispatch();
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
  const Setting = () => {
    return <div>Settings</div>
  }
  return (
    <div>
      <Header />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/today" element={<TodayTask />}/>
          <Route path="/upcoming" element={<UpcomingTasks />}/>
          <Route path="/completed" element={<CompletedTasks />} />
          <Route path="/login" element={<Login />}/>
          <Route path="/signup" element={<Signup />}/>
          <Route path="/settings" element={<Setting />}/>
        </Routes>
      <Footer />
    </div>
  )
}
