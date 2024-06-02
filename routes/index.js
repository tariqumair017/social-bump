const express  = require("express");
const router   = express.Router(); 

//Root Route
router.get("/", (req, res) => {
    res.render("landing");
});


module.exports = router;