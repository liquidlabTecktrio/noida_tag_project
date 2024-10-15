const mongoose = require("mongoose");
const TagReader = require("../models/TagReader");
const utils = require("../controllers/utils");


exports.createTagReader = async (req, res) => {
    try {

        const readerName = req.body.readerName;
        const ipAddress = req.body.ipAddress;
        const macAddress = req.body.macAddress;
        const readerNo = req.body.readerNo;

        await TagReader.create({

            readerName: readerName,
            ipAddress: ipAddress,
            macAddress: macAddress,
            readerNo: readerNo,
        });
        if (TagReader) {
            utils.commonResponce(res, 200, "TagReader Created Sucessfully"),
            TagReader
        }
    } catch (error) {
        console.log('error: ', error);
        utils.commonResponce(res, 500, "Unexpected Server Error", error.toString());
    }
}

exports.getAllTagReaders = async (req, res) => {
    try {

        const data = await TagReader.find()

        utils.commonResponce(res, 200, "Successfully fetched TagReader", data);

    } catch (error) {
        console.log("error", error);
    }
};

exports.updateTagReaders = async (req, res) => {
    try {
        const readerName = req.body.readerName;
        const ipAddress = req.body.ipAddress;
        const macAddress = req.body.macAddress;
        const readerNo = req.body.readerNo;
        const _id = req.body._id;

        await TagReader.findByIdAndUpdate(_id,{
            readerName: readerName,
            ipAddress: ipAddress,
            macAddress: macAddress,
            readerNo: readerNo,
            _id: _id,
        }).then (async (tagreaderdata) => {
            const tagreader = await TagReader.find();
            utils.commonResponce(res, 200, "TagReaders updated Successfully", tagreader);

        })
    } catch (error) {
        console.log('error: ', error);
        utils.commonResponce(res, 500, "Server Error", error);        
        
    }
}

exports.deletetagReaders = async (req, res) => { 
    try {
        
        const _id = req.body._id;

        await TagReader.findByIdAndDelete({
            _id: _id,
        }).then (async (tagreaderdata) => {
            const tagreader  = await TagReader.find();
            utils.commonResponce(res, 200, "tagreader deleted Successfully", tagreader);
        })
    } catch (error) {
        console.log('error: ', error);
        utils.commonResponce(res, 500, "Server Error", error);        
        
    }
}

exports.updateTagReaderStatus = async (req, res) => {
    try {
      console.log(req.body);
      const tagreaderId = req.body.tagreaderId;
      const status = req.body.status;
      const options = { returnNewDocument: true };
      const update = await TagReader.findOneAndUpdate(
        {
          _id: tagreaderId,
        },
        { blocklisted: status },
        options
      );
      utils.commonResponce(
        res,
        200,
         " tagreader status updated successfully",
        update
      );
    } catch (error) {
      console.log(error);
      utils.commonResponce(res, 500, "Server Error", error);
    }
  };
