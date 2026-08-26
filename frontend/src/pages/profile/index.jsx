import DashboardLayout from "@/layout/DashboardLayout";
import styles from "./index.module.css";
import UserLayout from "@/layout/UserLayout";
import clientServer, { BASE_URL } from "@/config/page";
import { useEffect, useState } from "react";
import { getAboutUser } from "@/config/redux/action/authAction/page";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "@/config/redux/action/postAction/page";
import { useRouter } from "next/router";

export default function index() {
  const authState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [EducationIsModalOpen, setEducationIsModalOpen] = useState(false);
  const [workSection, setWorkSection] = useState({
    company: "",
    position: "",
    years: "",
  });
  const [educationSection, setEducationSection] = useState({
    school: "",
    degree: "",
    fildOfStudy: "",
  });
  const [userProfile, setUserProfile] = useState({});
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
    dispatch(getAllPosts());
  }, []);

  useEffect(() => {
    if (authState.user !== null) {
      setUserProfile(authState.user);
      let post = postState.posts.filter((post) => {
        return post.userId.username === authState.user.userId.username;
      });
      setUserPosts(post);
    }
  }, [authState.user, postState.post]);

  const updateProfilePicture = async (file) => {
    const formData = new FormData();

    formData.append("profile_picture", file);
    formData.append("token", localStorage.getItem("token"));
    const response = await clientServer.post(
      "/update_profile_picture",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const updateProfileData = async () => {
    const request = await clientServer.post("/update_profile", {
      token: localStorage.getItem("token"),
      name: userProfile.userId.name,
    });

    const response = await clientServer.post("/update_profile_data", {
      token: localStorage.getItem("token"),
      bio: userProfile.bio,
      currentPost: userProfile.currentPost,
      pastWork: userProfile.pastWork,
      education: userProfile.education,
    });
    dispatch(getAboutUser({ token: localStorage.getItem("token") }));
  };

  const handleWorkInputChange = (e) => {
    const { name, value } = e.target;
    setWorkSection({ ...workSection, [name]: value });
  };

  const handleEducationInputChange = (e) => {
    const { name, value } = e.target;
    setEducationSection((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.container}>
          <div className={styles.backDropContainer}>
            <label
              htmlFor="profilePictureUpload"
              className={styles.backDropOverlay}
            >
              <p>Edit</p>
            </label>
            <input
              id="profilePictureUpload"
              type="file"
              onChange={(e) => {
                updateProfilePicture(e.target.files[0]);
              }}
              hidden
            />
            <img src={`${BASE_URL}/${userProfile?.userId?.profilePicture}`} />
          </div>

          <div className={styles.profileContainer_details}>
            <div className={styles.profileContainer_left}>
              <div className={styles.profileContainer_left_container}>
                <div className={styles.profileContainer_name_and_button_set}>
                  <div
                    style={{
                      display: "flex",
                      width: "fit-content",
                      alignItems: "center",
                      gap: "1.2rem",
                    }}
                  >
                    <input
                      type="text"
                      className={styles.inputName}
                      value={userProfile?.userId?.name}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          userId: {
                            ...userProfile.userId,
                            name: e.target.value,
                          },
                        })
                      }
                    />
                    <p style={{ color: "grey" }}>
                      {userProfile?.userId?.username}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  ></div>
                </div>

                <div>
                  <textarea
                    value={userProfile?.bio}
                    onChange={(e) =>
                      setUserProfile({ ...userProfile, bio: e.target.value })
                    }
                    rows={Math.max(
                      3,
                      Math.ceil((userProfile?.bio?.length || 0) / 80),
                    )}
                    style={{ width: "100%" }}
                  />
                </div>
              </div>

              <div className={styles.media_side}>
                <h3>Recent Activity</h3>
                {userPosts?.map((post) => (
                  <div key={post?._id} className={styles.postCard}>
                    <div className={styles.card}>
                      <div className={styles.card_profileContainer}>
                        {post.media !== "" ? (
                          <img src={`${BASE_URL}/${post?.media}`} />
                        ) : (
                          <div className={styles.mediaCard}></div>
                        )}
                      </div>
                      <p>{post?.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Education  */}
          <div className={styles.educationHistory}>
            <h4>education history</h4>
            <div className={styles.educationHistory_container}>
              {userProfile?.education?.map((work, index) => {
                return (
                  <div key={index} className={styles.educationHistoryCard}>
                    <p
                      style={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.8rem",
                      }}
                    >
                      {work?.school} - {work?.degree}
                    </p>
                    <p>{work?.fildOfStudy}</p>
                  </div>
                );
              })}

              <button
                className={styles.addWork}
                onClick={() => setEducationIsModalOpen(true)}
              >
                Add education
              </button>
            </div>
          </div>
          {/* work  */}
          <div className={styles.workHistory}>
            <h4>Work history</h4>
            <div className={styles.workHistory_container}>
              {userProfile?.pastWork?.map((work, index) => {
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
                      {work?.company} - {work?.position}
                    </p>
                    <p>{work?.years}</p>
                  </div>
                );
              })}

              <button
                className={styles.addWork}
                onClick={() => setIsModalOpen(true)}
              >
                Add work
              </button>
            </div>
          </div>

          {userProfile != authState.user && (
            <div
              onClick={() => {
                updateProfileData();
              }}
              className={styles.updateButton}
            >
              Update profile
            </div>
          )}
        </div>

        {(isModalOpen || EducationIsModalOpen) && (
          <div
            className={styles.commentContainer}
            onClick={() => {
              setIsModalOpen(false);
              setEducationIsModalOpen(false);
            }}
          >
            <div
              className={styles.allCommentsContainer}
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <input
                className={styles.inputField}
                type="text"
                placeholder={isModalOpen ? "enter company" : "enter school"}
                name={isModalOpen ? "company" : "school"}
                value={
                  isModalOpen ? workSection.company : educationSection.school
                }
                onChange={
                  isModalOpen
                    ? handleWorkInputChange
                    : handleEducationInputChange
                }
                required
              />
              <input
                className={styles.inputField}
                type="text"
                placeholder={isModalOpen ? "enter position" : "enter degree"}
                name={isModalOpen ? "position" : "degree"}
                value={
                  isModalOpen ? workSection.position : educationSection.degree
                }
                onChange={
                  isModalOpen
                    ? handleWorkInputChange
                    : handleEducationInputChange
                }
                required
              />
              <input
                className={styles.inputField}
                type="text"
                placeholder={
                  isModalOpen ? "enter years" : "enter field of study"
                }
                name={isModalOpen ? "years" : "fildOfStudy"}
                value={
                  isModalOpen ? workSection.years : educationSection.fildOfStudy
                }
                onChange={
                  isModalOpen
                    ? handleWorkInputChange
                    : handleEducationInputChange
                }
                required
              />

              <div
                className={styles.updateWorkButton}
                onClick={() => {
                  if (isModalOpen) {
                    setUserProfile({
                      ...userProfile,
                      pastWork: [...userProfile.pastWork, workSection],
                    });
                    setIsModalOpen(false);
                  } else {
                    setUserProfile({
                      ...userProfile,
                      education: [...userProfile.education, educationSection],
                    });
                    setEducationIsModalOpen(false);
                  }
                }}
              >
                {isModalOpen ? "add work" : "add Education"}
              </div>
            </div>
          </div>
        )}
      </DashboardLayout>
    </UserLayout>
  );
}
