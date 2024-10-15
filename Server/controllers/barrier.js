const mongoose = require("mongoose");
const Barrier = require("../models/Barrier");
const utils = require("../controllers/utils");


exports.createBarrier = async (req, res) => {
    try {

        const barrierName = req.body.barrierName;
        const ipAddress = req.body.ipAddress;
        const macAddress = req.body.macAddress;
        const barrierNo = req.body.barrierNo;

        await Barrier.create({
            barrierName: barrierName,
            ipAddress: ipAddress,
            macAddress: macAddress,
            barrierNo: barrierNo,
        });

        if (Barrier) {
            utils.commonResponce(res, 200, "Barrier created Sucessfully"),
            Barrier
        }
    } catch (error) {
        utils.commonResponce(res, 500, "Unexpected Server Error", error.toString());
    }
}

exports.getAllBarriers = async (req, res) => {
    try {

        const data = await Barrier.find()

        utils.commonResponce(res, 200, "Successfully fetched Barriers", data);

    } catch (error) {
        console.log("error", error);
    }
};

exports.updateBarriers = async (req, res) => {
    try {
        const barrierName = req.body.barrierName;
        const ipAddress = req.body.ipAddress;
        const macAddress = req.body.macAddress;
        const barrierNo = req.body.barrierNo;
        const _id = req.body._id;

        await Barrier.findByIdAndUpdate(_id,{
            barrierName: barrierName,
            ipAddress: ipAddress,
            macAddress: macAddress,
            barrierNo: barrierNo,
            _id: _id
        }).then (async(barrierdata) => {
            const barriers = await Barrier.find();
            utils.commonResponce(res, 200, "Barriers updated Successfully", barriers);

        })
    } catch (error) {
        console.log('error: ', error);
        utils.commonResponce(res, 500, "Server Error", error);        
    }
}

exports.deleteBarriers = async (req, res) => { 
    try {
        
        const _id = req.body._id;

        await Barrier.findByIdAndDelete({
            _id: _id,
        }).then (async (barrierdata) => {
            const barrier  = await Barrier.find();
            utils.commonResponce(res, 200, "barrier deleted Successfully", barrier);
        })
    } catch (error) {
        console.log('error: ', error);
        utils.commonResponce(res, 500, "Server Error", error);        
        
    }
}