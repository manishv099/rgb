import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBQ3Wza-nv1Dee6p4nVysD_vgO6JguZU1E",
  authDomain: "color-game-code.firebaseapp.com",
  projectId: "color-game-code",
  storageBucket: "color-game-code.appspot.com",
  messagingSenderId: "150101596787",
  appId: "1:150101596787:web:26144a8d1d20d06388a806"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);