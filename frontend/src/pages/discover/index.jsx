import { getAllUsers } from '@/config/redux/action/authAction/page'
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles  from "./styles.module.css"
import {BASE_URL} from "@/config/page"
import { useRouter } from 'next/router'
import { getAboutUser } from "@/config/redux/action/authAction/page";

function Discover() {
  const router = useRouter()
  const dispatch =  useDispatch()
  const authState = useSelector((state) => state.auth)

  useEffect(()=>{
    if (!authState.all_profile_fetched) {
      dispatch(getAllUsers())
    }
  },[])
  useEffect(() => {
        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  }, []);


  return (
    <UserLayout>
        <DashboardLayout>
            <div>
             <h1  style={{marginLeft:"3rem"}}>Discover</h1>
             <div className={styles.allUserProfile}>
              {
                authState.all_profile_fetched && authState.all_Users.map((user) =>(
                  <div className={styles.userCard} key={user._id}
                  onClick={()=> router.push(`/view_profile/${user.userId.username}`)}
                  >
                      <img className={styles.userCard_image}
                       src={`${BASE_URL}/${user.userId.profilePicture}`} />
                      <div>
                        <h2>{user.userId.name}</h2>
                        <p>{user.userId.username}</p>
                      </div>
                  </div>
                ))
              }
             </div>
            </div>
        </DashboardLayout>
    </UserLayout>
  )
}

export default Discover