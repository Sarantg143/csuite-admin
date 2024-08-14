import React, { useState, useEffect } from "react";
import axios from "axios";

const ELA = ({ data, closeTest, addTest }) => {
  const initialState = {
    question: "",
    answer: null,
    choices: [],
    questionNumber: null,
    description: "",
    difficulty: "",
    tags: [],
  };

  const [currentTest, setCurrentTest] = useState(data || []);
  const [currentQuestion, setCurrentQuestion] = useState(initialState);
  const [dropDown, setDropDown] = useState(false);
  const [difficultyDropDown, setDifficultyDropDown] = useState(false);
  const [sectionDropDown, setSectionDropDown] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [duration, setDuration] = useState({ hours: "", minutes: "" });

  const handleChoiceSelect = (index, value) => {
    setDropDown(false);
    setCurrentQuestion({
      ...currentQuestion,
      answer: { index: index, value: value },
    });
  };

  const handleChoiceInput = (index, value) => {
    const newChoices = [...currentQuestion.choices];
    newChoices[index] = value;
    setCurrentQuestion({ ...currentQuestion, choices: newChoices });
  };

  const handleNext = () => {
    const existingIndex = currentTest?.indexOf(currentQuestion);
    const updatestart = [...currentTest];
    if (existingIndex === -1) {
      updatestart?.push(currentQuestion);
      setCurrentTest(updatestart);
      setCurrentQuestion(initialState);
    } else if (existingIndex + 1 === currentTest.length) {
      updatestart[existingIndex] = currentQuestion;
      setCurrentTest(updatestart);
      setCurrentQuestion(initialState);
    } else {
      updatestart[existingIndex] = currentQuestion;
      setCurrentTest(updatestart);
      setCurrentQuestion(currentTest[existingIndex + 1]);
    }
  };

  const checkquestionMatch = (index) => {
    if (currentTest?.indexOf(currentQuestion) === index) return "#8949ff";
    return "transparent";
  };

  const questionValidation = () => {
    if (
      currentQuestion?.question.length > 5 &&
      currentQuestion?.answer &&
      currentQuestion?.choices?.length === 4 &&
      currentQuestion?.description &&
      currentQuestion?.difficulty &&
      currentQuestion?.tags?.length > 0
    )
      return true;
    return false;
  };

  const handleAddTest = async () => {
    try {
      const response = await axios.post("https://csuite-production.up.railway.app/api/question/", {
        questions: currentTest.map((q) => ({
          question: q.question,
          options: q.choices,
          answer: q.answer.value,
          description: q.description,
          difficulty: q.difficulty,
          tags: q.tags,
        })),
      });

      if (response.status === 201 || response.status === 200) {
        if (typeof addTest === "function") {
          addTest(currentTest);
        }
        if (typeof closeTest === "function") {
          closeTest();
        }
      } else {
        console.error("Failed to save the test. Server responded with:", response.status);
      }
    } catch (error) {
      console.error("Error saving test:", error.message);
    }
  };

  const handleUpdateDuration = async () => {
    if (!selectedSection) {
      console.error("Section is not selected");
      return;
    }
    
    try {
      const response = await axios.put(`https://csuite-production.up.railway.app/api/question/66bc5fbb7b56debaadf7377e/sections/${selectedSection}/duration`, {
        hours: duration.hours,
        minutes: duration.minutes
      });

      if (response.status === 200) {
        console.log("Duration updated successfully");
      } else {
        console.error("Failed to update duration. Server responded with:", response.status);
      }
    } catch (error) {
      console.error("Error updating duration:", error.message);
    }
  };

  return (
    <div className="ela-test-page">
      <p className="ela-title">Create or Edit your ELA assessment</p>
      <div className="questions-block-cnt">
        {currentTest?.map((test, index) => (
          <div
            className="question-block"
            style={{ background: checkquestionMatch(index) }}
            key={index}
            onClick={() => setCurrentQuestion(test)}
          >
            <p
              key={index}
              className="question-number"
              style={{
                color: checkquestionMatch(index) === "transparent" && "#8949ff",
              }}
            >
              {index + 1}
            </p>
          </div>
        ))}
        <div
          className="question-block"
          style={{ background: currentQuestion }}
          onClick={() => setCurrentQuestion(initialState)}
        >
          <p className="question-number">{currentTest?.length + 1}</p>
        </div>
      </div>
      <div className="ela-inputs-cnt">
        <div className="ela-question-input-cnt">
          <div>
            <p>Question</p>
            <textarea
              className="question-input ela-question-input"
              value={currentQuestion?.question}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  question: e.target.value,
                })
              }
            />
          </div>
          <div className="ela-choice-input-cover">
            <div className="choice-header">
              <p>Choices</p>
              <div className="select-answer-cnt">
                <p>Select Answer</p>
                <div className="selected-choice-display">
                  <p onClick={() => setDropDown(true)}>
                    {currentQuestion?.answer?.value
                      ? currentQuestion?.answer?.value
                      : "Not selected"}
                  </p>
                  {dropDown && (
                    <div className="drop-down-cnt">
                      <div
                        className="drop-down-choice"
                        onClick={() => handleChoiceSelect(0, "Choice one")}
                      >
                        <p>Choice one</p>
                      </div>
                      <div
                        className="drop-down-choice"
                        onClick={() => handleChoiceSelect(1, "Choice two")}
                      >
                        <p>Choice two</p>
                      </div>
                      <div
                        className="drop-down-choice"
                        onClick={() => handleChoiceSelect(2, "Choice three")}
                      >
                        <p>Choice three</p>
                      </div>
                      <div
                        className="drop-down-choice"
                        onClick={() => handleChoiceSelect(3, "Choice four")}
                      >
                        <p>Choice four</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="choice-cnt ela-choice-cnt">
              <div className="choice ela-choice">
                <p>Choice one</p>
                <input
                  type="text"
                  placeholder="Enter choice one"
                  value={
                    currentQuestion?.choices[0] ? currentQuestion?.choices[0] : ""
                  }
                  onChange={(e) => handleChoiceInput(0, e.target.value)}
                />
              </div>
              <div className="choice ela-choice">
                <p>Choice two</p>
                <input
                  type="text"
                  placeholder="Enter choice two"
                  value={
                    currentQuestion?.choices[1] ? currentQuestion?.choices[1] : ""
                  }
                  onChange={(e) => handleChoiceInput(1, e.target.value)}
                />
              </div>
              <div className="choice ela-choice">
                <p>Choice three</p>
                <input
                  type="text"
                  placeholder="Enter choice three"
                  value={
                    currentQuestion?.choices[2] ? currentQuestion?.choices[2] : ""
                  }
                  onChange={(e) => handleChoiceInput(2, e.target.value)}
                />
              </div>
              <div className="choice ela-choice">
                <p>Choice four</p>
                <input
                  type="text"
                  placeholder="Enter choice four"
                  value={
                    currentQuestion?.choices[3] ? currentQuestion?.choices[3] : ""
                  }
                  onChange={(e) => handleChoiceInput(3, e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="ela-description-cnt">
            <p>Describe the test</p>
            <textarea
              type="text"
              value={currentQuestion.description}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  description: e.target.value,
                })
              }
              className="ela-description description-input"
            />
          </div>
          <div className="ela-description-cnt">
            <p>Select Test Difficulty</p>
            <div
              className="ela-dropdown-box"
              onClick={() => setDifficultyDropDown(!difficultyDropDown)}
            >
                          <p>{currentQuestion.difficulty || "Choose"}</p>
              {difficultyDropDown && (
                <div className="ela-dropdown-cnt">
                  <div
                    className="ela-dropdown-element"
                    onClick={() => {
                      setCurrentQuestion({ ...currentQuestion, difficulty: "Easy" });
                      setDifficultyDropDown(false);
                    }}
                  >
                    <p style={{ color: "green" }}>Easy</p>
                  </div>
                  <div
                    className="ela-dropdown-element"
                    onClick={() => {
                      setCurrentQuestion({ ...currentQuestion, difficulty: "Medium" });
                      setDifficultyDropDown(false);
                    }}
                  >
                    <p style={{ color: "orange" }}>Medium</p>
                  </div>
                  <div
                    className="ela-dropdown-element"
                    onClick={() => {
                      setCurrentQuestion({ ...currentQuestion, difficulty: "Hard" });
                      setDifficultyDropDown(false);
                    }}
                  >
                    <p style={{ color: "red" }}>Hard</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="ela-description-cnt">
            <p>Tags</p>
            <input
              type="text"
              value={currentQuestion.tags.join(", ")}
              onChange={(e) => setCurrentQuestion({
                ...currentQuestion,
                tags: e.target.value.split(",").map(tag => tag.trim())
              })}
              className="ela-tags description-input"
            />
          </div>
          <div className="ela-description-cnt">
            <p>Select Section</p>
            <div
              className="ela-dropdown-box"
              onClick={() => setSectionDropDown(!sectionDropDown)}
            >
              <p>{selectedSection !== null ? `Section ${selectedSection}` : "Choose Section"}</p>
              {sectionDropDown && (
                <div className="ela-dropdown-cnt">
                  {[1, 2, 3, 4, 5].map((section) => (
                    <div
                      key={section}
                      className="ela-dropdown-element"
                      onClick={() => {
                        setSelectedSection(section);
                        setSectionDropDown(false);
                      }}
                    >
                      <p>Section {section}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="ela-description-cnt">
            <p>Set Duration</p>
            <div className="ela-timer-input-cnt">
              <div className="ela-timer-cover">
                <input
                  type="text"
                  placeholder="Hours"
                  value={duration.hours}
                  onChange={(e) => setDuration({ ...duration, hours: e.target.value })}
                  className="ela-timer-input description-input"
                />
                <p>Hours</p>
              </div>
              <div className="ela-timer-cover">
                <input
                  type="text"
                  placeholder="Minutes"
                  value={duration.minutes}
                  onChange={(e) => setDuration({ ...duration, minutes: e.target.value })}
                  className="ela-timer-input description-input"
                />
                <p>Minutes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="action-btns-cnt">
        <div
          className="course-delete-btn cancel-test-btn"
          onClick={() => closeTest()}
        >
          Cancel
        </div>
        <div
          className="course-delete-btn save-next"
          onClick={() => handleNext()}
          style={{
            background: !questionValidation() && "gray",
            pointerEvents: !questionValidation() && "none",
          }}
        >
          Save and Next
        </div>
        <div
          className="add-new-lesson-btn"
          onClick={() => {
            handleAddTest();
            handleUpdateDuration();
          }}
        >
          Upload
        </div>
      </div>
    </div>
  );
};

export default ELA;

                
