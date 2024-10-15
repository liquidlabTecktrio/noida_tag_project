import axios from 'axios';
import config from '../../services/config';

const GetContactus = {
    loadContactUs(dispatch){
        dispatch({type:'LOAD_CONTACTUS', payload:null})
        axios.get(config.baseUrl+"getAllContacts").then(contacts => { console.log(contacts); dispatch({type:"GET_CONTACTUS",payload: contacts})}).catch(()=>{
            dispatch({type:"ERROR_CONTACTUS",payload:null})
        }).finally(()=>{})
    },


    updateContactsAfterDelete(dispatch,item){
        dispatch({type:'UPDATE_LATEST_CONTACTS_AFTER_DELETE', item:item})
    },
   
}
export default GetContactus;


