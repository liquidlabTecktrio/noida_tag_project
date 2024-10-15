
import axios from "axios";
import config from '../../services/config'
const GetBanners = {

    loadBanners(dispatch){ //"http://localhost:8000/admin/getAllBannerImages"
        dispatch({type:'LOAD_BANNERS', payload:null})
        axios.get(config.baseUrl+'getAllBannerImages').then(banners=>{console.log(banners); dispatch({type:'GET_BANNERS',payload:banners})}).catch((error)=>{
            dispatch({type:'ERROR_BANNERS',payload:null})
        })
    },

    updateBanners(dispatch,item){
        dispatch({type:'UPDATE_BANNERS',item:item})
    },

    loadUpdateBanner(dispatch){
        dispatch({type:'LOAD_UPDATE_BANNERS'})
        axios.get(config.baseUrl+"getAllBannerImages").then(banners=>{console.log(banners); dispatch({type:'GET_UPDATE_BANNERS',payload:banners})}).catch((error)=>{
            dispatch({type:'ERROR_BANNERS',payload:null})
    })
    },

    editBanners(dispatch,item){
        dispatch({type:'EDIT_BANNER', item:item})
    },

    // clearRowData(dispatch,item){
    //     dispatch({type:'CLEAR_BANNER_ROWDATA', item:item})
    // }


}
export default GetBanners;