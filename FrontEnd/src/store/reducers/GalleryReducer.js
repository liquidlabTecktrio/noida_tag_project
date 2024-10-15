
const initialState={
    galleryImageList:[],
    editGalleryObj:{},
    loading:false,
    error:false
};

function GalleryReducer(state = initialState, action){
    switch(action.type){
        case'LOAD_Gallery':
            return {...state, galleryImageList:[],editGalleryObj:{}, error:false, loading:true }
        case 'GET_Gallery':
            console.log(action)
            return{...state, galleryImageList:action.payload,editGalleryObj:{}, error:false, loading:false}
        case 'ERROR_Gallery':
            return{...state, galleryImageList:[], editGalleryObj:{}, error:true, loading:false }
        case 'UPDATE_GALLERY':
                console.log(action.item);
                state.galleryImageList.data=action.item
            return{...state, galleryImageList:state.galleryImageList,editGalleryObj:{}, error:false, loading:false}
        case 'EDIT_GALLERY':
            
            return {...state, galleryImageList:state.galleryImageList,editGalleryObj:action.item, error:false, loading:false}
        default:
            return state;
    }
};

export default GalleryReducer
