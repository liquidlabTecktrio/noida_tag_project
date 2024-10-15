// const mongoose = require("mongoose");
// const PollGraph = require("../models/PollGraph");s
const utils = require("../controllers/utils");
const Customers = require("../models/Customers");
// const Transactions = require("../../models/Transactions");
const Transactions = require("../models/Transactions");

exports.createPollGraph = async (req, res) => {
  try {
    let fromDateWithTime = new Date(req.body.date + " 00:00:00");
    // console.log(req.body);
    let toDateWithTime = new Date(req.body.date + " 23:59:59");

    let getSeriesData = await Transactions.aggregate([
      [
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
          },
        },
        {
          $group: {
            _id: {
              dateHour: {
                $concat: [
                  {
                    $toString: {
                      $year: "$date",
                    },
                  },
                  "-",
                  {
                    $toString: {
                      $month: "$date",
                    },
                  },
                  "-",
                  {
                    $toString: {
                      $dayOfMonth: "$date",
                    },
                  },
                  " ",
                  {
                    $toString: {
                      $hour: "$date",
                    },
                  },
                  ":00",
                ],
              },
            },
            entryCount: {
              $sum: {
                $cond: {
                  if: {
                    $eq: ["$type", "entry"],
                  },
                  then: 1,
                  else: 0,
                },
              },
            },
            exitCount: {
              $sum: {
                $cond: {
                  if: {
                    $eq: ["$type", "exit"],
                  },
                  then: 1,
                  else: 0,
                },
              },
            },
          },
        },
        {
          $addFields: {
            hour: {
              $substrBytes: [
                "$_id.dateHour",
                {
                  $subtract: [
                    {
                      $strLenCP: "$_id.dateHour",
                    },
                    5,
                  ],
                },
                5,
              ], // Using $substrBytes
            },
          },
        },
        {
          $sort: {
            hour: 1,
          },
        },
        {
          $group: {
            _id: null,
            time: {
              $push: "$_id.dateHour",
            },
            entryArray: {
              $push: "$entryCount",
            },
            exitArray: {
              $push: "$exitCount",
            },
          },
        },
        {
          $project: {
            time: 1,
            _id: 0,
            series: [
              {
                name: "entry",
                data: "$entryArray",
              },
              {
                name: "exit",
                data: "$exitArray",
              },
            ],
          },
        },
      ]

    ]);
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);
    // sevenDaysAgo.setDate(today.getDate() - 37);

    let totalTransactionLast7DaysAndToday = await Transactions.aggregate([
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
          date: { $gte: sevenDaysAgo, $lte: today },
        },
      },
      {
        $count: "totalTransactions",
      },
    ]);

    if (totalTransactionLast7DaysAndToday.length <= 0) {
      totalTransactionLast7DaysAndToday.push({ totalTransactions: 0 })
    }

    // console.log(totalTransactionLast7DaysAndToday);

    const totalTransaction = await Transactions.countDocuments();
    // console.log("totalTransaction", totalTransaction);
    const totalCustomers = await Customers.countDocuments();
    // console.log("totalCustomers: ", getSeriesData, totalCustomers);

    let todayStart = new Date(new Date().setHours(0));
    let todayEnd = new Date(new Date().setHours(24));

    let todaysCount = await Transactions.aggregate([
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
          date: { $gte: todayStart, $lte: todayEnd },
        },
      },
      {
        $count: "todaystransactions",
      },
    ]);


    if (todaysCount.length <= 0) {
      todaysCount.push({ todaystransactions: 0 })
    }



    if (getSeriesData) {
      if (getSeriesData.length == 0) {
        getSeriesData.push({
          totalTransaction,
          totalCustomers,
          totalTransactionLast7DaysAndToday,
          todaysCount
        });
      } else {
        getSeriesData[0].totalTransaction = totalTransaction;
        getSeriesData[0].totalCustomers = totalCustomers;
        getSeriesData[0].totalTransactionLast7DaysAndToday =
          totalTransactionLast7DaysAndToday;
        getSeriesData[0].todaysCount = todaysCount;

      }
      utils.commonResponce(
        res,
        200,
        "getSeriesData created Sucessfully",
        getSeriesData
      );
      // console.log("getSeriesData: ", getSeriesData);
    }
  } catch (error) {
    // console.log(error);
    utils.commonResponce(res, 500, "Unexpected Server Error", error.toString());
  }
};
