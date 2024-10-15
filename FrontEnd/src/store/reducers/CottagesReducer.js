
const initialState={
    cottagesList:[],
    loading:false,
    editCottageObj:{},
    error:false
};

function CottagesReducer(state = initialState, action){
    switch(action.type){
        case'LOAD_COTTAGES':
            return {...state, cottagesList:[], editCottageObj:{}, error:false, loading:true }
        case 'GET_COTTAGES':
            console.log(action)
            return{...state, cottagesList:action.payload, editCottageObj:{}, error:false, loading:false}
        case 'ERROR_COTTAGES':
            return{...state, cottagesList:[], editCottageObj:{}, error:true, loading:false }
        case 'UPDATE_COTTAGES':
                console.log(action.item);
                state.cottagesList.data=action.item
            return{...state, cottagesList:state.cottagesList, editCottageObj:{}, error:false, loading:false};
        case 'EDIT_COTTAGES':
                console.log('EDIT_COTTAGES: ', action.item);
            return { ...state, contactUsList: state.contactUsList,editCottageObj:action.item, error: false, loading:false }
        default:
            return state;
    }
};

export default CottagesReducer
