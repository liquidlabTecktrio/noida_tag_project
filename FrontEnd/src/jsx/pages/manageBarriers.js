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

const ManageBarriers = () => {
  // ************ LOcal storrage, SessionStorrage, Coockies **********//
  //   const managerId = window.sessionStorage.getItem("_id");
  //   const orgId = window.sessionStorage.getItem("orgId");
  //   const clientId = window.sessionStorage.getItem("clientId");
  //   const clientName = window.sessionStorage.getItem("clientName");
  // ************ LOcal storrage, SessionStorrage, Coockies **********//

  // ************ ALL Table columns starts *********************//
  const barriersColumn = [
    {
      name: "SL No",
      selector: (row, i) => i + 1,
      width: "100px",
    },

    {
      name: "Barrier Name",
      selector: (row) => row.barrierName,
    },

    {
      name: "Barrier No",
      selector: (row) => row.barrierNo,
    },
    {
      name: "IP Address",
      selector: (row) => row.ipAddress,
    },
    {
      name: "MAC Address",
      selector: (row) => row.macAddress,
    },

    {
      name: "Edit",
      cell: (row) => (
        <FontAwesomeIcon
          style={{ cursor: "pointer" }}
          onClick={(e) => handleUpdateSection(row)}
          size="xl"
          color="green"
          icon={faPencil}
        />
      ),
      width: "100px",
    },
    {
      name: "Delete",
      cell: (row) => (
        <FontAwesomeIcon
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            handleDelete(row);
          }}
          size="xl"
          color="red"
          icon={faTrash}
        />
      ),
      width: "100px",
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
  const [barrierDataArray, setBarrierDataArray] = useState([]);

  // >>>>>>>>>>>>>>>main screen variables ENDS<<<<<<<<<<<<<>>>>>>>>>>>>>//

  //******** */ All create tag reader variables **************

  const [barrierName, setBarrierName] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [barrierNo, setBarrierNo] = useState(0);
  //******** */ All create tag reader variables ends **************//

  useEffect(() => {
    getAllBarriersAPI(); //TODO: uncomment this code
  }, []);

  //******** */ All update tag reader variables **************

  const [updateBarrierName, setUpdateBarrierName] = useState("");
  const [updateIpAddress, setUpdateIpAddress] = useState("");
  const [updateMacAddress, setUpdateMacAddress] = useState("");
  const [updateBarrierNo, setUpdateBarrierNo] = useState(0);
  const [upadeteRowId, setUpadeteRowId] = useState("");
  //******** */ All create tag reader variables ends **************//

  //************************************************************ */
  // **************** ALL API'S SECTION STARTS*******************//
  // *************************************************************/

  function getAllBarriersAPI() {
    setLoading(true);
    axios({
      url: config.baseUrl + "getAllBarriers",
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
          setBarrierDataArray(res.data.data);
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

  function createBarrierAPI(barrierObj) {
    setLoading(true);
    axios({
      url: config.baseUrl + "createBarrier",
      method: "POST",
      "Content-Type": "application/json",
      headers: {
        // token: sessionStorage.getItem("token"),
      },
      data: barrierObj,
    })
      .then((res) => {
        console.log("res", res);
        if (res.data.status == 200) {
          showSuccessToast(res.data.message);
          handleCancelBtn();

          console.log(res.data.data);
          // setTagReaderDataArray(res.data.data);
          setLoading(false);
        } else if (res.data.status == 201) {
          setLoading(false);
          showErrorToast(res.data.message);

          alert(res.data.message);

          console.log(res.data.message);
        } else if (res.data.status == 401) {
          setLoading(false);
          alert("you are unauthorized.. please login to continue");
          window.location = "/page-login";
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

  function updateBarrierAPI(upadetBarrierObj) {
    setLoading(true);
    axios({
      url: config.baseUrl + "updateBarriers",
      method: "POST",
      "Content-Type": "application/json",
      headers: {
        // token: sessionStorage.getItem("token"),
      },
      data: upadetBarrierObj,
    })
      .then((res) => {
        console.log("res", res);
        if (res.data.status == 200) {
          showSuccessToast(res.data.message);
          handleCancelBtn();
          setBarrierDataArray(res.data.data ?? []);
          console.log(res.data.data);
          // setTagReaderDataArray(res.data.data);
          setLoading(false);
        } else if (res.data.status == 201) {
          setLoading(false);
          showErrorToast(res.data.message);

          alert(res.data.message);

          console.log(res.data.message);
        } else if (res.data.status == 401) {
          setLoading(false);
          alert("you are unauthorized.. please login to continue");
          window.location = "/page-login";
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

  function deleteBarriersAPI(deleteKey) {
    setLoading(true);
    axios({
      url: config.baseUrl + "deleteBarriers",
      method: "DELETE",
      "Content-Type": "application/json",
      headers: {
        // token: sessionStorage.getItem("token"),
      },
      data: deleteKey,
    })
      .then((res) => {
        console.log("res", res);
        if (res.data.status == 200) {
          showSuccessToast(res.data.message);
          handleCancelBtn();
          setBarrierDataArray(res.data.data ?? []);
          console.log(res.data.data);
          setLoading(false);
        } else if (res.data.status == 201) {
          setLoading(false);
          showErrorToast(res.data.message);

          alert(res.data.message);

          console.log(res.data.message);
        } else if (res.data.status == 401) {
          setLoading(false);
          alert("you are unauthorized.. please login to continue");
          window.location = "/page-login";
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

  const handleCancelBtn = () => {
    setShowMainScreenTable(true);
    setShowCreateSection(false);
    setShowUpdateSection(false);
  };

  const handleCreateSection = () => {
    setShowMainScreenTable(true);
    setShowCreateSection(true);
    setShowUpdateSection(false);
  };
  const handleUpdateSection = (row) => {
    setShowMainScreenTable(true);
    setShowCreateSection(false);
    setShowUpdateSection(true);

    setUpadeteRowId(row._id);
    setUpdateBarrierName(row.barrierName);
    setUpdateIpAddress(row.ipAddress);
    setUpdateMacAddress(row.macAddress);
    setUpdateBarrierNo(row.barrierNo);
  };

  const handleCreateBannerSubmit = () => {
    const barrierObj = {
      barrierName: barrierName,
      ipAddress: ipAddress,
      macAddress: macAddress,
      barrierNo: barrierNo,
    };

    createBarrierAPI(barrierObj);
  };

  const handleUpdateBannerSubmit = () => {
    const updateBarrierObj = {
      _id: upadeteRowId,
      barrierName: updateBarrierName,
      ipAddress: updateIpAddress,
      macAddress: updateMacAddress,
      barrierNo: updateBarrierNo,
    };

    updateBarrierAPI(updateBarrierObj);
  };

  const handleDelete = (row) => {
    const deleteKey = {
      _id: row._id,
    };

    deleteBarriersAPI(deleteKey);
  };

  return (
    <div className="col-12">
      <ToastContainer />
      <div className="row d-flex">
        <div
          className={
            (showMainScreenTable && showCreateSection) ||
            (showMainScreenTable && showUpdateSection)
              ? "col-8"
              : "col-12"
          }
        >
          <div className="card ">
            <div className="card-header">
              <h2>Current Barriers</h2>
              <Button onClick={handleCreateSection}>Create Barrier</Button>
            </div>
            <div className="card-body">
              <DataTable
                columns={barriersColumn}
                data={barrierDataArray}
                customStyles={tableCustomStyles}
                pagination
                selectableRowsHighlight
              />
            </div>
          </div>
        </div>

        {showCreateSection ? (
          <div
            className={
              (showMainScreenTable && showCreateSection) ||
              (showMainScreenTable && showUpdateSection)
                ? "col-4"
                : "col-0"
            }
          >
            <div className="card ">
              <form>
                <div className="card-header">
                  <h4>Create New Barrier</h4>
                </div>
                <div className="card-body">
                  <div className="row d-flex">
                    <div className="col-12">
                      <input
                        type="text"
                        placeholder="Barrier Name"
                        value={barrierName}
                        onChange={(e) => setBarrierName(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>

                    <div className="col-12 mt-3">
                      <input
                        type="text"
                        placeholder="IP Address"
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>

                    <div className="col-12 mt-3">
                      <input
                        type="text"
                        placeholder="MAC Address"
                        value={macAddress}
                        onChange={(e) => setMacAddress(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>

                    <div className="col-12 mt-3">
                      <input
                        type="number"
                        placeholder="Barrier Number"
                        value={barrierNo}
                        onWheel={(e) => e.target.blur()}
                        onChange={(e) => {
                          let value = e.target.value;
                          value = Math.max(0, value);
                          setBarrierNo(value);
                        }}
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                </div>

                <div className="card-footer ">
                  <Button
                    type="submit"
                    className="float-end  btn-success"
                    style={{ marginLeft: "10px" }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleCreateBannerSubmit();
                      console.log("");
                    }}
                  >
                    Create
                  </Button>

                  <Button
                    className="float-end danger mb-3"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCancelBtn();
                      console.log("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <></>
        )}

        {showUpdateSection ? (
          <div
            className={
              (showMainScreenTable && showCreateSection) ||
              (showMainScreenTable && showUpdateSection)
                ? "col-4"
                : "col-0"
            }
          >
            <div className="card ">
              <form>
                <div className="card-header">
                  <h4>Edit Barrier</h4>
                </div>
                <div className="card-body">
                  <div className="row d-flex">
                    <div className="col-12">
                      <input
                        type="text"
                        placeholder="Barrier Name"
                        value={updateBarrierName}
                        onChange={(e) => setUpdateBarrierName(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>

                    <div className="col-12 mt-3">
                      <input
                        type="text"
                        placeholder="IP Address"
                        value={updateIpAddress}
                        onChange={(e) => setUpdateIpAddress(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>

                    <div className="col-12 mt-3">
                      <input
                        type="text"
                        placeholder="MAC Address"
                        value={updateMacAddress}
                        onChange={(e) => setUpdateMacAddress(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>

                    <div className="col-12 mt-3">
                      <input
                        type="number"
                        placeholder="Barrier Number"
                        value={updateBarrierNo}
                        onWheel={(e) => e.target.blur()}
                        onChange={(e) => {
                          let value = e.target.value;
                          value = Math.max(0, value);
                          setUpdateBarrierNo(value);
                        }}
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                </div>

                <div className="card-footer ">
                  <Button
                    type="submit"
                    className="float-end  btn-success"
                    style={{ marginLeft: "10px" }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleUpdateBannerSubmit();
                      console.log("");
                    }}
                  >
                    Update
                  </Button>

                  <Button
                    className="float-end danger mb-3"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCancelBtn();
                      console.log("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ManageBarriers;
