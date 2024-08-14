import React, { useState } from "react";
import axios from "axios";

const ELA = ({ data, closeTest, addTest }) => {
  const initialState = {
    section: "",
    difficulty: "",
    duration: "",
    question: "",
    answer: null,
    choices: [],
    questionNumber: null,
  };

  const [currentTest, setCurrentTest] = useState(data || []);
  const [currentQuestion, setCurrentQuestion] = useState(initialState);
  const [dropDown, setDropDown] = useState(false);
  const [difficultyDropDown, setDifficultyDropDown] = useState(false);
  const [sectionDropDown, setSectionDropDown] = useState(false);
  const [durationDropDown, setDurationDropDown] = useState(false);

  const checkquestionMatchStyle = (index) => {
    return currentTest.indexOf(currentQuestion) === index ? "#8949ff" : "transparent";
  };

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
    const updatedTest = [...currentTest];
    if (existingIndex === -1) {
      updatedTest.push(currentQuestion);
      setCurrentTest(updatedTest);
      setCurrentQuestion(initialState);
    } else if (existingIndex + 1 === currentTest.length) {
      updatedTest[existingIndex] = currentQuestion;
      setCurrentTest(updatedTest);
      setCurrentQuestion(initialState);
    } else {
      updatedTest[existingIndex] = currentQuestion;
      setCurrentTest(updatedTest);
      setCurrentQuestion(updatedTest[existingIndex + 1]);
    }
  };

  const questionValidation = () => {
    return (
      currentQuestion?.question.length > 5 &&
      currentQuestion?.answer &&
      currentQuestion?.choices?.length === 4 &&
      currentQuestion?.section &&
      currentQuestion?.difficulty &&
      currentQuestion?.duration
    );
  };

  const handleAddTest = async () => {
    try {
      const response = await axios.post("https://csuite-production.up.railway.app/api/question/", {
        sections: currentTest,
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

  return (
    <div className="ela-test-page">
      <p className="ela-title">Create or Edit your ELA assessment</p>
      <div className="questions-block-cnt">
        {currentTest?.map((test, index) => (
          <div
            className="question-block"
            style={{ background: checkquestionMatchStyle(index) }}
            key={index}
            onClick={() => setCurrentQuestion(test)}
          >
            <p
              className="question-number"
              style={{
                color: checkquestionMatchStyle(index) === "transparent" ? "#8949ff" : "#000",
              }}
            >
              {index + 1}
            </p>
          </div>
        ))}
        <div
          className="question-block"
          style={{ background: currentQuestion.section ? "#e0e0e0" : "transparent" }}
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
                    {currentQuestion?.answer?.value || "Not selected"}
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
                  value={currentQuestion?.choices[0] || ""}
                  onChange={(e) => handleChoiceInput(0, e.target.value)}
                />
              </div>
              <div className="choice ela-choice">
                <p>Choice two</p>
                <input
                  type="text"
                  placeholder="Enter choice two"
                  value={currentQuestion?.choices[1] || ""}
                  onChange={(e) => handleChoiceInput(1, e.target.value)}
                />
              </div>
              <div className="choice ela-choice">
                <p>Choice three</p>
                <input
                  type="text"
                  placeholder="Enter choice three"
                  value={currentQuestion?.choices[2] || ""}
                  onChange={(e) => handleChoiceInput(2, e.target.value)}
                />
              </div>
              <div className="choice ela-choice">
                <p>Choice four</p>
                <input
                  type="text"
                  placeholder="Enter choice four"
                  value={currentQuestion?.choices[3] || ""}
                  onChange={(e) => handleChoiceInput(3, e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="ela-dropdown-cnt">
            <p>Select Section</p>
            <div className="ela-dropdown-box" onClick={() => setSectionDropDown(!sectionDropDown)}>
              <p>{currentQuestion.section || "Select Section"}</p>
              {sectionDropDown && (
                <div className="ela-dropdown-options">
                  <div
                    className="ela-dropdown-element"
                    onClick={() => setCurrentQuestion({ ...currentQuestion, section: "Section 1" })}
                  >
                    <p>Section 1</p>
                  </div>
                  <div
                    className="ela-dropdown-element"
                    onClick={() => setCurrentQuestion({ ...currentQuestion, section: "Section 2" })}
                  >
                    <p>Section 2</p>
                  </div>
                  <div
                    className="ela-dropdown-element"
                    onClick={() => setCurrentQuestion({ ...currentQuestion, section: "Section 3" })}
                  >
                    <p>Section 3</p>
                  </div>
                </div>
              )}
            </div>
            {!currentQuestion.section && (
              <p className="warning-text">Section is required!</p>
            )}
          </div>
          <div className="ela-dropdown-cnt">
            <p>Select Difficulty</p>
            <div className="ela-dropdown-box" onClick={() => setDifficultyDropDown(!difficultyDropDown)}>
              <p>{currentQuestion.difficulty || "Select Difficulty"}</p>
              {difficultyDropDown && (
                <div className="ela-dropdown-options">
                  <div
                    className="ela-dropdown-element"
                    onClick={() => setCurrentQuestion({ ...currentQuestion, difficulty: "Easy" })}
                  >
                    <p>Easy</p>
                  </div>
                  <div
                    className="ela-dropdown-element"
                    onClick={() => setCurrentQuestion({ ...currentQuestion, difficulty: "Medium" })}
                  >
                    <p>Medium</p>
                  </div>
                  <div
                    className="ela-dropdown-element"
                    onClick={() => setCurrentQuestion({ ...currentQuestion, difficulty: "Hard" })}
                  >
                    <p>Hard</p>
                  </div>
                </div>
              )}
            </div>
            {!currentQuestion.difficulty && (
              <p className="warning-text">Difficulty is required!</p>
            )}
          </div>
          <div className="ela-dropdown-cnt">
            <p>Select Duration</p>
            <div className="ela-dropdown-box" onClick={() => setDurationDropDown(!durationDropDown)}>
              <p>{currentQuestion.duration || "Select Duration"}</p>
              {durationDropDown && (
                <div className="ela-dropdown-options">
                  <div
                    className="ela-dropdown-element"
                    onClick={() => setCurrentQuestion({ ...currentQuestion, duration: "10 minutes" })}
                  >
                    <p>10 minutes</p>
                  </div>
                  <div
                    className="ela-dropdown-element"
                    onClick={() => setCurrentQuestion({ ...currentQuestion, duration: "20 minutes" })}
                  >
                    <p>20 minutes</p>
                  </div>
                  <div
                    className="ela-dropdown-element"
                    onClick={() => setCurrentQuestion({ ...currentQuestion, duration: "30 minutes" })}
                  >
                    <p>30 minutes</p>
                  </div>
                </div>
              )}
            </div>
            {!currentQuestion.duration && (
              <p className="warning-text">Duration is required!</p>
            )}
          </div>
        </div>
        <div className="ela-description-cnt">
          <p>Tags</p>
          <input
            type="text"
            name=""
            id=""
            className="ela-tags description-input"
          />
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
        <div className="add-new-lesson-btn" onClick={() => handleAddTest()}>
          Upload
        </div>
      </div>
    </div>
  );
};

export default ELA;
