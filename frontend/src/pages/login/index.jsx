import UserLayout from "@/layout/UserLayout";
import styles from "./styles.module.css";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { login, register } from "@/config/redux/action/authAction/page.js";

export default function Login() {
  const formRef = useRef(null);
  const [isSignup, setIsSignup] = useState(null);
  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
    name: "",
  });

  const authState = useSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  function handleChange(e) {
    const { value, name } = e.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
    }
  }, [authState.loggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSignup) {
      dispatch(register(user));
    } else {
      dispatch(login(user));
    }
  };
  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.cardContainer}>
          <div className={styles.cardContainer__left}>
            <p className={styles.cardleft__heading}>
              {isSignup ? "Signup" : "Login"}
            </p>
            <form
              className={styles.inputContainer}
              onSubmit={handleSubmit}
              ref={formRef}
            >
              {isSignup && (
                <div className={styles.inputRow}>
                  <input
                    className={styles.inputField}
                    type="text"
                    placeholder="Username"
                    name="username"
                    value={user.username}
                    onChange={handleChange}
                  />
                  <input
                    className={styles.inputField}
                    type="text"
                    placeholder="Name"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                  />
                </div>
              )}
              <input
                className={styles.inputField}
                type="text"
                placeholder="Email"
                name="email"
                value={user.email}
                onChange={handleChange}
              />
              <input
                className={styles.inputField}
                type="text"
                placeholder="Password"
                name="password"
                value={user.password}
                onChange={handleChange}
              />
            </form>
            <br />
            <div className={styles.buttonWithOutline}>
              <p onClick={() => formRef.current.requestSubmit()}>
                {isSignup ? "Signup" : "Login"}
              </p>
            </div>
          </div>
          <div className={styles.cardContainer__right}>
            <div className={styles.cardContainer__col}>
              <p onClick={() => setIsSignup(true)}>Signup</p>
              <p onClick={() => setIsSignup(false)}>login</p>
            </div>
            <p className={styles.authMessage}  style={{color:authState.isSuccess ? "green" : "red"}}>{authState.message.message || authState.message}</p>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}
