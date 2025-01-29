import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyARqM6ZBbeb_SgGPx8QlQqt9Rg1tK8XDZ0",
  authDomain: "netflixb2-8c960.firebaseapp.com",
  projectId: "netflixb2-8c960",
  storageBucket: "netflixb2-8c960.firebasestorage.app",
  messagingSenderId: "55737133390",
  appId: "1:55737133390:web:2afaa8b3ceb5dccbcc961f",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name: name,
      authProvider: "local",
      email: email,
    });
  } catch (error) {
    console.log(error);
    toast.error("Utilisateur ou email déjà inscrit");
  }
};
const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error);
    toast.error("Email ou mot de passé incorrect");
  }
};

const logout = () => {
  signOut(auth);
};
export { auth, db, signup, login, logout };
