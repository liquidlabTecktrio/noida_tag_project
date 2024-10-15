import axios from "axios";
import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from "react";
import { Alert, Badge, Button, Col, Form, Row } from "react-bootstrap";
// import ReactDOM from "react-dom";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import config from "../../../../services/config";

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


    // const [approverName, setApproverName] = useState({});
    const [approverName, setApproverName] = useState('');
    const [signatureData, setSignatureData] = useState('');

    function handleChange(empName, e) {
        setApproverName(e.target.value)
        // setApproverName({ ...approverName, [empName]: e.target.value })
    }
    const [rejectReason, setRejectReason] = useState('')
    const [currentRejectTimesheet, setCurrentRejectTimesheet] = useState({});


    function handleTextChange(reason, e) {
        setRejectReason(e.target.value)
    }


    const sigCanvas = useRef({});

    const approve = () => {
        const sigData = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png")
        const isEmpty = sigCanvas.current.isEmpty()

        if (approverName == undefined || approverName == null || approverName == '' || approverName.replaceAll(' ', '') == '') {
            alert("Please enter approver name!");
        } else if (isEmpty) {

            alert("Please sign the timesheet to approve!");
        } else {
            const dailyData = TimeSheetData.timeSheet.DailyData
            // const dailyData = TimeSheetList.filter(t => t._id == cell._id)[0].timeSheet.DailyData

            let approverObj = {
                'objID': TimeSheetData._id,
                //  "isApproved":true,
                "approver": approverName,
                "signatureData": sigData,
                "month": TimeSheetData.timeSheet.month,
                "year": TimeSheetData.timeSheet.year,
                "allTimeSheetsArray": dailyData,
                clientID: clientID,

            }

            console.log('approverObj: ', approverObj);
            approveTimeSheetsForEmployeeAPI(approverObj)
        }

    }

    const reject = (cell, sigData, isEmpty) => {


        // const dailyData = TimeSheetList.filter(t => t._id == cell._id)[0].timeSheet.DailyData
        const dailyData = TimeSheetData.timeSheet.DailyData

        let approverObj = {
            'objID': TimeSheetData._id,
            //  "isApproved":true,
            // "approver": approver,
            // "signatureData": sigData,
            "month": TimeSheetData.timeSheet.month,
            "year": TimeSheetData.timeSheet.year,
            "allTimeSheetsArray": dailyData,
        }

        console.log('approverObj: ', approverObj);
        setCurrentRejectTimesheet(approverObj)
        setRejectReason('')
        setShow(true)

    }

    // function getSpecificEmployeeTimeSheetByClientIDAPI() {
    //   let timeSheetObj = {
    //     // 'clientID':sessionStorage.getItem('id'),
    //     clientID: clientID,
    //     month: monthYear.getMonth() + 1,
    //     year: monthYear.getFullYear(),
    //   };
    //   axios({
    //     url: config.baseUrl + "getEmployeesTimeSheetByClientID",
    //     method: "POST",
    //     "Content-Type": "application/json",
    //     headers: {
    //       token: sessionStorage.getItem("token"),
    //     },
    //     data: timeSheetObj,
    //   })
    //     .then((res) => {
    //       if (res.status == 200) {
    //         setTimeSheetList(res.data.data);
    //       } else if (res.status == 201) {
    //         console.log(res.data.message);
    //       } else if (res.status == 401) {
    //         alert("you are unauthorized.. please login to continue");

    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //       if(err.response.data.status==401){
    //           alert("you are unauthorized.. please login to continue");
    //           window.location = '/page-login'
    //           sessionStorage.removeItem('ClientName'); sessionStorage.removeItem('clientadminlogin');  sessionStorage.removeItem('token');  sessionStorage.removeItem('id');
    //           sessionStorage.removeItem('clientImgUrl');
    //       }
    //     });
    // }






    // const trim = window.sigComponent.trim;
    const [allLeaves, setAllLeaves] = useState([]);


    const expandColumn = [
        {
            name: "Sl no",
            center: true,
            selector: (row, index) => index + 1,
            sortable: true,
        },
        {
            name: "Date",
            center: true,
            selector: "date",
            sortable: true,
        },
        {
            name: "Status", //BootstrapSwitchButton
            center: true,
            selector: (data) => {

                // <BootstrapSwitchButton
                //     width={220}
                //     style={otherStyles}
                //     checked={data.leaveStatus}
                //     onlabel={data.holidayReason != '' && data.holidayReason != null ? data.holidayReason + " / On work" : "On work"}
                //     offlabel={data.holidayReason != '' && data.holidayReason != null ? data.holidayReason : "On leave"}
                //     onstyle="success"
                //     offstyle="danger"
                //     onChange={(checked) => {
                //         TimeSheetList.map((timeSheetData, i) => {
                //             if (timeSheetData._id == data.timeSheetId)
                //                 timeSheetData.timeSheet.DailyData.map((dailyData, i) => {
                //                     if (dailyData.date == data.date) {
                //                         dailyData.leaveStatus = checked
                //                     }
                //                 })
                //         })
                //     }}
                // />
                const onWork = data.holidayReason != '' && data.holidayReason != null ? data.holidayReason + " / On work" : "On work";
                const onLeave = data.holidayReason != '' && data.holidayReason != null ? data.holidayReason : "On leave";

                return (
                    <Badge pill bg={data.leaveStatus ? "success" : "danger"}>
                        {data.leaveStatus ? onWork : onLeave}
                    </Badge>
                )
            }

        },

    ];



    const [TimeSheetList, setTimeSheetList] = useState([]);
    const [TimeSheetData, setTimeSheetData] = useState({});
    console.log('TimeSheetData: ', TimeSheetData);
    TimeSheetList.map((timeSheetData, i) => {
        // console.log('timeSheetData: ', timeSheetData);

        timeSheetData.timeSheet.DailyData.map((dailyData, i) => {
            dailyData.timeSheetId = timeSheetData._id
        })

    })


    var refArray = useRef([]);

    refArray.current = TimeSheetList.map((emp, i) => {

        return refArray.current[i] || React.createRef();

    })



    const columns = [
        {
            name: "Employee",
            width: "15vw",
            selector: (data) =>
                data.EmployeesDetails.employeeFirstName +
                " " +
                data.EmployeesDetails.employeeLastName ?? " ",
            sortable: true,
        },
        {
            name: "Work Days",
            selector: "workingDaysCount" ?? "",
            sortable: true,
        },
        {
            name: "leave Days",
            selector: "leaveDaysCount" ?? "",
            sortable: true,
            right: true,
        },

        {
            name: "Approver name",
            width: "15vw",
            selector: (data, index) =>

                // <Input type="text" />
                data.timeSheet.isApproved ? (
                    <h5>{data.timeSheet.approver}</h5>
                ) : (

                    <TextField id={data._id} onChange={(e) => { handleChange(e.target.id, e) }} variant="filled" />
                )

        },
        {
            name: "Signature",
            width: "20vw",
            selector: (data, index) =>
                // console.log('index: ', index);

                data.timeSheet.isApproved ? (

                    <img src={data.timeSheet.signatureURL} alt="signature not found" />
                ) : (

                    <SignaturePad penColor='red' canvasProps={{ height: 100, width: 450 }} ref={refArray.current[index]} />
                )
        },


        {
            name: "Approve",
            //   Cell: props => <FontAwesomeIcon style={{ cursor: "pointer"}} onClick={() => {}} size='xl' color='green' icon={faPencil} />,

            selector: (data, index) =>
                data.timeSheet.isApproved ? (
                    // <Button size="sm"   onClick={()=>{ approve(data, refArray.current[index].current.getTrimmedCanvas().toDataURL('image/png'), refArray.current[index].current.isEmpty()  );console.log (refArray.current[index].current.getTrimmedCanvas().toDataURL('image/png'))}} variant="danger">
                    <h5>
                        Approved
                    </h5>
                    // </Button>
                ) : (
                    <Button size="sm" onClick={() => { approve(data, refArray.current[index].current.getTrimmedCanvas().toDataURL('image/png'), refArray.current[index].current.isEmpty()); console.log(refArray.current[index].current.getTrimmedCanvas().toDataURL('image/png')) }} variant="success">
                        Approve
                    </Button>
                ),
            sortable: false,
            right: true,
        },
    ];

    const expandableTimeSheetTable = (props) => (
        <DataTable
            columns={expandColumn}
            data={props.data.timeSheet.DailyData}
            customStyles={tableCustomStyles}
        />
    );




    // const [TimeSheetList, setTimeSheetList] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [clientID, setClientID] = useState('630609a7ee247e50e3a80df4');
    const [employeeID, setEmployeeID] = useState('6311b078ee247e50e3a8163d');
    const [month, setMonth] = useState(8);
    const [year, setYear] = useState(2022);
    const [isSignatureAllowed, setIsSignatureAllowed] = useState(true);



    const dispatch = useDispatch();
    useEffect(() => {
        getSpecificEmployeeTimeSheetByClientIDAPI()
    }, [dispatch]);

    const monthYear = useSelector((state) => state.monthYearDate.monthYearData);
    const monthsList = ["Jan", "Feb"];
    const getAllStaffsToast = () => toast.success("Timesheet fetched successfully");
    const approvedtimeSheetToast = () => toast.success("Timesheet approved successfully");
    const rejectedtimeSheetToast = () => toast.success("Timesheet rejected successfully");

    function getSpecificEmployeeTimeSheetByClientIDAPI() {
        let timeSheetObj = {
            // 'clientID':sessionStorage.getItem('id'),
            clientID: clientID,
            employeeID: employeeID,
            month: month,
            year: year,
        };
        axios({
            url: config.baseUrl + "getSpecificEmployeeTimeSheetByClientID",
            method: "POST",
            "Content-Type": "application/json",
            headers: {
                token: sessionStorage.getItem("token"),
            },
            data: timeSheetObj,
        })
            .then((res) => {
                if (res.status == 200) {

                    // alert("Successfully retrived timesheet !")

                    // setTimeSheetList(res.data.data);
                    if (res.data.data.length > 0) {
                        setTimeSheetData(res.data.data[0])
                    }
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

    function approveTimeSheetsForEmployeeAPI(approverObj) {

        axios({
            url: config.baseUrl + "approveTimeSheetsForSpecificEmployee",
            method: "POST",
            "Content-Type": "application/json",
            headers: {
                token: sessionStorage.getItem("token"),
            },
            data: approverObj,
        })
            .then((res) => {
                if (res.status == 200) {
                    // setTimeSheetList(res.data.data);
                    if (res.data.data.length > 0) {
                        setTimeSheetData(res.data.data[0])
                    }
                    approvedtimeSheetToast()
                } else if (res.status == 201) {
                    alert(res.data.message)
                    console.log(res.data.message);
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

    function getOrgAcademicLeavesCalenderByMonthAPI() {
        let timeSheetObj = {
            'clientID': sessionStorage.getItem('id'),
            //   clientID: "630609a7ee247e50e3a80df4",
            month: 7,
            year: 2022,
        };
        axios({
            url: config.baseUrl + "getOrgAcademicLeavesCalenderByMonth",
            method: "POST",
            "Content-Type": "application/json",
            headers: {
                token: sessionStorage.getItem("token"),
            },
            data: timeSheetObj,
        })
            .then((res) => {
                if (res.status == 200) {
                    setAllLeaves(res.data.data);
                } else if (res.status == 201) {
                    console.log(res.data.message);
                } else if (res.status == 401) {
                    alert("you are unauthorized.. please login to continue");
                }
            })
            .catch((err) => {
                console.log(err.toString());
            });
    }

    function rejectTimeSheetsForEmployeeAPI(rejectObj) {

        axios({
            url: config.baseUrl + "rejectTimeSheetsForSpecificEmployee",
            method: "POST",
            "Content-Type": "application/json",
            headers: {
                token: sessionStorage.getItem("token"),
            },
            data: rejectObj,
        })
            .then((res) => {
                if (res.status == 200) {
                    // setTimeSheetList(res.data.data);
                    if (res.data.data.length > 0) {
                        setTimeSheetData(res.data.data[0])
                    }
                    rejectedtimeSheetToast()
                } else if (res.status == 201) {
                    alert(res.data.message)
                    console.log(res.data.message);
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

    const handlerejectCurrentTimeSheet = () => {
        // console.log('rejectReason: ', rejectReason);
        // console.log('currentRejectTimesheet: ', currentRejectTimesheet);
        if (rejectReason != '') {
            if (currentRejectTimesheet.objID != null) {

                let rejectObj = currentRejectTimesheet
                rejectObj.rejectReason = rejectReason;
                rejectTimeSheetsForEmployeeAPI(rejectObj)
                console.log('rejectObj: ', rejectObj);
            }

        }

    }

    //signature modal
    const [show, setShow] = useState(false);


    const handleClose = () => {
        setRejectReason('')
        setCurrentRejectTimesheet({})

        setShow(false)
    };

    const handleSaveLeave = () => {


        handlerejectCurrentTimeSheet()
        setShow(false);
    }

    const handleShow = () => setShow(true);

    const [allLeaveDetailsByTimeSheetIds, setAllLeaveDetailsByTimeSheetIds] = useState([]);
    const [allLeaveDetailsByTimeSheet, setAllLeaveDetailsByTimeSheet] = useState([]);
    const [currentLeaveDetails, setCurrentLeaveDetails] = useState({});
    const [currentCheckBox, setCurrentCheckBox] = useState('');
    const [currentLeaveType, setCurrentLeaveType] = useState('');

    const changeRadio = (data) => {
        // console.log('data: ', data.target.id  );
        setCurrentLeaveType(data.target.id)
        setCurrentLeaveDetails({
            ...currentLeaveDetails,
            "leaveStatus": true,
            "leaveType": data.target.id
        })
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

                                        {
                                            TimeSheetData.EmployeesDetails != undefined ? (
                                                // <h2>
                                                //     {TimeSheetData.EmployeesDetails.employeeFirstName + ' ' + TimeSheetData.EmployeesDetails.employeeLastName}
                                                // </h2>
                                                TimeSheetData.timeSheet != undefined ? (
                                                    <h2>
                                                        TimeSheet For {TimeSheetData.EmployeesDetails.employeeFirstName + ' ' + TimeSheetData.EmployeesDetails.employeeLastName}  {'(' + TimeSheetData.timeSheet.month + '-' + TimeSheetData.timeSheet.year + ')'}
                                                    </h2>
                                                ) : ('')
                                            ) : (<h2>TimeSheet</h2>)
                                        }

                                        {/* <StaticDatePicker className="me-5" />
                                        <Button
                                            className="me-2 "

                                            onClick={() => {
                                                getSpecificEmployeeTimeSheetByClientIDAPI();
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
                                columns={expandColumn}
                                // columns={columns}
                                data={TimeSheetData.timeSheet != null ? TimeSheetData.timeSheet.DailyData : []}
                                // data={TimeSheetList}
                                defaultSortField="title"
                                // expandableRowsComponent={expandableTimeSheetTable}
                                // expandableRows
                                pagination
                                customStyles={tableCustomStyles}

                            //   selectableRows
                            />
                            {/* </Card> */}
                        </div>
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title>Please Enter Reason of rejecting time sheet</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <TextField value={rejectReason} id={'ReasonForReject'} onChange={(e) => { handleTextChange(e.target.id, e) }} variant="filled" />

                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button variant="primary" onClick={handleSaveLeave}>
                                    Reject Time Sheet
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <div className="">
                            {
                                TimeSheetData.timeSheet ? (
                                    <>
                                        <Row className="d-flex justify-content-around align-items-center">


                                            {TimeSheetData.timeSheet != undefined && TimeSheetData.timeSheet.isApproved == true ? (
                                                <>
                                                    <Col md="3" sm="12" xs="12">
                                                        <div className="text-center pb-2">
                                                            <p>Approver :</p>
                                                            <h5>
                                                                {TimeSheetData.timeSheet.approver}
                                                            </h5>
                                                        </div>
                                                    </Col>
                                                </>
                                            ) : (
                                                TimeSheetData.timeSheet != undefined && TimeSheetData.timeSheet.isRejected == true ? (
                                                    <>
                                                        <Col md="3" sm="12" xs="12">
                                                            <div className="text-center pb-2">
                                                                <p>Reject Reason :</p>
                                                                <h5>
                                                                    {TimeSheetData.timeSheet.rejectedTimeSheetData ? (TimeSheetData.timeSheet.rejectedTimeSheetData[TimeSheetData.timeSheet.rejectedTimeSheetData.length - 1].reason):('')}
                                                                </h5>
                                                            </div>
                                                        </Col>
                                                    </>
                                                ) : (
                                                    <>
                                                    <Col md="3" sm="12" xs="12">
                                                            <div className="text-center pb-2">
                                                        <label>Enter approver Name</label>
                                                        <TextField onChange={(e) => { handleChange(e.target.id, e) }} variant="filled" />
                                                        </div>
                                                        </Col>
                                                    </>
                                                )
                                            )}



                                            {TimeSheetData.timeSheet != undefined && TimeSheetData.timeSheet.isApproved == true ? (
                                                <>
                                                    <Col md="4" sm="10" xs="10">
                                                        <div className="text-center border m-2" style={{ 'overflow': "hidden" }}>
                                                            <div className="p-2 " >
                                                                <img src={TimeSheetData.timeSheet.signatureURL} alt="signature not found" />
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </>
                                            ) : (
                                                TimeSheetData.timeSheet != undefined && TimeSheetData.timeSheet.isRejected == true ? (
                                                    ''
                                                ) : (
                                                    <Col md="4" sm="10" xs="10">
                                                        <div className="text-center border m-2" style={{ 'overflow': "hidden" }}>
                                                            {isSignatureAllowed?(
                                                            <SignaturePad ref={sigCanvas} penColor='red' canvasProps={{ height: 100, width: 450 }} />
                                                            ):(<p>signature not allowed, please approve time sheet without signature.</p>)}
                                                        </div>
                                                    </Col>
                                                )
                                            )}

                                            <Col md="3" sm="6" xs="6">
                                                <div className="text-center">
                                                    {TimeSheetData.timeSheet != undefined && TimeSheetData.timeSheet.isApproved == true ? (
                                                        <>
                                                            <p>Status :</p>
                                                            <h5 className="text-success">
                                                                Approved
                                                            </h5>
                                                        </>
                                                    ) : (
                                                        TimeSheetData.timeSheet != undefined && TimeSheetData.timeSheet.isRejected == true ? (
                                                            <>
                                                                <p>Status :</p>
                                                                <h5 className="text-danger">
                                                                    Rejected
                                                                </h5>
                                                            </>

                                                        ) : (

                                                            <Button size="sm" variant="success" onClick={() => { approve() }}>
                                                                Approve
                                                            </Button>
                                                        )
                                                    )}
                                                </div>
                                            </Col>


                                            {TimeSheetData.timeSheet != undefined && TimeSheetData.timeSheet.isApproved == true ? (
                                                ''
                                            ) : (
                                                TimeSheetData.timeSheet != undefined && TimeSheetData.timeSheet.isRejected == true ? (
                                                    ''
                                                ) : (
                                                    <Col md="2" sm="6" xs="6">
                                                        <div className="text-center">
                                                            <Button size="sm" variant="danger" onClick={() => { reject() }}>
                                                                Reject
                                                            </Button>
                                                        </div>
                                                    </Col>

                                                )
                                            )}

                                        </Row>





                                    </>

                                ) : ('')
                            }


                        </div>


                    </div>
                </div>
            </div>
        </>
    );

};

export default TimeSheet;
