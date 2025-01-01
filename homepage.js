// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import {getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js"
import {getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC8raLuAJm3ZvL_hqwMto_tSZUdmujGFLY",
  authDomain: "login-3ca3a.firebaseapp.com",
  projectId: "login-3ca3a",
  storageBucket: "login-3ca3a.firebasestorage.app",
  messagingSenderId: "362234859360",
  appId: "1:362234859360:web:921d7a6fc28226502e5805"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth=getAuth();
const db=getFirestore();

onAuthStateChanged(auth, (user)=>{
  const loggedInUserId=localStorage.getItem('loggedInUserId');
  if(loggedInUserId){
      console.log(user);
      const docRef = doc(db, "users", loggedInUserId);
      getDoc(docRef)
      .then((docSnap)=>{
          if(docSnap.exists()){
              const userData=docSnap.data();
              document.getElementById('loggedUserFName').innerText=userData.firstName;
              document.getElementById('loggedUserEmail').innerText=userData.email;
              document.getElementById('loggedUserLName').innerText=userData.lastName;

          }
          else{
              console.log("no document found matching id")
          }
      })
      .catch((error)=>{
          console.log("Error getting document");
      })
  }
  else{
      console.log("User Id not Found in Local storage")
  }
})

const logoutButton=document.getElementById('logout');

logoutButton.addEventListener('click',()=>{
  localStorage.removeItem('loggedInUserId');
  signOut(auth)
  .then(()=>{
      window.location.href='index.html';
  })
  .catch((error)=>{
      console.error('Error Signing out:', error);
  })
})

// Add functionality to copy the profile URL to clipboard
    document.getElementById("copyLinkBtn").addEventListener("click", () => {
        const profileUrl = window.location.href;  // Get current URL
        navigator.clipboard.writeText(profileUrl)  // Copy URL to clipboard
        .then(() => alert("Profile link copied to clipboard!"))
        .catch(err => alert("Failed to copy: " + err));
    });