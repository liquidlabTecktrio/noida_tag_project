const initialState={
    contactUsList:[],
    error: false,
    loading: false,
};
function contactUsReducer(state = initialState, action) {
        switch (action.type) {
        case 'LOAD_CONTACTUS':
        return { ...state, contactUsList:[], error: false, loading:true }
        case 'GET_CONTACTUS':
        return { ...state, contactUsList: action.payload,  error: false, loading:false  }
        case 'ERROR_CONTACTUS':
        return { ...state, contactUsList: [],  error: true, loading:false }
        case 'UPDATE_LATEST_CONTACTS_AFTER_DELETE':
            console.log(action.item);
            //  console.log('state.contactUsList: ', state.contactUsList.data);
            // console.log('state.contactUsList: ', state.contactUsList);
            state.contactUsList.data = action.item
            //  return{...state,contactUsList:state.contactUsList, error:false, loading:false }
        return { ...state, contactUsList: state.contactUsList, error: false,  loading:false  }
        default:
        return state;
        }
        };





    export default contactUsReducer;

