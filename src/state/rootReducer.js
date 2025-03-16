import { combineReducers } from 'redux';
import userReducer from "./userSlice";
import taskReducer from "./taskSlice";

const rootReducer = combineReducers({
  user: userReducer,
  tasks: taskReducer
});

export default rootReducer;
