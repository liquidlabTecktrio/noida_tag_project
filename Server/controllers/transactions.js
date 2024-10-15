const mongoose = require("mongoose");
const Transactions = require("../models/Transactions");
const utils = require("../controllers/utils");
const Terminals = require("../models/Terminal");
const TagReader = require("../models/TagReader");
const Customers = require("../models/Customers");
const TcpCommand = require("../controllers/tcpController/tcpcommand");
const noidaRFIDServer = require("../noidaRFIDServer");
const { WebSocket, WebSocketServer } = require("ws");

exports.createTransactions = async (req, res) => {
  try {
    const type = req.body.type;
    const terminalId = req.body.terminalId;
    const customerId = req.body.customerId;
    const date = req.body.date;

    await Transactions.create({
      type: type,
      terminalId: terminalId,
      customerId: customerId,
      date: date,
    });
    if (Transactions) {
      utils.commonResponce(res, 200, "Transcations created Sucessfully");
    }
  } catch (error) {
    console.log("error: ", error);
    utils.commonResponce(res, 500, "Unexpected Server Error", error.toString());
  }
};

exports.createTransaction = async (data) => {
  // console.log('data: createTransaction', data);
  try {
    if (data != null) {
      // console.log('readerId : ', data.readerId, parseInt(data.readerId), parseInt(data.readerId, 16));

      const tagReaderObj = await TagReader.findOne({
        readerNo: parseInt(data.readerId, 16),
      });
      // const tagReaderObj = await TagReader.findOne({readerNo:parseInt(data.readerId)});
      // console.log('tagReaderObj: ', tagReaderObj);
      const terminalObj = await Terminals.findOne({
        tagReaderId: tagReaderObj._id,
      });
      // console.log('terminalObj: ', terminalObj);
      const customerObj = await Customers.findOne({ tagNo: data.tags });
      // console.log('customerObj: ', customerObj);

      const type = terminalObj.type;
      const terminalId = terminalObj._id;
      const customerId = customerObj._id;
      const date = utils.dateTimeFormate(new Date());

      const checkType = await Transactions.findOne({
        customerId: customerId,
      }).sort({ createdAt: -1 });
      console.log("checkType: ", checkType);

      //  if( checkType!=null&&checkType.type==type )
      if (false) {
        let data1 = {
          readerId: tagReaderObj._id,
        };
        await noidaRFIDServer.wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {
            console.log("WebSocket.OPEN: ", client.readyState);
            client.send(
              JSON.stringify({
                isShowAlert: true,
                message: `vehical already ${
                  type == "entry" ? "in the parking" : "exited"
                }`,
                vehicleNo: customerObj.vehicleNo ?? "",
                terminalName: terminalObj.terminalName ?? "",
              })
            );
          }
        });
        await TcpCommand.makeBeepSound(data1, 4, 2);
        // utils.commonResponce(res, 201, `vehical already ${ type=='entry'?"in the parking":"exited" }`, error.toString());
        console.log("vehical already : ");
      } else {
        let data2 = {
          readerId: tagReaderObj._id,
        };
        //  await  TcpCommand.makeBeepSound(data2, 4, 5);
        await Transactions.create({
          type: type,
          terminalId: terminalId,
          customerId: customerId,
          date: date,
        }).then(async (val) => {
          // console.log('val: ', val);
          await TcpCommand.activateRelayToOpenBarrier(data2);
          console.log("transaction created");
          // utils.commonResponce(res, 200, "Transcations created Sucessfully")
        });
      }
    }
  } catch (error) {
    console.log("error: ", error);
    // utils.commonResponce(res, 500, "Unexpected Server Error", error.toString());
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const data = await Transactions.find();

    utils.commonResponce(res, 200, "Successfully fetched Transactions", data);
  } catch (error) {
    console.log("error", error);
  }
};

exports.deleteTransactions = async (req, res) => {
  try {
    const _id = req.body._id;

    await Transactions.findByIdAndDelete({
      _id: _id,
    }).then(async (transactiondata) => {
      const transactions = await Transactions.find();
      utils.commonResponce(
        res,
        200,
        "transactions deleted Successfully",
        transactions
      );
    });
  } catch (error) {
    console.log("error: ", error);
    utils.commonResponce(res, 500, "Server Error", error);
  }
};

exports.transactionReport = async (req, res) => {
  try {
    const fromDate = req.body.fromDate;
    const toDate = req.body.toDate;
    const terminalId = req.body.terminalId;

    console.log("date",fromDate, toDate)

    let fromDateWithTime = new Date(fromDate + " 00:00:01");
    let toDateWithTime = new Date(toDate + " 23:59:59");

    console.log("date",fromDateWithTime, toDateWithTime)

    await Transactions.aggregate([
      {
        $addFields: {
          date: {
            $dateFromString: {
              dateString: "$date",
            },
          },
        },
      },
      {
        $match: {
          date: {
            $gte: fromDateWithTime,
            $lte: toDateWithTime,
          },
          terminalId: mongoose.Types.ObjectId(terminalId),
        },
      },
      {
        $lookup: {
          from: "terminals",
          localField: "terminalId",
          foreignField: "_id",
          as: "terminalName",
        },
      },
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "result",
        },
      },
      {
        $addFields: {
          result: {
            $first: "$result",
          },
        },
      },
      {
        $unwind: {
          path: "$terminalName",
        },
      },
      {
        $project: {
          terminalName: "$terminalName.terminalName",
          type: 1,
          date: 1,
          tagNo: "$result.tagNo",
          customersName: "$result.name",
        },
      },
    ]).then(async (transactionData) => {
      utils.commonResponce(
        res,
        200,
        "transactions Report Created Successfully",
        transactionData
      );
    });
  } catch (error) {
    console.log("error: ", error);
    utils.commonResponce(res, 500, "Server Error", error);
  }
};
