import clientServer, { BASE_URL } from "@/config/page";
import DashboardLayout from "@/layout/DashboardLayout";
import UserLayout from "@/layout/UserLayout";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import styles from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getAllUsers,
  getConnectionRequrest,
  sendConnectionRequest,
  getAboutUser,
} from "@/config/redux/action/authAction/page";

function ViewProfile({ userProfile }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.post);

  const [userPost, setUserPosts] = useState([]);
  const [isCurrentUserInConnection, setIsCurrentUserInConnection] =
    useState(false);
  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const getUserPost = async () => {
    await dispatch(getAllUsers());
    await dispatch(
      getConnectionRequrest({ token: localStorage.getItem("token") }),
    );
  };

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  }, []);

  useEffect(() => {
    getUserPost();
  }, []);

  useEffect(() => {
    let post = postState.posts.filter((post) => {
      return post.userId.username === router.query.username;
    });
    setUserPosts(post);
  }, [postState.posts]);

  useEffect(() => {
    if (
      authState.connections.some(
        (user) => user.connectionId._id === userProfile.userId._id,
      )
    ) {
      setIsCurrentUserInConnection(true);
      if (
        authState.connections.find(
          (user) => user.connectionId._id === userProfile.userId._id,
        ).status_accepted === true
      ) {
        setIsConnectionNull(false);
      }
    }
  }, [authState.connections]);

  useEffect(() => {
    if (authState.isTokenThere) {
      dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    }
  }, [authState.isTokenThere, dispatch]);

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <img src={`${BASE_URL}/${userProfile.userId.profilePicture}`} />
          </div>

          <div className={styles.profileContainer_details}>
            <div className={styles.profileContainer_left}>
              <div className={styles.profileContainer_name_and_button_set}>
                <div
                  style={{
                    display: "flex",
                    width: "fit-content",
                    alignItems: "center",
                    gap: "1.2rem",
                  }}
                >
                  <h2>{userProfile.userId.name}</h2>
                  <p style={{ color: "grey" }}>{userProfile.userId.username}</p>
                </div>

                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  {isCurrentUserInConnection ? (
                    <button className={styles.connectedButon}>
                      {isConnectionNull ? "Pending" : "Connected"}
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        dispatch(
                          sendConnectionRequest({
                            token: localStorage.getItem("token"),
                            user_id: userProfile.userId._id,
                          }),
                        )
                      }
                      className={styles.connectBtn}
                    >
                      Connect
                    </button>
                  )}
                  <div
                    style={{ cursor: "pointer", width: "1rem" }}
                    onClick={() =>
                      window.open(
                        `${BASE_URL}/user/download_resume?id=${userProfile.userId._id}`,
                        "_blank",
                      )
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <p>{userProfile.bio}</p>
              </div>
            </div>

            <div className={styles.recentActivity}>
              <h3>Recent Activity</h3>
              {userPost.map((post) => (
                <div key={post._id} className={styles.postCard}>
                  <div className={styles.card}>
                    <div className={styles.card_profileContainer}>
                      {post.media !== "" ? (
                        <img src={`${BASE_URL}/${post.media}`} />
                      ) : (
                        <div className={styles.mediaCard}></div>
                      )}
                    </div>
                    <p>{post.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.workHistory}>
            <h4>education history</h4>
            <div className={styles.workHistory_container}>
              {userProfile.education.map((work, index) => {
                return (
                  <div key={index} className={styles.workHistoryCard}>
                    <p
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                      }}
                    >
                      {work.school} - {work.degree}
                    </p>
                    <p>{work.fildOfStudy}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.workHistory}>
            <h4>Work history</h4>
            <div className={styles.workHistory_container}>
              {userProfile.pastWork.map((work, index) => {
                return (
                  <div key={index} className={styles.workHistoryCard}>
                    <p
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                      }}
                    >
                      {work.company} - {work.position}
                    </p>
                    <p>{work.years}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}

export async function getServerSideProps(context) {
  const request = await clientServer.get(
    "/user/get_uers_profile_and_user_based_on_username",
    {
      params: { username: context.query.username },
    },
  );

  const response = await request.data;

  return { props: { userProfile: request.data.profile } };
}

export default ViewProfile;
