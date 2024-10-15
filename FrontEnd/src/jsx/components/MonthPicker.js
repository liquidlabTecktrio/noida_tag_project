import React, { Fragment, useEffect, useState } from "react";
import { DatePicker,KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import { store } from "../../store/store";



const StaticDatePicker = (props) => {
  console.log('props: ', props);
  // let defaultDate = new Date();
  // defaultDate.setDate(defaultDate.getDate()+3)

  useEffect(()=>{
 
  if(props.Type != null){
    var dateArray = props.Type.split('-')
   
    const propsDate = new Date (dateArray[1], parseInt(dateArray[0])-1, 1)
    // console.log('propsDate: ', propsDate);
    changeDate(propsDate)
  }

  }, [])
  
  const [date, changeDate] = useState(new Date());
  
  store.dispatch({type:'UPDATE_MONTHYEAR',item: date});


  return (
    <Fragment>
      {/* <DatePicker
        autoOk
        variant="static"
        openTo="year"
        value={date}
        onChange={changeDate}
      /> */}
<MuiPickersUtilsProvider utils={DateFnsUtils}>
<KeyboardDatePicker style={{"marginTop":"1"}}

views={["year", "month"]}
        autoOk={true}
        orientation="portrait"
        inputVariant="outlined"
        format="MM/yyyy"
    //    helperText="select month"
        variant="dialog" 
        openTo="month"
        label="Select month"
        animateYearScrolling={true}
        InputAdornmentProps={{position:"start"}}
        value={date}
        onChange={changeDate}
        disableFuture={true}
      DialogProps
       
      />
</MuiPickersUtilsProvider>
      
    </Fragment>
  );
};

export default StaticDatePicker;
