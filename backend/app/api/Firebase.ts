import { initializeApp } from "firebase/app";

import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBCIPbd8ejdAoggzgLVJSGzPei_dKl479I",

  authDomain: "urban-vogue-br.firebaseapp.com",

  projectId: "urban-vogue-br",

  storageBucket: "urban-vogue-br.appspot.com",

  messagingSenderId: "812157076861",

  appId: "1:812157076861:web:3bd25c7bd04f35d1a8f814",

  measurementId: "G-E1JEYW67EF",
};



// Initialize Firebase

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
