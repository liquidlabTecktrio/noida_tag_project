import React, { useEffect } from "react";
import { useState } from "react";
import { Button,Spinner, Modal, Row, Col } from "react-bootstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import config from "../../../../services/config";
// import TariffTable from "./showTariffTable"
import { Form } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import 'font-awesome/css/font-awesome.min.css';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import BootstrapSwitchButton from 'bootstrap-switch-button-react';


const ManageTariff = () => {



    useEffect(() => {
        getAllTariffsAPI()
    }, [])


    const [show, setShow] = useState(false);
    // console.log("show", show)
    const [allTariffsArray, setAllTariffsArray] = useState([])
    const [rowData, setRowData] = useState({});
    const [rowDayIndex, setRowDayIndex] = useState({});
    // const [tariffId]
    // console.log("rowData",rowData)

    function getAllTariffsAPI() {


        axios({
            url: config.baseUrl + "getTariffs",
            method: "POST",
            headers: {
                "token": sessionStorage.getItem("token"),
            },
            // headers: {
            // 	"Content-Type":"application/json"
            // },
            // data: JSON.stringify({orgID:loggedInClientId.}),
        }).then((res) => {

            console.log("res", res)
            if (res.status == 200) {

                // alert(res.data.message)
                console.log(res.data.message);
                setAllTariffsArray(res.data.data);

            } else if (res.status == 201) {
                alert(res.data.message)
                console.log(res.data.message);
            } else if (res.status == 401) {
                alert("you are unauthorized.. please login to continue");
                window.location = '/page-login'

            }
        })
            .catch((err) => {
                console.log(err);
                if (err.response.data.status == 401) {
                    alert("you are unauthorized.. please login to continue");
                    window.location = '/page-login'

                }
            });

    }

    function connectTariffApi(connectTariffData) {

        console.log("sgdfhsgdf");

        axios({
            url: config.baseUrl + "connectTariff",
            method: "POST",
            headers: {
                token: sessionStorage.getItem("token"),
            },
            data: connectTariffData
        }).then((res) => {

            console.log("res", res)
            if (res.status == 200) {

                // alert(res.data.message)
                console.log(res.data.message);


            } else if (res.status == 201) {
                alert(res.data.message)
                console.log(res.data.message);
            } else if (res.status == 401) {
                alert("you are unauthorized.. please login to continue");
                window.location = '/page-login'

            }
        })
            .catch((err) => {
                console.log(err);
                if (err.response.data.status == 401) {
                    alert("you are unauthorized.. please login to continue");
                    window.location = '/page-login'

                }
            });

    }







    // const handleDaySubmit = ()=>{
    //     setTariffId(!tariffid)
    //     console.log("setTariffId",setTariffId)


    // }

    const [Tariff, setTariff] = useState(true);
    const [showTariff, setShowTariff] = useState(false);
    const addNewTariff = () => {
        setTariff(false)
        setShowTariff(true)
    }
    const cancelButton = () => {
        setShowTariff(false)
        setTariff(true)
    }
    const tableCustomStyles = {
        headCells: {
            style: {
                fontSize: "15px",
                fontWeight: "bold",
                color: "#f8857e",
                // width:"5vw",

                backgroundColor: "#fef3f2",
            },
        },
        rows: {
            style: {
                minHeight: '60px',

            }
        },
        cells: {
            style: {
                paddingLeft: '33px', // override the cell padding for data cells

            },
        },


    };

    const handleDailyCheckBox = () => {
        setDailyCheckBox(!DailyCheckBox)
        setIsInfinite(false)
        setIsIterate(false)

    }
    const handleWeeklyCheckBox = () => {
        setWeeklyCheckBox(!weeklyCheckBox)
        setIsInfinite(false)
        setIsIterate(false)
    }
    const handleMonthlyCheckBox = () => {
        setMonthlyCheckBox(!monthlyCheckBox)
        setIsInfinite(false)
        setIsIterate(false)
    }

    //  create tariff input fields 
    const [tariffName, setTariffName] = useState('');
    const [selectHour, setSelectHour] = useState('');
    const [error, setError] = useState('');

    const [starting, setStarting] = useState('0')
    const [ending, setEnding] = useState('')
    const [price, setPrice] = useState('')
    const [iterateSelectHour, setIterateSelectHour] = useState('');
    const [isInfinite, setIsInfinite] = useState(false)
    const [iterrateEvery, setIterateEvery] = useState('')
    const [lostTicket, setLostTicket] = useState('')
    const [cleaningCharge, setCleaningCharge] = useState('')
    const [DailyCheckBox, setDailyCheckBox] = useState(false)
    const [DailyRateInput, setDailyRateInput] = useState('')
    const [weeklyCheckBox, setWeeklyCheckBox] = useState(false)
    const [weeklyRateInput, setWeeklyRateInput] = useState('')
    const [monthlyCheckBox, setMonthlyCheckBox] = useState('')
    const [monthlyRateInput, setMonthlyRateInput] = useState('')
    const [loading,setLoading] = useState(false)
    const [tariffList, setTariffList] = useState([]);
    console.log('tariffList: ', tariffList);

    const [isAddTariffSlabDisabled, setIsAddTariffSlabDisabled] = useState(false)
    const [dailyData, setDailyData] = useState([])

    const [isIterate, setIsIterate] = useState(false)
    const handleCreateTariff = (e) => {
        e.preventDefault();

        if (isInfinite || DailyCheckBox || weeklyCheckBox || monthlyCheckBox) {

            if ((tariffName == '' || selectHour == '' || lostTicket == '' || cleaningCharge == ''))
                alert('Please fill all details')
            else {

                let hoursToMin = []
                tariffList.map(t => {
                    var a = t
                    if (selectHour == 'hours') {
                        a.starting = parseFloat(a.starting) * 60
                        a.ending = parseFloat(a.ending) * 60
                    }

                    if (a.iterrateType == 'hours')
                        a.iterrateEvery = parseFloat(a.iterrateEvery) * 60
                    hoursToMin.push(a)
                })
                console.log('hoursToMin: ', hoursToMin);

                const createTaiffObj = {

                    "tariffName": tariffName,
                    "tariffData": hoursToMin,
                    "isActive": false,
                    "isTariffInHour": selectHour == 'hours',
                    "lostTicket": lostTicket,
                    "cleaningCharge": cleaningCharge,
                    "dailyRate": DailyRateInput,
                    "WeeklyRate": weeklyRateInput,
                    "monthlyRate": monthlyRateInput
                }
                // CreateTariffAPI(createTaiffObj)
                console.log("createTaiffObj", createTaiffObj)
            }
        } else {
            alert("Please add Infinite slab before creating Tariff")
        }





    }
    // if(dayChanged){
    //     allTariffsArray.map(DataId=>{
    //        let data = DataId._id
    //         console.log("data",data)
    //     })
    // dailyData.map((data, index)=>{
    //     console.log("index",index)
    //      if(data.isActive == "false"){

    //     }
    //   console.log("dayData",dayData) 
    // })
    // }
    // const handleDaySubmit = (e) => {
    //     e.preventDefault();




    //     // console.log("rowDayIndex",rowDayIndex)


    //     // console.log("rowData",rowData)
    //     // let tariffObjID = (rowData._id)
    //     // console.log("tariffObjID", tariffObjID)
    //     // var updateDailyData = allTariffsArray.filter(e => e._id == rowData._id)[0].dailyData.filter(e => e.dayIndex == rowDayIndex.dayIndex)[0].isActive = dayChanged;


    //     // setDailyData({ ...dailyData, isActive: updateDailyData })

    //     const createTariffDayObj = {
    //         "tariffObjID": tariffObjID,
    //         "dailyData": dailyData,

    //     }
    //     console.log("createTariffDayObj", createTariffDayObj)
    //     connectTariffApi(createTariffDayObj)
    //     console.log("createTariffDayObj", createTariffDayObj)

    // }

    // const editTariffDailyData = (data) => {
    //     // let rowData = cell?.row?.original 
    //     setDailyData(data)


    // }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (selectHour == '') {
            alert('Please Select tariff in hours or min')
            return
        }

        let inputObj = {};
        if (ending == '' || price == '') {
            alert('Please enter all details')
            return
        }

        if (starting < ending && !isInfinite) {
            // if (selectHour == "hours") {

            inputObj = {
                "starting": starting,
                "ending": ending,
                "isIterate": isIterate,
                "iterateEvery": iterrateEvery,
                "iterrateType": iterateSelectHour,
                "price": price,
                "isInfinite": isInfinite,

            }


            setStarting(parseFloat(ending))

            tariffList.push(inputObj)
            // console.log("tariffList", tariffList)
            // setTariffName('')
            setEnding('')
            setPrice('')
            setIterateEvery('')
            setIsIterate(false)
            // setIsInfinite(false)

        } else if (isInfinite) {

            inputObj = {
                "starting": starting,
                "ending": starting,
                "isIterate": isIterate,
                "iterateEvery": iterrateEvery,
                "iterrateType": iterateSelectHour,
                "price": price,
                "isInfinite": isInfinite,

            }



            setIsAddTariffSlabDisabled(true)
            tariffList.push(inputObj)
            // setTariffName('')
            setEnding('')
            setPrice('')
            setIterateEvery('')
            setIsIterate(false)
            // setIsInfinite(false)

        }
        else {
            alert("Ending is greater than starting")
        }


        if (isInfinite) {
            setIsAddTariffSlabDisabled(true)

        }


    }




    const columns = [

        {
            name: "Starting",
            selector: row => selectHour == "hours" ? row.starting + " Hours" : row.starting + " Minutes",
            sortable: true,

        },
        {
            name: "Ending",
            selector: row => row.isInfinite ? 'Infinite' : selectHour == "hours" ? row.ending + " Hours" : row.ending + " Minutes",
            sortable: true,
        },
        {
            name: "Iterate",
            selector: row => {
                if (row.isIterate)
                    return 'Every ' + row.iterateEvery + ' ' + row.iterrateType
                else
                    return 'NA'
            },
            sortable: true,
        },
        {
            name: "Infinite",
            selector: row => {
                if (row.isInfinite)
                    return 'Yes'
                else
                    return 'NA'
            },
            sortable: true,
        },
        {
            name: "Price",
            selector: row => row.price,
            sortable: true,
        }


    ]
    function CreateTariffAPI(tariffData) {
        setLoading(true)

        axios({
            url: config.baseUrl + "createTariff",
            method: "POST",
            "Content-Type": "application/json",
            headers: {
                token: sessionStorage.getItem("token"),
            },
            data: tariffData,
        })
            .then((res) => {

                console.log("res", res)
                if (res.status == 200) {

                    alert(res.data.message)
                    setLoading(false)
                    console.log(res.data.message);

                    setShowTariff(false)
                    setTariff(true)
                    setAllTariffsArray(res.data.data)

                    setTariffName('');
                    setSelectHour('')
                    setStarting('0')
                    setEnding('')
                    setPrice('')
                    setIterateSelectHour('');
                    setIsInfinite(false)
                    setIterateEvery('')
                    setTariffList([]);
                    setIsAddTariffSlabDisabled(false)
                    setIsIterate(false)
                    setLostTicket('')
                    setCleaningCharge('')


                } else if (res.status == 201) {
                    alert(res.data.message)
                    console.log(res.data.message);
                } else if (res.status == 401) {
                    alert("you are unauthorized.. please login to continue");
                    window.location = '/page-login'

                }
            })
            .catch((err) => {
                console.log(err);
                if (err.response.data.status == 401) {
                    alert("you are unauthorized.. please login to continue");
                    window.location = '/page-login'

                }
            });
    }



    const mainColumns = [
        {
            name: "Tariff Name",
            selector: "tariffName",

            sortable: true,

        },
        // {
        //     name: "Active",
        //     selector: row => row.isActive ? (<span class="badge badge-danger">Active</span>) : (<span class="badge badge-danger">InActive</span>),
        //     sortable: true,

        // },
        // {
        //     name: "",
        //     cell: (row) => <FontAwesomeIcon style={{ cursor: "pointer" }} onClick={() => { editTariffDailyData(row.dailyData); handleShow(); setRowData(row) }} size='xl' color='red' icon={faPencil} />,

        //     // <Row>
        //     //     <Col md-="6">
        //     //         <Button className="btn btn-primary" onClick={(row)=> console.log(row.row.original)}>Edit</Button>
        //     //     </Col>

        //     // </Row>





        // }
    ];
    const handleIterateEveryChange = (e) => {
        const newIterateEvery = e.target.value;
        const difference = ending - starting;
        if (newIterateEvery === '' || newIterateEvery <= difference) {
            setIterateEvery(newIterateEvery);
            setError('');
        } else {
            setError('Iterate Every value cannot be greater than the difference between starting and ending values.');
        }
    }


    const expandableColumns = [
        // {
        //     name: "Starting",
        //     selector: 'starting',
        //     sortable: true,

        // },
        // {
        //     name: "Ending",
        //     selector: 'ending',
        //     sortable: true,
        // },
        {
            name: "Starting",
            selector: row => row.isTariffInHour ? row.starting / 60 + " Hours" : row.starting + " Minutes",
            sortable: true,

        },
        {
            name: "Ending",
            selector: row => row.isInfinite ? 'Infinite' : row.isTariffInHour ? row.ending / 60 + " Hours" : row.ending + " Minutes",
            sortable: true,
        },
        {
            name: "Iterate",
            selector: row => {
                if (row.isIterate)
                    return 'Every ' + row.iterateEvery + ' ' + row.iterrateType
                else
                    return 'NA'
            },
            sortable: true,
        },
        {
            name: "Infinite",
            selector: row => {
                if (row.isInfinite)
                    return 'Yes'
                else
                    return 'NA'
            },
            sortable: true,
        },
        {
            name: "Price",
            selector: 'price',
            sortable: true,
        }
    ]

    const expandableTariffTable = (props) => {
        let data = []
        props.data.tariffData.map(t => {
            let a = t
            a.isTariffInHour = props.data.isTariffInHour
            data.push(a)
        })
        console.log('data: ', data);

        return (

            <DataTable
                columns={expandableColumns}
                data={data}
                customStyles={tableCustomStyles}

            />
        )
    }




    //daily data columns
    const dailyDataMainColums = [
        {
            name: "Day Name",
            selector: "dayName",

        },
        {
            name: "Status",
            selector: row => row.isActive ? (
                <BootstrapSwitchButton
                    checked={row.isActive}
                    onlabel='Active'

                    offlabel='Inactive' width={90} onstyle='success' offstyle='danger' disabled={true}


                />
            ) : (
                <BootstrapSwitchButton
                    checked={row.isActive}
                    onlabel='Active'
                    // value={tariffid}
                    onChange={(checked) => {
                        console.log("checked", checked)


                        // console.log(row);
                        // console.log(allTariffsArray.filter(e => e._id == rowData._id)[0].dailyData.filter(e=>e.dayIndex==row.dayIndex)[0].isActive=dayChanged)
                        setRowDayIndex(row)

                    }}
                    offlabel='Inactive' width={90} onstyle='success' offstyle='danger'


                />
            )
        }
    ]


    return (
        <>
            {Tariff ?


                (<div className="card">
                    <div className="card-header">
                        <h4 className="card-title">Current Tariffs</h4>
                        <Button className="" onClick={addNewTariff} variant="outline-primary" ><i class="fa fa-plus"></i> Add New Tariff </Button>

                    </div>

                </div>)
                :
                (<div className="card">
                    <div className="card-header">
                        <h4 className="card-title">Add Tariff</h4>
                        <div>
                            <Button onClick={cancelButton} className="me-2" variant="outline-primary">
                                Cancel
                            </Button>
                            <Button onClick={handleCreateTariff} className="me-2" varient="outline-primary">
                              {loading ? <Spinner animation="border" size="sm" /> : '  Create Tariff'}
                            </Button>
                        </div>
                    </div>
                </div>
                )
            }
            <>
                {showTariff ?
                    <div className="card">
                        <div className="card-body">

                            <div className="search-results">
                                <form >
                                    <div className="row">
                                        <div className='mb-3 mt-2 col-md-3'>
                                            <label className='mb-1'><strong>Tariff Name</strong></label>
                                            <input type="text" value={tariffName} onChange={(e) => { setTariffName(e.target.value) }} className='form-control' placeholder='Enter Tariff Name'></input>
                                        </div>
                                        <div className='mb-3 col-md-3 mt-4'>
                                            <label className='mb-1'><strong>Select Tariff in Hours/Minute</strong></label>

                                            <select class="form-select" value={selectHour} onChange={(e) => { if (tariffList.length > 0) { if (window.confirm('All slab willl be removed. Are you sure want to change?')) setSelectHour(e.target.value); setTariffList([]); setStarting(0); setIsInfinite(false); setIsAddTariffSlabDisabled(false) } else setSelectHour(e.target.value) }} aria-label="Default select example">
                                                <option value="">Select Minutes/Hours</option>
                                                <option value="minute">Minute</option>
                                                <option value="hours">Hour</option>

                                            </select>
                                        </div>

                                        <div className='mb-3  col-md-3'>
                                            <label className='mb-1'><strong>Lost Ticket</strong></label>
                                            <input type="number" min="0" value={lostTicket} onChange={(e) => { setLostTicket(e.target.value) }} className='form-control' placeholder='Enter Lost Ticket Charge'></input>
                                        </div>

                                        <div className='mb-3  col-md-3'>
                                            <label className='mb-1'><strong>Cleaning Charge</strong></label>
                                            <input type="number" min="0" value={cleaningCharge} onChange={(e) => { setCleaningCharge(e.target.value) }} className='form-control' placeholder='Enter Cleaning Service Charge'></input>
                                        </div>

                                        {isAddTariffSlabDisabled ? (

                                            <h3>Ready to created tariff ?</h3>

                                        ) : (

                                            <div className="card-body shadow rounded">
                                                <div className="row">
                                                    <div className='mb-3  col-md-3'>
                                                        <label className='mb-1'><strong>Starting </strong></label>
                                                        <input type="number" className='form-control' value={starting} onChange={(e) => { setStarting(e.target.value) }} readOnly placeholder='Enter Starting'></input>
                                                    </div>
                                                    <div className='mb-3  col-md-3'>
                                                        <label className='mb-1'><strong>Ending </strong></label>
                                                        <input type="number" disabled={DailyCheckBox || weeklyCheckBox || monthlyCheckBox} min="0" value={ending} onChange={(e) => { setEnding(e.target.value) }} className='form-control' placeholder='Enter'></input>
                                                    </div>

                                                    <div className="form-check  mb-3 mt-4 col-md-1 ">
                                                        <input className="form-check-input" disabled={DailyCheckBox || weeklyCheckBox || monthlyCheckBox} type="checkbox" checked={isIterate} onChange={(e) => { setIsIterate(e.target.checked) }} value="" id="flexCheckDefault" />
                                                        <label className="form-check-label" for="flexCheckDefault">
                                                            Iterate
                                                        </label>
                                                        {/* {isIterate ?
                <>
                    <div className='mb-3 col-md-3 mt-4'>
                        <label className='mb-1'><strong>Select Hours/Minute</strong></label>
                        <select class="form-select" value={iterateSelectHour} onChange={(e) => { setIterateSelectHour(e.target.value) }} aria-label="Default select example">
                            <option value="">Select Minute/Hour</option>
                            <option value="minute">Minute</option>
                            <option value="hours">Hour</option>

                        </select>

                    </div>
                    <div className='mb-3  col-md-3'>
                        <label className='mb-1'><strong>Iterate Every</strong></label>
                        <input type="number" min="0" value={iterrateEvery} onChange={(e) => { setIterateEvery(e.target.value) }} className='form-control' placeholder='Enter'></input>
                    </div>
                </>
                :
                ''
            } */}
                                                        {/* <div className="form-check  mb-3 mt-4 col-md-1 ">
                <input className="form-check-input" type="checkbox" onChange={(e) => { setIsInfinite(e.target.checked) }} value="" id="flexCheckDefault" />
                <label className="form-check-label" for="flexCheckDefault">
                    Infinite
                </label>
            </div>

            <div>
                <Button className="me-2" onClick={handleSubmit} disabled={isAddTariffSlabDisabled} varient="outline-primary">
                    ADD
                </Button>
            </div> */}

                                                    </div>

                                                    {isIterate ?
                                                        <>
                                                            <div className='mb-3 col-md-3 mt-4'>
                                                                <label className='mb-1'><strong>Select Iterate in Hours/Minute</strong></label>
                                                                <select class="form-select" value={iterateSelectHour} disabled={DailyCheckBox || weeklyCheckBox || monthlyCheckBox} onChange={(e) => { setIterateSelectHour(e.target.value) }} aria-label="Default select example">
                                                                    <option value="">Select Minute/Hour</option>
                                                                    <option value="minute">Minute</option>
                                                                    <option value="hours">Hour</option>

                                                                </select>

                                                            </div>
                                                            <div className='mb-3  col-md-3'>
                                                                <label className='mb-1'><strong>Iterate Every</strong></label>
                                                                <input type="number" min="0" disabled={DailyCheckBox || weeklyCheckBox || monthlyCheckBox} value={iterrateEvery} onChange={handleIterateEveryChange} className='form-control' placeholder='Enter'></input>
                                                            </div>
                                                        </>
                                                        :
                                                        ''
                                                    }

                                                    <div className='mb-3  col-md-3'>
                                                        <label className='mb-1'><strong>Price</strong></label>
                                                        <input type="number" min="0" disabled={DailyCheckBox || weeklyCheckBox || monthlyCheckBox} value={price} onChange={(e) => { setPrice(e.target.value) }} className='form-control' placeholder='Enter Price'></input>
                                                    </div>

                                                    <div className='form-check  mb-3 mt-4 col-md-1 '>
                                                        <input className="form-check-input" type="checkbox" checked={isInfinite} disabled={DailyCheckBox || weeklyCheckBox || monthlyCheckBox} onChange={(e) => { setIsInfinite(e.target.checked) }} value="" id="flexCheckDefault" />
                                                        <label className="form-check-label" for="flexCheckDefault">
                                                            Infinite
                                                        </label>
                                                    </div>
                                                    <div className='form-check  mb-3 mt-4 col-md-6 row '>
                                                        <div className="col-md-3">
                                                            <input className="form-check-input" type="checkbox" checked={DailyCheckBox} onChange={handleDailyCheckBox} value="" id="flexCheckDefault" />
                                                        </div>
                                                        <label className="form-check-label" for="flexCheckDefault">
                                                            Daily rate
                                                        </label>
                                                        <div className="col-md-9">
                                                            <input type="number" min="0" value={DailyRateInput} disabled={!DailyCheckBox} onChange={(e) => { setDailyRateInput(e.target.value) }} className='form-control' placeholder='Enter'></input>
                                                        </div>
                                                    </div>
                                                    <div className='form-check  mb-3 mt-4 col-md-6 row '>
                                                        <div className="col-md-3">
                                                            <input className="form-check-input" type="checkbox" checked={weeklyCheckBox} onChange={handleWeeklyCheckBox} value="" id="flexCheckDefault" />
                                                        </div>
                                                        <label className="form-check-label" for="flexCheckDefault">
                                                            Weekly rate
                                                        </label>
                                                        <div className="col-md-9">
                                                            <input type="number" min="0" value={weeklyRateInput} disabled={!weeklyCheckBox} onChange={(e) => { setWeeklyRateInput(e.target.value) }} className='form-control' placeholder='Enter'></input>
                                                        </div>
                                                    </div>
                                                    <div className='form-check  mb-3 mt-4 col-md-6 row '>
                                                        <div className="col-md-3">
                                                            <input className="form-check-input" type="checkbox" checked={monthlyCheckBox} onChange={handleMonthlyCheckBox} value="" id="flexCheckDefault" />
                                                        </div>
                                                        <label className="form-check-label" for="flexCheckDefault">
                                                            Monthly Rate
                                                        </label>
                                                        <div className="col-md-9">
                                                            <input type="number" min="0" value={monthlyRateInput} disabled={!monthlyCheckBox} onChange={(e) => { setMonthlyRateInput(e.target.value) }} className='form-control' placeholder='Enter'></input>
                                                        </div>
                                                    </div>



                                                    <div className='mb-3  mt-5 col-md-2'>
                                                        <Button className="me-2" onClick={handleSubmit} disabled={isAddTariffSlabDisabled} varient="outline-primary">
                                                            ADD
                                                        </Button>
                                                    </div>

                                                </div>
                                            </div>
                                        )}


                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* <div className="card"> */}
                        <div className="card-body">

                            <DataTable
                                columns={columns}
                                data={tariffList}
                                // title="Tariff Table"
                                // expandableRowsComponent={expandableTariffTable}
                                // expandableRows
                                customStyles={tableCustomStyles}

                            />
                            {/* <TariffTable/> */}
                        </div>
                        {/* </div> */}
                    </div>



                    :

                    (
                        <div className="card">
                            <div className="card-body">

                                <DataTable
                                    columns={mainColumns}
                                    data={allTariffsArray}
                                    // title="Tariff Table"
                                    expandableRowsComponent={expandableTariffTable}
                                    expandableRows
                                    customStyles={tableCustomStyles}

                                />
                                {/* <TariffTable/> */}
                            </div>
                        </div>


                    )


                }



            </>
        </>
    )

}

export default ManageTariff