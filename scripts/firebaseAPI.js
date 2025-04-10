// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCr2IuZ-cxQPgEOe6DW-Fl-U9IExRZ3MiE",
    authDomain: "bby15-e3ff5.firebaseapp.com",
    projectId: "bby15-e3ff5",
    storageBucket: "bby15-e3ff5.firebasestorage.app",
    messagingSenderId: "246151298107",
    appId: "1:246151298107:web:a04048e2ceab42b9abb01e"
  };
  
  // Initialize Firebase
  const app = firebase.initializeApp(firebaseConfig);
  // Initialize Firebase services
  const db = firebase.firestore();
  // const auth = getAuth(app);
  
  // Export the services
  // export { app, db, auth };