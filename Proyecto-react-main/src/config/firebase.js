import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCofFDjouVvSvymRjhB3BgXYXhMwY6hJjw",
  authDomain: "turismo-ecuador-420f5.firebaseapp.com",
  projectId: "turismo-ecuador-420f5",
  storageBucket: "turismo-ecuador-420f5.firebasestorage.app",
  messagingSenderId: "631006731364",
  appId: "1:631006731364:web:0c53b3539b4c4546431371",
  measurementId: "G-7QC22QK5BS"
};

const app = initializeApp(firebaseConfig);

// Exportamos auth y db para que Zustand y los componentes puedan usarlos
export const auth = getAuth(app);
export const db = getFirestore(app);