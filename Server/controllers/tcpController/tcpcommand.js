
const net = require("net");
const utils = require("../utils");
const TagReader = require("../../models/TagReader");



exports.sendCommad=async(port, ip)=>{
    const commandSocket = new net.Socket()
    // commandSocket.connect(8080,'192.168.1.222',()=>{
    commandSocket.connect(port,ip,()=>{
      const buffer = Buffer.from("0350023EC5", 'hex');
      console.log("command socket  connected");
      console.log(commandSocket.remotePort, commandSocket.remoteAddress)
      commandSocket.write(buffer)
     
    });
  
  }





  //portNo: reader port number not server port number, readerIP:reader ip not serve ip,
exports.audiableIndicationCommand=(req, res)=>{
  const portNo= req.body.portNo;
  const readerIP= req.body.readerIP;
  const command= req.body.command;

try {
  const commandSocket = new net.Socket()
  var newData;

  commandSocket.connect(portNo,readerIP,()=>{
    // const buffer = Buffer.from("03F0058C2F", 'hex');
    const buffer = Buffer.from(command, 'hex');
    console.log("command socket  connected");
    console.log(commandSocket.remotePort, commandSocket.remoteAddress)
    commandSocket.write(buffer)

    commandSocket.on("data", data=>{

    newData =  Buffer.from(data).toString("hex")
    console.log('newData: ', newData);
    if(newData.substring(0, 6)=="05f005"){

      utils.commonResponce(res, 200, "", newData);
    }else{
      utils.commonResponce(res, 201, "", newData);
    }
    });

    // utils.commonResponce(res, 400, "", newData);


     });
} catch (error) {
  console.log('error: ', error);
  utils.commonResponce(res, 500, "something went wrong", error.toString());
}

 
  
  }



  //open barrier by triggering relay
  exports.activateRelay=(req, res)=>{
    const portNo= req.body.portNo;
    const readerIP= req.body.readerIP;
  
  try {
    const commandSocket = new net.Socket()
    var newData;
  
    commandSocket.connect(portNo,readerIP,()=>{
      const buffer = Buffer.from("05F00B01106D3F", 'hex');
      commandSocket.write(buffer)
      commandSocket.on("data", data=>{
  
      newData =  Buffer.from(data).toString("hex")
      if(newData.substring(0, 6)=="05f00b"){
  
        utils.commonResponce(res, 200, "", newData);
      }else{
        utils.commonResponce(res, 201, "", newData);
      }
      });
  
       });
  } catch (error) {
    console.log('error: ', error);
    utils.commonResponce(res, 500, "something went wrong", error.toString());
  }
  
    }



    // call this function to open the barrier once the transaction created successfully
    async function activateRelayToOpenBarrier(data){
      console.log('data: ', data);
      const portNo= 8080;
      const readerId= data.readerId;

      const readerObj= await TagReader.findOne({_id:readerId});

      const readerIP= readerObj!=null?readerObj.ipAddress:null;
    
    try {
      const commandSocket = new net.Socket()
      var newData;


      commandSocket.setTimeout(5000); // Adjust the timeout as needed
      
      commandSocket.on('timeout', () => {
        console.log('Connection timeout');
        commandSocket.destroy(); // Close the socket on timeout
      });
    
      commandSocket.on('error', (error) => {
        console.error('Socket error:', error);
        return;
        // Handle the error appropriately, e.g., log it or respond accordingly
      });
    
      commandSocket.connect(portNo,readerIP,()=>{
        const buffer = Buffer.from("05F00B01106D3F", 'hex');
        commandSocket.write(buffer)
        commandSocket.on("data", data=>{
    
        newData =  Buffer.from(data).toString("hex")
        if(newData.substring(0, 6)=="05f00b"){
    
          // utils.commonResponce(res, 200, "", newData);
        }else{
          // utils.commonResponce(res, 201, "", newData);
        }
        });
    
         });
    } catch (error) {
      console.log('error: ', error);
      // utils.commonResponce(res, 500, "something went wrong", error.toString());
    }
    
      }



      // call this function to make beep sound
      // async  function makeBeepSound(data){

      //   try {
      //     const portNo= 8585;
      //     const readerId= data.readerId;

      //     const readerObj = await TagReader.findOne({_id:data.readerId});
      //     const ip = readerObj.ipAddress;

      //     const commandSocket = new net.Socket()

      //     commandSocket.connect(portNo,ip,()=>{
      //       const buffer = Buffer.from("0350023EC5", 'hex');
      //       commandSocket.write(buffer)
      //     });
        
          
      //   } catch (error) {
      //     console.log('error: ', error.toString());
          
      //   }
      // }

      async function makeBeepSound(data, duration, number) {
        try {
          const portNo = 8080;
          const readerId = data.readerId;
          // console.log('readerId: ', readerId);
      
          const readerObj =   await TagReader.findOne({_id:readerId});
          // console.log('readerObj: ', readerObj);
          const readerIP = readerObj.ipAddress;

          commandSocket.setTimeout(5000); // Adjust the timeout as needed
      
          commandSocket.on('timeout', () => {
            console.log('Connection timeout');
            commandSocket.destroy(); // Close the socket on timeout
          });
        
          commandSocket.on('error', (error) => {
            console.error('Socket error:', error);
            return;
            // Handle the error appropriately, e.g., log it or respond accordingly
          });
        
      
          for (let i = 0; i < number; i++) {
      
            const commandSocket = new net.Socket();
      
            commandSocket.connect(portNo, readerIP, () => {
              const buffer = Buffer.from("03F0058C2F", 'hex');
              commandSocket.write(buffer);
            });
      
          //   // Keep the socket open for the specified duration
            await new Promise(resolve => setTimeout(resolve, duration));
      
          //   // Close the socket to stop the current beep before the next one
            // commandSocket.end();
          }
      






    
        } catch (error) {
          console.log('error: ', error.toString());
        }
      }

      exports.makeBeepSound=makeBeepSound;
      exports.activateRelayToOpenBarrier=activateRelayToOpenBarrier;
