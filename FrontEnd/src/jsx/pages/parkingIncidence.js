import React from "react";
import { useState, useRef } from "react";
import Select from "react-select";
import { Button, Spinner, Badge } from "react-bootstrap";
import axios from "axios";
import config from "../../services/config";
import { useEffect } from "react";
import DataTable from "react-data-table-component";
import { faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";
import SignatureCanvas from 'react-signature-canvas'
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'


// Import React FilePond
import { FilePond, File, registerPlugin } from "react-filepond";
// Import FilePond styles
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import "filepond/dist/filepond.min.css";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileEncode)

var operatorOptions = [];

const ParkingIncidence = () => {
  // ************ LOcal storrage, SessionStorrage, Coockies **********//
  const managerId = window.sessionStorage.getItem("_id");
  const orgId = window.sessionStorage.getItem("orgId");
  const clientId = window.sessionStorage.getItem("clientId");
  const clientName = window.sessionStorage.getItem("clientName");
  // ************ LOcal storrage, SessionStorrage, Coockies **********//

  // ************ ALL Table columns starts *********************//
  const parkingIncidenceColumns = [
    {
      name: "Customer Name",
      selector: (row) => row.customerName,
    },

    {
      name: "Contact Number",
      selector: (row) => row.contactNumber,
    },

    {
      name: "Plate Number",
      selector: (row) => row.plateNumber,
    },

    {
      name: "Reported At",
      selector: (row) => row.reportedDateTime,
    },
    {
      name: "Ticket Number",
      selector: (row) => row.ticketNumber,
    },
    {
      name: "Entry",
      selector: (row) => row.entryDateAndTime,
    },
    {
      name: "Exit",
      selector: (row) => row.exitDateAndTime,
    },
    {
      name: "Reported To",
      // selector: (row) => row.reportedTo,
      selector: (row) => operatorOptions.filter((e) => e.value == row.reportedTo)[0] != undefined ? operatorOptions.filter((e) => e.value == row.reportedTo)[0].label : '-'
    },
    {
      name: "Status",
      selector: (row) => (<BootstrapSwitchButton
        checked={row.isPublished}
        onlabel='Published'
        offlabel='Saved'
        width={100}
        onstyle="success"
        offstyle="primary"
        disabled={row.isPublished}
      />),
    },
    {
      name: "Edit",
      cell: (row) => (
        row.isPublished ? '-' : <FontAwesomeIcon style={{ cursor: "pointer" }} onClick={() => { handleEditOnClickPencilIcon(row) }} size='xl' color='green' icon={faPencil} />
      )
    },
    {
      name: "Delete",
      cell: (row) => (
        row.isPublished ? '-' : <FontAwesomeIcon style={{ cursor: "pointer" }} onClick={() => handleDeleteIconClick(row)} size='xl' color='red' icon={faTrash} />
      )
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
  // ************ ALL Table columns ends *********************//

  const showToast = (message) => toast(`${message}`);
  const showWarningToast = (message) => toast.warning(`${message}`, { position: 'top-center' });
  const showSuccessToast = (message) => toast.success(`${message}`, { position: 'top-center' });
  const showErrorToast = (message) => toast.error(`${message}`, { position: 'top-center' })

  // >>>>>>>>>>>>>>>main screen variables <<<<<<<<<<<<<>>>>>>>>>>>>>//
  const [loading, setLoading] = useState(false);
  const [parkingIncidenceDataArray, setParkingIncidenceDataArray] = useState([]);
  const [showMainScreenTable, setShowMainScreenTable] = useState(true);
  const [showCreateParkingIncidence, setShowCreateParkingIncidence] = useState(false);
  const [showUpdateParkingIncidence, setShowUpdateParkingIncidence] = useState(false);



  // >>>>>>>>>>>>>>>  Create parking incidence section hooks variables starts>>>>>>>>>>>>//
  const [customerName, setCustomerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [reportedDateTime, setReportedDateTime] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");
  const [entryDateAndTime, setEntryDateAndTime] = useState("");
  const [exitDateAndTime, setExitDateAndTime] = useState("");
  const [reportedTo, setReportedTo] = useState("");
  const customerSignRef = useRef(null);
  const managerSignRef = useRef(null);
  const [vehicleImage, setVehicleImage] = useState([]);
  const [isPublish, setIsPublish] = useState(false);

  // >>>>>>>>>>>>>>>  Create parking incidence section hooks variables ends>>>>>>>>>>>>//


  // >>>>>>>>>>>>>>>  update parking incidence section hooks variables starts>>>>>>>>>>>>//
  const [customerNameUpdate, setUpdateCustomerName] = useState("");
  const [contactNumberUpdate, setUpdateContactNumber] = useState("");
  const [plateNumberUpdate, setUpdatePlateNumber] = useState("");
  const [reportedDateTimeUpdate, setUpdateReportedDateTime] = useState("");
  const [ticketNumberUpdate, setUpdateTicketNumber] = useState("");
  const [entryDateAndTimeUpdate, setUpdateEntryDateAndTime] = useState("");
  const [exitDateAndTimeUpdate, setUpdateExitDateAndTime] = useState("");
  const [reportedToUpdate, setUpdateReportedTo] = useState("");
  const customerSignRefUpdate = useRef(null);
  const managerSignRefUpdate = useRef(null);
  const [vehicleImageUpdate, setUpdateVehicleImage] = useState([]);
  const [isPublishUpdate, setUpdateIsPublish] = useState(false);
  const [customerSignImage, setCustomerSignImage] = useState('');
  const [managerSignImage, setManagerSignImage] = useState('');
  // >>>>>>>>>>>>>>>  update parking incidence section hooks variables ends>>>>>>>>>>>>//










  useEffect(() => {
    getAllParkingIncidenceAPI();
    getClientwiseActiveEmployeesAPI(); //TODO: uncomment this code
  }, []);

  const handleCreateParkingIncidenceBtnOnClick = () => {
    setShowMainScreenTable(false);
    setShowCreateParkingIncidence(true);
    setShowUpdateParkingIncidence(false);
  };

  //************************************************************ */
  // **************** ALL API'S SECTION STARTS*******************//
  // *************************************************************/

  //get clientwise employees
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
        console.log("res", res.data.data);
        if (res.status == 200) {
          showSuccessToast(res.data.message);
          let clientwiseEmpList = res.data.data.map((e) => {
            return {
              value: e._id,
              label: `${e.employeeFirstName} ${e.employeeLastName}`,
            };
          });
          console.log("clientwiseEmpList: ", clientwiseEmpList);
          operatorOptions = clientwiseEmpList;
          console.log(res.data.data);
          // setDailyShiftEndDataArray(res.data.data);
          setLoading(false);
          // createReportCloseBtnClick(); //clear all variables
        } else if (res.status == 201) {
          setLoading(false);
          showErrorToast(res.data.message);

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

  // get All parking incidence API
  function getAllParkingIncidenceAPI() {
    setLoading(true);
    axios({
      url: config.baseUrl + "getParkingIncidence",
      method: "post",
      "Content-Type": "application/json",
      // headers: {
      //     // token: sessionStorage.getItem("token"),
      // },
      data: {
        clientId,
        orgId
      },
    })
      .then((res) => {
        console.log("res", res.data.data);
        if (res.status == 200) {
          showSuccessToast(res.data.message);

          console.log(res.data.data);
          setParkingIncidenceDataArray(res.data.data)
          setLoading(false);
        } else if (res.status == 201) {
          setLoading(false);
          showErrorToast(res.data.message);

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

  // create parking incidence API
  function createParkingIncidenceAPI(parkingIncidenceObj) {
    setLoading(true);
    axios({
      url: config.baseUrl + "createParkingIncidence",
      method: "post",
      "Content-Type": "application/json",
      // headers: {
      //     // token: sessionStorage.getItem("token"),
      // },
      data: parkingIncidenceObj
    })
      .then((res) => {

        if (res.status == 200) {
          showSuccessToast(res.data.message);

          // alert(res.data.message)
          setLoading(false);
          handleCreateCancelBtnClick();
        } else if (res.status == 201) {
          setLoading(false);
          showErrorToast(res.data.message);

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

  // update parking incidence API
  function updateParkingIncidenceAPI(updateParkingIncidenceObj) {
    setLoading(true);
    axios({
      url: config.baseUrl + "update ParkingIncidence",
      method: "post",
      "Content-Type": "application/json",
      // headers: {
      //     // token: sessionStorage.getItem("token"),
      // },
      data: updateParkingIncidenceObj
    })
      .then((res) => {
        console.log("res", res.data.data);
        if (res.status == 200) {
          showSuccessToast(res.data.message);

          // alert(res.data.message)
          setLoading(false);
          handleCreateCancelBtnClick();
        } else if (res.status == 201) {
          setLoading(false);
          showErrorToast(res.data.message);

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


  //delete parking incidence API
  // ******** delete shift end report API ****************/
  function deleteParkingIncidenceAPI(deleteObj) {
    setLoading(true);
    axios({
      url: config.baseUrl + "deleteParkingIncidence",
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
  //*************************************************************//


  const handleCreateCancelBtnClick = () => {
    setShowMainScreenTable(true);
    setShowCreateParkingIncidence(false);
    setShowUpdateParkingIncidence(false);

    setCustomerName('');
    setContactNumber('');
    setPlateNumber('');
    setReportedDateTime('');
    setTicketNumber('');
    setEntryDateAndTime('');
    setExitDateAndTime('');
    setReportedTo('');
    setVehicleImage([]);
    setIsPublish(false);
    customerSignRef.current.clear();
    managerSignRef.current.clear();
  }

  const getBase64ManagerSignatureData = () => {
    if (managerSignRef.current) {
      if (managerSignRef.current.isEmpty()) return '';
      const base64Data = managerSignRef.current.toDataURL();
      return base64Data.split(',')[1]; // Remove the data URL header
    }
    return null;
  };

  const getBase64CustomerSignatureData = () => {
    if (customerSignRef.current) {
      if (customerSignRef.current.isEmpty()) return '';
      const base64Data = customerSignRef.current.toDataURL();
      return base64Data.split(',')[1]; // Remove the data URL header
    }
    return null;
  };

  function formatedDateTime(inputDateString) {
    const inputDate = new Date(inputDateString);

    const formattedDate = `${inputDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).replace(/\//g, '-')} ${inputDate.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    })}`;
    return formattedDate;
  }

  function convertToGmtDate(formattedDate) {
    const [formattedDatePart, formattedTimePart] = formattedDate.split(' ');
    const [day, month, year] = formattedDatePart.split('-');
    const [hours, minutes] = formattedTimePart.split(':');
    const reconstructedDate = new Date(`${year}-${month}-${day} ${hours}:${minutes}`);

    const inputDateString = reconstructedDate.toDateString(); // This might not exactly match the original input format
    return inputDateString;
  }

  const handleSubmitCreateParkingIncidence = () => {
    // 
    let vehicleImagesList = []
    if (Array.isArray(vehicleImage) && vehicleImage.length > 0) {
      vehicleImagesList = vehicleImage.map((e) => e.getFileEncodeBase64String());
    }
    const parkingIncidenceObj = {
      // incidenceObjId
      customerName: customerName,
      contactNumber: contactNumber,
      plateNumber: plateNumber,
      reportedDateTime: formatedDateTime(reportedDateTime),
      ticketNumber: ticketNumber,
      entryDateAndTime: formatedDateTime(entryDateAndTime),
      exitDateAndTime: formatedDateTime(exitDateAndTime),
      reportedTo: reportedTo,
      orgId: orgId,
      customerSign: getBase64CustomerSignatureData(),
      managerSign: getBase64ManagerSignatureData(),
      vehicleImage: vehicleImagesList,
      isPublished: isPublish

    }
    console.log('parkingIncidenceObj: ', parkingIncidenceObj);
    createParkingIncidenceAPI(parkingIncidenceObj);
    // }else{
    //   console.log("publish false");
    // }

  };



  //*********** Edit section functionalities Start*************//
  const handleEditOnClickPencilIcon = (rowData) => {
    console.log('rowData: ', rowData);
    setShowMainScreenTable(false);
    setShowCreateParkingIncidence(false);
    setShowUpdateParkingIncidence(true)

    setUpdateCustomerName(rowData.customerName);
    setUpdateContactNumber(rowData.contactNumber);
    setUpdatePlateNumber(rowData.plateNumber);
    setUpdateReportedDateTime(convertToGmtDate(rowData.reportedDateTime))
    setUpdateTicketNumber(rowData.ticketNumber);
    setUpdateEntryDateAndTime(convertToGmtDate(rowData.entryDateAndTime));
    setUpdateExitDateAndTime(convertToGmtDate(rowData.exitDateAndTime));
    setUpdateReportedTo(rowData.reportedTo);
    setCustomerSignImage(rowData.customerSign??'');
    setManagerSignImage(rowData.managerSign)


  }
  const handleUpdateCancelBtnClick = () => {
    setShowMainScreenTable(true);
    setShowCreateParkingIncidence(false);
    setShowUpdateParkingIncidence(false);

    setUpdateCustomerName('');
    setUpdateContactNumber('');
    setUpdatePlateNumber('');
    setUpdateReportedDateTime('');
    setUpdateTicketNumber('');
    setUpdateEntryDateAndTime('');
    setUpdateExitDateAndTime('');
    setUpdateReportedTo('');
    setUpdateVehicleImage([]);
    setIsPublish(false);
    setCustomerSignImage('');
    customerSignRefUpdate.current.clear();
    managerSignRefUpdate.current.clear();
  }
  const handleDeleteIconClick = (rowData) => {
    const result = window.confirm(`Are you sure you want to delete ${rowData.customerName} shift details ?`);
    if (result) {
      let deleteObj = {
        incidenceObjId: rowData._id
      }
      deleteParkingIncidenceAPI(deleteObj);
    }
  }




  return (
    <div className="col-12">
      <ToastContainer />
      {showMainScreenTable ? (
        <div className="card ">
          <div className="card-header">
            <h2>PARKING INCIDENCE</h2>
            <Button onClick={handleCreateParkingIncidenceBtnOnClick}>
              Create Parking Incidence
            </Button>
          </div>
          <div className="card-body">
            {/* <div className="row">
            <div className="m-3  "> */}
            <DataTable
              columns={parkingIncidenceColumns}
              data={parkingIncidenceDataArray}
              customStyles={tableCustomStyles}
              pagination
              selectableRowsHighlight
            />
            {/* </div>
            </div> */}
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* create parking incidence section */}
      {showCreateParkingIncidence ? (
        <div className="card ">
          <div className="card-header">
            <h2>CREATE PARKING INCIDENCE</h2>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitCreateParkingIncidence();
            }}
          >
            <div className="card-body">
              <div className="row">
                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Customer Name </strong>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                    }}
                    placeholder="Enter Customer Name"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Contact Number </strong>
                  </label>
                  <input
                    type="number"
                    required
                    className="form-control"
                    value={contactNumber}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setContactNumber(e.target.value);
                    }}
                    placeholder="Enter Customer Phone No"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Plate Number </strong>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={plateNumber}
                    onChange={(e) => {
                      setPlateNumber(e.target.value);
                    }}
                    placeholder="Enter Plate Number"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Ticket Number</strong>
                  </label>
                  <input
                    type="number"
                    required
                    className="form-control"
                    value={ticketNumber}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setTicketNumber(e.target.value);
                    }}
                    placeholder="Enter Ticket Number "
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Entry Date And Time</strong>
                  </label>
                  <DateTimePicker
                    required
                    clearIcon={false}
                    clockIcon={null}
                    calendarIcon={null}

                    onChange={(selectedDate) => {
                      setEntryDateAndTime(selectedDate);
                    }}
                    format="dd-MM-y hh:mm a"
                    value={entryDateAndTime}
                  />

                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Exit Date And Time    </strong>
                  </label>
                  <DateTimePicker
                    required
                    // className={"form-control"}
                    clearIcon={false}
                    clockIcon={null}
                    calendarIcon={null}

                    onChange={(selectedDate) => {
                      setExitDateAndTime(selectedDate);
                    }}
                    format="dd-MM-y hh:mm a"
                    value={exitDateAndTime}
                  />

                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Report Date Time </strong>
                  </label><br></br>
                  <DateTimePicker
                    // className={"form-control"}
                    required
                    clearIcon={false}
                    clockIcon={null}
                    calendarIcon={null}
                    onChange={(selectedDate) => {
                      console.log('selectedDate: ', selectedDate);
                      setReportedDateTime(selectedDate);
                    }}
                    format="dd-MM-y hh:mm a"
                    value={reportedDateTime}
                  />
                  {/* <input
                    type="text"
                    required
                    className="form-control"
                    value={reportedDateTime}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setReportedDateTime(e.target.value);
                    }}
                    placeholder="Enter Report Date Time "
                  ></input> */}
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Report To </strong>
                  </label>
                  {/* <input
                    type="text"
                    required
                    className="form-control"
                    value={reportedTo}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setReportedTo(e.target.value);
                    }}
                    placeholder="Enter Report To "
                  ></input> */}
                  <Select
                    options={operatorOptions}
                    onChange={(e) => {
                      setReportedTo(e.value);
                    }}
                    value={operatorOptions.filter(function (option) {
                      return option.value === reportedTo;
                    })}
                  />

                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Vehicle Images </strong>
                  </label>
                  <FilePond
                    files={vehicleImage}
                    value={vehicleImage}
                    credits={false}
                    onupdatefiles={setVehicleImage}
                    allowReorder={true}
                    allowMultiple={true}
                    maxFiles={2}
                    name={vehicleImage}
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                  />

                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Customer's Signature </strong>
                  </label>
                  <div style={{ border: '1px solid red', width: "280px" }} >
                    <SignatureCanvas canvasProps={{ className: 'sigCanvas', width: '280', height: '150' }} clearButton="true" ref={customerSignRef} />
                  </div>
                  <button onClick={() => customerSignRef.current.clear()}>Clear</button>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Manager's Signature </strong>
                  </label>
                  <div style={{ border: '1px solid red', width: "280px" }}  >
                    <SignatureCanvas canvasProps={{ className: 'sigCanvas', width: '280', height: '150' }} clearButton="true"
                      ref={managerSignRef}
                    />
                  </div>
                  <button onClick={() => managerSignRef.current.clear()}>Clear</button>

                  {/* <button onClick={getBase64ManagerSignatureData}>Read Signature</button> */}

                </div>


              </div>
            </div>
            <div className="card-footer">
              <div className="mb-3 mt-2  float-end">
                <Button type="button" onClick={handleCreateCancelBtnClick} className="me-2 btn btn-danger light ">CANCEL</Button>
                <Button type="submit" onClick={() => { setIsPublish(false) }} className="me-2" variant="dark light">SAVE</Button>
                <Button type="submit" onClick={() => { setIsPublish(true) }} className="me-2" variant="success light">PUBLISH</Button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <></>
      )}


      {showUpdateParkingIncidence ? (
        <div className="card ">
          <div className="card-header">
            <h2>UPDATE PARKING INCIDENCE</h2>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitCreateParkingIncidence();
            }}
          >
            <div className="card-body">
              <div className="row">
                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Customer Name </strong>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={customerNameUpdate}
                    onChange={(e) => {
                      setUpdateCustomerName(e.target.value);
                    }}
                    placeholder="Enter Customer Name"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Contact Number </strong>
                  </label>
                  <input
                    type="number"
                    required
                    className="form-control"
                    value={contactNumberUpdate}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setUpdateContactNumber(e.target.value);
                    }}
                    placeholder="Enter Customer Phone No"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Plate Number </strong>
                  </label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={plateNumberUpdate}
                    onChange={(e) => {
                      setUpdatePlateNumber(e.target.value);
                    }}
                    placeholder="Enter Plate Number"
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Ticket Number</strong>
                  </label>
                  <input
                    type="number"
                    required
                    className="form-control"
                    value={ticketNumberUpdate}
                    onWheel={(e) => e.target.blur()}
                    onChange={(e) => {
                      setUpdateTicketNumber(e.target.value);
                    }}
                    placeholder="Enter Ticket Number "
                  ></input>
                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Entry Date And Time</strong>
                  </label>
                  <DateTimePicker
                    required
                    clearIcon={false}
                    clockIcon={null}
                    calendarIcon={null}

                    onChange={(selectedDate) => {
                      setUpdateEntryDateAndTime(selectedDate);
                    }}
                    format="dd-MM-y hh:mm a"
                    value={entryDateAndTimeUpdate}
                  />

                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Exit Date And Time    </strong>
                  </label>
                  <DateTimePicker
                    required
                    // className={"form-control"}
                    clearIcon={false}
                    clockIcon={null}
                    calendarIcon={null}

                    onChange={(selectedDate) => {
                      setUpdateExitDateAndTime(selectedDate);
                    }}
                    format="dd-MM-y hh:mm a"
                    value={exitDateAndTimeUpdate}
                  />

                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Report Date Time </strong>
                  </label><br></br>
                  <DateTimePicker
                    required
                    clearIcon={false}
                    clockIcon={null}
                    calendarIcon={null}
                    onChange={(selectedDate) => {
                      console.log('selectedDate: ', selectedDate);
                      setUpdateReportedDateTime(selectedDate);
                    }}
                    format="dd-MM-y hh:mm a"
                    value={reportedDateTimeUpdate}
                  />

                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Report To </strong>
                  </label>

                  <Select
                    options={operatorOptions}
                    onChange={(e) => {
                      setReportedTo(e.value);
                    }}
                    value={operatorOptions.filter(function (option) {
                      return option.value === reportedToUpdate;
                    })}
                  />

                </div>

                <div className="mb-3 mt-2 col-md-5">
                  <label className="mb-1">
                    <strong>Vehicle Images </strong>
                  </label>
                  <FilePond
                    files={vehicleImageUpdate}
                    value={vehicleImageUpdate}
                    credits={false}
                    onupdatefiles={setUpdateVehicleImage}
                    allowReorder={true}
                    allowMultiple={true}
                    maxFiles={2}
                    name={vehicleImageUpdate}
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                  />

                </div>

                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Customer's Signature </strong>
                  </label>
                  <div style={{ border: '1px solid red', width: "280px" }} >
                    <SignatureCanvas canvasProps={{ className: 'sigCanvas', width: '280', height: '150' }} clearButton="true" ref={customerSignRefUpdate} />
                  </div>
                  <button onClick={() => customerSignRefUpdate.current.clear()}>Clear</button>
                </div>
               { customerSignImage!==''?
                <div className="m-4 col-md-3">
                   <label className="mb-1">
                    <strong>Customer's Previous Signature </strong>
                  </label>
                  <img width={200} style={{border:"2px grey solid"}} src={customerSignImage}>
                  </img>
                  </div>:<></>}


                <div className="mb-3 mt-2 col-md-3">
                  <label className="mb-1">
                    <strong>Manager's Signature </strong>
                  </label>
                  <div style={{ border: '1px solid red', width: "280px" }}  >
                    <SignatureCanvas canvasProps={{ className: 'sigCanvas', width: '280', height: '150' }} clearButton="true"
                      ref={managerSignRefUpdate}
                    />
                  </div>
                  <button onClick={() => managerSignRefUpdate.current.clear()}>Clear</button>

                  {/* <button onClick={getBase64ManagerSignatureData}>Read Signature</button> */}

                </div>
                { managerSignImage!==''?
                <div className="mb-3 mt-2 col-md-2" >
                                     <label className="mb-1">
                    <strong>Manager's Previous Signature </strong>
                  </label>
                  <img width={200} style={{border:"2px grey solid"}} src={managerSignImage}>
                  </img>
                  </div>:<></>}


              </div>
            </div>
            <div className="card-footer">
              <div className="mb-3 mt-2  float-end">
                <Button type="button" onClick={handleUpdateCancelBtnClick} className="me-2 btn btn-danger light ">CANCEL</Button>
                <Button type="submit" onClick={() => { setUpdateIsPublish(false) }} className="me-2" variant="dark light">SAVE</Button>
                <Button type="submit" onClick={() => { setUpdateIsPublish(true) }} className="me-2" variant="success light">PUBLISH</Button>
              </div>
            </div>
          </form>
        </div>
      ) : (
        <></>
      )}


    </div>
  );
};

export default ParkingIncidence;
