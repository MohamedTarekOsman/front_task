import { combineReducers } from 'redux';
import carReducer from './carReducer';

const rootReducer = combineReducers({
    carReducer: carReducer,
});

export default rootReducer;
