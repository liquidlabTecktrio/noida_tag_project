
const initialState={
    activitiesList:[],
    editActivityObj:{},
    loading:false,
    error:false
};

function ActivitiesReducer(state = initialState, action){
    switch(action.type){
        case'LOAD_ACTIVITIES':
            return {...state, activitiesList:[],editActivityObj:{}, error:false, loading:true }
        case 'GET_ACTIVITIES':
            console.log(action)
            return{...state, activitiesList:action.payload, editActivityObj:{}, error:false, loading:false}
        case 'ERROR_ACTIVITIES':
            return{...state, activitiesList:[], editActivityObj:{}, error:true, loading:false }
        case 'UPDATE_ACTIVITY':
                console.log(action.item);
                state.activitiesList.data=action.item
            return{...state, activitiesList:state.activitiesList,editActivityObj:{}, error:false, loading:false};
        case 'EDIT_ACTIVITY':
            return{...state, activitiesList:state.activitiesList,editActivityObj:action.item, error:false, loading:false}
        default:
            return state;
    }
};

export default ActivitiesReducer
