import React from 'react';
import { useState } from 'react';
import DataTable from 'react-data-table-component';
import config from "../../../services/config";
import axios from 'axios';
import { Button } from 'react-bootstrap';


const TariffCreate = (tariffData) => {
    const [Tariff, setTariff] = useState(true);
    const [showTariff, setShowTariff] = useState(false);
    const addNewTariff = () => (
        setTariff(false),
        setShowTariff(true)
    )
    const [checked, setChecked] = useState(false);

    // const handleChange = () => {
    //     setChecked(true)
    // }

    // function createTariffApi(){

    //     axios({
    //        url: config.baseUrl + "createTariff",
    //        method:"POST",
    //        "Content-Type": "application/json",
    //        data: tariffData,
    //     })
    //     .then((res)=>{
    //         console.log('res: ', res);
    //         if (res.status == 200 ){
    //             setTariff(res.data.data);
    //         }else if (res.status == 201){
    //             alert(res.data.message)
    //         }else if (res.status == 401){
    //             alert("you are un ")
    //         }
    //     })
    // }
    //  http://localhost:8080/v1/admin/createTariff

    return (
        <>
            {Tariff
                ?
                (<div className='card'>
                    <div className='card-header'>
                        <h4 className='Card-title'>Tariff</h4>
                        <Button className='me-2' onClick={addNewTariff} variant='outline-primary' >Create Tariff </Button>
                    </div>
                </div>)
                :
                (
                    <div className='card-header'>
                        <h4 className='card-title'>Add Tariff</h4>
                        <div>
                            <Button className='me-2' variant="outline-primary">
                                cancel
                            </Button>
                            <Button className='me-2' variant="outline-primary">
                                Create Tariff
                            </Button>
                        </div>
                    </div>

                )
            }
            <>
                {showTariff ?
                    <div id="reults" className='search-results'>
                        <form>
                            <div className='row'>
                                {/* <div className='col-md-1'></div> */}
                                <div className='mb-3 mt-2 col-md-3'>
                                    <label className='mb-1'><strong>Tariff Name</strong></label>
                                    <input type="text" className='form-control' placeholder='Enter Tariff Name'></input>
                                </div>
                                <div className='mb-3 col-md-3 mt-4'>
                                    <label className='mb-1'><strong>Select Hours/Minute</strong></label>

                                    <select class="form-select" aria-label="Default select example">
                                        <option value="minute">Minute</option>
                                        <option value="hours">Hour</option>

                                    </select>
                                </div>
                                <div className='mb-3 mt-2 col-md-3'>
                                    <label className='mb-1'><strong>Hour</strong></label>
                                    <input type="number" min="0" className='form-control' value="0" disabled placeholder='Enter Hour'></input>
                                </div>
                                <div className='mb-3 mt-2 col-md-3'>
                                    <label className='mb-1'><strong>Minute</strong></label>
                                    <input type="number" min="0" className='form-control' placeholder='Enter Minute'></input>
                                </div>
                                <div className='mb-3 mt-2 col-md-3'>
                                    <label className='mb-1'><strong>Price</strong></label>
                                    <input type="number" min="0" className='form-control' placeholder='Enter Price'></input>
                                </div>


                                <div className="form-check  mb-3 mt-4 col-md-3 ">
                                    <input className="form-check-input" type="checkbox" onChange={(e) => { setChecked(e.target.checked) }} value="" id="flexCheckDefault" />
                                    <label className="form-check-label" for="flexCheckDefault">
                                        Iterate
                                    </label>
                                </div>
                                {checked ?
                                    <div className='mb-3 col-md-3 mt-4'>
                                        <label className='mb-1'><strong>Select Hours/Minute</strong></label>

                                        <select class="form-select" aria-label="Default select example">
                                            <option value="minute">Minute</option>
                                            <option value="hours">Hour</option>

                                        </select>
                                        {/* <div className='mb-3 mt-2 col-md-3'>
                                            <label className='mb-1'><strong>Price</strong></label>
                                            <input type="number" min="0" className='form-control' placeholder='Enter Price'></input>
                                        </div> */}
                                    </div>


                                    :
                                    ''

                                }
                                <div className="form-check  mb-3 mt-4 col-md-3 ">
                                    <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                    <label className="form-check-label" for="flexCheckDefault">
                                        Infinite
                                    </label>
                                </div>

                            </div>


                        </form>
                    </div>

                    :
                    <h2>xjjj</h2>
                }

            </>
        </>
    )
}

export default TariffCreate