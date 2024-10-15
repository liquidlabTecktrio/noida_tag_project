import axios from "axios";
import React, { useEffect, useState, forwardRef, useRef, useImperativeHandle } from "react";
import { Alert, Badge, Button, Col, Form, Row } from "react-bootstrap";
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
import { useParams } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { PDFViewer } from '@react-pdf/renderer';
import MyDocument from '../../MyDocument'

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

const TimeSheet = (props) => {


    const [approverName, setApproverName] = useState({});

    const [rejectReason, setRejectReason] = useState('')
    const [currentRejectTimesheet, setCurrentRejectTimesheet] = useState({});
    console.log('rejectReason: ', rejectReason);

    function handleChange(empName, e) {
        console.log('empName: ', empName)
        setApproverName({ ...approverName, [empName]: e.target.value })
    }

    function handleTextChange(reason, e) {
        setRejectReason(e.target.value)
    }


    // useEffect(() => {

    //   changeDate(new Date());

    // }, [])

    const approve = (cell, sigData, isEmpty) => {

        const rowData = cell;
        let approver = approverName[rowData._id];

        if (approver == undefined || approver == null || approver == '' || approver.replaceAll(' ', '') == '') {
            alert("Please enter approver name!");
        } else if (isEmpty) {

            alert("Please sign the timesheet to approve!");
        } else {
            const dailyData = TimeSheetList.filter(t => t._id == cell._id)[0].timeSheet.DailyData

            let approverObj = {
                'objID': cell._id,
                //  "isApproved":true,
                "approver": approver,
                "signatureData": sigData,
                "month": cell.timeSheet.month,
                "year": cell.timeSheet.year,
                "allTimeSheetsArray": dailyData,
            }

            console.log('approverObj: ', approverObj);
            approveTimeSheetsForEmployeeAPI(approverObj)
        }

    }

    const reject = (cell, sigData, isEmpty) => {


        const rowData = cell;
        console.log('rowData: ', rowData);
        let approver = approverName[rowData._id];


        // if (rejectReason == '') {

        //     alert("Please enter reason to reject time sheet!");
        // } else {
        const dailyData = TimeSheetList.filter(t => t._id == cell._id)[0].timeSheet.DailyData

        let approverObj = {
            'objID': cell._id,
            //  "isApproved":true,
            // "approver": approver,
            // "signatureData": sigData,
            "month": cell.timeSheet.month,
            "year": cell.timeSheet.year,
            "allTimeSheetsArray": dailyData,
        }

        console.log('approverObj: ', approverObj);
        setCurrentRejectTimesheet(approverObj)
        // approveTimeSheetsForEmployeeAPI(approverObj)
        // }
        setRejectReason('')
        setShow(true)

    }

    const handlerejectCurrentTimeSheet = () => {
        // console.log('rejectReason: ', rejectReason);
        // console.log('currentRejectTimesheet: ', currentRejectTimesheet);
        if (rejectReason != '') {
            if (currentRejectTimesheet.objID != null) {

                let rejectObj = currentRejectTimesheet
                rejectObj.rejectReason = rejectReason;
                rejectTimeSheetsForEmployeeAPI(rejectObj)
            }

        }

    }

    // const trim = window.sigComponent.trim;

    const [allLeaves, setAllLeaves] = useState([]);

    // const approve = (cell)=>{

    //     const rowData=cell;
    //     console.log('rowData: ', rowData);
    //     let approver =approverName[rowData._id];
    //     console.log('approver: ', approver);
    //     // let signature = 
    //     const trim =  window.sigComponent.trim;

    //   }


    // const changeStatus = (value) => {
    //   console.log('value: ', value);
    //   console.log('date: ', value.target.attributes["date"].value);
    //   console.log('timeSheetId: ', value.target.attributes["timeSheetId"].value);

    // }

    const expandColumn = [
        {
            name: "Sl no",
            selector: (row, index) => index + 1,
            sortable: true,
        },
        {
            name: "Date",
            selector: "date",
            sortable: true,
        },
        {
            name: "Status", //BootstrapSwitchButton
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
                //         // setCurrentCheckBox(this)
                //         // if (!checked) {
                //         //     if (data.holidayReason == '') {
                //         //         // const leaveType = prompt('select', 'defaultText')
                //         //         // console.log('leaveType: ', leaveType);
                //         //         setCurrentLeaveDetails({
                //         //             ...currentLeaveDetails, // Copy the old fields
                //         //             "date": data.date,
                //         //             "leaveStatus": checked,
                //         //             "holidayReason": data.holidayReason,
                //         //             "timeSheetId": data.timeSheetId,
                //         //         })
                //         //         handleShow()

                //         //     }
                //         // }
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
    TimeSheetList.map((timeSheetData, i) => {
        timeSheetData.timeSheet.DailyData.map((dailyData, i) => {
            dailyData.timeSheetId = timeSheetData._id
        })

    })

    // const [selectedDate, setSelectedDate] = useState(null);

    var refArray = useRef([]);
    // console.log('refArray: ', refArray);


    // console.log('emp: ', emp);
    refArray.current = TimeSheetList.map((emp, i) => {

        return refArray.current[i] || React.createRef();

    })


    const columns = [
        {
            name: "Employee",
            center: true,
            className: "rdt_TableHeader",
            style: {
                // backgroundColor: 'green',
                // color: 'white',
                // fontSize:"10px"
              },
            width: "15vw",
            selector: (data) =>
                data.EmployeesDetails.employeeFirstName +
                " " +
                data.EmployeesDetails.employeeLastName ?? " ",
            sortable: true,
        },
        {
            name: "Work Days",
            center: true,
            selector: "workingDaysCount" ?? "",
            sortable: true,
        },
        {
            name: "leave Days",
            center: true,
            selector: "leaveDaysCount" ?? "",
            sortable: true,
            right: true,
        },

        {
            name: "Approver name",
            center: true,
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
            center: true,
            width: "20vw",
            selector: (data, index) =>
                // console.log('index: ', index);

                data.timeSheet.isApproved ? (
                    <div className="p-2 ">
                        <img src={data.timeSheet.signatureURL} alt="signature not found" />
                    </div>

                ) : (

                    <div className="m-2 border">
                        <SignaturePad penColor='red' canvasProps={{ height: 100, width: 450 }} ref={refArray.current[index]} />
                    </div>
                )
        },

        {
            name: "Actions",
            center:true,
            width: "15vw",
            selector: (data, index) =>
                data.timeSheet.isApproved ? (
                    <p>
                        Approved
                    </p>
                ) : (
                    data.timeSheet.isRejected ? (
                        <p>
                            Rejected
                        </p>
                    ) : (
                        <Row>
                            <Col md="6">
                                <Button size="sm" onClick={() => { approve(data, refArray.current[index].current.getTrimmedCanvas().toDataURL('image/png'), refArray.current[index].current.isEmpty()); console.log(refArray.current[index].current.getTrimmedCanvas().toDataURL('image/png')) }} variant="success">
                                    Approve
                                </Button>
                            </Col>

                            <Col md="6">
                                <Button size="sm" onClick={() => { reject(data) }} variant="danger">
                                    Reject
                                </Button>
                            </Col>
                        </Row>
                    )
                ),
            sortable: false,
            right: true,
        },
        {
            name: "Notes",
            center: true,
            selector: (data, index) =>
                data.timeSheet.isRejected ? (
                    <p>
                        {/* Rejected */}
                    </p>
                ) : (
                    data.timeSheet.isApproved ? (
                        <p>
                            {/* Approved */}
                        </p>
                    ) : (
                        // <Button size="sm" onClick={() => { reject(data) }} variant="danger">
                        //     Reject
                        // </Button>
                        <p>
                            {data.timeSheet.rejectedTimeSheetData ? (data.timeSheet.rejectedTimeSheetData[data.timeSheet.rejectedTimeSheetData.length - 1].reason):('')}

                        </p>
                    )
                ),
            sortable: false,
            right: true,
        },
    ];

    // const expandableTimeSheetTable = (props) => (
    //     <DataTable
    //         columns={expandColumn}
    //         data={props.data.timeSheet.DailyData}
    //         customStyles={tableCustomStyles}
    //     />
    // );

    const expandableTimeSheetTablePdf = (props) => (
        <PDFViewer>
    <MyDocument data={props}/>
  </PDFViewer>
    );




    // const [TimeSheetList, setTimeSheetList] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    const location = useLocation()
    const queryParameters = new URLSearchParams(location.search)

    // console.log('queryParameters: ', queryParameters.Type);
    const dispatch = useDispatch();
    useEffect(() => {
        // GetMonthYear.loadMonthYear(dispatch)
        // console.log(' GetMonthYear.loadMonthYear(dispatch): ',  GetMonthYear.loadMonthYear(dispatch));
        if (queryParameters.get("type")) {
            const ArrayDate = queryParameters.get("type").split('-')
            var monthData = ArrayDate[0];
           
            var yearData = ArrayDate[1];   
            

           
           
            getEmployeesTimeSheetByClientIDAPI(parseFloat(monthData),parseFloat(yearData) );
        }
    }, [dispatch]);



    const monthYear = useSelector((state) => state.monthYearDate.monthYearData);
    const monthsList = ["Jan", "Feb"];
    const getAllStaffsToast = () => toast.success("Timesheet fetched successfully");
    const approvedtimeSheetToast = () => toast.success("Timesheet approved successfully");
    const rejectedtimeSheetToast = () => toast.success("Timesheet rejected successfully");

    function getEmployeesTimeSheetByClientIDAPI(month,year) {
        let timeSheetObj = {
            // 'clientID':sessionStorage.getItem('id'),
            clientID: sessionStorage.getItem("id"),
            month: month,
            year: year,
        };
       
        axios({
            url: config.baseUrl + "getEmployeesTimeSheetByClientID",
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

                    setTimeSheetList(res.data.data);
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
            url: config.baseUrl + "approveTimeSheetsForEmployee",
            method: "POST",
            "Content-Type": "application/json",
            headers: {
                token: sessionStorage.getItem("token"),
            },
            data: approverObj,
        })
            .then((res) => {
                if (res.status == 200) {
                    setTimeSheetList(res.data.data);
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




    function rejectTimeSheetsForEmployeeAPI(rejectObj) {


        axios({
            url: config.baseUrl + "rejectTimeSheetsForEmployee",
            method: "POST",
            "Content-Type": "application/json",
            headers: {
                token: sessionStorage.getItem("token"),
            },
            data: rejectObj,
        })
            .then((res) => {
                if (res.status == 200) {
                    setTimeSheetList(res.data.data);
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

    //signature modal
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setRejectReason('')
        setCurrentRejectTimesheet({})
        // setCurrentLeaveDetails({
        //     ...currentLeaveDetails, // Copy the old fields
        //     "leaveStatus": true,
        // })
        setShow(false)
    };

    const handleSaveLeave = () => {

        // const timeSheetIdIndex = allLeaveDetailsByTimeSheetIds.indexOf(currentLeaveDetails.timeSheetId)
        // console.log('timeSheetIdIndex: ', timeSheetIdIndex);
        // if (timeSheetIdIndex != -1) {

        // } else {
        //     setAllLeaveDetailsByTimeSheetIds([...allLeaveDetailsByTimeSheetIds, currentLeaveDetails.timeSheetId])
        //     setAllLeaveDetailsByTimeSheet([...allLeaveDetailsByTimeSheet, currentLeaveDetails])
        // }
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
    // const [date, changeDate] = useState(new Date());
    // console.log('date: ', date);



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
                                        <h2>TimeSheet</h2>

                                        <StaticDatePicker className="me-5" Type={queryParameters.get("type")} />

                                        <Button
                                            className="me-2 "

                                            onClick={() => {
                                                getEmployeesTimeSheetByClientIDAPI( monthYear.getMonth() + 1,  monthYear.getFullYear());

                                                // getOrgAcademicLeavesCalenderByMonthAPI();
                                            }}
                                            variant="outline-success"
                                        >
                                            Get TimeSheet
                                        </Button>

                                    </div>
                                    <div></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Please Enter Reason of rejecting time sheet</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                {/* {['radio'].map((type) => (
                                    <div key={`inline-${type}`} className="mb-3">
                                        <Form.Check
                                            inline
                                            label="Annual Leave"
                                            name="group1"
                                            type={type}
                                            id={`annualLeave`}
                                            checked={currentLeaveType == 'annualLeave'}
                                            // id={`inline-${type}-1`}
                                            onChange={changeRadio}
                                        />
                                        <Form.Check
                                            inline
                                            label="Medical Leave"
                                            name="group1"
                                            type={type}
                                            id={`medicalLeave`}
                                            checked={currentLeaveType == 'medicalLeave'}
                                            // id={`inline-${type}-2`}
                                            onChange={changeRadio}

                                        />
                                    </div>
                                ))} */}
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

                    <div className="card-body">
                        <div className="App">
                            {/* <Card> */}

                            <DataTable
                                columns={columns}
                                data={TimeSheetList}
                                defaultSortField="title"
                                expandableRowsComponent={expandableTimeSheetTablePdf}
                                // expandableRowsComponent={expandableTimeSheetTable}
                                expandableRows
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
