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

const ManageTagReader = () => {
  // ************ LOcal storrage, SessionStorrage, Coockies **********//
  //   const managerId = window.sessionStorage.getItem("_id");
  //   const orgId = window.sessionStorage.getItem("orgId");
  //   const clientId = window.sessionStorage.getItem("clientId");
  //   const clientName = window.sessionStorage.getItem("clientName");
  // ************ LOcal storrage, SessionStorrage, Coockies **********//

  // ************ ALL Table columns starts *********************//
  const tagReaderColumn = [
    {
      name: "SL No",
      selector: (row, i) => i + 1,
      width: "100px",
    },

    {
      name: "Tag Reader Name",
      selector: (row) => row.readerName,
    },

    {
      name: "IP Address",
      selector: (row) => row.ipAddress ?? "",
    },
    {
      name: "MAC Address",
      selector: (row) => row.macAddress ?? "",
    },
    {
      name: "Status",
      selector: (row) => (
        <BootstrapSwitchButton
          checked={row.isService}
          onlabel="Published"
          offlabel="Saved"
          width={100}
          onstyle="success"
          offstyle="primary"
          disabled={row.isService}
          onChange={(checked) => handleStatusSwitchChange(row._id, checked)}
        />
      ),
    },
    {
      name: "Edit",
      cell: (row) => (
        <FontAwesomeIcon
          style={{ cursor: "pointer" }}
          onClick={(e) => handleUpdateTagReaderSection(row)}
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
  const [tagReaderDataArray, setTagReaderDataArray] = useState([]);

  // >>>>>>>>>>>>>>>main screen variables ENDS<<<<<<<<<<<<<>>>>>>>>>>>>>//

  //******** */ All create tag reader variables **************

  const [readerName, setReaderName] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [macAddress, setMacAddress] = useState("");
  const [readerNo, setReaderNo] = useState("");
  //******** */ All create tag reader variables ends **************//

  //******** */ All update tag reader variables **************
  const [updateRowID, setUpdateRowID] = useState("");
  const [updateReaderName, setUpdateReaderName] = useState("");
  const [updateIpAddress, setUpdateIpAddress] = useState("");
  const [updateMacAddress, setUpdateMacAddress] = useState("");
  const [updateReaderNo, setUpdateReaderNo] = useState("");
  const [updateIsService, setUpdateIsService] = useState(false);
  //******** */ All update tag reader variables ends **************//

  useEffect(() => {
    getAllTagReadersAPI(); //TODO: uncomment this code
  }, []);

  //************************************************************ */
  // **************** ALL API'S SECTION STARTS*******************//
  // *************************************************************/

  function getAllTagReadersAPI() {
    setLoading(true);
    axios({
      url: config.baseUrl + "getAllTagReaders",
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
          setTagReaderDataArray(res.data.data);
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

  function createTagReaderAPI(tagReaderObj) {
    setLoading(true);
    axios({
      url: config.baseUrl + "createTagReader",
      method: "POST",
      "Content-Type": "application/json",
      headers: {
        // token: sessionStorage.getItem("token"),
      },
      data: tagReaderObj,
    })
      .then((res) => {
        console.log("res1111", res);
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

  function updateTagReadersAPI(updateTagReadersObj) {
    setLoading(true);
    axios({
      url: config.baseUrl + "updateTagReaders",
      method: "POST",
      "Content-Type": "application/json",
      headers: {
        // token: sessionStorage.getItem("token"),
      },
      data: updateTagReadersObj,
    })
      .then((res) => {
        console.log("res", res);
        if (res.data.status == 200) {
          showSuccessToast(res.data.message);
          handleCancelBtn();
          setTagReaderDataArray(res.data.data ?? []);
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

  function deleteTagReadersAPI(deleteKey) {
    setLoading(true);
    axios({
      url: config.baseUrl + "deletetagReaders",
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
          setTagReaderDataArray(res.data.data ?? []);
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

  function updateTagReaderStatus(statusObj) {
    setLoading(true);
    axios({
      url: config.baseUrl + "updateTagReaderStatus",
      method: "POST",
      "Content-Type": "application/json",
      headers: {
        // token: sessionStorage.getItem("token"),
      },
      data: statusObj,
    })
      .then((res) => {
        console.log("res", res);
        if (res.data.status == 200) {
          showSuccessToast(res.data.message);
          handleCancelBtn();
          setTagReaderDataArray(res.data.data ?? []);
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

  //************************************************************ */
  // **************** ALL API'S SECTION ENDS *******************//
  // *************************************************************/

  const handleCreateTagSection = () => {
    setShowMainScreenTable(true);
    setShowCreateSection(true);
    setShowUpdateSection(false);
  };

  const handleCancelBtn = () => {
    setShowMainScreenTable(true);
    setShowCreateSection(false);
    setShowUpdateSection(false);
  };

  const handleUpdateTagReaderSection = (row) => {
    setShowMainScreenTable(true);
    setShowCreateSection(false);
    setShowUpdateSection(true);

    setUpdateRowID(row._id);
    setUpdateReaderName(row.readerName);
    setUpdateIpAddress(row.ipAddress);
    setUpdateMacAddress(row.macAddress);
    setUpdateReaderNo(row.readerNo);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "readerNo") {
      setReaderNo(value);
    } else if (name === "updateReaderNo") {
      setUpdateReaderNo(value);
    }
  };

  const handleCreateTagReaderSubmit = () => {
    const tagReaderObj = {
      readerName: readerName,
      ipAddress: ipAddress,
      macAddress: macAddress,
      readerNo: readerNo,
    };
    console.log("tagReaderObj: ", tagReaderObj);
    createTagReaderAPI(tagReaderObj);
  };

  const handleUpdateTagReaderSubmit = () => {
    const updateTagReadersObj = {
      _id: updateRowID,
      readerName: updateReaderName,
      ipAddress: updateIpAddress,
      macAddress: updateMacAddress,
      readerNo: updateReaderNo,
    };

    updateTagReadersAPI(updateTagReadersObj);
  };

  const handleDelete = (row) => {
    const deleteKey = {
      _id: row._id,
    };

    deleteTagReadersAPI(deleteKey);
  };

  function handleStatusSwitchChange(rowId, checked) {
    let tagreaderId = rowId;
    let serviceStatus = checked;
    const statusObj = {
      tagreaderId: tagreaderId,
      status: serviceStatus,
    };
    // updateTagReaderStatus(statusObj);
    console.log("statusObj", statusObj);
    console.log("Switch state:", checked); // Log the state variable
  }

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
              <h2>Current Tag Readers</h2>
              <Button onClick={handleCreateTagSection}>
                Create Tag Reader
              </Button>
            </div>
            <div className="card-body">
              <DataTable
                columns={tagReaderColumn}
                data={tagReaderDataArray}
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
            <form>
              <div className="card ">
                <div className="card-header">
                  <h4>Create Tag Reader</h4>
                </div>
                <div className="card-body">
                  <div className="row d-flex">
                    <div className="col-12">
                      <input
                        type="text"
                        placeholder="Reader Name"
                        value={readerName}
                        onChange={(e) => setReaderName(e.target.value)}
                        className="form-control"
                        required={true}
                      ></input>
                    </div>
                    <div className="col-12 mt-3">
                      <input
                        type="text"
                        placeholder="IP Address"
                        required
                        value={ipAddress}
                        onChange={(e) => setIpAddress(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                    <div className="col-12 mt-3">
                      <input
                        type="text"
                        placeholder="MAC Address"
                        required
                        value={macAddress}
                        onChange={(e) => setMacAddress(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                    <div className="col-12 mt-3">
                      <input
                        type="number"
                        name="readerNo"
                        placeholder="Reader Number"
                        required
                        value={readerNo}
                        onWheel={(e) => e.target.blur()}
                        onChange={handleInputChange}
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                </div>
                <div className="card-footer ">
                  <Button
                    type="submit"
                    className="float-end "
                    style={{ marginLeft: "10px" }}
                    onClick={(e) => {
                      console.log("e: ", e);
                      e.preventDefault();
                      handleCreateTagReaderSubmit();
                    }}
                  >
                    Create
                  </Button>

                  <Button
                    className="float-end danger mb-3"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCancelBtn();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
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
            <form>
              <div className="card ">
                <div className="card-header">
                  <h4>Edit Tag Reader</h4>
                </div>
                <div className="card-body">
                  <div className="row d-flex">
                    <div className="col-12">
                      <input
                        type="text"
                        placeholder="Reader Name"
                        value={updateReaderName}
                        onChange={(e) => setUpdateReaderName(e.target.value)}
                        className="form-control"
                        required={true}
                      ></input>
                    </div>
                    <div className="col-12 mt-3">
                      <input
                        type="text"
                        placeholder="IP Address"
                        required
                        value={updateIpAddress}
                        onChange={(e) => setUpdateIpAddress(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                    <div className="col-12 mt-3">
                      <input
                        type="text"
                        placeholder="MAC Address"
                        required
                        value={updateMacAddress}
                        onChange={(e) => setUpdateMacAddress(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                    <div className="col-12 mt-3">
                      <input
                        type="number"
                        name="updateReaderNo"
                        placeholder="Reader Number"
                        required
                        value={updateReaderNo}
                        onWheel={(e) => e.target.blur()}
                        onChange={handleInputChange}
                        className="form-control"
                      ></input>
                    </div>
                  </div>
                </div>
                <div className="card-footer ">
                  <Button
                    type="submit"
                    className="float-end "
                    style={{ marginLeft: "10px" }}
                    onClick={(e) => {
                      console.log("e: ", e);
                      e.preventDefault();
                      handleUpdateTagReaderSubmit();
                    }}
                  >
                    Update
                  </Button>

                  <Button
                    className="float-end danger mb-3"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCancelBtn();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ManageTagReader;
