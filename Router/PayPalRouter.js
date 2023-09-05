const express = require("express");
const router = express.Router();
const paypal = require('paypal-rest-sdk');

paypal.configure({
  mode: 'sandbox', // 'sandbox' or 'live' depending on your environment
  client_id: 'AR1P1qCucSUOc87tuWd__ZXibwNya05d07mFBP3gSaGOH8jjmwH8fNrBzFKtnokc8A17JOb-zu80e9lg',
  client_secret: 'EGC2RyUFpbG9SgwiFevDsqWlhklbPRXKnao0Aw9FK_HwcKqc9kWg41ppYVjbKeYqo_0FBpQ1VB5Ql7zi',
});  

// Create a payment
router.post("/create-payment", (req, res) => {
  const paymentData = {
    intent: "sale",
    payer: {
      payment_method: "paypal",
    },
    redirect_urls: {
      return_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
    },
    transactions: [
      {
        amount: {
          total: "10.00",
          currency: "USD",
        },
        description: "Sample Payment",
      },
    ],
  };

  paypal.payment.create(paymentData, (error, payment) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating payment" });
    } else {
      // Redirect the user to PayPal for payment approval
      for (let link of payment.links) {
        if (link.rel === "approval_url") {
          res.redirect(link.href);
        }
      }
    }
  });
});

// Execute the payment
router.get("/success", (req, res) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const executePayment = {
    payer_id: payerId,
  };

  paypal.payment.execute(paymentId, executePayment, (error, payment) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "Error executing payment" });
    } else {
      // Payment was successful
      res.json({ success: true, message: "Payment was successful." });
    }
  });
});

router.get("/cancel", (req, res) => {
  res.json({ success: false, message: "Payment was canceled." });
});

module.exports = router;