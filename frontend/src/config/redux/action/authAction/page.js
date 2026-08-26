import { createAsyncThunk } from '@reduxjs/toolkit'
import clintServer from "../../../page.jsx"

export const login = createAsyncThunk(
  'users/login',
  async (user, thunkAPI) => {
    try{
        const response = await clintServer.post('/login', { email: user.email, password: user.password })
        if(response.data.token) {
            localStorage.setItem('token', response.data.token)
        }else {
            return thunkAPI.rejectWithValue({
                message: 'Invalid credentials'
            })
        }
        return response.data
    }catch (error) {
        return thunkAPI.rejectWithValue(error.response.data)
    }
  },
)

export const register = createAsyncThunk(
  'users/register',
  async (user, thunkAPI) => {
    try{
        const response = await clintServer.post("/register", {
        name: user.name,
        username: user.username,
        email: user.email,
        password: user.password,
      });
        return response.data
    }catch (error) {
        return thunkAPI.rejectWithValue(error.response.data)
    }
  },
)

export const getAboutUser = createAsyncThunk(
  "users/getAboutUser",
  async (user ,thunkAPI) => {
    try {
      const response = await clintServer.get("/get_user_and_profile" ,{
        params: { token: user.token }
      })

      return response.data
    }
    catch(error){
        return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

export const getAllUsers = createAsyncThunk(
  "user/getAllUser",
  async (_ , thunkAPI) =>{
    try {
      const response = await clintServer.get("/user/get_all_users")
      return response.data
      
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

export const sendConnectionRequest = createAsyncThunk(
  "user/sendConnectionRequest",
  async(user , thunkAPI) =>{
    try {
      const response = await clintServer.post("/user/send_connection_request" , {
        token: user.token,
        connection_id:user.user_id
      })
      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)      
    }
  }
)

export const getConnectionRequrest = createAsyncThunk(
  "user/getConnectionRequrest",
  async(user,thunkAPI) => {
    try {
      const response = await clintServer.get("/user/getConnectionRequests",{
        params:{
        token: user.token
      }
      })

      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)            
    }
  }
)

export const getMyAllConnection = createAsyncThunk(
  "user/getMyAllConnection",
    async(user,thunkAPI) => {
    try {
      const response = await clintServer.get("/user/user_connection_request",{
        params:{
        token: user.token
      }
      })

      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)            
    }
  }
)

export const acceptConnectionRequest = createAsyncThunk(
  "user/acceptConnectionRequest",
    async(user,thunkAPI) => {
    try {
      const response = await clintServer.post("user/accept_connection_request",{
        token: user.token,
         requestId :user.requestId, 
         action_type:user.action_type
      })

      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)            
    }
  }
)

