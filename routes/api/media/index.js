const { Router } = require("express");
const mediaRouter = require("./media");

const router = Router();

router.use(mediaRouter); 

module.exports = router;
