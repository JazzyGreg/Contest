const functions = require("firebase-functions");
const axios = require("axios");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();

const PAYSTACK_SECRET_KEY = "pk_test_8430ba50d9ed4200e7a5ec26f35dfd237e34aa93";  // Replace with your Paystack secret key

// Endpoint to handle Paystack webhook
exports.paystackWebhook = functions.https.onRequest(async (req, res) => {
  try {
    // Webhook payload
    const event = req.body;
    const transactionReference = event.data.reference;

    if (event.event === "charge.success") {
      // Verify the transaction using the Paystack API
      const paystackVerificationUrl = `https://api.paystack.co/transaction/verify/${transactionReference}`;

      // Paystack headers with secret key for verification
      const headers = {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      };

      const response = await axios.get(paystackVerificationUrl, { headers });

      if (response.data.status === "success") {
        // Payment successful, update Firestore
        const userId = response.data.data.metadata.user_id;  // Assuming you saved user_id in metadata during payment setup

        // Reference to the user document in Firestore
        const userRef = admin.firestore().doc(`users/${userId}`);
        const userDoc = await userRef.get();

        if (userDoc.exists) {
          // If user exists, update the votes
          await userRef.update({
            votes: admin.firestore.FieldValue.increment(10),  // Increment votes by 10 for each successful payment
          });

          res.status(200).send("Payment verified and vote count updated.");
        } else {
          res.status(404).send("User not found.");
        }
      } else {
        res.status(400).send("Payment verification failed.");
      }
    } else {
      res.status(400).send("Invalid event type.");
    }
  } catch (error) {
    console.error("Error verifying Paystack payment:", error);
    res.status(500).send("Server error");
  }
});
