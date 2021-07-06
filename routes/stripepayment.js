const express= require("express");
const router = express.Router();

const { makepayment } = require("../controllers/stripepayment");
//post route 
router.post("/stripepayment",makepayment)




module.exports = router;
