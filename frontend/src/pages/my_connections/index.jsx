import { BASE_URL } from '@/config/page';
import {  acceptConnectionRequest, getMyAllConnection } from '@/config/redux/action/authAction/page';
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./styles.module.css";
import { getAboutUser } from "@/config/redux/action/authAction/page";
import { useRouter } from 'next/router';


function MyConnectionsPage() {

  const dispatch = useDispatch();
  const router = useRouter()
  const authState = useSelector((state) => state.auth )

  useEffect(() => {
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }, []);

  useEffect(() => {
      dispatch(getMyAllConnection({token:localStorage.getItem("token")}))
    },[])

  // useEffect(() => {
  //     if(authState.connectionRequest.length != 0){
  //       console.log(authState.connectionRequest)
  //     }
  // },[authState.connectionRequest])

  async function handleButtonAccept(e , requestId) {
    e.stopPropagation();
   
    console.log("Accept Request ID:", requestId);
     await dispatch(
    acceptConnectionRequest({
      token: localStorage.getItem("token"),
      requestId,
      action_type: "accept",
    })
  );
  }

  return (
    <UserLayout>
        <DashboardLayout>
            <div className={styles.container}>
                <h1>My Connection</h1>

                {
                  authState.connectionRequest.length != 0 && authState.connectionRequest.filter((connection) => connection?.status_accepted === false).map((user) =>{
                    return (
                      <div 
                      onClick={() => {
                        router.push(`/view_profile/${user.userId.username}`)
                      }}
                      key={user._id} className={styles.userCard}>
                        <div style={{display:"flex" ,alignItems:"center",gap:"1.2rem"}}>
                      <div  className={styles.profilePicture}>
                        <img src={`${BASE_URL}/${user.userId.profilePicture}`} />
                        </div>
                        <div className={styles.userInfo}>
                          <h3>{user.userId.name}</h3>
                          <p>{user.userId.username}</p>
                        </div>
                        </div>
                        <button className={styles.connectedButon}
                        onClick={(e) =>handleButtonAccept(e, user._id)}
                        >Accept</button>
                      </div>
                    );
                  })
                }
                <h1>my net work</h1>
                {authState.connectionRequest.filter((connection) => connection?.status_accepted === true).map((user) =>{
                  return(
                    <div 
                      onClick={() => {
                        router.push(`/view_profile/${user.userId.username}`)
                      }}
                      key={user._id} className={styles.userCard}>
                        <div style={{display:"flex" ,alignItems:"center",gap:"1.2rem"}}>
                      <div  className={styles.profilePicture}>
                        <img src={`${BASE_URL}/${user.userId.profilePicture}`} />
                        </div>
                        <div className={styles.userInfo}>
                          <h3>{user.userId.name}</h3>
                          <p>{user.userId.username}</p>
                        </div>
                        </div>
                      </div>
                  )
                })}
            </div>
        </DashboardLayout>
    </UserLayout>
  )
}

export default MyConnectionsPage