const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "vkk2nr5b6k3wkg4c",
  publicKey: "gt55h3xrznw2xhsc",
  privateKey: "f9f0f9b59ffbb4223c26497f8cb80141"
});

exports.getToken = (req,res) => {
    gateway.clientToken.generate({
        
    }, (err, response) => {
        if (err) {
            res.status(500).send(err);
        }
        else {
            res.send(response)
        }
        // pass clientToken to your front-end
        //const clientToken = response.clientToken
      });
}
exports.processPayment = (req,res) => {
    let nonceFromTheClient = req.body.paymentMethodNonce;
    let amountFromTheClient = req.body.amount;
    gateway.transaction.sale({
        amount: amountFromTheClient,
        paymentMethodNonce: nonceFromTheClient,
        options: {
          submitForSettlement: true
        }
    }, (err, result) => {
        if (err) {
            res.status(500).json(err);
        }
        else {
            res.json(result);
        }
      });
}
