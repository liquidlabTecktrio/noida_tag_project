
const initialState={
    blogsList:[],
    editBlogsObj:{},
    loading:false,
    error:false
};

function BlogsReducer(state = initialState, action){
    switch(action.type){
        case'LOAD_BLOGS':
            return {...state, blogsList:[],editBlogsObj:{}, error:false, loading:true }
        case 'GET_BLOGS':
            // console.log(action)
            return{...state, blogsList:action.payload, editBlogsObj:{}, error:false, loading:false}
        case 'ERROR_BLOGS':
            return{...state, blogsList:[], editBlogsObj:{}, error:true, loading:false }
        case 'UPDATE_BLOGS':
                // console.log(action.item);
                state.blogsList.data=action.item
            return{...state, blogsList:state.blogsList,editBlogsObj:{}, error:false, loading:false};
        case 'EDIT_BLOGS':
            return{...state, blogsList:state.blogsList,editBlogsObj:action.item, error:false, loading:false}
        default:
            return state;
    }
};

export default BlogsReducer
