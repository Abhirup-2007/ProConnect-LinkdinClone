import { createAsyncThunk } from '@reduxjs/toolkit'
import clintServer from "../../../page.jsx"

export const getAllPosts = createAsyncThunk(
  'users/getAllPosts' ,
  async(thunkAPI) => {
    try{
       const response = await clintServer.get("/posts")
       return response.data
    }catch (error) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

export const createPost = createAsyncThunk(
  "user/createPost",
    async(userDate ,  thunkAPI) =>{
      const {file ,body} =userDate
        try{
          const formData = new FormData()
          formData.append("token" , localStorage.getItem("token"))
          formData.append("body" , body)
          formData.append("media" , file)

          const response = await clintServer.post("/post" , formData , {
            headers:{
              "Content-Type" : "multipart/form-data"
            }
          })

          if (response.status === 200) {
            return thunkAPI.fulfillWithValue("Post Upload")
          } else {
            return  thunkAPI.rejectWithValue("Post not Upload")
          }

        }catch(error){
          return  thunkAPI.rejectWithValue(error)
        }
    }
)

export const deletePost = createAsyncThunk(
    "user/deletePost",
    async(post_id ,thunkAPI) =>{
      try {
        const response = await clintServer.delete("/delete_posts",{
          data:{token:localStorage.getItem("token"),
            post_id:post_id.post_id
          }
        })

        return response
      } catch (error) {
        return  thunkAPI.rejectWithValue(error)
      }
    }
)

export const incremantPostLike  = createAsyncThunk(
  "user/incrementLike" ,
  async(post_id ,  thunkAPI) =>{
    try {
      const response = await clintServer.post("/increment_post_likes" , {
        post_id: post_id
      })

      return response.data
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  }
)

export const getAllCommnet = createAsyncThunk(
  "user/getAllComment",
  async(postData,thunkAPI) =>{
    try {
      const response = await clintServer.get("/get_all_comment" , {
        params:{
          post_id:postData.post_id
        }
      })

      return {
        comments:response.data,
        post_id:postData.post_id
      }

    } catch (error) {
      return thunkAPI.rejectWithValue("somethink was wrong")      
    }
  }
)

export const postComment = createAsyncThunk(
  "user/postComment",
  async(userData , thunkAPI) =>{
    try {
      const response = await clintServer.post("/comment",{
        token:localStorage.getItem("token"),
        post_id:userData.post_id,
        commentBody:userData.body
      })

      return response.data

    } catch (error) {
      return thunkAPI.rejectWithValue("somethink was wrong") 
    }
  }
) 