import React, { useEffect, useState } from "react";
import Nolesson from "../../Assets/Images/no-lesson-illustration.svg";
import Trash from "../../Assets/Images/trash.png";
import Edit from "../../Assets/Images/edit.png";
import { useNavigate } from "react-router-dom";

const NewCourse = () => {
  const [popupOpen, setPopupOpen] = useState({ open: false, data: null });
  const navigate = useNavigate()

  useEffect(() => {
    if (popupOpen) window.scrollTo(0, 1000);
  }, [popupOpen]);
  return (
    <div
      className="course-list-cnt new-course"
      style={{
        // height:  popupOpen ? "100vh" :"auto",
        overflow: popupOpen ? "hidden" : "scroll",
      }}
    >
      <div className="top-header-cnt">
        <div>
          <h3 className="course-new-title">Create New Course</h3>
          <p className="course-new-discription">
            Create new course and lets publish
          </p>
        </div>
        <div className="top-btn-cnt">
          <div
            className=" course-delete-btn "
            onClick={() => navigate('/')}
          >
            Cancel
          </div>
          <div
            className="add-new-lesson-btn"
            onClick={() => navigate('/')}
          >
            Save Course
          </div>
        </div>
      </div>
      <div className="input-split-cover">
        <form className="left-form">
          <div className="course-name-cnt">
            <p>Enter course Name</p>
            <input type="text" name="" id="" className="name-input" />
          </div>

          <div className="course-description-cnt">
            <p>Describe course</p>
            <textarea type="text" name="" id="" className="description-input" />
          </div>
          <div className="flex-input">
            <div className="course-name-cnt">
              <p>Enter course price</p>
              <input
                type="number"
                name=""
                id=""
                className="name-input price-input"
                placeholder="₹"
              />
            </div>
            <div className="course-name-cnt">
              <p>Upload course thumnale</p>
              <input
                type="file"
                name=""
                id=""
                className="styled-input"
                placeholder=""
              />
            </div>
          </div>
          <div className="course-description-cnt">
            <p>OverviewPoints</p>
            <div className="overview-input-cnt">
              <input
                type="text"
                name=""
                id=""
                className="name-input"
                placeholder="Heading"
              />
              <textarea
                type="text"
                name=""
                id=""
                className=" overview-input name-input"
                placeholder="Description"
              />
              <div className="overview-add-btn">
                <p>Add</p>
              </div>
            </div>
          </div>
        </form>
        <form className="form-right">
          <div className="form-right-header">
            <h3 className="course-new-title form-right-heading">
              List The Lessons
            </h3>
            <div
              className="add-new-lesson-btn"
              onClick={() => setPopupOpen({ open: true })}
            >
              Add new lesson{" "}
            </div>
          </div>
          <div className="no-lesson-cnt">
            <img src={Nolesson} alt="no-lesson" className="empty-lesson-img" />
          </div>
          <div className="lesson-list-cnt">
            {/* <div className="lesson" onClick={()=>setPopupOpen({open:false})}>
              <h1 className="lesson-number">1</h1>
              <div className="lesson-title-cnt">
                <h3 className="lesson-title">The heading of the lesson</h3>
              </div>
              <ul className="lesson-subtitle-cnt">
                <li>
                  <p className="lesson-subtitle">Strategic Planning Overview</p>
                  <p className="lesson-duration-txt">duration : 22:00</p>
                </li>
                <li>
                  <p className="lesson-subtitle">Strategic Planning Overview</p>
                  <p className="lesson-duration-txt">duration : 22:00</p>
                </li>
              </ul>
            </div>
            <div className="lesson">
              <h1 className="lesson-number">2</h1>
              <div className="lesson-title-cnt">
                <h3 className="lesson-title">The heading of the lesson</h3>
              </div>
              <ul className="lesson-subtitle-cnt">
                <li>
                  <p className="lesson-subtitle">Strategic Planning Overview</p>
                  <p className="lesson-duration-txt">duration : 22:00</p>
                </li>
                <li>
                  <p className="lesson-subtitle">Strategic Planning Overview</p>
                  <p className="lesson-duration-txt">duration : 22:00</p>
                </li>
              </ul>
            </div> */}
          </div>
        </form>
      </div>
      {popupOpen.open && (
        <div className="lesson-popup-cnt">
          <div className="lesson-new-cnt">
            <div className="form-right-header">
              <h3 className="course-new-title form-right-heading">
                Create New Lesson
              </h3>
              <div className="top-btn-cnt">
                <div
                  className="add-new-lesson-btn cancel-btn"
                  onClick={() => setPopupOpen(true)}
                >
                  Cancel
                </div>
                <div
                  className="add-new-lesson-btn"
                  onClick={() => setPopupOpen(true)}
                >
                  Add to Course
                </div>
              </div>
            </div>
            <div className="new-lesson-top">
              <div className="lesson-content-input-cnt">
                <div className="sublesson-name-cnt">
                  <p>Sub lesson Title</p>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="sublesson-title-input"
                  />
                </div>
                <div className="sublesson-content-cover">
                  <div className="input-cnt">
                    <p>Duration</p>
                    <input
                      type="text"
                      name=""
                      id=""
                      className="sublesson-duration-input sublesson-title-input "
                    />
                  </div>
                  <div className="input-cnt add-sublesson-btn">
                    <div className="sublesson-title-input center-media">
                      <p>upload video</p>
                      <input
                        type="file"
                        name="video-upload"
                        accept="video/*"
                        id=""
                        className="file-title-input "
                      />
                    </div>
                  </div>
                  <div
                    className="add-new-lesson-btn add-sublesson-btn"
                    onClick={() => setPopupOpen(false)}
                  >
                    Add
                  </div>
                </div>
              </div>
              <div className="lesson-name-cnt">
                <p>Lesson Title</p>
                <input
                  type="text"
                  name=""
                  id=""
                  className="lesson-title-input"
                />
              </div>
            </div>
            <div className="content-list">
              <div className="lesson-content-input-cnt sublesson">
                <div className="sublesson-name-cnt">
                  <p className="sublesson-title-txt">Sub lesson Title</p>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="sublesson-title-input sublesson-card-input"
                  />
                </div>
                <div className="sublesson-content-cover">
                  <div className="input-cnt sublesson-title-txt">
                    <p>Duration</p>
                    <input
                      type="text"
                      name=""
                      id=""
                      className="sublesson-duration-input sublesson-title-input sublesson-card-input"
                    />
                  </div>
                  <div className="input-cnt add-sublesson-btn">
                    <div className="sublesson-title-input center-media sublesson-card-input">
                      <p className="sublesson-title-txt">upload video</p>
                      <input
                        type="file"
                        name="video-upload"
                        accept="video/*"
                        id=""
                        className="file-title-input "
                      />
                    </div>
                  </div>
                  <div
                    className="add-new-lesson-btn add-sublesson-btn edit-sublesson-btn"
                    onClick={() => setPopupOpen(false)}
                  >
                    <div className="delete-btn">
                      <img
                        src={Trash}
                        alt="delete"
                        className="action-btn-img"
                      />
                    </div>
                    <div className="delete-btn">
                      <img src={Edit} alt="edit" className="action-btn-img" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewCourse;
