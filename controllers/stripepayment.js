const stripe = require("stripe")("sk_test_51IrPpxSB7UabbCMrCSVRkNORwjFTOaUJKMP6vw6aSNc8ZA3AqRYhWseuJyTp5cXZZhiudEegQnckDAGD7kajhCfr003803nntj");
const uuid = require('uuid/v4');




exports.makepayment = (req, res) => {
    const { products, token } = req.body;
    console.log(products);
    let amount=0;
        
    if(products !== undefined ){
       products.map(p=>{
amount = amount + p.price;
});
    }
    const idempotencyKey = uuid();
    return stripe.customers.create({
        email: token.email,
        source: token.id,
        
    }).then((customer) => {
        stripe.charges.create({
            amount:amount*100,
            currency: "usd",
            customer: customer.id,
            receipt_email: token.email,
            description:"testing phase",
            shipping: {
                name: token.card.name,
                address: {
                    line1:token.card.address_line1,
                    line2: token.card.address_line2,
                    country: token.card.address_country,
                    city:token.card.address_city,
                } 
                
                
            }

        }, { idempotencyKey })
            .then(result => {
                res.status(200).json(result);
            })
            .catch((err) => console.log("Error", err));
    })
}