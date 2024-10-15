const mongoose = require("mongoose");
const Customers = require("../models/Customers");
const Transactions = require("../models/Transactions");
const utils = require("../controllers/utils");
const Tags = require("../models/Tags");

exports.createCustomers = async (req, res) => {
    try {

        const name = req.body.name;
        const vehicleNo = req.body.vehicleNo;
        const address = req.body.address;
        const phoneNo = req.body.phoneNo;
        const tagNo = req.body.tagNo;
        const validity = req.body.validity;
        const blocklisted = req.body.blocklisted;
        const status = req.body.status;

        const isTagAssigned =  await Customers.findOne({tagNo});

        if(!isTagAssigned){
          await Customers.create({

            name: name,
            vehicleNo: vehicleNo,
            address: address,
            phoneNo: phoneNo,
            tagNo: tagNo,
            validity: validity,
            blocklisted: blocklisted,
            status: status,
        });

      const customers = await Customers.find();
      utils.commonResponce(res, 200, "Customers created Sucessfully", customers);

        }else{
          utils.commonResponce(res, 201, "This tag number is already assigned to someone. Please use a different tag number.");
        }
      
            
     
    } catch (error) {
        console.log('error: ', error);
        utils.commonResponce(res, 500, "Unexpected Server Error", error.toString());
    }
}

exports.getAllCustomers = async (req, res) => {
  try {

      const data = await Customers.find()

      utils.commonResponce(res, 200, "Successfully fetched Customers", data);

  } catch (error) {
      console.log("error", error);
  }
};

exports.customerSearch = async (req, res) => {
  try {
    let keyword = req.body.keyword
    let data;
    let isOnlyNumbers = /^\d+$/.test(keyword);
    // console.log('keyword',req.body.keyword)
      if(isOnlyNumbers){
        console.log(keyword)
        Keyword_inNumber = Number(keyword)
        data = await Customers.find({ tagNo:Keyword_inNumber} );
      }
      else{
        data = await Customers.find({ name: { $regex: `^${keyword}`, $options: 'i' } });
      }


      utils.commonResponce(res, 200, "Successfully fetched Customers", data);

  } catch (error) {
      console.log("error", error);
  }
};



exports.updateCustomers = async (req, res) => {
    try {
        const name = req.body.name;
        const vehicleNo = req.body.vehicleNo;
        const address = req.body.address;
        const phoneNo = req.body.phoneNo;
        const tagNo = req.body.tagNo;
        const validity = req.body.validity;
        const blocklisted = req.body.blocklisted;
        const status = req.body.status;
        const _id = req.body._id;

        await Customers.findByIdAndUpdate(_id,{
            name: name,
            vehicleNo: vehicleNo,
            address: address,
            phoneNo: phoneNo,
            tagNo: tagNo,
            validity: validity,
            blocklisted: blocklisted,
            status: status,
            _id: _id
        }).then (async (customersdata) => {
            const customers = await Customers.find();
            utils.commonResponce(res, 200, "Customers updated Successfully", customers);

        })
    } catch (error) {
        console.log('error: ', error);
        utils.commonResponce(res, 500, "Server Error", error);        
        
    }
}

exports.deleteCustomers = async (req, res) => {
    try {
        
        const _id = req.body._id;

        await Customers.findByIdAndDelete({
            _id: _id,
        }).then (async (Customersdata) => {
            const customer  = await Customers.find();
            utils.commonResponce(res, 200, "Customers deleted Successfully", customer);
        })
    } catch (error) {
        console.log('error: ', error);
        utils.commonResponce(res, 500, "Server Error", error);        
        
    }
}

exports.updateCustomersStatus = async (req, res) => {
    try {
      console.log(req.body);
      const customerId = req.body.customerId;
      const status = req.body.status;
      const options = { returnNewDocument: true };
      const update = await Customers.findOneAndUpdate(
        {
          _id: customerId,
        },
        { blocklisted: status },
        options
      );
      utils.commonResponce(
        res,
        200,
       " customer status updated successfully",
        update
      );
    } catch (error) {
      console.log(error);
      utils.commonResponce(res, 500, "Server Error", error);
    }
  };

  exports.customerReport = async (req, res) => { 
    try {
        
        
        const fromDate = req.body.fromDate;
        const toDate = req.body.toDate;
        const customerId = req.body.customerId;

        let fromDateWithTime = new Date(fromDate + " 00:00:00");
        let toDateWithTime = new Date(toDate + " 23:59:59"); 

        await Transactions.aggregate(
            [
                {
                  '$addFields': {
                    'date': {
                      '$dateFromString': {
                        'dateString': '$date'
                      }
                    }
                  }
                }, {
                  '$match': {
                    'date': {
                      '$gte': fromDateWithTime, 
                      '$lte': toDateWithTime
                    }, 
                    'customerId': mongoose.Types.ObjectId(customerId)

                  }
                }, {
                  '$lookup': {
                    'from': 'terminals', 
                    'localField': 'terminalId', 
                    'foreignField': '_id', 
                    'as': 'terminalName'
                  }
                }, {
                  '$lookup': {
                    'from': 'customers', 
                    'localField': 'customerId', 
                    'foreignField': '_id', 
                    'as': 'result'
                  }
                }, {
                  '$addFields': {
                    'result': {
                      '$first': '$result'
                    }
                  }
                }, {
                  '$unwind': {
                    'path': '$terminalName'
                  }
                }, {
                  '$project': {
                    'terminalName': '$terminalName.terminalName', 
                    'type': 1, 
                    'date': 1, 
                    'tagNo': '$result.tagNo'
                  }
                }
              ]
        ).then (async (transactionData) => {
            utils.commonResponce(res, 200, "customer report created Successfully", transactionData);
            
        })
    } catch (error) {
        console.log('error: ', error);
        utils.commonResponce(res, 500, "Server Error", error);        
        
    }
}
