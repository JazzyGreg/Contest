import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

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
const db = getFirestore(app);

// Fetch and display users
function displayLeaderboard() {
  const leaderboardDiv = document.getElementById("leaderboard");

  // Query Firestore to order users by votes in descending order
  const usersQuery = query(collection(db, "users"), orderBy("votes", "desc"));

  // Listen to Firestore updates
  onSnapshot(usersQuery, (snapshot) => {
    leaderboardDiv.innerHTML = ""; // Clear leaderboard
    let rank = 1; // Initialize rank

    snapshot.forEach((doc) => {
      const user = doc.data();
      const userVotes = user.votes || 0;  // Default to 0 votes if no votes field exists

      // Create user card with rank, name, votes, and "Vote" button
      const userDiv = document.createElement("div");
      userDiv.className = "user";
      userDiv.innerHTML = `
        <span>#${rank} ${user.firstName} ${user.lastName} - Votes: ${userVotes}</span>
        <button class="vote-btn" onclick="window.location.href='profile.html?uid=${doc.id}'">Vote</button>
      `;
      leaderboardDiv.appendChild(userDiv);
      rank++; // Increment rank after each user
    });
  });
}

// Load leaderboard when the page loads
document.addEventListener("DOMContentLoaded", displayLeaderboard);
