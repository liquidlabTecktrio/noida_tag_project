
const initialState={
  
    monthYearData:new Date(),
   
};

function MonthReducer(state = initialState, action){
    switch(action.type){
      

        case 'UPDATE_MONTHYEAR':
            // console.log('action: ', action.item);
            return {...state,monthYearData:action.item}
        // case 'GET_MONTHYEAR':


        default:
            return state;
    }
};

export default MonthReducer
