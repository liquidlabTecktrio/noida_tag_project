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

const ManageTerminals = () => {
  // ************ LOcal storrage, SessionStorrage, Coockies **********//
  //   const managerId = window.sessionStorage.getItem("_id");
  //   const orgId = window.sessionStorage.getItem("orgId");
  //   const clientId = window.sessionStorage.getItem("clientId");
  //   const clientName = window.sessionStorage.getItem("clientName");
  const token = window.sessionStorage.getItem("token");
  // ************ LOcal storrage, SessionStorrage, Coockies **********//

  // ************ ALL Table columns starts *********************//
  const terminalsColumn = [
    {
      name: "Type",
      selector: (row) => row.type,
      width: "100px",
    },
    {
      name: "Terminal Name",
      selector: (row) => row.terminalName,
    },
    {
      name: "Tag Reader",
      // selector: (row) => row.tagReaderId,
      selector: (row) =>
        tagReaderDataArray.reduce((acc, item) => {
          if (item._id == row.tagReaderId) {
            acc = item.readerName;
          }
          return acc;
        }, null),
    },

    {
      name: "Barrier Name",
      // selector: (row) => row.barrierId,
      selector: (row) =>
        barrierDataArray.reduce((acc, item) => {
          if (item._id == row.barrierId) {
            acc = item.barrierName;
          }
          return acc;
        }, null),
    },
    {
      name: "Status",
      selector: (row) => (
        <BootstrapSwitchButton
          checked={row.isService}
          offlabel="Inactive"
          onlabel="Active"
          width={100}
          onstyle="success"
          offstyle="primary"
          onChange={(checked) => handleStatusSwitchChange(row._id, checked)}
        />
      ),
    },
    {
      name: "Edit",
      cell: (row) => (
        <FontAwesomeIcon
          style={{ cursor: "pointer" }}
          onClick={() => handleUpdateSection(row)}
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
  const [showCreateTerminalSection, setShowCreateTerminalSection] =
    useState(false);
  const [showUpdateTerminalSection, setShowUpdateTerminalSection] =
    useState(false);
  const [terminalsDataArray, setTerminalsDataArray] = useState([]);
  const [tagReaderDataArray, setTagReaderDataArray] = useState([]);
  const [barrierDataArray, setBarrierDataArray] = useState([]);

  const [readerOptions, setReaderOptions] = useState([]);
  const [barrierOptions, setBarrierOptions] = useState([]);

  // >>>>>>>>>>>>>>>main screen variables ENDS<<<<<<<<<<<<<>>>>>>>>>>>>>//

  //******** */ All create terminals variables **************
  const [type, setType] = useState(null);
  const [tagReaderID, setTagReaderID] = useState("");
  const [terminalName, setTerminalName] = useState("");
  const [barrierID, setBarrierID] = useState("");
  const [isService, setIsService] = useState(false);
  const typesOptions = [
    { value: "entry", label: "ENTRY" },
    { value: "exit", label: "EXIT" },
  ];

  //******** */ All update terminals variables **************
  const [rowData, setRowData] = useState({});
  const [updateRowID, setUpdateRowID] = useState(null);
  const [updateType, setUpdateType] = useState("entry");
  const [updateTerminalName, setUpdateTerminalName] = useState("");
  const [updateTagReaderID, setUpdateTagReaderID] = useState(null);
  const [updateBarrierID, setUpdateBarrierID] = useState(null);
  const [updateIsService, setUpdateIsService] = useState(false);

  //******** */ All create terminals variables ends **************//

  useEffect(() => {
    getAllBarriersAPI();
    getAllTagReadersAPI();
    getAllTerminalsAPI(); //TODO: uncomment this code
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
      headers: {
        token: sessionStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log("res", res.data.data);
        if (res.status == 200) {
          // showSuccessToast(res.data.message);
          setTagReaderDataArray(res.data.data);
          if (
            res.data.data != null &&
            res.data.data != undefined &&
            res.data.data.length > 0
          ) {
            const readerOptionsArray = res.data.data.map((reader) => {
              return {
                value: reader._id,
                label: reader.readerName,
              };
            });
            setReaderOptions(readerOptionsArray);
          }

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

  function getAllBarriersAPI() {
    setLoading(true);
    axios({
      url: config.baseUrl + "getAllBarriers",
      method: "GET",
      "Content-Type": "application/json",
      headers: {
        token: sessionStorage.getItem("token"),
      },
    })
      .then((res) => {
        console.log("res", res.data.data);
        if (res.status == 200) {
          if (
            res.data.data != null &&
            res.data.data != undefined &&
            res.data.data.length > 0
          ) {
            const barrierOptionsArray = res.data.data.map((barrier) => {
              return {
                value: barrier._id,
                label: barrier.barrierName,
              };
            });

            setBarrierOptions(barrierOptionsArray);
          }
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

  function getAllTerminalsAPI() {
    setLoading(true);
    axios({
      url: config.baseUrl + "getAllTerminals",
      method: "GET",
      "Content-Type": "application/json",
      // headers: {
      //   token,
      // },
      //   data: terminalObj
    })
      .then((res) => {
        console.log("res", res.data.data);
        if (res.status == 200) {
          showSuccessToast(res.data.message);

          //   console.log("clientwiseEmpList: ", clientwiseEmpList);
          //   operatorOptions = clientwiseEmpList;
          console.log(res.data.data);
          setTerminalsDataArray(res.data.data);
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

  function createTerminalsAPI(terminalObj) {
    setLoading(true);
    axios({
      url: config.baseUrl + "createTerminal",
      method: "POST",
      "Content-Type": "application/json",
      headers: {
        token,
      },
      data: terminalObj,
    })
      .then((res) => {
        console.log("res", res.data.data);
        if (res.status == 200) {
          showSuccessToast(res.data.message);

          //   console.log("clientwiseEmpList: ", clientwiseEmpList);
          //   operatorOptions = clientwiseEmpList;
          console.log(res.data.data);
          setTerminalsDataArray(res.data.data);
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

  function updateTerminalAPI(updateTerminalObj) {
    setLoading(true);
    axios({
      url: config.baseUrl + "updateTerminal",
      method: "POST",
      "Content-Type": "application/json",
      headers: {
        // token: sessionStorage.getItem("token"),
      },
      data: updateTerminalObj,
    })
      .then((res) => {
        console.log("res", res);
        if (res.data.status == 200) {
          showSuccessToast(res.data.message);
          handleCancelBtn();
          setTerminalsDataArray(res.data.data ?? []);
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

  function deleteTerminalAPI(deleteKey) {
    setLoading(true);
    axios({
      url: config.baseUrl + "deleteTerminals",
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
          setTerminalsDataArray(res.data.data ?? []);
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

  function updateTerminalStatus(statusObj) {
    console.log("statusObj: ", statusObj);
    setLoading(true);
    axios({
      url: config.baseUrl + "updateTerminalStatus",
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
          setTerminalsDataArray(res.data.data ?? []);
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
        console.log(err.code);

        if (err.response.data.status == 401) {
          alert("you are unauthorized.. please login to continue");
          window.location = "/page-login";
        }
      });
  }

  //************************************************************ */
  // **************** ALL API'S SECTION ENDS *******************//
  // *************************************************************/

  // >>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  const handleOpenCreateSection = () => {
    setShowMainScreenTable(true);
    setShowUpdateTerminalSection(false);
    setShowCreateTerminalSection(true);
  };

  const handleCancelBtn = () => {
    setShowMainScreenTable(true);
    setShowUpdateTerminalSection(false);
    setShowCreateTerminalSection(false);
  };

  const handleUpdateSection = (row) => {
    console.log("row: ", row);
    // setUpdateType({value:row.type});
    const updateSelectedType = typesOptions.find(
      (option) => option.value == row.type
    );
    setUpdateType(updateSelectedType);

    setRowData(row);
    setShowMainScreenTable(true);
    setShowCreateTerminalSection(false);
    setShowUpdateTerminalSection(true);

    setUpdateRowID(row._id);

    const updateSelectedBarrierName = barrierDataArray.map((barrier) => {
      if (barrier._id == row.barrierId) {
        return { value: barrier._id, label: barrier.barrierName };
      }
    });

    const updateSelectedTagReaderName = tagReaderDataArray.map((reader) => {
      if (reader._id == row.tagReaderId) {
        return { value: reader._id, label: reader.readerName };
      }
    });
    setUpdateTerminalName(row.terminalName);
    setUpdateTagReaderID(updateSelectedTagReaderName);

    //  updateSelectedType.length>0?
    //  setUpdateType(updateSelectedType[0]):setUpdateType(null);
    // setUpdateType( { value: "entry", label: "ENTRY" },);

    setUpdateBarrierID(updateSelectedBarrierName);
    setUpdateIsService(row.isService);
  };

  const handleCreateTerminalSubmit = () => {
    const terminalObj = {
      type: type,
      terminalName: terminalName,
      tagReaderId: tagReaderID,
      barrierId: barrierID,
      isService: isService,
    };
    console.log("terminalObj: ", terminalObj);

    createTerminalsAPI(terminalObj);
  };

  const handleUpdateTerminalSubmit = () => {
    const updateTerminalObj = {
      _id: updateRowID,
      terminalName: updateTerminalName,
      type: updateType.value,
      tagReaderId: updateTagReaderID.value,
      barrierId: updateBarrierID.value,
      isService: updateIsService,
    };
    console.log("UPDATED", updateTerminalObj);
    updateTerminalAPI(updateTerminalObj);
  };

  const handleDelete = (row) => {
    const deleteKey = {
      _id: row._id,
    };

    deleteTerminalAPI(deleteKey);
  };

  function handleStatusSwitchChange(rowId, checked) {
    let terminalId = rowId;
    let serviceStatus = checked;
    const statusObj = {
      terminalId: terminalId,
      status: serviceStatus,
    };
    updateTerminalStatus(statusObj);
    setIsService(serviceStatus);
    console.log("statusObj", statusObj);
    console.log("Switch state:", checked); // Log the state variable
  }

  return (
    <div className="col-12">
      <ToastContainer />
      <div className="row d-flex">
        {showMainScreenTable ? (
          <div
            className={` ${
              (showMainScreenTable && showCreateTerminalSection) ||
              (showMainScreenTable && showUpdateTerminalSection)
                ? "col-7"
                : "col-12"
            }`}
          >
            <div className="card">
              <div className="card-header">
                <h2>Current Terminals</h2>
                <Button onClick={handleOpenCreateSection}>
                  Create Terminals
                </Button>
              </div>
              <div className="card-body">
                <DataTable
                  columns={terminalsColumn}
                  data={terminalsDataArray}
                  customStyles={tableCustomStyles}
                  pagination
                  selectableRowsHighlight
                />
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}

        {showCreateTerminalSection ? (
          <div
            className={` ${
              showMainScreenTable && showCreateTerminalSection
                ? "col-5"
                : "none"
            }`}
          >
            <form>
              <div className={`card `}>
                <div className="card-header">
                  <h2>Create Terminal</h2>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <label>Select Terminal Type</label>
                      <Select
                        options={typesOptions}
                        required
                        onChange={(e) => setType(e.value)}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Enter Terminal Name</label>
                      <input
                        type="text"
                        placeholder="Terminal Name"
                        value={terminalName}
                        onChange={(e) => setTerminalName(e.target.value)}
                        className="form-control"
                        style={{ height: "38px" }}
                      ></input>
                    </div>

                    <div className="col-md-6">
                      <label>Select Tag Reader</label>
                      <Select
                        options={readerOptions}
                        required
                        onChange={(e) => setTagReaderID(e.value)}
                      />
                    </div>

                    <div className="col-md-6">
                      <label>Select Barrier</label>
                      <Select
                        options={barrierOptions}
                        required
                        onChange={(e) => setBarrierID(e.value)}
                      />
                    </div>

                    <div className="col-md-4 ">
                      <p className="mb-0">IS In Service</p>
                      <BootstrapSwitchButton
                        checked={isService}
                        onlabel="Yes"
                        offlabel="No"
                        offstyle="dark"
                        onstyle="success"
                        width="100"
                        // size="lg"
                        // style="width:100px"
                        onChange={(e) => {
                          // console.log(e);
                          setIsService(e);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <Button
                    type="submit"
                    className="float-end  btn-success"
                    style={{ marginLeft: "10px" }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleCreateTerminalSubmit();
                      console.log(type);
                    }}
                  >
                    Create
                  </Button>

                  <Button
                    className="float-end danger"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCancelBtn();
                      console.log(type);
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

        {showUpdateTerminalSection ? (
          <div
            className={` ${
              showMainScreenTable && showUpdateTerminalSection
                ? "col-5"
                : "none"
            }`}
          >
            <form>
              <div className={`card `}>
                <div className="card-header">
                  <h2>Edit Terminal</h2>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <label>Select Terminal Type</label>
                      <Select
                        options={typesOptions}
                        required
                        value={updateType}
                        onChange={(e) => {
                          setUpdateType({ value: e.value, label: e.label });
                          console.log("selectedValue", e.value);
                        }}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label>Edit Terminal Name</label>
                      <input
                        type="text"
                        placeholder="Terminal Name"
                        value={updateTerminalName}
                        onChange={(e) => setUpdateTerminalName(e.target.value)}
                        className="form-control"
                        style={{ height: "38px" }}
                      ></input>
                    </div>

                    <div className="col-md-6">
                      <label>Select Tag Reader</label>
                      <Select
                        options={readerOptions}
                        required
                        value={updateTagReaderID}
                        onChange={(e) => {
                          setUpdateTagReaderID({
                            value: e.value,
                            label: e.label,
                          });
                        }}
                      />
                    </div>

                    <div className="col-md-6">
                      <label>Select Barrier</label>
                      <Select
                        options={barrierOptions}
                        required
                        value={updateBarrierID}
                        onChange={(e) => {
                          setUpdateBarrierID({
                            value: e.value,
                            label: e.label,
                          });
                        }}
                      />
                    </div>

                    <div className="col-md-4 ">
                      <p className="mb-0">IS In Service</p>
                      <BootstrapSwitchButton
                        checked={updateIsService}
                        onlabel="Yes"
                        offlabel="No"
                        offstyle="dark"
                        onstyle="success"
                        width="100"
                        // size="lg"
                        // style="width:100px"
                        onChange={(e) => {
                          console.log(e);
                          setUpdateIsService(e);
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <Button
                    type="submit"
                    className="float-end  btn-success"
                    style={{ marginLeft: "10px" }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleUpdateTerminalSubmit();
                      console.log(type);
                    }}
                  >
                    Update
                  </Button>

                  <Button
                    className="float-end danger"
                    onClick={(e) => {
                      e.preventDefault();
                      handleCancelBtn();
                      console.log(type);
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

export default ManageTerminals;
