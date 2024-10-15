
const initialState={
    testimonialsList:[],
    editTestimonialObj:{},
    loading:false,
    error:false
};

function TestimonialsReducer(state = initialState, action){
    switch(action.type){
        case'LOAD_TESTIMONIALS':
            return {...state, testimonialsList:[],editTestimonialObj:{}, error:false, loading:true }
        case 'GET_TESTIMONIALS':
            console.log(action)
            return{...state, testimonialsList:action.payload, editTestimonialObj:{}, error:false, loading:false}
        case 'ERROR_TESTIMONIALS':
            return{...state, testimonialsList:[], editTestimonialObj:{}, error:true, loading:false }
        case 'UPDATE_TESTIMONIALS':
                console.log(action.item);
                state.testimonialsList.data=action.item
            return{...state, testimonialsList:state.testimonialsList,editTestimonialObj:{}, error:false, loading:false};
        case 'EDIT_TESTIMONIALS':
            return{...state, testimonialsList:state.testimonialsList,editTestimonialObj:action.item, error:false, loading:false}
        default:
            return state;
    }
};

export default TestimonialsReducer
