import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getFirestore, doc, getDoc, updateDoc, increment } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

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
const auth = getAuth(app); // Firebase Authentication instance

// Fetch and display user profile based on UID in URL
async function displayUserProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const uid = urlParams.get("uid");

  if (uid) {
    try {
      const userRef = doc(db, "users", uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const user = docSnap.data();
        const profileDiv = document.getElementById("profile");

        profileDiv.innerHTML = `
          <h2>${user.firstName} ${user.lastName}</h2>
          <p><strong>Email:</strong> ${user.email || "Not provided"}</p>
          <p><strong>Votes:</strong> ${user.votes || 0}</p>
          <button class="button" id="copyLinkBtn">Copy Profile Link</button>
          <button class="button" id="voteBtn">Pay to Vote</button>
        `;

        // Add functionality to copy the profile URL to clipboard
        document.getElementById("copyLinkBtn").addEventListener("click", () => {
          const profileUrl = window.location.href;  // Get current URL
          navigator.clipboard.writeText(profileUrl)  // Copy URL to clipboard
            .then(() => alert("Profile link copied to clipboard!"))
            .catch(err => alert("Failed to copy: " + err));
        });

        // Paystack payment integration
        document.getElementById("voteBtn").addEventListener("click", () => {
          // Trigger Paystack payment
          payWithPaystack(userRef, user);
        });
      } else {
        console.log("No such user!");
        const profileDiv = document.getElementById("profile");
        profileDiv.innerHTML = "<p>User not found.</p>";
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("Failed to load user profile. Please try again later.");
    }
  } else {
    console.log("No UID found in URL.");
    alert("User ID is missing from the URL.");
  }
}

// Paystack payment process
function payWithPaystack(userRef, user) {
  // If a user is logged in, use their email; otherwise, ask for an email
  const currentUser = auth.currentUser;  // Get the currently logged-in user from Firebase Authentication
  let email = currentUser ? currentUser.email : prompt("Please enter your email to vote:");

  if (!email) {
    alert("Email is required to proceed with the payment.");
    return;
  }

  const handler = PaystackPop.setup({
    key: "pk_test_8430ba50d9ed4200e7a5ec26f35dfd237e34aa93", // Replace with your Paystack public key
    email: email, // Use the authenticated user's email or the manually entered email
    amount: 50000, // Amount in kobo (500 Naira = 50000 kobo)
    currency: "NGN",
    ref: "unique_reference_" + Math.floor(Math.random() * 1000000),
    callback: async function (response) {
      // Handle successful payment
      alert("Payment successful! Transaction reference: " + response.reference);

      // Now increment votes (10 votes for every 500 Naira)
      try {
        await updateDoc(userRef, {
          votes: increment(10)  // Increment votes by 10 for every successful payment
        });
        alert("Your vote count has been updated!");
      } catch (error) {
        console.error("Error updating vote count:", error);
        alert("Failed to update vote count. Please try again later.");
      }
    },
    onClose: function () {
      alert("Transaction was not completed. Please try again.");
    }
  });

  handler.openIframe();  // Open Paystack payment modal
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", displayUserProfile);
