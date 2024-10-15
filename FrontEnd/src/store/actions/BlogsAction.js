
import axios from "axios";
import config from "../../services/config";


const GetBlogs={
    loadBlogs(dispatch){
        dispatch({type:'LOAD_BLOGS', payload:null})
        axios.get(config.baseUrl+"getAllBlogs").then((blogs) => {  dispatch({type:"GET_BLOGS",  payload:blogs})}).catch(()=>{
            dispatch({type:"ERROR_BLOGS",payload:null})
        }).finally(()=>{})
    },

    updateBlogs(dispatch, item){
        dispatch({type:'UPDATE_BLOGS',item:item})
    },
    
    editBlogs(dispatch, item){
        dispatch({type:'EDIT_BLOGS',item:item})
    }

}
export default GetBlogs