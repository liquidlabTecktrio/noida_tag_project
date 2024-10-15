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

const ManageCustomers = () => {
  // ************ LOcal storrage, SessionStorrage, Coockies **********//
  //   const managerId = window.sessionStorage.getItem("_id");
  //   const orgId = window.sessionStorage.getItem("orgId");
  //   const clientId = window.sessionStorage.getItem("clientId");
  //   const clientName = window.sessionStorage.getItem("clientName");
  // ************ LOcal storrage, SessionStorrage, Coockies **********//

  // ************ ALL Table columns starts *********************//
  const customerColums = [
    {
      name: "SL No",
      selector: (row, index) => index + 1,
      width: "100px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      width: "125px",
    },

    {
      name: "Vehicle No",
      selector: (row) => row.vehicleNo,
    },

    {
      name: "Address",
      selector: (row) => row.address,
    },
    {
      name: "Phone No",
      selector: (row) => row.phoneNo,
      width: "125px",
    },
    {
      name: "Tag No",
      selector: (row) => row.tagNo,
      width: "100px",
    },
    {
      name: "Validity",
      selector: (row) => row.validity,
      width: "125px",
    },

    {
      name: "Status",
      selector: (row) => (
        <BootstrapSwitchButton
          checked={!row.blocklisted}
          onlabel="Active"
          offlabel="Inactive"
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
  const [customersDataArray, setCustomersDataArray] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  // >>>>>>>>>>>>>>>main screen variables ENDS<<<<<<<<<<<<<>>>>>>>>>>>>>//

  //******** */ All create tag reader variables **************

  const [name, setName] = useState("");
  const [vehicleNo, setVehicleNo] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [tagNo, setTagNo] = useState(null);
  const [validity, setValidity] = useState("");
  const [isBlackListed, setIsBlackListed] = useState(false);
  //******** */ All create tag reader variables ends **************//

  //******** */ All update tag reader variables **************

  const [customerId, setCustomerId] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [updateVehicleNo, setUpdateVehicleNo] = useState("");
  const [updateAddress, setUpdateAddress] = useState("");
  const [updatePhoneNo, setUpdatePhoneNo] = useState("");
  const [formError, setFormError] = useState("");
  const [updateTagNo, setUpdateTagNo] = useState(null);
  const [updateValidity, setUpdateValidity] = useState("");
  const [updateIsBlackListed, setUpdateIsBlackListed] = useState(false);
  //******** */ All update tag reader variables ends **************//

  useEffect(() => {
    getAllCustomersAPI(); //TODO: uncomment this code
  }, []);

  //************************************************************ */
  // **************** ALL API'S SECTION STARTS*******************//
  // *************************************************************/

  function getAllCustomersAPI() {
    setLoading(true);
    axios({
      url: config.baseUrl + "getAllCustomers",
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
        console.log("res", res);
        if (res.status == 200) {
          showSuccessToast(res.data.message);

          //   console.log("clientwiseEmpList: ", clientwiseEmpList);
          //   operatorOptions = clientwiseEmpList;
          console.log(res.data.data);
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
        if (err.code == "ERR_NETWORK") return;
        if (err.response.data.status == 401) {
          alert("you are unauthorized.. please login to continue");
          window.location = "/page-login";
        }
      });
  }
  function createCustomerAPI(customerObj) {
    setLoading(true);
    axios({
      url: config.baseUrl + "createCustomers",
      method: "POST",
      "Content-Type": "application/json",
      headers: {
        // token: sessionStorage.getItem("token"),
      },
      data: customerObj,
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
        if (err.code == "ERR_NETWORK") return;
        if (err.response.data.status == 401) {
          alert("you are unauthorized.. please login to continue");
          window.location = "/page-login";
        }
      });
  }

  function updateCustomerAPI(updateCustomerObj) {
    setLoading(true);
    axios({
      url: config.baseUrl + "updateCustomers",
      method: "POST",
      "Content-Type": "application/json",
      headers: {
        // token: sessionStorage.getItem("token"),
      },
      data: updateCustomerObj,
    })
      .then((res) => {
        console.log("res", res);
        if (res.data.status == 200) {
          showSuccessToast(res.data.message);
          handleCancelBtn();
          setCustomersDataArray(res.data.data ?? []);
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

  function getAvailableTagsAPI() {
    setLoading(true);
    axios({
      url: config.baseUrl + "getAvailableTags",
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
          // console.log(res.data.data)
          setAvailableTags(res.data.data)
        }
      })
  }

  function deleteCustomersAPI(deleteKey) {
    setLoading(true);
    axios({
      url: config.baseUrl + "deleteCustomers",
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
          setCustomersDataArray(res.data.data ?? []);
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

  function updateCustomerStatus(statusObj) {
    setLoading(true);
    axios({
      url: config.baseUrl + "updateCustomersStatus",
      method: "POST",
      "Content-Type": "application/json",
      headers: {
        // token: sessionStorage.getItem("token"),
      },
      data: statusObj,
    })
      .then((res) => {
        console.log("res", res.data.data);
        if (res.data.status == 200) {
          showSuccessToast(res.data.message);
          // handleCancelBtn();
          // setCustomersDataArray(res.data.data ?? []);
          // console.log(res.data.data);
          // setTagReaderDataArray(res.data.data);
          // setLoading(false);
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

  function handleStatusSwitchChange(rowId, checked) {
    let customerId = rowId;
    let serviceStatus = !checked;
    const statusObj = {
      customerId: customerId,
      status: serviceStatus,
    };
    updateCustomerStatus(statusObj);
    console.log("statusObj", statusObj);
    console.log("Switch state:", checked); // Log the state variable
  }

  const handleCancelBtn = () => {
    setShowMainScreenTable(true);
    setShowCreateSection(false);
    setShowUpdateSection(false);
  };

  const handleCreateSection = () => {
    getAvailableTagsAPI()
    setName('')
    setTagNo('')
    setVehicleNo('')
    setPhoneNo('')
    setAddress('')
    setValidity('')
    setFormError('')
    setShowMainScreenTable(true);
    setShowCreateSection(true);
    setShowUpdateSection(false);
  };
  const handleUpdateSection = (row) => {
    getAvailableTagsAPI()
    setFormError('')
    setShowMainScreenTable(true);
    setShowCreateSection(false);
    setShowUpdateSection(true);

    setUpdateName(row.name);
    setUpdateVehicleNo(row.vehicleNo);
    setUpdateAddress(row.address);
    setUpdatePhoneNo(row.phoneNo);
    setUpdateTagNo(row.tagNo);
    setCustomerId(row._id);
    console.log('date validiry', row.validity)
    setUpdateValidity(convertDateFormat(row.validity));
    setUpdateIsBlackListed(row.blocklisted);
  };

  function convertDateFormat(dateString) {
    // Split the date string by hyphens
    const [day, month, year] = dateString.split('-');

    // Return in YYYY-MM-DD format
    return `${year}-${month}-${day}`;
  }

  // Example usage
  const originalDate = "05-03-2024";
  const formattedDate = convertDateFormat(originalDate);
  console.log(formattedDate); // Output: "2024-05-03"

  const handleCreateSubmit = () => {
    setLoading(true)
    if (name === '' || name == null) { setFormError('Customer Name Cannot be Empty') }
    else if (vehicleNo === '' || vehicleNo === null) { setFormError('Vehicle Number Cannot be Empty') }
    else if (address === '' || address === null) { setFormError('Address Cannot be Empty') }
    else if (phoneNo == '' || phoneNo === null) { setFormError('Phone Number Cannot be Empty') }
    else if (tagNo === '' || tagNo === null) { setFormError('Tag Number Cannot be Empty') }
    else if (validity === '' || validity === null) { setFormError('Validity Cannot be Empty') }
    else {
      setFormError("")
      const customerObj = {
        name: name,
        vehicleNo: vehicleNo,
        address: address,
        phoneNo: phoneNo,
        tagNo: tagNo,
        validity: validity.split("-").reverse().join("-"),
        blocklisted: isBlackListed,
      };
      console.log("customerObj: ", customerObj);

      createCustomerAPI(customerObj);
    }

    // getAllCustomersAPI()
    window.location.reload()
    setLoading(false)
  };

  const handleUpdateBannerSubmit = () => {
    if (updateName === '' || updateName == null) { setFormError('Customer Name Cannot be Empty') }
    else if (updateVehicleNo === '' || updateVehicleNo === null) { setFormError('Vehicle Number Cannot be Empty') }
    else if (updateAddress === '' || updateAddress === null) { setFormError('Address Cannot be Empty') }
    else if (updatePhoneNo == '' || updatePhoneNo === null) { setFormError('Phone Number Cannot be Empty') }
    else if (updateTagNo === '' || updateTagNo === null) { setFormError('Tag Number Cannot be Empty') }
    else if (updateValidity === '' || updateValidity === null) { setFormError('Validity Cannot be Empty') }
    else {
      setFormError("")
      const updateCustomerObj = {
        _id: customerId,
        name: updateName,
        vehicleNo: updateVehicleNo,
        address: updateAddress,
        phoneNo: updatePhoneNo,
        tagNo: updateTagNo,
        validity: updateValidity.split("-").reverse().join("-"),
        blocklisted: updateIsBlackListed,
      };
      console.log("customerObj: ", updateCustomerObj);

      updateCustomerAPI(updateCustomerObj);
    }
  };

  const handleDelete = (row) => {
    const deleteKey = {
      _id: row._id,
    };

    deleteCustomersAPI(deleteKey);
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
              <h2>Current Customers</h2>
              <Button onClick={handleCreateSection}>Create Customer</Button>
            </div>
            <div className="card-body">
              <DataTable
                columns={customerColums}
                data={customersDataArray}
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
                  <h4>Create New Customer</h4>
                </div>

                <div className="card-body">
                  <div className="row d-flex">

                    {formError ? <div className="col-12">
                      <p className=" form-control-error" >{formError}</p>

                    </div> : <div></div>}
                    <div className="col-12">
                      <input

                        type="text"
                        placeholder="Customer Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>

                    <div className="col-12 mt-3">
                      <input
                        type="text"
                        placeholder="Vehicle Number"
                        value={vehicleNo}
                        onChange={(e) => setVehicleNo(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>

                    <div className="col-12 mt-3">
                      <textarea
                        type="text"
                        placeholder=" Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="form-control"
                      ></textarea>
                    </div>

                    <div className="col-12 mt-3">
                      <input
                        type="text"
                        placeholder="Phone Number"
                        value={phoneNo}
                        onChange={(e) => setPhoneNo(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>

                    <div className="col-12 mt-3">
                      <select
                        // type="text"
                        // placeholder="Tag Number"
                        // value={tagNo}
                        onChange={(e) => setTagNo(e.target.value)}
                        className="form-control"
                      >
                        <option></option>
                        {availableTags.map((tag, key) => {
                          return (
                            <option>
                              {tag.tagNo}
                            </option>
                          )

                        })}
                      </select>
                    </div>

                    <div className="col-12 mt-3">
                      <input
                        type="date"
                        placeholder="Validity"
                        value={validity}
                        onChange={(e) => setValidity(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>

                    <div className="col-md-4 ">
                      <p className="mb-0">Blocklist</p>
                      <BootstrapSwitchButton
                        checked={isBlackListed}
                        onlabel="Yes"
                        offlabel="No"
                        offstyle="dark"
                        onstyle="success"
                        width="100"
                        // size="lg"
                        // style="width:100px"
                        onChange={(checked) => {
                          console.log("blacklist switch", checked);
                          setIsBlackListed(checked);
                        }}
                      />
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
                  <h4>Edit Customer</h4>
                </div>
                <div className="card-body">
                  {formError ? <div className="col-12">
                    <p className=" form-control-error" >{formError}</p>

                  </div> : <div></div>}
                  <div className="row d-flex">
                    <div className="col-12">
                      <input
                        required
                        type="text"
                        placeholder="Customer Name"
                        value={updateName}
                        onChange={(e) => setUpdateName(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>

                    <div className="col-12 mt-3">
                      <input
                        required
                        type="text"
                        placeholder="Vehicle Number"
                        value={updateVehicleNo}
                        onChange={(e) => setUpdateVehicleNo(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>

                    <div className="col-12 mt-3">
                      <textarea
                        required
                        type="text"
                        placeholder=" Address"
                        value={updateAddress}
                        onChange={(e) => setUpdateAddress(e.target.value)}
                        className="form-control"
                      ></textarea>
                    </div>

                    <div className="col-12 mt-3">
                      <input
                        required
                        type="text"
                        placeholder="Phone Number"
                        value={updatePhoneNo}
                        onChange={(e) => setUpdatePhoneNo(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>

                    <div className="col-12 mt-3">


                      <select
                        // type="text"
                        // placeholder="Tag Number"
                        // value={tagNo}
                        onChange={(e) => setUpdateTagNo(e.target.value)}
                        className="form-control"
                      >
                        <option >
                          {updateTagNo}
                        </option>
                        {availableTags.map((tag, key) => {
                          return (
                            <option>
                              {tag.tagNo}
                            </option>
                          )

                        })}
                      </select>

                    </div>

                    <div className="col-12 mt-3">
                      <input
                        required
                        type="date"
                        placeholder="Validity"
                        // value={convertDateFormat(updateValidity)}
                        value={updateValidity}
                        onChange={(e) => setUpdateValidity(e.target.value)}
                        className="form-control"
                      ></input>
                    </div>

                    <div className="col-md-4 ">
                      <p className="mb-0">Blocklist</p>
                      <BootstrapSwitchButton
                        checked={updateIsBlackListed}
                        onlabel="Yes"
                        offlabel="No"
                        offstyle="dark"
                        onstyle="success"
                        width="100"
                        // size="lg"
                        // style="width:100px"
                        onChange={(checked) => {
                          console.log("blacklist switch", checked);
                          setUpdateIsBlackListed(checked);
                        }}
                      />
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

export default ManageCustomers;
