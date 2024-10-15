import axios from "axios";
import config from "../../services/config";

const GetGalleryIamges={
    loadGallery(dispatch){
        dispatch({type:'LOAD_GALLERY', payload:null})
        axios.get(config.baseUrl+"getAllGalleryImages").then((gallery) => { console.log(gallery); dispatch({type:'GET_Gallery',  payload:gallery})}).catch(()=>{
            dispatch({type:'ERROR_GALLERY',payload:null})
        }).finally(()=>{})
    },


    updateGallery(dispatch, item){
        dispatch({type:'UPDATE_GALLERY',item:item})
    },

    editGallery(dispatch, item){
        dispatch({type:'EDIT_GALLERY',item:item})
    },
}
export default GetGalleryIamges