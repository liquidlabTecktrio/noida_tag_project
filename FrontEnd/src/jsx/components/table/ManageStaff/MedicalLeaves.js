import axios from "axios";
import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from "react";
import { Alert, Button, Form } from "react-bootstrap";
// import ReactDOM from "react-dom";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import config from "../../../../services/config";
// import Picker from 'react-month-picker'
// import "react-month-picker/css/month-picker.css";
// import ReactDatePicker from "react-datepicker";
// import TextField from '@mui/material/TextField';
import BootstrapSwitchButton from "bootstrap-switch-button-react";
import { DatePicker } from "@material-ui/pickers";
import StaticDatePicker from "../../../components/MonthPicker";
import zIndex from "@material-ui/core/styles/zIndex";
import { Router } from "react-router-dom";
import GetMonthYear from "../../../../store/actions/MonthPickerAction";
import SignaturePad from 'react-signature-canvas';
// import SignatureCanvas from "./SignaturePad";
// import SignaturePad from "./SignaturePad";
import styles from "../../../../css/style.css";
import Modal from "react-bootstrap/Modal";
// import Modal from 'react-modal';
import { Input } from "@material-ui/core";
import TextField from '@mui/material/TextField';
import { faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SweetAlert from "react-bootstrap-sweetalert";
import { ToastContainer, toast } from 'react-toastify';

const tableCustomStyles = {
    headCells: {
        style: {
            fontSize: "18px",
            fontWeight: "bold",
            color: "#f8857e",

            backgroundColor: "#fef3f2",
        },
    },
};

const otherStyles = {
    btn: {
        style: {
            padding: "18px",
        },
    },
}





// const nav = Router()

const TimeSheet = () => {




    const approve = (cell) => {

        const rowData = cell;
        console.log('rowData: ', rowData);


        let annual_leaveObj = {
            objID: rowData._id,
            employeeID: rowData.employeeID,
            leaveDecision: true,
            totalLeaveDays: rowData.listOfDates.length,
            orgID: rowData.orgID,
            fromDate: rowData.fromDate,
            toDate: rowData.toDate,
            listOfDates: rowData.listOfDates,
        }

        console.log('annual_leaveObj: ', annual_leaveObj);
        // if (confirm('Are you sure want to approve this leave'))
        changeMedicalLeavestatusApi(annual_leaveObj)

    }

    const disApprove = (cell) => {

        const rowData = cell;
        console.log('rowData: ', rowData);


        let annual_leaveObj = {
            objID: rowData._id,
            employeeID: rowData.employeeID,
            leaveDecision: false,
            totalLeaveDays: rowData.listOfDates.length,
            orgID: rowData.orgID,
            fromDate: rowData.fromDate,
            toDate: rowData.toDate,
            listOfDates: rowData.listOfDates,
        }

        console.log('annual_leaveObj: ', annual_leaveObj);

        // if (confirm('Are you sure want to reject this leave'))
        changeMedicalLeavestatusApi(annual_leaveObj)

    }

    const reject = (cell) => {

        const rowData = cell;
        console.log('rowData: ', rowData);


        let annual_leaveObj = {
            objID: rowData._id,
            employeeID: rowData.employeeID,
            leaveDecision: false,
            totalLeaveDays: rowData.listOfDates.length,
            orgID: rowData.orgID,
            fromDate: rowData.fromDate,
            toDate: rowData.toDate,
            listOfDates: rowData.listOfDates,
        }

        console.log('annual_leaveObj: ', annual_leaveObj);
        // if (confirm('Are you sure want to reject this leave after it is approved'))
        rejectMedicalLeaveAfterApproved(annual_leaveObj)

    }

    function changeMedicalLeavestatusApi(annual_leaveObj) {

        axios({
            url: config.baseUrl + "changeMedicalLeavestatus",
            method: "POST",
            "Content-Type": "application/json",
            headers: {
                token: sessionStorage.getItem("token"),
            },
            data: annual_leaveObj,
        })
            .then((res) => {
                if (res.status == 200) {
                    console.log('res: ', res);
                    // setMedicalLeavesList(res.data.data);
                    getMedicalLeavesRequestsAPI()
                    if (annual_leaveObj.leaveDecision == true)
                        approvedMedicalLeaveToast()
                    else
                        disApprovedMedicalLeaveToast()
                } else if (res.status == 201) {
                    console.log(res.data.message);
                    alert(res.data.message)

                } else if (res.status == 401) {
                    alert("you are unauthorized.. please login to continue");

                }
            })
            .catch((err) => {
                console.log(err);
                if (err.response.data.status == 401) {
                    alert("you are unauthorized.. please login to continue");
                    window.location = '/page-login'
                    sessionStorage.removeItem('ClientName'); sessionStorage.removeItem('clientadminlogin'); sessionStorage.removeItem('token'); sessionStorage.removeItem('id');
                    sessionStorage.removeItem('clientImgUrl');
                }
            });
    }

    function rejectMedicalLeaveAfterApproved(annual_leaveObj) {

        axios({
            url: config.baseUrl + "rejectMedicalLeaveAfterApproved",
            method: "POST",
            "Content-Type": "application/json",
            headers: {
                token: sessionStorage.getItem("token"),
            },
            data: annual_leaveObj,
        })
            .then((res) => {
                if (res.status == 200) {
                    console.log('res: ', res);
                    // setMedicalLeavesList(res.data.data);
                    getMedicalLeavesRequestsAPI()
                    rejectMedicalLeaveToast()
                } else if (res.status == 201) {
                    console.log(res.data.message);
                    alert(res.data.message)
                } else if (res.status == 401) {
                    alert("you are unauthorized.. please login to continue");

                }
            })
            .catch((err) => {
                console.log(err);
                if (err.response.data.status == 401) {
                    alert("you are unauthorized.. please login to continue");
                    window.location = '/page-login'
                    sessionStorage.removeItem('ClientName'); sessionStorage.removeItem('clientadminlogin'); sessionStorage.removeItem('token'); sessionStorage.removeItem('id');
                    sessionStorage.removeItem('clientImgUrl');
                }
            });
    }


    const [MedicalLeavesList, setMedicalLeavesList] = useState([]);


    var refArray = useRef([]);

    refArray.current = MedicalLeavesList.map((emp, i) => {

        return refArray.current[i] || React.createRef();
    })



    const columns = [
        {
            name: "Employee",
            width: "15vw",
            selector: (data) =>
                data.employeeFirstName +
                " " +
                data.employeeLastName ?? " ",
            sortable: true,
            center:true,
        },
        {
            name: "Type",
            selector: "leaveType" ?? "",
            sortable: true,
            center:true,
        },
        {
            name: "Status",
            selector: "leaveStatus" ?? "",
            sortable: true,
            center:true,
        },
        {
            name: "Days",
            selector: "totalDays" ?? "",
            sortable: true,
            center:true,
            right: true,
        },
        {
            name: "From",
            selector: "fromDate" ?? "",
            sortable: true,
            center:true,
        },
        {
            name: "To",
            selector: "toDate" ?? "",
            sortable: true,
            center:true,
            right: true,
        },
        {
            name: "Message",
            wrap:true,
            width: "10vw",
            selector: "message" ?? "",
            sortable: true,
            center:true,
        },
        {
            name: "Attachment",
            selector: (data, index) =>
            data.imageUrls.length > 0 ? (
                <>
                <div className="p-2 ">
                <img src={data.imageUrls[0]} width="100" height="100" alt="attachment not found" />
                </div>
                </>
            ) : (
                <p>no attachment</p>               
            ),
            sortable: true,
            center:true,
            right: true,
        },
        {
            name: "Approve",
            center:true,
            selector: (data, index) =>

                data.leaveStatus == 'requested' ? (

                    <Button size="sm" onClick={() => { approve(data); }} variant="success">
                        Approve
                    </Button>
                ) : (
                    <p>{data.leaveStatus}</p>
                )
        },
        {
            name: "Reject",
            center:true,
            selector: (data, index) =>
                data.leaveStatus == 'requested' ? (

                    <Button size="sm" onClick={() => { disApprove(data) }} variant="warning">
                        Reject
                    </Button>
                ) : (

                    data.leaveStatus == 'granted' ? (
                        <Button size="sm" onClick={() => { reject(data) }} variant="danger">
                            Reject
                        </Button>
                    ) : (
                        <p>{data.leaveStatus}</p>
                    )
                )
        },

    ];




    const dispatch = useDispatch();
    useEffect(() => {

        getMedicalLeavesRequestsAPI()
    }, [dispatch]);



    const monthYear = useSelector((state) => state.monthYearDate.monthYearData);
    const monthsList = ["Jan", "Feb"];
    const getAllStaffsToast = () => toast.success("Medical Leaves fetched successfully");
    const approvedMedicalLeaveToast = () => toast.success("Medical Leave approved successfully");
    const disApprovedMedicalLeaveToast = () => toast.warning("Medical Leave rejected successfully");
    const rejectMedicalLeaveToast = () => toast.error("Medical Leave rejected successfully");

    function getMedicalLeavesRequestsAPI() {
        let timeSheetObj = {
            // 'orgID': '6305da1bee247e50e3a80af8',
            clientID: sessionStorage.getItem("id"),

        };
        axios({
            url: config.baseUrl + "getMedicalLeavesRequests",
            method: "POST",
            "Content-Type": "application/json",
            headers: {
                token: sessionStorage.getItem("token"),
            },
            data: timeSheetObj,
        })
            .then((res) => {
                if (res.status == 200) {

                    setMedicalLeavesList(res.data.data);
                    console.log('res.data.data: ', res.data.data);
                    getAllStaffsToast()
                } else if (res.status == 201) {
                    console.log(res.data.message);
                    alert(res.data.message)
                } else if (res.status == 401) {
                    alert("you are unauthorized.. please login to continue");

                }
            })
            .catch((err) => {
                console.log(err);
                if (err.response.data.status == 401) {
                    alert("you are unauthorized.. please login to continue");
                    window.location = '/page-login'
                    sessionStorage.removeItem('ClientName'); sessionStorage.removeItem('clientadminlogin'); sessionStorage.removeItem('token'); sessionStorage.removeItem('id');
                    sessionStorage.removeItem('clientImgUrl');
                }
            });
    }





    return (
        <>
            <div className="card">
                <div className="col-xl-12">
                    <div className="card h-auto">
                        <div className="card-body">
                            <ToastContainer />
                            <div className="row   align-items-center">
                                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">

                                    <div className="income-data d-flex align-items-center justify-content-around  mb-xl-0 mb-3">
                                        <h2>Medical Leaves</h2>
                                        {/* <StaticDatePicker className="me-5" />
                                        <Button
                                            className="me-2 "

                                            onClick={() => {
                                                getMedicalLeavesRequestsAPI();
                                                // getOrgAcademicLeavesCalenderByMonthAPI();
                                            }}
                                            variant="outline-success"
                                        >
                                            Get TimeSheet
                                        </Button> */}


                                    </div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                    </div>



                    <div className="card-body">
                        <div className="App">
                            {/* <Card> */}

                            <DataTable
                                columns={columns}
                                data={MedicalLeavesList}
                                defaultSortField="title"
                                // expandableRowsComponent={expandableTimeSheetTable}
                                // expandableRows
                                pagination
                                customStyles={tableCustomStyles}

                            //   selectableRows
                            />
                            {/* </Card> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );

};

export default TimeSheet;
