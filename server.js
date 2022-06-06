// This is your test secret API key.
const stripe = require('stripe')('sk_test_51L5QWSSIgAz5sBW0XW5IspjkRxlNiFovuXtU6XdiJtIEjse0DPpzP9T1mIb9FPtuvX0P3iSigtJWVcQk2lWWRqX600eA53REIl');
const express = require('express');
const app = express();
app.use(express.static('public'));

const YOUR_DOMAIN = 'http://localhost:4242';





app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1L5S7vSIgAz5sBW0avtTn712',
        quantity: 1,
      },
    ],
    
  phone_number_collection: {
    enabled: true,
  },
    mode: 'payment',
    success_url: `http://localhost:4242/order/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  })
  res.redirect(303, session.url);
});


app.get('/order/success', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  const customer = await stripe.customers.retrieve(session.customer);
  const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
  console.log("paymentIntent", paymentIntent)
  console.log("session", session)
  console.log("customer", customer)
  res.send(`<html><body><h1>Thanks for your order, ${customer.name}!</h1></body></html>`);
});


app.listen(4242, () => console.log('Running on port 4242'));