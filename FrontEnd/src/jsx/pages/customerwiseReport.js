import React from "react";
import { useState } from "react";
import Select from "react-select";
import { Button, Spinner, Badge } from "react-bootstrap";
import axios from "axios";
import config from "../../services/config";
import { useEffect } from "react";
import DataTable from "react-data-table-component";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import pdfMake from "pdfmake/build/pdfmake";
import { faHouseChimneyWindow, faPencil, faRemove, faTrash } from "@fortawesome/free-solid-svg-icons";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
// import {Tooltip} from 'recharts';
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import DatePicker from "react-datepicker";
import { DropdownButton, Dropdown, ButtonGroup, Form } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
// import "./customSelect.css";
import "../../css/entryExitReport.css";

import "../../css/customerreport.css"

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const CustomerWiseReport = () => {
  const terminalIdName = JSON.parse(
    window.sessionStorage.getItem("terminalIdName")
  );
  console.log("terminalIdName ", terminalIdName);

  const showCreateNewShiftEndReport = () => {
    setShowUpdateSection(false);
    setShowCreateSection(true);
    setShowTableSection(false);
  };
  const createReportCloseBtnClick = () => {
    setShowUpdateSection(false);
    setShowCreateSection(false);
    setShowTableSection(true);
    // clearShiftArrayVariables();
    // clearCreateShiftEndReportVariable();
  };

  // ****** CUSTOMERWISE TABLE VARIABLE ******

  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState();

  const [options, setOptions] = useState(terminalIdName ?? []);
  const [selectedOption, setSelectedOption] = useState(null);
  let available_hints = []

  // const [customerName, setCustomerName] = useState("");

  //   ******** CUSTOMERWISE ALL TABLE COLUMNS ********

  const columns = [
    {
      name: "Sl.No",
      selector: (row, index) => index + 1,
    },
    {
      name: "Transaction Type",
      selector: (row) => row.type,
    },
    {
      name: "created At",
      selector: (row) => {
        return (
          row.date.split("T")[0]?.split("-").reverse().join("-") +
          " " +
          row.date.split("T")[1].split(".")[0]
        );
      },
    },
    {
      name: " Terminal Name",
      selector: (row) => row.terminalName,
    },
    {
      name: "Tag No",
      selector: (row) => row.tagNo,
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

  //   ******* ALL THE CUSTOMERWISE REPORT TABLE COLUMN ENDS HERE *******

  const [loading, setLoading] = useState(false);

  const [customerWiseData, setCustomerWiseData] = useState([]);

  // ****** SHOW HIDE SECTION STATE VARIABLES ******

  const [showUpdateSection, setShowUpdateSection] = useState(false);
  const [showCreateSection, setShowCreateSection] = useState(false);
  const [showTableSection, setShowTableSection] = useState(true);
  const [CustomerSearchKeyword, setCustomerSearchKeyword] = useState("");
  const [HintOptions, setHintOptions] = useState(false);
  const [selected_customer, setSelectedCustomer] = useState({});

  useEffect(() => {
    getCustomers();
  }, []);

  function getCustomers() {
    axios({
      url: config.baseUrl + "getAllCustomers",
      method: "GET",
      "Content-Type": "application/json",
    })
      .then((res) => {
        console.log("res", res);
        if (res.status === 200) {
          // alert(res.data.message)
          setOptions(res.data.data);
          console.log(res.data.message);
          console.log(res.data.data);
          // window.location.reload()
        } else if (res.status === 201) {
          alert(res.data.message);
          console.log(res.data.message);
        } else if (res.status === 401) {
          alert("you are unauthorized.. please login to continue");
          window.location = "/page-login";
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.data.status === 401) {
          alert("you are unauthorized.. please login to continue");
          //   window.location = '/page-login'
        }
      });
  }

  function getDateString(datetime) {
    let d = datetime.getDate();
    let m = datetime.getMonth() + 1;
    return `${datetime.getFullYear()}/${m < 10 ? "0" + m : m}/${d < 10 ? "0" + d : d
      }`;
  }

  function handleCustomerSearch(keyword) {
    console.log(keyword)
    setCustomerSearchKeyword(keyword)
    setHintOptions(true)

    // setCustomer(keyword)
    // try {
    //   axios({
    //     url: config.baseUrl + "customerSearch", //TODO: Add API Call
    //     method: "POST",
    //     "Content-Type": "application/json",
    //     data: { "keyword": keyword },
    //   })
    //     .then((res) => {
    //       console.log("res", res);
    //       if (res.status === 200) {
    //         // alert(res.data.message)
    //         // available_hints.push(keyword)
    //         sethints(res.data.data)
    //         // console.log(res.data.message);
    //         // window.location.reload()
    //       } else if (res.status === 201) {
    //         alert(res.data.message);
    //         console.log(res.data.message);
    //       } else if (res.status === 401) {
    //         alert("you are unauthorized.. please login to continue");
    //         window.location = "/page-login";
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       if (err.response?.data.status === 401) {
    //         alert("you are unauthorized.. please login to continue");
    //         //   window.location = '/page-login'
    //       }
    //     });
    // } catch (error) {
    //   console.log(error);
    // }

    let isOnlyNumbers = /^\d+$/.test(keyword);
    let search_result = [];
    // let search_result_tagNo = []
    // console.log('keyword',req.body.keyword)
    if (isOnlyNumbers) {
      // console.log(keyword)
      // Keyword_inNumber = Number(keyword)
      options?.map(hint => {

        // console.log(faHouseChimneyWindow)
        let tagInString = hint.tagNo.toString()
        if (tagInString.startsWith(keyword)) {
          search_result.push(hint)
        }
      // console.log(search_result_tagNo)


      })
    }
    else {
      search_result = options?.filter((hint) => hint.name.toLowerCase().startsWith(keyword))
      
    }

    sethints(search_result)

  }

  function getReportData() {
    const fromDate = getFromDate();
    const toDate = getToDate();
    if (!error) {

      let selectedCustomer = options.find(
        (item) => item.name === selectedOption
      );

      let _customerId = selectedCustomer ? selectedCustomer._id : null;

      const reportObj = {
        customerId: selected_customer._id,
        fromDate: fromDate,
        toDate: toDate,
      };
      console.log("reportObj: ", reportObj);

      try {
        axios({
          url: config.baseUrl + "customerReport", //TODO: Add API Call
          method: "POST",
          "Content-Type": "application/json",
          data: reportObj,
        })
          .then((res) => {
            console.log("res", res);
            if (res.status === 200) {
              // alert(res.data.message)
              setCustomerWiseData(res.data.data);
              console.log("Report Data", res.data.data);

              // console.log(res.data.message);
              // window.location.reload()
            } else if (res.status === 201) {
              alert(res.data.message);
              console.log(res.data.message);
            } else if (res.status === 401) {
              alert("you are unauthorized.. please login to continue");
              window.location = "/page-login";
            }
          })
          .catch((err) => {
            console.log(err);
            if (err.response?.data.status === 401) {
              alert("you are unauthorized.. please login to continue");
              //   window.location = '/page-login'
            }
          });
      } catch (error) {
        console.log(error);
      }
    }
  }

  const CustomerSelector = () => {
    return (
      <div className="basic-dropdown">
        <h4 className="mb-1">Customer</h4>
        <CustomSelect options={options} value={selectedOption} required />
      </div>
    );
  };
  const CustomerSearchBox = () => {
    return (
      <div className="basic-dropdown col-3">
        <h4 className="mb-1">Search Customer</h4>
        <div className=" mt-2">
          <input
            // required
            type="text"
            placeholder="Customer Name or Vehicle Number"
            value={CustomerSearchKeyword}
            onChange={(e) => { handleCustomerSearch(e.target.value) }}
            className="form-control"
          ></input>
        </div>
      </div>
    );
  };



  const CustomSelect = ({ options }) => {
    const handleSelect = (terminalName) => {
      setSelectedOption(terminalName);
    };

    return (
      <div className="basic-dropdown">
        <Dropdown>
          <Dropdown.Toggle variant="primary">
            {selectedOption || "Select an Option"}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {options?.map((option) => (
              <Dropdown.Item
                key={option?._id}
                onClick={() => handleSelect(option.name)}
              >
                {option.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const [startDate, setStartDate] = useState(new Date());
  const nextDate = new Date(startDate);
  const [endDate, setEndDate] = useState(
    new Date(nextDate.setDate(nextDate.getDate() + 1))
  );
  const [transactionType, setTransactionType] = useState();
  const [createdAt, setCreatedAt] = useState();
  const [terminalName, setTerminialName] = useState();
  const [tagNo, setTagNo] = useState();
  const [hints, sethints] = useState([]);

  const handleStartDateChange = (date) => {
    setStartDate(date);

    // Update endDate when startDate changes
    setEndDate(date);
  };

  const handleSelectCustomerFromHint = (hint) => {
    // try {
    //   axios({
    //     url: config.baseUrl + "customerSearch", //TODO: Add API Call
    //     method: "POST",
    //     "Content-Type": "application/json",
    //     data: { "keyword": customer_id },
    //   })
    //     .then((res) => {
    //       console.log("res", res);
    //       if (res.status === 200) {
    //         // alert(res.data.message)
    //         // available_hints.push(keyword)
    //         sethints(res.data.data)
    //         // console.log(res.data.message);
    //         // window.location.reload()
    //       } else if (res.status === 201) {
    //         alert(res.data.message);
    //         console.log(res.data.message);
    //       } else if (res.status === 401) {
    //         alert("you are unauthorized.. please login to continue");
    //         window.location = "/page-login";
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       if (err.response?.data.status === 401) {
    //         alert("you are unauthorized.. please login to continue");
    //         //   window.location = '/page-login'
    //       }
    //     });
    // } catch (error) {
    //   console.log(error);
    // }
    setSelectedCustomer(hint)
    setCustomerSearchKeyword(hint.name)
  }
  const getNextDate = (date) => {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1); // Add one day
    return nextDay;
  };

  function getFromDate() {
    const fromDay = String(startDate.getDate()).padStart(2, "0");
    const fromMonth = String(startDate.getMonth() + 1).padStart(2, "0");
    const fromYear = startDate.getFullYear();
    const fromDate = `${fromYear}-${fromMonth}-${fromDay}`;

    return fromDate;
  }

  function getToDate() {
    const toDay = String(endDate.getDate()).padStart(2, "0");
    const toMonth = String(endDate.getMonth() + 1).padStart(2, "0");
    const toYear = endDate.getFullYear();
    const toDate = `${toYear}-${toMonth}-${toDay}`;

    return toDate;
  }

  const DateRangePicker = () => {
    return (
      <>
        <div>
          <h4 className="mb-1">Start date</h4>
          <DatePicker
            className="form-control"
            selected={startDate}
            value={startDate}
            onChange={(date) => handleStartDateChange(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="dd-MM-yyyy"
            required
          />
        </div>
        <div>
          <h4 className="mb-1">End Date</h4>
          <DatePicker
            className="form-control"
            selected={endDate}
            value={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate ? getNextDate(startDate) : null}

            dateFormat="dd-MM-yyyy"
            required
          />
        </div>
      </>
    );
  };

  const date1 = new Date(startDate);
  const date2 = new Date(endDate);

  const dateValidation = () => {
    if (date2 > date1) {
      setError("");
      return true;
    } else {
      return false;
    }
  };

  const getReport = () => {
    console.log(date1);
    console.log(date2);
    // const isDateValid = dateValidation();
    const isTerminalValid = terminalValidation();

    // if (isDateValid && isTerminalValid) {
    //   console.log("Success");
    setError("");
    getReportData();
    // } else if (!isDateValid) {
    //   setError(
    //     "End date must be greater than Start date\nPlease recheck your dates (MM/DD/YYYY)"
    //   );
    // }
  };

  const terminalValidation = () => {
    if (!selectedOption) {
      setError("Please select a customer");
      return false;
    } else {
      setError("");
      return true;
    }
  };

  let errorMessage = error;

  return (
    <div className="pt-1">
      {errorMessage && (
        <p style={{ color: "red", textAlign: "center", fontSize: 15 }}>
          {errorMessage}
        </p>
      )}
      <div className="col-12">
        <h3
          className="parkoBlue"
          style={{ fontSize: "1.125rem", alignSelf: "center" }}
        >
          Customer Report
        </h3>
        <div className="card">
          <div className="card-header">

            {/* Drop down menu and 2 date pickers */}
            <div className="basic-dropdown col-3 ">
              <h4 className="mb-1">Search Customer</h4>
              <div className=" mt-2">
                <input
                  // required
                  type="text"
                  placeholder="Customer Name or Tag Number"
                  value={CustomerSearchKeyword}
                  onChange={(e) => { handleCustomerSearch(e.target.value) }}
                  className="form-control"
                  onBlur={() => {
                    setTimeout(() => {
                      setHintOptions(false)
                    }, 300);
                  }}
                ></input>
              </div>
              {HintOptions ?
                <div className="search_hints parent" >
                  <div className="hint" >
                    {hints.map((hint, key) => {
                      return (
                        <>
                          <div style={{ 'margin': "2px", 'cursor': 'pointer' }} onClick={() => handleSelectCustomerFromHint(hint)}>
                            <div className="" style={{ 'fontSize': "20px" }}>{hint.name}</div>
                            <div className="cols-6">{hint.tagNo}</div>
                          </div>
                          <hr />
                          {/* <div style={{'display':'block'}}>{hint}</div> */}
                        </>
                      )
                    })}
                  </div>

                </div> : ""}
            </div>
            {/* <CustomerSelector /> */}
            <DateRangePicker />
            <Button className="" onClick={getReport} variant="outline-primary">
              <i class="fa fa-plus me-2"></i> Get Report
            </Button>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <DataTable
            columns={columns}
            data={customerWiseData}
            customStyles={tableCustomStyles}
            pagination
          // expandableRowsComponent={expandableWinningPriceTable}
          // expandableRows
          // fixedHeader
          // selectableRowsHighlight
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerWiseReport;
