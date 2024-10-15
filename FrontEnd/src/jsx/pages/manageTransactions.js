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
import SignatureCanvas from "react-signature-canvas";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import BootstrapSwitchButton from "bootstrap-switch-button-react";

const ManageTransactions = () => {
  // ************ LOcal storrage, SessionStorrage, Coockies **********//
  //   const managerId = window.sessionStorage.getItem("_id");
  //   const orgId = window.sessionStorage.getItem("orgId");
  //   const clientId = window.sessionStorage.getItem("clientId");
  //   const clientName = window.sessionStorage.getItem("clientName");
  // ************ LOcal storrage, SessionStorrage, Coockies **********//

  // ************ ALL Table columns starts *********************//
  const transactionsColumns = [
    {
      name: "SL.No.",
      selector: (row, index) => index + 1,
    },

    {
      name: "Type",
      selector: (row) => row.type,
    },

    {
      name: "Terminal",
      // selector: (row) => row.terminalId,
      selector: (row) =>
        terminalDataDataArray.reduce((acc, item) => {
          if (item._id == row.terminalId) {
            console.log("item: ", item, row.terminalId);
            acc = item.terminalName ?? "-";
          }
          return acc;
        }, "-"),
    },

    {
      name: "Customer",
      // selector: (row) => row.customerId,
      selector: (row) =>
        customerDataArray.reduce((acc, item) => {
          if (item._id === row.customerId) {
            acc = item.name;
          }
          return acc;
        }, null),
    },
    {
      name: "Date",
      selector: (row) => row.date,
    },

    // {
    //   name: "Edit",
    //   cell: (row) => (
    //     <FontAwesomeIcon
    //       style={{ cursor: "pointer" }}
    //       onClick={() => {}}
    //       size="xl"
    //       color="green"
    //       icon={faPencil}
    //     />
    //   ),
    // },
    {
      name: "Delete",
      cell: (row) => (
        <FontAwesomeIcon
          style={{ cursor: "pointer" }}
          onClick={() => {}}
          size="xl"
          color="red"
          icon={faTrash}
        />
      ),
    },
  ];
  const tableCustomStyles = {
    headCells: {
      style: {
        marginRight: "-3px",
        color: "#f8857e",
        width: "165px",
        backgroundColor: "#fef3f2",
      },
    },
    cells: {
      style: {
        marginRight: "1px",
        width: "150px",
        textAlign: "center",
      },
    },
  };
  // ************ ALL Table columns ends *********************//

  const showWarningToast = (message) =>
    toast.warning(`${message}`, { position: "top-center" });
  const showSuccessToast = (message) =>
    toast.success(`${message}`, { position: "top-center" });
  const showErrorToast = (message) =>
    toast.error(`${message}`, { position: "top-center" });

  // >>>>>>>>>>>>>>>main screen variables starts <<<<<<<<<<<<<>>>>>>>>>>>>>//
  const [loading, setLoading] = useState(false);
  const [showMainScreenTable, setShowMainScreenTable] = useState(true);
  const [showCreateSection, setShowCreateSection] = useState(false);
  const [showUpdateSection, setShowUpdateSection] = useState(false);
  const [transactionDataArray, setTransactionDataArray] = useState([]);
  const [terminalDataDataArray, setTerminalDataArray] = useState([]);
  const [customerDataArray, setCustomersDataArray] = useState([]);
  // const [barrierDataArray, setBarrierDataArray] = useState([]);
  // >>>>>>>>>>>>>>>main screen variables ENDS<<<<<<<<<<<<<>>>>>>>>>>>>>//

  //******** */ All create tag reader variables **************
  const [type, setType] = useState("");
  const [terminalID, setTerminalID] = useState("");
  const [customerID, setCustomerID] = useState("");
  const [date, setDate] = useState("");

  //******** */ All create tag reader variables ends **************//

  useEffect(() => {
    getAllTerminalsAPI();
    getAllCustomersAPI();
    // getAllBarriersAPI();
    getTransactionsAPI(); //TODO: uncomment this code
  }, []);

  //************************************************************ */
  // **************** ALL API'S SECTION STARTS*******************//
  // *************************************************************/
  function getAllTerminalsAPI() {
    setLoading(true);
    axios({
      url: config.baseUrl + "getAllTerminals",
      method: "GET",
      "Content-Type": "application/json",
      headers: {
        token: sessionStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log("res", res.data.data);
        if (res.status == 200) {
          showSuccessToast(res.data.message);
          setTerminalDataArray(res.data.data);
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

  function getAllCustomersAPI() {
    setLoading(true);
    axios({
      url: config.baseUrl + "getAllCustomers",
      method: "GET",
      "Content-Type": "application/json",
      headers: {
        // token: sessionStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log("res", res.data.data);
        if (res.status == 200) {
          showSuccessToast(res.data.message);

          setCustomersDataArray(res.data.data);
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

  function getTransactionsAPI() {
    setLoading(true);
    axios({
      url: config.baseUrl + "getAllTransactions",
      method: "GET",
      "Content-Type": "application/json",
      // headers: {
      //     // token: sessionStorage.getItem("token"),
      // },
      //   data: {
      //     clientId,
      //   },
    })
      .then((res) => {
        console.log("res", res.data.data);
        if (res.status == 200) {
          showSuccessToast(res.data.message);

          //   console.log("clientwiseEmpList: ", clientwiseEmpList);
          //   operatorOptions = clientwiseEmpList;
          console.log(res.data.data);
          setTransactionDataArray(res.data.data);
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

  //************************************************************ */
  // **************** ALL API'S SECTION ENDS *******************//
  // *************************************************************/

  return (
    <div className="col-12">
      <ToastContainer />

      <div className="card ">
        <div className="card-header">
          <h2>Current Transactions</h2>
          {/* <Button onClick={{}}>
            Create Barriers
          </Button> */}
        </div>
        <div className="card-body">
          <DataTable
            columns={transactionsColumns}
            data={transactionDataArray}
            customStyles={tableCustomStyles}
            pagination
            selectableRowsHighlight
          />
        </div>
      </div>
    </div>
  );
};

export default ManageTransactions;
