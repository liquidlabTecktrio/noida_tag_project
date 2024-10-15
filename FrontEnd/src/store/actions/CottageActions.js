import axios from "axios";
import config from "../../services/config";

const GetCottages={
    loadCottages(dispatch){
        dispatch({type:'LOAD_COTTAGES', payload:null})
        axios.get(config.baseUrl+"getAllCottages").then((cottages) => { console.log(cottages); dispatch({type:"GET_COTTAGES",  payload:cottages})}).catch(()=>{
            dispatch({type:"ERROR_COTTAGES",payload:null})
        }).finally(()=>{})
    },


    updateCottages(dispatch, item){
        dispatch({type:'UPDATE_COTTAGES',item:item})
    },
    
    editCottages(dispatch,item){
        dispatch({type:'EDIT_COTTAGES', item:item})
    },

}
export default GetCottages