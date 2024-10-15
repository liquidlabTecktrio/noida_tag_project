const express = require("express");
const router = express.Router();

const tcpcommandController = require("../controllers/tcpController/tcpcommand");
// const dashboardController = require("../controllers/dashboard");


router.post("/checkBeep",tcpcommandController.audiableIndicationCommand);
// router.post("/getDashboardData",dashboardController.getDashboardData);


module.exports = router;