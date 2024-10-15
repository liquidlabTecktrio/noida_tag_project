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

const ManageTags = () => {
  // ************ LOcal storrage, SessionStorrage, Coockies **********//
  //   const managerId = window.sessionStorage.getItem("_id");
  //   const orgId = window.sessionStorage.getItem("orgId");
  //   const clientId = window.sessionStorage.getItem("clientId");
  //   const clientName = window.sessionStorage.getItem("clientName");
  // ************ LOcal storrage, SessionStorrage, Coockies **********//

  // ************ ALL Table columns starts *********************//
  const tagsColumns = [
    {
      name: "Tag NO",
      selector: (row) => row.tagNo,
    },

    {
      name: "Tag EPC",
      selector: (row) => row.epcCode,
    },

    // {
    //   name: "BarrierID",
    //   selector: (row) => row.plateNumber,
    // },

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
  const [tagDataArray, setTagDataArray] = useState([]);

  // >>>>>>>>>>>>>>>main screen variables ENDS<<<<<<<<<<<<<>>>>>>>>>>>>>//

  //******** */ All create tag reader variables **************

  const [tagNo, setTagNo] = useState("");
  const [tagEPC, setTagEPC] = useState("");
  //   const [macAddress, setMacAddress] = useState("");
  //   const [readerNo, setReaderNo] = useState(0);

  //******** */ All create tag reader variables **************
  const [updateRowID, setUpdateRowID] = useState("");
  const [updateTagNo, setUpdateTagNo] = useState("");
  const [updateTagEPC, setUpdateTagEPC] = useState("");

  //******** */ All create tag reader variables ends **************//

  useEffect(() => {
    getAllTagsAPI(); //TODO: uncomment this code
  }, []);

  //************************************************************ */
  // **************** ALL API'S SECTION STARTS*******************//
  // *************************************************************/

  function getAllTagsAPI() {
    setLoading(true);
    axios({
      url: config.baseUrl + "getAllTags",
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
          setTagDataArray(res.data.data);
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

  function createTagsAPI(tagObj) {
    setLoading(true);
    axios({
      url: config.baseUrl + "createTags",
      method: "POST",
      "Content-Type": "application/json",
      headers: {
        token: sessionStorage.getItem("token"),
      },
      data: tagObj,
    })
      .then((res) => {
        console.log("res", res);
        if (res.data.status == 200) {
          showSuccessToast(res.data.message);
          handleCancelBtn();

          console.log(res.data.data);
          setTagDataArray(res.data.data);
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

  function updateTagsAPI(updateTagObj) {
    setLoading(true);
    axios({
      url: config.baseUrl + "updateTags",
      method: "POST",
      "Content-Type": "application/json",
      headers: {
        token: sessionStorage.getItem("token"),
      },
      data: updateTagObj,
    })
      .then((res) => {
        console.log("res", res);
        if (res.data.status == 200) {
          showSuccessToast(res.data.message);
          handleCancelBtn();
          setTagDataArray(res.data.data ?? []);
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

  function deleteTagsAPI(deleteKey) {
    setLoading(true);
    axios({
      url: config.baseUrl + "deleteTags",
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
          setTagDataArray(res.data.data ?? []);
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

    setUpdateRowID(row._id);
    setUpdateTagNo(row.tagNo);
    setUpdateTagEPC(row.epcCode);
  };

  const handleCreateSubmit = () => {
    const tagObj = {
      tagNo: tagNo,
      epcCode: tagEPC,
    };
    createTagsAPI(tagObj);
  };

  const handleUpdateSubmit = () => {
    const updateTagObj = {
      _id: updateRowID,
      tagNo: updateTagNo,
      epcCode: updateTagEPC,
    };
    updateTagsAPI(updateTagObj);
  };

  const handleDelete = (row) => {
    const deleteKey = {
      _id: row._id,
    };

    deleteTagsAPI(deleteKey);
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
              <h2>Current Tags</h2>
              <Button onClick={handleCreateSection}>Create New Tag</Button>
            </div>
            <div className="card-body">
              <DataTable
                columns={tagsColumns}
                data={tagDataArray}
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
                  <h4>Create New Tag</h4>
                </div>

                <div className="card-body">
                  <div className="row d-flex">
                    <div className="col-12">
                      <input
                        type="number"
                        placeholder="Tag Number"
                        onWheel={(e) => e.target.blur()}
                        value={tagNo}
                        onChange={(e) => setTagNo(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                    <div className="col-12 mt-3">
                      <input
                        type="text"
                        placeholder="Tag EPC code"
                        value={tagEPC}
                        onChange={(e) => setTagEPC(e.target.value)}
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
                      handleCreateSubmit();
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
                  <h4>Edit Tag</h4>
                </div>

                <div className="card-body">
                  <div className="row d-flex">
                    <div className="col-12">
                      <input
                        type="number"
                        placeholder="Tag Number"
                        onWheel={(e) => e.target.blur()}
                        value={updateTagNo}
                        onChange={(e) => setUpdateTagNo(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>
                    <div className="col-12 mt-3">
                      <input
                        type="text"
                        placeholder="Tag EPC code"
                        value={updateTagEPC}
                        onChange={(e) => setUpdateTagEPC(e.target.value)}
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
                      handleUpdateSubmit();
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

export default ManageTags;
