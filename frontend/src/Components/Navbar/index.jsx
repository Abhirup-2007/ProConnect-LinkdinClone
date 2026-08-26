import React from 'react'
import styles from "./styles.module.css";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer/page';

function Navbar() {
    const router = useRouter()
    const authState = useSelector((state) => state.auth)
    const dispatch = useDispatch()

  return (
    <div className={styles.container}>
        <nav className={styles.navbar}>
            <h1 style={{cursor:"pointer"}} 
            onClick={()=>router.push("/")}
            >Pro Connection</h1>
            <div className={styles.navBarOptionContainer}>
            {
              authState.profileFetched && authState.user?.userId?.name && (
                <div style={{display:"flex" , gap:"1.2rem" , cursor:"pointer"}}>
                        <p>Hey, {authState.user.userId.name}</p>
                        <p style={{fontWeight:"bold"}}
                        onClick={() => router.push("/profile")}
                        >Profile</p>
                        <p style={{fontWeight:"bold"}}
                        onClick={()=> {
                          localStorage.removeItem("token")
                          dispatch(reset())
                          router.push("/login")
                        }}
                        >logout</p>
                </div>
              )  
            }

            {
                !authState.profileFetched && !authState.user?.userId?.name && (
                <div onClick={()=>router.push("/login")} className={styles.buttonJoin}>
                    <p>be a part</p>
                </div>)
            }
            </div>
        </nav>
    </div>
  )
}

export default Navbar