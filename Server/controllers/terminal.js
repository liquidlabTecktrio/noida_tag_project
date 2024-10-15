const mongoose = require("mongoose");
const Terminal = require("../models/Terminal");
const utils = require("../controllers/utils");


exports.createTerminal = async (req, res) => {
    try {
        const terminalName = req.body.terminalName;
        const type = req.body.type;
        const tagReaderId = req.body.tagReaderId;
        const barrierId = req.body.barrierId;
        const isService = req.body.isService;
        
        

        await Terminal.create({
            terminalName: terminalName,
            type: type,
            tagReaderId: tagReaderId,
            barrierId: barrierId,
            isService: isService,
        });
        if (Terminal) {
            const allterminalData = await Terminal.find()
            utils.commonResponce(res, 200, "Terminal created Sucessfully"),
            allterminalData            
        }
    } catch (error) {
        console.log('error: ', error);
        utils.commonResponce(res, 500, "Unexpected Server Error", error.toString());
    }
}


exports.getAllTerminals = async (req, res) => {
    try {

        const data = await Terminal.find()

        utils.commonResponce(res, 200, "Successfully fetched terminals", data);

    } catch (error) {
        console.log("error", error);
    }
};

exports.updateTerminal = async (req, res) => {
    try {
        console.log(req.body);
        const terminalName = req.body.terminalName;
        const type = req.body.type;
        // const tagReaderId = mongoose.Types.ObjectId(req.body.tagReaderId);
        const tagReaderId = req.body.tagReaderId;
        const barrierId = req.body.barrierId;
        const isService = req.body.isService;
        const _id = req.body._id;

        let terminalObj={};
        if(terminalName!=null&&terminalName!=undefined)
        terminalObj.terminalName=terminalName;

        if(type!=null&&type!=undefined) terminalObj.type=type;
        if(tagReaderId!=null&&tagReaderId!=undefined) terminalObj.tagReaderId=tagReaderId;
        if(barrierId!=null&&barrierId!=undefined) terminalObj.barrierId=barrierId;
        if(isService!=null&&isService!=undefined) terminalObj.isService=isService;
        

        await Terminal.findByIdAndUpdate(_id,terminalObj).then(async (terminaldata) => {
          const terminals = await Terminal.find();
          utils.commonResponce(res, 200, "Terminal updated Successfully", terminals);
        });

    } catch (error) {
        console.log(error);
        utils.commonResponce(res, 500, "Server Error", error);
    }
}

exports.deleteTerminals = async (req, res) => { 
    try {
        
        const _id = req.body._id;

        await Terminal.findByIdAndRemove({
            _id: _id,
        }).then (async (terminaldata) => {
            const terminal  = await Terminal.find();
            utils.commonResponce(res, 200, "terminals deleted Successfully", terminal);
        })
    } catch (error) {
        console.log('error: ', error);
        utils.commonResponce(res, 500, "Server Error", error);        
        
    }
}

exports.updateTerminalStatus = async (req, res) => {
    try {
      console.log(req.body);
      const terminalId = req.body.terminalId;
      const status = req.body.status;
      const options = { returnNewDocument: true };
      const update = await Terminal.findOneAndUpdate(
        {
          _id: terminalId,
        },
        { isService: status },
        options
      ).then(async(data)=>{

        const allTermianlArray=await Terminal.find();
        utils.commonResponce(
            res,
            200,
             " terminal status updated successfully",
             allTermianlArray
          );

      });
     
    } catch (error) {
      console.log(error);
      utils.commonResponce(res, 500, "Server Error", error);
    }
  };