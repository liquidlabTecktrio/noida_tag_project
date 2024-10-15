import React from "react";
import { useState } from "react";
import Select from "react-select";
import { Button, Spinner, Badge,  } from "react-bootstrap";
import axios from "axios";
import config from "../../services/config";
import { useEffect } from "react";
import DataTable from "react-data-table-component";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import pdfMake from "pdfmake/build/pdfmake";
import { faPencil, faRemove, faTrash } from "@fortawesome/free-solid-svg-icons";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
// import {Tooltip} from 'recharts';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';


pdfMake.vfs = pdfFonts.pdfMake.vfs;

var operatorOptions = [];
const DailyShiftEndReport = () => {
  const handleGetData = () => {};

  const showCreateNewShiftEndReport = () => {
    setShowUpdateSection(false);
    setShowCreateSection(true);
    setShowTableSection(false);
  };
  const createReportCloseBtnClick = () => {
    setShowUpdateSection(false);
    setShowCreateSection(false);
    setShowTableSection(true);
    clearShiftArrayVariables();
    clearCreateShiftEndReportVariable();
  };


  // ************ LOcal storrage, SessionStorrage, Coockies **********//
  const managerId = window.sessionStorage.getItem("_id");
  const orgId = window.sessionStorage.getItem("orgId");
  const clientId = window.sessionStorage.getItem("clientId");
  const clientName = window.sessionStorage.getItem("clientName");
  // ************ LOcal storrage, SessionStorrage, Coockies **********//

  let totalReducedTotalCollection = 0;

  // ************ ALL Table columns *********************//
  const columns = [
    {
      name: "Date",
      selector: (row) => row.date,
    },
    {
      name: "Total Cash",
      selector: (row) => row.totalCashAmount,
    },
    {
      name: "Actual Total Cash",
      selector: (row) => row.actualTotalCashAmount,
    },
    {
      name: "Total Upi",
      selector: (row) => row.totalUpiAmount,
    },
    {
      name: "Actual Total Upi",
      selector: (row) => row.actualTotalUpiAmount,
    },

    {
      name: "Total Card",
      selector: (row) => row.totalCardAmount,
    },
    {
      name: "Actual Total Card",
      selector: (row) => row.actualTotalCardAmount,
    },
    {
      name: "Grand Total",
      selector: (row) => row.grandTotal,
    },
    {
      name: "Actual Grand Total",
      selector: (row) => row.actualGrandTotal,
    },

    {
      name: "Status",
      cell: (row) => (
        <>
        <OverlayTrigger
          key="top"
          placement="top"
          overlay={<Tooltip id={`tooltip-top`}>Your Tooltip Content</Tooltip>}
        >
          <BootstrapSwitchButton
            checked={row.isPublished}
            onlabel='Published'
            offlabel='Saved'
            width={100}
            onstyle="success"
            offstyle="primary"
            disabled={row.isPublished}
          />
        </OverlayTrigger>
      </>
      ),
    },
    {
      name: "Edit",
      cell:(row)=>(
        row.isPublished?'-':<FontAwesomeIcon style={{ cursor: "pointer"}} onClick={()=>{handleEditOnClickPencilIcon(row)}}  size='xl' color='green' icon={faPencil} />
      )
    },
    {
      name: "Delete",
      cell:(row)=>(
        row.isPublished?'-':<FontAwesomeIcon style={{ cursor: "pointer"}} onClick={()=>handleDeleteIconClick(row)}  size='xl' color='red' icon={faTrash} />
      )
    },
  ];

  const shiftColumns = [
    {
      name: "Shift No",
      selector: (row) => row.shiftNo,
    },
    {
      name: "Shift Start",
      selector: (row) => row.shiftStart,
    },
    {
      name: "Shift End",
      selector: (row) => row.shiftEnd,
    },
    {
      name: "Ticket Collected",
      selector: (row) => row.ticketCollected,
    },
    {
      name: "Ticket Cancelled",
      selector: (row) => row.ticketCancelled,
    },
    {
      name: "Cash Amount",
      selector: (row) => row.cashAmount,
    },
    {
      name: "Actual Cash Amount",
      selector: (row) => row.actualCashAmount,
    },
    {
      name: "Card Amount",
      selector: (row) => row.cardAmount,
    },
    {
      name: "Actual Card Amount",
      selector: (row) => row.actualCardAmount,
    },
    {
      name: "UPI Amount",
      selector: (row) => row.upiAmount,
    },
    {
      name: "Actual UPI Amount",
      selector: (row) => row.actualUpiAmount,
    },
    {
      name: "Total Amount",
      selector: (row) => row.totalAmount,
    },
    {
      name: "Actual Total Amount",
      selector: (row) => row.actualTotalAmount,
    },
    {
      name: "Active",
      cell: (row) => (
        <FontAwesomeIcon
          style={{ cursor: "pointer" }}
          size="xl"
          onClick={() => {
            console.log("isDuplicateshiftNo", row);
            removeShiftFromTable(row);
          }}
          color="blue"
          icon={faRemove}
        />
      ),
    },

    
  ];
  const shiftColumnsUpdate = [
    {
      name: "Shift No",
      selector: (row) => row.shiftNo,
    },
    {
      name: "Shift Start",
      selector: (row) => row.shiftStart,
    },
    {
      name: "Shift End",
      selector: (row) => row.shiftEnd,
    },
    {
      name: "Ticket Collected",
      selector: (row) => row.ticketCollected,
    },
    {
      name: "Ticket Cancelled",
      selector: (row) => row.ticketCancelled,
    },
    {
      name: "Cash Amount",
      selector: (row) => row.cashAmount,
    },
    {
      name: "Actual Cash Amount",
      selector: (row) => row.actualCashAmount,
    },
    {
      name: "Card Amount",
      selector: (row) => row.cardAmount,
    },
    {
      name: "Actual Card Amount",
      selector: (row) => row.actualCardAmount,
    },
    {
      name: "UPI Amount",
      selector: (row) => row.upiAmount,
    },
    {
      name: "Actual UPI Amount",
      selector: (row) => row.actualUpiAmount,
    },
    {
      name: "Total Amount",
      selector: (row) => row.totalAmount,
    },
    {
      name: "Actual Total Amount",
      selector: (row) => row.actualTotalAmount,
    },
    {
      name: "Active",
      cell: (row) => (
        <FontAwesomeIcon
          style={{ cursor: "pointer" }}
          size="xl"
          onClick={() => {
           
            removeShiftFromTableUpdate(row);
          }}
          color="blue"
          icon={faRemove}
        />
      ),
    },

    
  ];

  const expandableSifttColumnData = [
    {
      name: "Shift No",
      selector: (row) => row.shiftNo,
    },
    {
      name: "Operator",
      selector: (row) => operatorOptions.filter((e)=>e.value==row.operator)[0]!=undefined?operatorOptions.filter((e)=>e.value==row.operator)[0].label:'',
    },
    {
      name: "Shift Start",
      selector: (row) => row.shiftStart,
    },
    {
      name: "Shift End",
      selector: (row) => row.shiftEnd,
    },
    {
      name: "Ticket Collected",
      selector: (row) => row.ticketCollected,
    },
    {
      name: "Ticket Cancelled",
      selector: (row) => row.ticketCancelled,
    },
    {
      name: "Ticket Cancelled",
      selector: (row) => row.ticketCancelled,
    },
    {
      name: "Cash Amount",
      selector: (row) => row.cashAmount,
    },
    {
      name: "Actual Cash Amount",
      selector: (row) => row.actualCashAmount,
    },
    {
      name: "Upi Amount",
      selector: (row) => row.upiAmount,
    },
    {
      name: "Actual Upi Amount",
      selector: (row) => row.actualUpiAmount,
    },
    {
      name: "Actual Upi Amount",
      selector: (row) => row.actualUpiAmount,
    },
    {
      name: "Card Amount",
      selector: (row) => row.cardAmount,
    },
    {
      name: "Actual Card Amount",
      selector: (row) => row.actualCardAmount,
    },
    {
      name: "Total Amount",
      selector: (row) => row.totalAmount,
    },
    {
      name: "Actual Total Amount",
      selector: (row) => row.actualTotalAmount,
    },
  ];

  const tableCustomStyles = {
    headCells: {
      style: {
        marginRight: "-3px",
        color: "#f8857e",
        width: "180px",
        backgroundColor: "#fef3f2",
      },
    },
    cells: {
      style: {
        marginRight: "1px",
        width: "165px",
        textAlign: "center",
      },
    },
  };
  // ************ ALL Table columns ends here ************//

  //loader
  const [loading, setLoading] = useState(false);

  const [dailyShiftEndDataArray, setDailyShiftEndDataArray] = useState([]);

  //**** show hide section state variables ***********/
  const [showUpdateSection, setShowUpdateSection] = useState(false);
  const [showCreateSection, setShowCreateSection] = useState(false);
  const [showTableSection, setShowTableSection] = useState(true);

  //********* Main Table section variables *************/
  // const []

  // **************** Shift Table variables *******/
  const [shiftArray, setShiftArray] = useState([]);

  // **************** Shift Table variables ends *******/

  //********* Create section variables ********/
  const [date, setDate] = useState(""); //date formate dd-mm-yyyy
  const [totalCashAmount, setTotalCashAmount] = useState("");
  const [actualTotalCashAmount, setActualTotalCashAmount] = useState("");
  const [totalCardAmount, setTotalCardAmount] = useState("");
  const [actualTotalCardAmount, setActualTotalCardAmount] = useState("");
  const [totalUpiAmount, setTotalUpiAmount] = useState("");
  const [actualTotalUpiAmount, setActualTotalUpiAmount] = useState("");
  const [grandTotal, setGrandTotal] = useState("");
  const [actualGrandTotal, setActualGrandTotal] = useState("");

  // *** shift data variables ***//  "shifts" key needed to pass data through api
  const [operator, setOperator] = useState("");
  const [shiftNo, setShiftNo] = useState("");
  const [shiftStart, setShiftStart] = useState("");
  const [shiftEnd, setShiftEnd] = useState("");
  const [ticketCollected, setTicketCollected] = useState("");
  const [ticketCancelled, setTicketCancelled] = useState("");
  const [cashAmount, setCashAmount] = useState("");
  const [actualCashAmount, setActualCashAmount] = useState("");
  const [cardAmount, setCardAmount] = useState("");
  const [actualCardAmount, setActualCardAmount] = useState("");
  const [upiAmount, setUpiAmount] = useState("");
  const [actualUpiAmount, setActualUpiAmount] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [actualTotalAmount, setActualTotalAmount] = useState("");

  
   // >>>>>>>>>>>>>>> update daily shift end report section hooks variables <<<<<<<<<<<<<<<<<<<<<//

   const [shiftArrayUpdate, setUpdateShiftArray] = useState([]);

  const [dailyShiftObjId, setDailyShiftObjId]=useState('');
   const [dateUpdate, setUpdateDate] = useState(""); //date formate dd-mm-yyyy
   const [totalCashAmountUpdate, setUpdateTotalCashAmount] = useState("");
   const [actualTotalCashAmountUpdate, setUpdateActualTotalCashAmount] = useState("");
   const [totalCardAmountUpdate, setUpdateTotalCardAmount] = useState("");
   const [actualTotalCardAmountUpdate, setUpdateActualTotalCardAmount] = useState("");
   const [totalUpiAmountUpdate, setUpdateTotalUpiAmount] = useState("");
   const [actualTotalUpiAmountUpdate, setUpdateActualTotalUpiAmount] = useState("");
   const [grandTotalUpdate, setUpdateGrandTotal] = useState("");
   const [actualGrandTotalUpdate, setUpdateActualGrandTotal] = useState("");
 

   const [operatorUpdate, setUpdateOperator] = useState("");
   const [shiftNoUpdate, setUpdateShiftNo] = useState("");
   const [shiftStartUpdate, setUpdateShiftStart] = useState("");
   const [shiftEndUpdate, setUpdateShiftEnd] = useState("");
   const [ticketCollectedUpdate, setUpdateTicketCollected] = useState("");
   const [ticketCancelledUpdate, setUpdateTicketCancelled] = useState("");
   const [cashAmountUpdate, setUpdateCashAmount] = useState("");
   const [actualCashAmountUpdate, setUpdateActualCashAmount] = useState("");
   const [cardAmountUpdate, setUpdateCardAmount] = useState("");
   const [actualCardAmountUpdate, setUpdateActualCardAmount] = useState("");
   const [upiAmountUpdate, setUpdateUpiAmount] = useState("");
   const [actualUpiAmountUpdate, setUpdateActualUpiAmount] = useState("");
   const [totalAmountUpdate, setUpdateTotalAmount] = useState("");
   const [actualTotalAmountUpdate, setUpdateActualTotalAmount] = useState("");
 
  // >>>>>>>>>>>>>>> update daily shift end report section hooks variables <<<<<<<<<<<<<<<<<<<<<//


  useEffect(() => {
    getDailyShiftEndReport();
    getClientwiseActiveEmployeesAPI();
  }, []);

  //************************************************************ */
  // **************** ALL API'S SECTION STARTS*******************//
  // *************************************************************/

  // ******** Get all shift end report ************ //
  function getDailyShiftEndReport() {
    setLoading(true);
    axios({
      url: config.baseUrl + "getDailyShift",
      method: "get",
      "Content-Type": "application/json",
      // headers: {
      //     // token: sessionStorage.getItem("token"),
      // },
    })
      .then((res) => {
        if (res.status == 200) {
          showToast(res.data.message);
          setDailyShiftEndDataArray(res.data.data);
          setLoading(false);
          createReportCloseBtnClick(); //clear all variables
        } else if (res.status == 201) {
          setLoading(false);
          showToast(res.data.message);

          alert(res.data.message);

          console.log(res.data.message);
        } else if (res.status == 401) {
          setLoading(false);
          alert("you are unauthorized.. please login to continue");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        if (err.response.data.status == 401) {
          alert("you are unauthorized.. please login to continue");
          window.location = "/page-login";
        }
      });
  }

  function getClientwiseActiveEmployeesAPI() {
    setLoading(true);
    axios({
      url: config.baseUrl + "getClientwiseActiveEmployees",
      method: "POST",
      "Content-Type": "application/json",
      // headers: {
      //     // token: sessionStorage.getItem("token"),
      // },
      data: {
        clientId,
      },
    })
      .then((res) => {
       
        if (res.status == 200) {
          showToast(res.data.message);
          let clientwiseEmpList = res.data.data.map((e) => {
            return {
              value: e._id,
              label: `${e.employeeFirstName} ${e.employeeLastName}`,
            };
          });
          operatorOptions = clientwiseEmpList;
          setLoading(false);
        } else if (res.status == 201) {
          setLoading(false);
          showToast(res.data.message);

          alert(res.data.message);

          console.log(res.data.message);
        } else if (res.status == 401) {
          setLoading(false);
          alert("you are unauthorized.. please login to continue");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        if (err.response.data.status == 401) {
          alert("you are unauthorized.. please login to continue");
          window.location = "/page-login";
        }
      });
  }

  //***** create Shift end report API */
  function createDailyShiftEndReportAPI(createShiftEndReportDataObj) {
    //  console.log('createShiftEndReportDataObj: ', createShiftEndReportDataObj);
    setLoading(true);

    axios({
      url: config.baseUrl + "createDailyShiftEndReport",
      method: "POST",
      "Content-Type": "application/json",
      // headers: {
      //     token: sessionStorage.getItem("token"),
      // },
      data: createShiftEndReportDataObj,
    })
      .then((res) => {
        console.log("res", res);
        if (res.status == 200) {
          showToast(res.data.message);
          // alert(res.data.message)
          console.log(res.data.data);
          setLoading(false);
          createReportCloseBtnClick();
        } else if (res.status == 201) {
          setLoading(false);
          alert(res.data.message);

          console.log(res.data.message);
        } else if (res.status == 401) {
          setLoading(false);
          alert("you are unauthorized.. please login to continue");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        if (err.response.data.status == 401) {
          alert("you are unauthorized.. please login to continue");
          window.location = "/page-login";
        }
        showToast(err.response?.data.message);
      });
  }

  //***** Update Shift end report API */
  function updateDailyShiftAPI(updateShiftEndReportDataObj) {
    setLoading(true);
    axios({
      url: config.baseUrl + "updateDailyShift",
      method: "POST",
      "Content-Type": "application/json",
      // headers: {
      //     token: sessionStorage.getItem("token"),
      // },
      data: updateShiftEndReportDataObj,
    })
      .then((res) => {
        console.log("res", res);
        if (res.status == 200) {
          showToast(res.data.message);
          // alert(res.data.message)
          console.log(res.data.data);
          setLoading(false);
          createReportCloseBtnClick();
        } else if (res.status == 201) {
          setLoading(false);
          alert(res.data.message);

          console.log(res.data.message);
        } else if (res.status == 401) {
          setLoading(false);
          alert("you are unauthorized.. please login to continue");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        if (err.response.data.status == 401) {
          alert("you are unauthorized.. please login to continue");
          window.location = "/page-login";
        }
        showToast(err.response?.data.message);
      });
  }


  // ******** delete shift end report API ****************/
  function deleteDailyShiftEnd(deleteObj) {
    setLoading(true);
    axios({
      url: config.baseUrl + "updateDailyShift",
      method: "DELETE",
      "Content-Type": "application/json",
      // headers: {
      //     token: sessionStorage.getItem("token"),
      // },
      data: deleteObj,
    })
      .then((res) => {
        console.log("res", res);
        if (res.status == 200) {
          showToast(res.data.message);
          console.log(res.data.data);
          setLoading(false);
        
        } else if (res.status == 201) {
          setLoading(false);
          showToast(res.data.message);
        } else if (res.status == 401) {
          setLoading(false);
          alert("you are unauthorized.. please login to continue");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        if (err.response.data.status == 401) {
          alert("you are unauthorized.. please login to continue");
          window.location = "/page-login";
        }
        showToast(err.response?.data.message);
      });
    
  }



  //************************************************************ */
  // **************** ALL API'S SECTION ENDS*******************//
  //************************************************************ */
  const showToast = (data) => toast(`${data}`, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });

  const createDailyShiftEndReportSavaOrPublishBtn = (isPublished) => {
    const createShiftEndReportDataObj = {
      date: date.split("-").reverse().join("-"),
      managerId: managerId,
      orgId: orgId,
      clientId: clientId,
      isPublished: isPublished,
      totalCashAmount: totalCashAmount,
      actualTotalCashAmount: actualTotalCashAmount,
      totalCardAmount: totalCardAmount,
      actualTotalCardAmount: actualTotalCardAmount,
      totalUpiAmount: totalUpiAmount,
      actualTotalUpiAmount: actualTotalUpiAmount,
      grandTotal: grandTotal,
      actualGrandTotal: actualGrandTotal,
      shifts: shiftArray,
    };

    const objKeys = {
      Date: date,
      "Manager Id": managerId,
      "Organisation Id": orgId,
      "Client Id": clientId,

      "Total Cash Amount": totalCashAmount,
      "Actual Total Cash Amount": actualTotalCashAmount,
      "Total CardAmount": totalCardAmount,
      "Actual Total Card Amount": actualTotalCardAmount,
      "Total Upi Amount": totalUpiAmount,
      "actual Total Upi Amount": actualTotalUpiAmount,
      "Grand Total": grandTotal,
      "Actual Grand Total": actualGrandTotal,
    };

    let isCreatable = Object.values(objKeys).every((v) => v != "");

    if (isCreatable == true) {
      console.log("createShiftEndReportDataObj: ", createShiftEndReportDataObj);
      createDailyShiftEndReportAPI(createShiftEndReportDataObj);
    } else {
      for (const key in objKeys) {
        if (objKeys.hasOwnProperty(key) && objKeys[key] === "") {
          alert(`Please fill in the ${key} field.`);
          break;
        }
      }
    }
  };

  const clearCreateShiftEndReportVariable = () => {
    setDate("");
    setTotalCashAmount("");
    setActualTotalCashAmount("");
    setTotalCardAmount("");
    setActualTotalCardAmount("");
    setTotalUpiAmount("");
    setActualTotalUpiAmount("");
    setGrandTotal("");
    setActualGrandTotal("");
    setShiftArray([]);
  };

  const clearShiftArrayVariables = () => {
    setOperator("");
    setShiftNo("");
    setShiftStart("");
    setShiftEnd("");
    setTicketCollected("");
    setTicketCancelled("");
    setCashAmount("");
    setActualCashAmount("");
    setCardAmount("");
    setActualCardAmount("");
    setUpiAmount("");
    setActualUpiAmount("");
    setTotalAmount("");
    setActualTotalAmount("");
  };





  useEffect(() => {
    if (operator || shiftNo) pushShiftsToShiftArray();
    removeShiftFromTable();
  }, []);

  const pushShiftsToShiftArray = () => {
    // shiftArray
    const shiftObjData = {
      shiftNo,
      operator,
      shiftStart,
      shiftEnd,
      ticketCollected,
      ticketCancelled,
      cashAmount,
      actualCashAmount,
      cardAmount,
      actualCardAmount,
      upiAmount,
      actualUpiAmount,
      totalAmount,
      actualTotalAmount,
    };
    let isShiftPushable = Object.values(shiftObjData).every((v) => v != "");

    if (isShiftPushable == true) {
      let isDuplicateshiftNo = shiftArray.filter((e) => e.shiftNo == shiftNo);

      if (isDuplicateshiftNo.length == 0) {
        const updatedShiftArray = [...shiftArray, shiftObjData];
        setShiftArray(updatedShiftArray);
        console.log("shiftArray: ", shiftArray);
        clearShiftArrayVariables();
      } else {
        alert("Duplicate shift number not allowed");
      }
    } else {
      for (const key in shiftObjData) {
        if (shiftObjData.hasOwnProperty(key) && shiftObjData[key] === "") {
          alert(`Please fill in the ${key} field.`);
          break;
        }
      }
    }
  };

  const removeShiftFromTable = (rowData) => {
    let shiftArrayNew =[];
    if(Array.isArray(shiftArray)&&shiftArray.length>0){
      shiftArrayNew=shiftArray.filter(
        (item) => item.shiftNo !== rowData.shiftNo
      );
    }
    setShiftArray(shiftArrayNew);
  };

  const expandableShiftData = (props) => {
    return (
      <DataTable
        columns={expandableSifttColumnData}
        data={props.data.shifts}
        customStyles={tableCustomStyles}
      />
    );
  };



  // update shift end report All functionalities
  const handleEditOnClickPencilIcon=(rowData)=>{
    console.log('rowData: ', rowData);

    setShowTableSection(false);
    setShowCreateSection(false);
    setShowUpdateSection(true);

    setDailyShiftObjId(rowData._id);

    setUpdateShiftArray(rowData.shifts);
    setUpdateDate(rowData.date!=null&&rowData.date!=undefined?rowData.date.split('-').reverse().join('-'):'');
    setUpdateTotalCashAmount(rowData.totalCashAmount);
    setUpdateActualTotalCashAmount(rowData.actualTotalCashAmount);
    setUpdateTotalCardAmount(rowData.totalCardAmount);
    setUpdateActualTotalCardAmount(rowData.actualTotalCardAmount);
    setUpdateTotalUpiAmount(rowData.totalUpiAmount);
    setUpdateActualTotalUpiAmount(rowData.actualTotalUpiAmount);
    setUpdateGrandTotal(rowData.grandTotal);
    setUpdateActualGrandTotal(rowData.actualGrandTotal);

    // setUpdateOperator(rowData.operator);
    // setUpdateShiftNo(rowData.shiftNo);
    // setUpdateShiftStart(rowData.shiftStart);
    // setUpdateShiftEnd(rowData.shiftEnd);

  }

  const pushShiftsToShiftArrayUpdate = () => {
    // shiftArray
    const shiftObjDataUpdate = {
      
      shiftNo:shiftNoUpdate,
      operator: operatorUpdate,
      shiftStart:shiftStartUpdate,
      shiftEnd: shiftEndUpdate,
      ticketCollected: ticketCollectedUpdate,
      ticketCancelled: ticketCancelledUpdate,
      cashAmount: cashAmountUpdate,
      actualCashAmount: actualCashAmountUpdate,
      cardAmount: cardAmountUpdate,
      actualCardAmount: actualCardAmountUpdate,
      upiAmount: upiAmountUpdate,
      actualUpiAmount: actualUpiAmountUpdate,
      totalAmount: totalAmountUpdate,
      actualTotalAmount: actualTotalAmountUpdate,
    };
    let isShiftPushable = Object.values(shiftObjDataUpdate).every((v) => v != "");

    if (isShiftPushable == true) {
      let isDuplicateshiftNo = shiftArrayUpdate.filter((e) => e.shiftNo == shiftNoUpdate);

      if (isDuplicateshiftNo.length == 0) {
        const updatedShiftArray = [...shiftArrayUpdate, shiftObjDataUpdate];
        setUpdateShiftArray(updatedShiftArray);
        console.log("shiftArrayUpdate: ", shiftArrayUpdate);
        clearUpdateShiftArrayVariables();
      } else {
        alert("Duplicate shift number not allowed");
      }
    } else {
      for (const key in shiftObjDataUpdate) {
        if (shiftObjDataUpdate.hasOwnProperty(key) && shiftObjDataUpdate[key] === "") {
          alert(`Please fill in the ${key} field.`);
          break;
        }
      }
    }
  };

  const removeShiftFromTableUpdate = (rowData) => {
    let shiftArrayNew =[];
    if(Array.isArray(shiftArrayUpdate)&&shiftArrayUpdate.length>0){
      shiftArrayNew= shiftArrayUpdate.filter(
        (item) => item.shiftNo !== rowData.shiftNo
      );
    }
    setUpdateShiftArray(shiftArrayNew);
  };

  useEffect(() => {
    if (operatorUpdate || shiftNoUpdate) pushShiftsToShiftArrayUpdate();
    removeShiftFromTableUpdate();
  }, []);

  const clearUpdateShiftArrayVariables = ()=>{
    setUpdateOperator('');
    setUpdateShiftNo('');
    setUpdateShiftStart('');
    setUpdateShiftEnd('');
    setUpdateTicketCollected('');
    setUpdateTicketCancelled('');
    setUpdateCashAmount('');
    setUpdateActualCashAmount('');
    setUpdateCardAmount('');
    setUpdateActualCardAmount('');
    setUpdateUpiAmount('');
    setUpdateActualUpiAmount('');
    setUpdateTotalAmount('');
    setUpdateActualTotalAmount('');
  }

 const  clearUpdateShiftEndReportVariable = ()=>{

  createReportCloseBtnClick();
  setDailyShiftObjId('');
  setUpdateDate('');
  setUpdateTotalCashAmount('');
  setUpdateActualTotalCashAmount('');
  setUpdateTotalCardAmount('');
  setUpdateActualTotalCardAmount('');
  setUpdateTotalUpiAmount('');
  setUpdateActualTotalUpiAmount('');
  setUpdateGrandTotal('');
  setUpdateActualGrandTotal('');

  setUpdateShiftArray([]);
  clearUpdateShiftArrayVariables();

 }

 const updateDailyShiftEndReportSavaOrPublishBtn = (isPublished) => {
  const updateShiftEndReportDataObj = {
    dailyShiftObjId,
    date: dateUpdate.split("-").reverse().join("-"),
    managerId: managerId,
    orgId: orgId,
    clientId: clientId,
    isPublished: isPublished,
    totalCashAmount: totalCashAmountUpdate,
    actualTotalCashAmount: actualTotalCashAmountUpdate,
    totalCardAmount: totalCardAmountUpdate,
    actualTotalCardAmount: actualTotalCardAmountUpdate,
    totalUpiAmount: totalUpiAmountUpdate,
    actualTotalUpiAmount: actualTotalUpiAmountUpdate,
    grandTotal: grandTotalUpdate,
    actualGrandTotal: actualGrandTotalUpdate,
    shifts: shiftArrayUpdate,
  };

  const objKeys = {
    Date: dateUpdate,
    // "Manager Id": managerId,
    // "Organisation Id": orgId,
    // "Client Id": clientId,

    "Total Cash Amount": totalCashAmountUpdate,
    "Actual Total Cash Amount": actualTotalCashAmountUpdate,
    "Total CardAmount": totalCardAmountUpdate,
    "Actual Total Card Amount": actualTotalCardAmountUpdate,
    "Total Upi Amount": totalUpiAmountUpdate,
    "actual Total Upi Amount": actualTotalUpiAmountUpdate,
    "Grand Total": grandTotalUpdate,
    "Actual Grand Total": actualGrandTotalUpdate,
  };

  let isCreatable = Object.values(objKeys).every((v) => v != "");

  if (isCreatable == true) {
    console.log("updateShiftEndReportDataObj: ", updateShiftEndReportDataObj);
    updateDailyShiftAPI(updateShiftEndReportDataObj);
  } else {
    for (const key in objKeys) {
      if (objKeys.hasOwnProperty(key) && objKeys[key] === "") {
        alert(`Please fill in the ${key} field.`);
        break;
      }
    }
  }
};



// ************* Delete Daily shift end report secton *************** //

const handleDeleteIconClick = (rowData) =>{
  const result = window.confirm(`Are you sure you want to delete ${rowData.date} shift details ?`);
    if (result) {
      let deleteObj={
        dailyShiftEndObjId:rowData._id
      }
      deleteDailyShiftEnd(deleteObj);
    }
}
 









  return (
    <div className="col-12">
      <ToastContainer />
      {/* {showTableSection ? (
        <div className="card ">
          <div className="card-body p-0">
            <div className="row align-items-center">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                <div className="income-data d-flex align-items-center justify-content-between  mb-xl-0 mb-3">
                  <h2 className="parkoBlue" style={{ fontSize: "21px" }}></h2>
                  <div className="row">
                    <div className="mb-3 mt-2 col-md-4">
                      <label className="mb-1">
                        <strong>From Date</strong>
                      </label>
                      <input type="date" className="form-control"></input>
                    </div>
                    <div className="mb-3 mt-2 col-md-4">
                      <label className="mb-1">
                        <strong>To Date</strong>
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        onWheel={(e) => e.target.blur()}
                        placeholder="Enter Vehicle Wheels"
                      ></input>
                    </div>
                    <div className="mb-3 mt-2 col-md-4">
                      <label className="mb-1">
                        <strong>Select Parking</strong>
                      </label>
                      <select
                        class="form-select"
                        aria-label="Default select example"
                      >
                        <option value="">Select Parking</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <Button
                      onClick={handleGetData}
                      className="me-2"
                      varient="outline-primary"
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Get Data"
                      )}
                    </Button>

                    <Button
                      onClick={showCreateNewShiftEndReport}
                      className="me-2"
                      varient="outline-primary"
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Create New Shiftend Report"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )} */}

      {showTableSection ? (
        <div className="card">
          <div className="card-header">
          <h2 className="text-center">Daily shiftend Report</h2>
          <Button
                      onClick={showCreateNewShiftEndReport}
                      className="me-2"
                      varient="outline-primary"
                    >
                      {loading ? (
                        <Spinner animation="border" size="sm" />
                      ) : (
                        "Create New Shiftend Report"
                      )}
                    </Button>
            </div>

          <div className="card-body">
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {/* <Button className="m-1" variant="outline-primary">
                Export to Excel
              </Button> */}
            </div>
            <DataTable
              columns={columns}
              data={dailyShiftEndDataArray}
              customStyles={tableCustomStyles}
              pagination
              expandableRowsComponent={expandableShiftData}
              expandableRows
              // fixedHeader
              selectableRowsHighlight
            />
            {/* <div className="parkoBlue" style={{ fontSize: "21px" }}>
              Total Collection: {totalReducedTotalCollection}
            </div> */}

            {/* <Button onClick={handlePdfExport} className="me-2" variant="outline-primary">
                                Export to PDF
                            </Button> */}
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* ************ Create shift end report section starts ******************* */}
      {showCreateSection ? (
        <div className="card">
          <div className="card-header">
            <h3 className="m-4">Create Shift End Report</h3>
          </div>
          <form>
            <div className="card-body">
              <div className="search-results">
                <div className="row">
                  <div className="mb-3 mt-2 col-md-3">
                    <label className="mb-1">
                      <strong>Date </strong>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                      }}
                      placeholder="Enter Date"
                    ></input>
                  </div>

                  <div className="mb-3 mt-2 col-md-3">
                    <label className="mb-1">
                      <strong> Total Cash Amount</strong>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      onWheel={(e) => e.target.blur()}
                      value={totalCashAmount}
                      onChange={(e) => {
                        setTotalCashAmount(e.target.value);
                      }}
                      placeholder="Enter total cash amount "
                    ></input>
                  </div>

                  <div className="mb-3 mt-2 col-md-3">
                    <label className="mb-1">
                      <strong> Actual Total Cash Amount</strong>
                    </label>
                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      className="form-control"
                      value={actualTotalCashAmount}
                      onChange={(e) => {
                        setActualTotalCashAmount(e.target.value);
                      }}
                      placeholder="Enter actual cash amount"
                    ></input>
                  </div>

                  <div className="mb-3 mt-2 col-md-3">
                    <label className="mb-1">
                      <strong>Total Card Amount </strong>
                    </label>
                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      className="form-control"
                      value={totalCardAmount}
                      onChange={(e) => {
                        setTotalCardAmount(e.target.value);
                      }}
                      placeholder="Enter card amount"
                    ></input>
                  </div>

                  <div className="mb-3 mt-2 col-md-3">
                    <label className="mb-1">
                      <strong>Actual Total Card Amount </strong>
                    </label>
                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      className="form-control"
                      value={actualTotalCardAmount}
                      onChange={(e) => {
                        setActualTotalCardAmount(e.target.value);
                      }}
                      placeholder="Enter card amount"
                    ></input>
                  </div>

                  <div className="mb-3 mt-2 col-md-3">
                    <label className="mb-1">
                      <strong> Total UPI Amount </strong>
                    </label>
                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      className="form-control"
                      value={totalUpiAmount}
                      onChange={(e) => {
                        setTotalUpiAmount(e.target.value);
                      }}
                      placeholder="Enter total upi amount"
                    ></input>
                  </div>

                  <div className="mb-3 mt-2 col-md-3">
                    <label className="mb-1">
                      <strong>Actual Total UPI Amount </strong>
                    </label>
                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      className="form-control"
                      value={actualTotalUpiAmount}
                      onChange={(e) => {
                        setActualTotalUpiAmount(e.target.value);
                      }}
                      placeholder="Enter actual total upi amount"
                    ></input>
                  </div>

                  <div className="mb-3 mt-2 col-md-3">
                    <label className="mb-1">
                      <strong>Grand Total </strong>
                    </label>
                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      className="form-control"
                      value={grandTotal}
                      onChange={(e) => {
                        setGrandTotal(
                          Math.max(0, parseInt(e.target.value, 10)) || 0
                        );
                      }}
                      placeholder="Enter grand total amount"
                    ></input>
                  </div>

                  <div className="mb-3 mt-2 col-md-3">
                    <label className="mb-1">
                      <strong>Actual Grand Total </strong>
                    </label>
                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      className="form-control"
                      value={actualGrandTotal}
                      onChange={(e) => {
                        setActualGrandTotal(
                          Math.max(0, parseInt(e.target.value, 10)) || 0
                        );
                      }}
                      placeholder="Enter actual grand total amount"
                    ></input>
                  </div>
                </div>
              </div>
            </div>

            <hr></hr>
            {/*  */}
            <div className="card-body">
              <div className="row">
                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Shift Number </strong>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={shiftNo}
                    onChange={(e) => {
                      setShiftNo(e.target.value);
                    }}
                    placeholder="Enter shift number"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Operator Name</strong>
                  </label>
                  <Select
                    options={operatorOptions}
                    onChange={(e) => {
                      setOperator(e.value);
                    }}
                    value={operatorOptions.filter(function (option) {
                      return option.value === operator;
                    })}
                  />
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Shift Start Date and Time </strong>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={shiftStart}
                    onChange={(e) => {
                      setShiftStart(e.target.value);
                    }}
                    placeholder="Enter shift start date time"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Shift End Date and Time </strong>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={shiftEnd}
                    onChange={(e) => {
                      setShiftEnd(e.target.value);
                    }}
                    placeholder="Enter shift end date time"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Total Number Of Ticket Collected </strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={ticketCollected}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setTicketCollected(
                        Math.max(0, parseInt(e.target.value, 10)) || 0
                      );
                    }}
                    placeholder="Enter total number of ticket collected"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Total Number Of Ticket Cancelled </strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={ticketCancelled}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setTicketCancelled(
                        Math.max(0, parseInt(e.target.value, 10)) || 0
                      );
                    }}
                    placeholder="Enter total no of ticket cancelled"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Total Cash Amount</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={cashAmount}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setCashAmount(
                        Math.max(0, parseInt(e.target.value, 10)) || 0
                      );
                    }}
                    placeholder="Enter total cash amount"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Actual Total Cash Amount</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={actualCashAmount}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setActualCashAmount(
                        Math.max(0, parseInt(e.target.value, 10)) || 0
                      );
                    }}
                    placeholder="Enter actual total cash amount"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong> Total Card Amount</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={cardAmount}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setCardAmount(
                        Math.max(0, parseInt(e.target.value, 10)) || 0
                      );
                    }}
                    placeholder="Enter  total card amount"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Actual Total Card Amount</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={actualCardAmount}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setActualCardAmount(
                        Math.max(0, parseInt(e.target.value, 10)) || 0
                      );
                    }}
                    placeholder="Enter actual total card amount"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Total UPI Amount</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={upiAmount}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setUpiAmount(
                        Math.max(0, parseInt(e.target.value, 10)) || 0
                      );
                    }}
                    placeholder="Enter  total upi amount"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Actual Total UPI Amount</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={actualUpiAmount}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setActualUpiAmount(
                        Math.max(0, parseInt(e.target.value, 10)) || 0
                      );
                    }}
                    placeholder="Enter actual total upi amount"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Total Amount</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={totalAmount}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setTotalAmount(
                        Math.max(0, parseInt(e.target.value, 10)) || 0
                      );
                    }}
                    placeholder="Enter total amount"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Actual Total Amount</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={actualTotalAmount}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setActualTotalAmount(
                        Math.max(0, parseInt(e.target.value, 10)) || 0
                      );
                    }}
                    placeholder="Enter actual total amount"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <Button
                    onClick={pushShiftsToShiftArray}
                    className="me-2 mt-4"
                    variant="success"
                  >
                    ADD
                  </Button>
                </div>
              </div>

              <DataTable
                columns={shiftColumns}
                data={shiftArray}
                customStyles={tableCustomStyles}
                pagination
                selectableRowsHighlight
              />
            </div>

            <div className="card-footer">
              <div className="mb-3 mt-2  float-end">
                <Button
                  onClick={createReportCloseBtnClick}
                  className="me-2"
                  variant="danger light"
                >
                  CANCEL
                </Button>
                <Button
                  className="me-2"
                  onClick={() => {
                    createDailyShiftEndReportSavaOrPublishBtn(false);
                  }}
                  variant="dark light"
                >
                  SAVE
                </Button>

                <Button
                  className="me-2"
                  onClick={() => {
                    createDailyShiftEndReportSavaOrPublishBtn(true);
                  }}
                  variant="success light"
                >
                  PUBLISH
                </Button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <></>
      )}
      {/* ************ Create shift end report section ends here ******************* */}


      {/* ************ update shiftend report section starts from here ************ */}
      {showUpdateSection?( 
      <div className="card">
          <div className="card-header">
            <h3 className="m-4">Update Shift End Report</h3>
          </div>
          <form>
            <div className="card-body">
              <div className="search-results">
                <div className="row">
                  <div className="mb-3 mt-2 col-md-3">
                    <label className="mb-1">
                      <strong>Date </strong>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={dateUpdate}
                      onChange={(e) => {
                        setUpdateDate(e.target.value);
                      }}
                      placeholder="Enter Date"
                    ></input>
                  </div>

                  <div className="mb-3 mt-2 col-md-3">
                    <label className="mb-1">
                      <strong> Total Cash Amount</strong>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      onWheel={(e) => e.target.blur()}
                      value={totalCashAmountUpdate}
                      onChange={(e) => {
                        setUpdateTotalCashAmount(e.target.value);
                      }}
                      placeholder="Enter total cash amount "
                    ></input>
                  </div>

                  <div className="mb-3 mt-2 col-md-3">
                    <label className="mb-1">
                      <strong> Actual Total Cash Amount</strong>
                    </label>
                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      className="form-control"
                      value={actualTotalCashAmountUpdate}
                      onChange={(e) => {
                        setUpdateActualTotalCashAmount(e.target.value);
                      }}
                      placeholder="Enter actual cash amount"
                    ></input>
                  </div>

                  <div className="mb-3 mt-2 col-md-3">
                    <label className="mb-1">
                      <strong>Total Card Amount </strong>
                    </label>
                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      className="form-control"
                      value={totalCardAmountUpdate}
                      onChange={(e) => {
                        setUpdateTotalCardAmount(e.target.value);
                      }}
                      placeholder="Enter card amount"
                    ></input>
                  </div>

                  <div className="mb-3 mt-2 col-md-3">
                    <label className="mb-1">
                      <strong>Actual Total Card Amount </strong>
                    </label>
                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      className="form-control"
                      value={actualTotalCardAmountUpdate}
                      onChange={(e) => {
                        setUpdateActualTotalCardAmount(e.target.value);
                      }}
                      placeholder="Enter card amount"
                    ></input>
                  </div>

                  <div className="mb-3 mt-2 col-md-3">
                    <label className="mb-1">
                      <strong> Total UPI Amount </strong>
                    </label>
                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      className="form-control"
                      value={totalUpiAmountUpdate}
                      onChange={(e) => {
                        setUpdateTotalUpiAmount(e.target.value);
                      }}
                      placeholder="Enter total upi amount"
                    ></input>
                  </div>

                  <div className="mb-3 mt-2 col-md-3">
                    <label className="mb-1">
                      <strong>Actual Total UPI Amount </strong>
                    </label>
                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      className="form-control"
                      value={actualTotalUpiAmountUpdate}
                      onChange={(e) => {
                        setUpdateActualTotalUpiAmount(e.target.value);
                      }}
                      placeholder="Enter actual total upi amount"
                    ></input>
                  </div>

                  <div className="mb-3 mt-2 col-md-3">
                    <label className="mb-1">
                      <strong>Grand Total </strong>
                    </label>
                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      className="form-control"
                      value={grandTotalUpdate}
                      onChange={(e) => {
                        setUpdateGrandTotal(
                          Math.max(0, parseInt(e.target.value, 10)) || 0
                        );
                      }}
                      placeholder="Enter grand total amount"
                    ></input>
                  </div>

                  <div className="mb-3 mt-2 col-md-3">
                    <label className="mb-1">
                      <strong>Actual Grand Total </strong>
                    </label>
                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      className="form-control"
                      value={actualGrandTotalUpdate}
                      onChange={(e) => {
                        setUpdateActualGrandTotal(
                          Math.max(0, parseInt(e.target.value, 10)) || 0
                        );
                      }}
                      placeholder="Enter actual grand total amount"
                    ></input>
                  </div>
                </div>
              </div>
            </div>

            <hr></hr>
            {/*  */}
            <div className="card-body">
              <div className="row">
                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Shift Number </strong>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={shiftNoUpdate}
                    onChange={(e) => {
                      setUpdateShiftNo(e.target.value);
                    }}
                    placeholder="Enter shift number"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Operator Name</strong>
                  </label>
                  <Select
                    options={operatorOptions}
                    onChange={(e) => {
                      setUpdateOperator(e.value);
                    }}
                    value={operatorOptions.filter(function (option) {
                      return option.value === operatorUpdate;
                    })}
                  />
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Shift Start Date and Time </strong>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={shiftStartUpdate}
                    onChange={(e) => {
                      setUpdateShiftStart(e.target.value);
                    }}
                    placeholder="Enter shift start date time"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Shift End Date and Time </strong>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={shiftEndUpdate}
                    onChange={(e) => {
                      setUpdateShiftEnd(e.target.value);
                    }}
                    placeholder="Enter shift end date time"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Total Number Of Ticket Collected </strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={ticketCollectedUpdate}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setUpdateTicketCollected(
                        Math.max(0, parseInt(e.target.value, 10)) || 0
                      );
                    }}
                    placeholder="Enter total number of ticket collected"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Total Number Of Ticket Cancelled </strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={ticketCancelledUpdate}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setUpdateTicketCancelled(
                        Math.max(0, parseInt(e.target.value, 10)) || 0
                      );
                    }}
                    placeholder="Enter total no of ticket cancelled"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Total Cash Amount</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={cashAmountUpdate}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setUpdateCashAmount(
                        Math.max(0, parseInt(e.target.value, 10)) || 0
                      );
                    }}
                    placeholder="Enter total cash amount"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Actual Total Cash Amount</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={actualCashAmountUpdate}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setUpdateActualCashAmount(
                        Math.max(0, parseInt(e.target.value, 10)) || 0
                      );
                    }}
                    placeholder="Enter actual total cash amount"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong> Total Card Amount</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={cardAmountUpdate}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setUpdateCardAmount(
                        Math.max(0, parseInt(e.target.value, 10)) || 0
                      );
                    }}
                    placeholder="Enter  total card amount"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Actual Total Card Amount</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={actualCardAmountUpdate}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setUpdateActualCardAmount(
                        Math.max(0, parseInt(e.target.value, 10)) || 0
                      );
                    }}
                    placeholder="Enter actual total card amount"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Total UPI Amount</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={upiAmountUpdate}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setUpdateUpiAmount(
                        Math.max(0, parseInt(e.target.value, 10)) || 0
                      );
                    }}
                    placeholder="Enter  total upi amount"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Actual Total UPI Amount</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={actualUpiAmountUpdate}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setUpdateActualUpiAmount(
                        Math.max(0, parseInt(e.target.value, 10)) || 0
                      );
                    }}
                    placeholder="Enter actual total upi amount"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Total Amount</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={totalAmountUpdate}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setUpdateTotalAmount(
                        Math.max(0, parseInt(e.target.value, 10)) || 0
                      );
                    }}
                    placeholder="Enter total amount"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Actual Total Amount</strong>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={actualTotalAmountUpdate}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setUpdateActualTotalAmount(
                        Math.max(0, parseInt(e.target.value, 10)) || 0
                      );
                    }}
                    placeholder="Enter actual total amount"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <Button
                    onClick={pushShiftsToShiftArrayUpdate}
                    className="me-2 mt-4"
                    variant="success"
                  >
                    ADD
                  </Button>
                </div>
              </div>

              <DataTable
                columns={shiftColumnsUpdate}
                data={shiftArrayUpdate}
                customStyles={tableCustomStyles}
                pagination
                selectableRowsHighlight
              />
            </div>

            <div className="card-footer">
              <div className="mb-3 mt-2  float-end">
                <Button
                  onClick={clearUpdateShiftEndReportVariable}
                  className="me-2"
                  variant="danger light"
                >
                  CANCEL
                </Button>
                <Button
                  className="me-2"
                  onClick={() => {
                    updateDailyShiftEndReportSavaOrPublishBtn(false);
                  }}
                  variant="dark light"
                >
                  SAVE
                </Button>

                <Button
                  className="me-2"
                  onClick={() => {
                    updateDailyShiftEndReportSavaOrPublishBtn(true);
                  }}
                  variant="success light"
                >
                  PUBLISH
                </Button>
              </div>
            </div>
          </form>
        </div>):(<></>)}
      {/* ************ update shiftend report section ends  here ************ */}

    </div>
  );
};

export default DailyShiftEndReport;
