import React from "react";
import { useState } from "react";
import Select from "react-select";
import {
  Button,
  Spinner,
  Badge,
  DropdownButton,
  Dropdown,
  ButtonGroup,
  Form,
} from "react-bootstrap";
import axios from "axios";
import config from "../../services/config";
import { useEffect } from "react";
import DataTable from "react-data-table-component";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import pdfMake from "pdfmake/build/pdfmake";
import {
  faArrowDownUpAcrossLine,
  faPencil,
  faRemove,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ToastContainer, toast } from "react-toastify";
import BootstrapSwitchButton from "bootstrap-switch-button-react";
// import {Tooltip} from 'recharts';
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import "./customSelect.css";
import "../../css/entryExitReport.css";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const EntryExitReport = () => {
  const terminalIdName = JSON.parse(
    window.sessionStorage.getItem("terminalIdName")
  );

  // const showCreateNewReport = () => {
  //   setShowUpdateSection(false);
  //   setShowCreateSection(true);
  //   setShowTableSection(false);
  // };
  // const createReportCloseBtnClick = () => {
  //   setShowUpdateSection(false);
  //   setShowCreateSection(false);
  //   setShowTableSection(true);
  //   // clearReportVariables();
  //   // clearCreateReportVariables();
  // };

  /* ******************************
   * *   DATA TABLE VARIABLES     *
   * ******************************
   */

  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState("");

  const [options, setOptions] = useState(terminalIdName ?? []);
  const [selectedOption, setSelectedOption] = useState(null);
  // const [allTerminals, setAllTerminals] = useState([]);

  // const [transactionType, setTransactionType] = useState("");
  // const [createdAt, setCreatedAt] = useState("");
  // const [customerName, setCustomerName] = useState("");
  // const [terminalName, setTerminalname] = useState("");
  // const [tagNo, setTagNo] = useState("");

  /* ******************************
   * *       DATA TABLE           *
   * ******************************
   */

  const columns = [
    {
      name: "Sl No.",
      selector: (row, index) => index + 1,
    },
    {
      name: "Transaction Type",
      selector: (row) => row.type,
    },
    {
      name: "Created At",
      width: "265px",
      selector: (row) => {
        return (
          row.date.split("T")[0]?.split("-").reverse().join("-") +
          " " +
          row.date.split("T")[1].split(".")[0]
        );
      },
    },
    {
      name: "Customer Name",
      selector: (row) => row.customersName,
    },
    {
      name: "Terminal Name",
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

  /* ******************************
   * *       DATA TABLE ENDS      *
   * ******************************
   */

  // const [loading, setLoading] = useState(false);

  const [reportData, setReportData] = useState([]);

  // //**** show hide section state variables ***********/
  // const [showUpdateSection, setShowUpdateSection] = useState(false);
  // const [showCreateSection, setShowCreateSection] = useState(false);
  // const [showTableSection, setShowTableSection] = useState(true);

  useEffect(() => {
    getTerminals();
  }, []);

  function getTerminals() {
    axios({
      url: config.baseUrl + "getAllTerminals",
      method: "GET",
      "Content-Type": "application/json",
    })
      .then((res) => {
        console.log("res", res);
        if (res.status === 200) {
          // alert(res.data.message)
          setOptions(res.data.data);
          console.log(res.data.message);
          // console.log(res.data.data);
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
    return `${datetime.getFullYear()}/${m < 10 ? "0" + m : m}/${
      d < 10 ? "0" + d : d
    }`;
  }

  function getReportData() {
    const fromDate = getFromDate();
    const toDate = getToDate();
    if (!error) {
      let selectedTerminal = options.find(
        (item) => item.terminalName === selectedOption
      );

      let _terminalId = selectedTerminal ? selectedTerminal._id : null;

      const reportObj = {
        terminalId: _terminalId,
        fromDate: fromDate,
        toDate: toDate,
      };
      console.log("reportObj: ", reportObj);

      try {
        axios({
          url: config.baseUrl + "transactionReport", //TODO: Add API Call
          method: "POST",
          "Content-Type": "application/json",
          data: reportObj,
        })
          .then((res) => {
            console.log("res", res);
            if (res.status === 200) {
              // alert(res.data.message)
              setReportData(res.data.data);
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

  const TerminalSelector = () => {
    return (
      <div className="basic-dropdown">
        <h4 className="mb-1">Terminal</h4>
        <CustomSelect options={options} value={selectedOption} required />
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
                onClick={() => handleSelect(option.terminalName)}
              >
                {option.terminalName}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  };

  const [startDate, setStartDate] = useState(new Date());
  const nextDate = new Date(startDate);
  const [endDate, setEndDate] = useState(startDate);
  const handleStartDateChange = (date) => {
    console.log(date)
    setStartDate(date);

    // Update endDate when startDate changes
    setEndDate(date);
  };

  const getNextDate = (date) => {
    const nextDay = new Date(date);
    // nextDay.setDate(nextDay.getDate() + 1); // Add one day
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
    console.log(date2, date1 , 'dates live')
    // if (date2 >= date1) {
      setError("");
      return true;
    // } else {
    //   return false;
    // }

  };

  const getReport = () => {
    const isDateValid = dateValidation();
    const isTerminalValid = terminalValidation();

    if (isDateValid && isTerminalValid) {
      console.log("Success");
      setError("");
      getReportData();
    } else if (!isDateValid) {
      setError(
        "End date must be greater than Start date\nPlease recheck your dates (MM/DD/YYYY)"
      );
    }
  };
  const terminalValidation = () => {
    if (!selectedOption) {
      setError("Please select a terminal");
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
        <div className="card">
          <div className="card-header">
            <h3
              className="parkoBlue"
              style={{ fontSize: "1.125rem", alignSelf: "center" }}
            >
              Entry Exit Report
            </h3>
            {/* Drop down menu and 2 date pickers */}
            <TerminalSelector />
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
            data={reportData}
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

export default EntryExitReport;
