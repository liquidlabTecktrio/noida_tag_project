const express = require("express");

const router = express.Router();

const appLoginController = require("../controllers/admin");

// const readerController = require("../controllers/reader");

const terminalController = require("../controllers/terminal");

const tagReaderController = require("../controllers/tagReader");

const barrierController = require("../controllers/barrier");

const tagsController = require("../controllers/tags");

const customersController = require("../controllers/customers");

const transactionsController = require("../controllers/transactions");

const pollGraphController = require("../controllers/pollGraph")













             
router.post("/adminLogin",appLoginController.adminLogin)
router.post("/adminSignUp",appLoginController.adminSignUp)
router.delete("/deleteAdmin",appLoginController.deleteAdmin)
router.put("/UpdateAdmin",appLoginController.UpdateAdmin)
router.post("/getAllAdmin",appLoginController.getAllAdmin)

// router.post("/createReader",readerController.createReader)
// router.post("/getAllReader",readerController.getAllReader)


router.post("/createTerminal",terminalController.createTerminal)
router.post("/createTagReader",tagReaderController.createTagReader)
router.post("/createBarrier",barrierController.createBarrier)
router.post("/createTags",tagsController.createTags)
router.post("/createCustomers",customersController.createCustomers)
router.post("/createTransactions",transactionsController.createTransactions)

router.get("/getAllTerminals",terminalController.getAllTerminals)
router.get("/getAllTransactions",transactionsController.getAllTransactions)
router.get("/getAllTags",tagsController.getAllTags)
router.get("/getAvailableTags",tagsController.getAvailableTags)
router.get("/getAllBarriers",barrierController.getAllBarriers)
router.get("/getAllTagReaders",tagReaderController.getAllTagReaders)
router.get("/getAllCustomers",customersController.getAllCustomers)


router.post("/updateTerminal", terminalController.updateTerminal)
router.post("/updateTags", tagsController.updateTags)
router.post("/updateBarriers", barrierController.updateBarriers)
router.post("/updateTagReaders", tagReaderController.updateTagReaders)
router.post("/updateCustomers", customersController.updateCustomers)

router.delete("/deleteCustomers",customersController.deleteCustomers)
router.delete("/deletetagReaders",tagReaderController.deletetagReaders)
router.delete("/deleteBarriers",barrierController.deleteBarriers)
router.delete("/deleteTags",tagsController.deleteTags)
router.delete("/deleteTransactions",transactionsController.deleteTransactions)
router.delete("/deleteTerminals",terminalController.deleteTerminals)



router.post("/updateCustomersStatus", customersController.updateCustomersStatus)
router.post("/updateTagReaderStatus", tagReaderController.updateTagReaderStatus)
router.post("/updateTerminalStatus", terminalController.updateTerminalStatus)




router.post("/transactionReport", transactionsController.transactionReport)
router.post("/customerReport", customersController.customerReport)

router.post("/customerSearch", customersController.customerSearch)

router.post("/createPollGraph", pollGraphController.createPollGraph)























module.exports = router;