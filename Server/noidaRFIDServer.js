const dotenv = require("dotenv").config({ path: "./.env" });
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const bodyParser = require("body-parser");
const net = require("net");
// const Trolleys= require("./controllers/trolley");
// const DashboardController= require("./controllers/dashboard.js");
const commands=require("./controllers/tcpController/tcpcommand");
const tcpcommand= require("./controllers/tcpController/tcpcommand")
const transactions = require("./controllers/transactions"); 




// create TCP server code
const tcpServer = net.createServer(socket => {

  console.log('TCP Client connected');





  // Handle incoming data from the client
  socket.on('data', async data => {
    console.log('data: buffer ', Buffer.from(data).toString("hex"));
    let decodedBufferData=Buffer.from(data).toString("hex");
    


    //  await Trolleys.updateTrolleys(parsingTcpBufferData(decodedBufferData));
    //  DashboardController.sendDashboardSocket()

    const tagsBufferObjData =parsingTcpBufferData(decodedBufferData);
    // console.log('tagsBufferObjData:1111 ', tagsBufferObjData);
    // console.log('tagsBufferObjData:2222 ', tagsBufferObjData.);
    

    // switch (tagsBufferObjData.tags.length) {
    //   case 1:
    //     tagsBufferObjData.tags=tagsBufferObjData.tags[0]
    //     transactions.createTransaction(tagsBufferObjData);
    //     break;
    //   case 2:
    //     tcpcommand.makeBeepSound(tagsBufferObjData, 4, 20 ); //4 second duration, 10 times

    //   break;

    //   default:
    //     break;
    // }


    if(tagsBufferObjData.tags.length==1){
      tagsBufferObjData.tags=tagsBufferObjData.tags[0]
          transactions.createTransaction(tagsBufferObjData);
    }else{
        tcpcommand.makeBeepSound(tagsBufferObjData, 4, 20 ); //4 second duration, 10 times if it detects multiple tags

    }


 




  });


});
function parsingTcpBufferData(data) {

  let dataLength = 0;
  let readerID = 0;
  let noOfTrolleys = 0;
  let trolleysList = [];


  let ffffIndex = data.toString().indexOf("f00d");
  // console.log('ffffIndex: ', ffffIndex);
  function convertHexToDecimal(hexStr) {
    return parseInt(hexStr, 16);
  }


  function pushDataToRFIDsList(data, noOfTrolleys) {
    const RFIDsList = [];
    let currentIndex = 0;

    while (currentIndex < data.length && RFIDsList.length < noOfTrolleys) {
      const hexLength = data.substr(currentIndex, 2);
      const decimalLength = convertHexToDecimal(hexLength);
      // console.log('decimalLength: ', decimalLength);

      currentIndex += 2;
      const dataSubstring = data.substr(currentIndex, (decimalLength*2));

      RFIDsList.push(dataSubstring);
      currentIndex += decimalLength*2;
    }

    return RFIDsList;
  }

  //get data after food
  let dataAfterF00D = ffffIndex !== -1 ? data.substring(ffffIndex + 4) : "";
  // console.log('dataAfterF00D: ', dataAfterF00D);
  let dataBeroreF00D = ffffIndex !== -1 ? data.substring(0, ffffIndex) : "";

  if (dataAfterF00D != '') {
    dataLength = convertHexToDecimal(dataBeroreF00D);
    // console.log("dataAfterF00D", dataAfterF00D);
    // readerID = convertHexToDecimal(dataAfterF00D.slice(0, 2));
    readerID = dataAfterF00D.slice(0, 2);
    // console.log(readerID);
    noOfTrolleys = convertHexToDecimal(dataAfterF00D.slice(2, 4));
    // console.log("noOfTrolleys", noOfTrolleys);
    // console.log("dataLength", dataLength);

    console.log(dataAfterF00D.slice(4))
    dataAfterF00D.slice(4)

    trolleysList = pushDataToRFIDsList(dataAfterF00D.slice(4), noOfTrolleys);
    console.log(trolleysList);


    // Remove duplicates using Set
let uniqueTrolleysSet = new Set(trolleysList);

// Convert Set back to an array
let uniqueTrolleysArray = Array.from(uniqueTrolleysSet);

// Filter out elements with 4 digits
let filteredTags = uniqueTrolleysArray.filter(trolley => trolley.length === 4);

    let rfDataObj={
      "tags":filteredTags??[],
      "readerId":readerID,
      "noOfTrolleys":noOfTrolleys
    } 


    return rfDataObj;


  }
  else{
    let rfDataObj={
      "tags":[],
      "readerId": null,
      "noOfTrolleys":0
    } 
    return rfDataObj;

  }

}









const tcpPort = 8585;
tcpServer.listen(tcpPort, () => {
  console.log(`TCP Server listening on port ${tcpPort}`);
  // sendCommad();
  // commands.sendCommad(8080, "192.168.1.222");
});
// Function to process the received data
function processData(data) {
  // Perform any necessary data processing


  console.log("Received data from client in A buffer", data);

  return data; // Example: Convert data to uppercase
}

// ****************TCP Server code ends here*****************















const adminRoutes = require("./routes/admin");
const tcpRoutes = require("./routes/tcpApi");
var cors = require('cors')
const { WebSocket, WebSocketServer } = require('ws');
// const { trolleyEvents,inactiveMarkingScheduler } = require("./controllers/trolleyEvents");
// const { inOutRecords } = require("./controllers/trolley_in_Out_Recods");
const wss = new WebSocket.Server({ port: 8000 });

app.use(bodyParser.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors())

if(process.env.SERVER_IP != 'localhost'){

  // trolleyEvents()
  // inOutRecords()
  inactiveMarkingScheduler()
}

wss.on('connection', function connection(ws) {
  console.log("websocket connected");
  // wss.clients.forEach(function each(client) {

  //   if (client.readyState === WebSocket.OPEN) {
  //     // console.log(client)
  //     // client.send(JSON.stringify("test data"));
  //   }
  // });
})


function setupCORS(req, res, next) {
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "token",
    "X-Requested-With, Content-type,Accept,X-Access-Token,X-Key"
  );
  res.header("Access-Control-Allow-Origin", "*");
  if (req.method === "OPTIONS") {
    res.status(200).end();
  } else {
    next();
  }
}


app.all("/*", setupCORS);

app.use("/", express.static(__dirname + "/build"));
app.use("/*", express.static(__dirname + "/build/index.html"));

//app api's

app.use("/v1/admin", adminRoutes);
app.use("/tcpApi", tcpRoutes);

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then((connection) => {
    if (connection) {
      app.listen(process.env.PORT);
      console.log("Database Connected !!!");
      console.log(`admin server running on ${process.env.PORT} !!!`);
    } else {
      console.log("Error while connecting to database");
    }
  })
  .catch((err) => {
    console.log("catched database connection error :", err);
  });

exports.wss = wss;