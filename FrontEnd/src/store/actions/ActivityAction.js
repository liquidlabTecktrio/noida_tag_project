
import axios from "axios";
import config from "../../services/config";


const GetActivities={
    loadActivities(dispatch){
        dispatch({type:'LOAD_ACTIVITIES', payload:null})
        axios.get(config.baseUrl+"getAllActivities").then((activities) => { console.log(activities); dispatch({type:"GET_ACTIVITIES",  payload:activities})}).catch(()=>{
            dispatch({type:"ERROR_ACTIVITIES",payload:null})
        }).finally(()=>{})
    },

    updateActivities(dispatch, item){
        dispatch({type:'UPDATE_ACTIVITY',item:item})
    },
    
    editActivities(dispatch, item){
        dispatch({type:'EDIT_ACTIVITY',item:item})
    }

}
export default GetActivities