import todoReducers from './Reducers';
import {combineReducers} from 'redux';
import contactUsReducer from './ContactReducer';

const rootReducers = combineReducers({
	// todoReducers
	contactUsData:contactUsReducer

})

export default rootReducers;