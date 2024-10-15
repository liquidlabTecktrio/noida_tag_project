const initialState={
    bannersList:[],
    editBannerObj:{},
    error: false,
    loading: false,
};

function BannersReducer(state = initialState, action) {
    switch (action.type) {
    case 'LOAD_BANNERS':
    return { ...state, bannersList:[],editBannerObj:{}, error: false, loading:true }
    case 'GET_BANNERS':
    return { ...state, bannersList: action.payload, editBannerObj:{}, error: false, loading:false  }
    case 'ERROR_BANNERS':
    return { ...state, bannersList: [],editBannerObj:{}, error: true, loading:false }
    case 'UPDATE_BANNERS':
        console.log(action.item);
        state.bannersList.data = action.item
        console.log(' state.bannersList.data: ',  state.bannersList);
    return { ...state, bannersList: state.bannersList,editBannerObj:{}, error: false, loading:false  }
    case 'EDIT_BANNER':
        console.log('EDIT_BANNER: ', action.item);
        return { ...state, bannersList: state.bannersList,editBannerObj:action.item, error: false, loading:false }
    // case 'CLEAR_BANNER_ROWDATA':
    //     console.log('CLEAR_BANNER_ROWDATA: ', action.item);
    //     return { ...state, bannersList: state.bannersList,editBannerObj:{}, error: false, loading:false }
    default:
    return state;
    }
    };


export default BannersReducer;
