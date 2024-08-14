import React, { useState, useEffect } from "react";
import axios from "axios";

const ELA = ({ closeTest, addTest }) => {
  const initialState = {
    question: "",
    answer: null,
    choices: [],
    questionNumber: null,
    hours: "",
    minutes: "",
    description: "",
    difficulty: "",
    tags: "",
  };

  const [currentTest, setCurrentTest] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(initialState);
  const [dropDown, setDropDown] = useState(false);
  const [difficultyDropDown, setDifficultyDropDown] = useState(false);

  useEffect(() => {
    axios.get("https://csuite-production.up.railway.app/api/question/")
      .then(response => {
        setCurrentTest(response.data);
      })
      .catch(error => console.error("Error fetching questions:", error));
  }, []);

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
    const updatestart = [...currentTest];
    const existingIndex = currentTest.findIndex(
      (q) => q.question === currentQuestion.question
    );

    if (existingIndex === -1) {
      updatestart.push(currentQuestion);
    } else {
      updatestart[existingIndex] = currentQuestion;
    }

    setCurrentTest(updatestart);
    setCurrentQuestion(initialState);
  };

  const questionValidation = () => {
    return (
      currentQuestion.question.length > 5 &&
      currentQuestion.answer &&
      currentQuestion.choices.length === 4 &&
      currentQuestion.hours &&
      currentQuestion.minutes &&
      currentQuestion.description &&
      currentQuestion.difficulty
    );
  };

  const handleAddTest = () => {
    axios.post("https://csuite-production.up.railway.app/api/question/", {
      sections: currentTest,
    })
      .then(response => {
        if (typeof addTest === 'function') {
          addTest(currentTest);
        }
        if (typeof closeTest === 'function') {
          closeTest();
        }
      })
      .catch(error => console.error("Error saving test:", error));
  };

  return (
    <div className="ela-test-page">
      <p className="ela-title">Create or Edit your ELA assessment</p>
      <div className="questions-block-cnt">
        {currentTest?.map((test, index) => (
          <div
            className="question-block"
            style={{ background: currentTest.indexOf(currentQuestion) === index ? "#8949ff" : "transparent" }}
            key={index}
            onClick={() => setCurrentQuestion(test)}
          >
            <p className="question-number">{index + 1}</p>
          </div>
        ))}
        <div
          className="question-block"
          onClick={() => setCurrentQuestion(initialState)}
        >
          <p className="question-number">{currentTest.length + 1}</p>
        </div>
      </div>
      <div className="ela-inputs-cnt">
        <div className="ela-question-input-cnt">
          <p>Question</p>
          <textarea
            className="question-input ela-question-input"
            value={currentQuestion.question}
            onChange={(e) =>
              setCurrentQuestion({
                ...currentQuestion,
                question: e.target.value,
              })
            }
          />
          <div className="ela-choice-input-cover">
            <p>Choices</p>
            <div className="choice-header">
              <div className="select-answer-cnt">
                <p>Select Answer</p>
                <div className="selected-choice-display">
                  <p onClick={() => setDropDown(true)}>
                    {currentQuestion.answer?.value || "Not selected"}
                  </p>
                  {dropDown && (
                    <div className="drop-down-cnt">
                      {["Choice one", "Choice two", "Choice three", "Choice four"].map((choice, index) => (
                        <div
                          key={index}
                          className="drop-down-choice"
                          onClick={() => handleChoiceSelect(index, choice)}
                        >
                          <p>{choice}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {["Choice one", "Choice two", "Choice three", "Choice four"].map((choice, index) => (
              <div key={index} className="choice ela-choice">
                <p>{choice}</p>
                <input
                  type="text"
                  placeholder={`Enter ${choice}`}
                  value={currentQuestion.choices[index] || ""}
                  onChange={(e) => handleChoiceInput(index, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="ela-question-info-cnt">
          <div className="ela-description-cnt">
            <p>Set Duration</p>
            <div className="ela-timer-input-cnt">
              <div className="ela-timer-cover">
                <input
                  type="number"
                  value={currentQuestion.hours}
                  onChange={(e) =>
                    setCurrentQuestion({ ...currentQuestion, hours: e.target.value })
                  }
                  className="ela-timer-input description-input "
                  placeholder="Hours"
                />
                <p>Hours</p>
              </div>
              <div className="ela-timer-cover">
                <input
                  type="number"
                  value={currentQuestion.minutes}
                  onChange={(e) =>
                    setCurrentQuestion({ ...currentQuestion, minutes: e.target.value })
                  }
                  className="ela-timer-input description-input "
                  placeholder="Minutes"
                />
                <p>Minutes</p>
              </div>
            </div>
          </div>
          <div className="ela-description-cnt">
            <p>Describe the test</p>
            <textarea
              className="ela-description description-input"
              value={currentQuestion.description}
              onChange={(e) =>
                setCurrentQuestion({ ...currentQuestion, description: e.target.value })
              }
              placeholder="Enter test description"
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
                  {["Easy", "Medium", "Hard"].map((level) => (
                    <div
                      key={level}
                      className="ela-dropdown-element"
                      onClick={() =>
                        setCurrentQuestion({ ...currentQuestion, difficulty: level })
                      }
                    >
                      <p style={{ color: level === "Easy" ? "green" : level === "Medium" ? "orange" : "red" }}>
                        {level}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="ela-description-cnt">
            <p>Tags</p>
            <input
              type="text"
              className="ela-tags description-input"
              value={currentQuestion.tags}
              onChange={(e) =>
                setCurrentQuestion({ ...currentQuestion, tags: e.target.value })
              }
              placeholder="Enter tags"
            />
          </div>
        </div>
      </div>
      <div className="action-btns-cnt">
        <div
          className="course-delete-btn cancel-test-btn"
          onClick={() => typeof closeTest === 'function' && closeTest()}
        >
          Cancel
        </div>
        <div
          className="course-delete-btn save-next"
          onClick={() => handleNext()}
          style={{
            background: !questionValidation() ? "gray" : "#8949ff",
            pointerEvents: !questionValidation() ? "none" : "auto",
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
