import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducer/authReducer/page';
import postReducer from './reducer/postReducet/page';

const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer, 
  },
});

export default store;
