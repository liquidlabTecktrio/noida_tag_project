
import axios from "axios";
import config from "../../services/config";


const GetTestimonials={
    loadTestimonials(dispatch){
        dispatch({type:'LOAD_TESTIMONIALS', payload:null})
        axios.get(config.baseUrl+"getAllTestimonials").then((testimonials) => { console.log(testimonials); dispatch({type:"GET_TESTIMONIALS",  payload:testimonials})}).catch(()=>{
            dispatch({type:"ERROR_TESTIMONIALS",payload:null})
        }).finally(()=>{})
    },

    updateTestimonials(dispatch, item){
        dispatch({type:'UPDATE_TESTIMONIALS',item:item})
    },
    
    editTestimonials(dispatch, item){
        dispatch({type:'EDIT_TESTIMONIALS',item:item})
    }

}
export default GetTestimonials