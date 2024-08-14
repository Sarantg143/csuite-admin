import React, { useState } from "react";
import axios from "axios";

const ELA = ({ data, closeTest, addTest }) => {
  const initialState = {
    question: "",
    answer: null,
    choices: [],
    questionNumber: null,
    section: null,  // Ensure section is included in initial state
    description: "",
    difficulty: "",
    tags: "",
  };

  const [currentTest, setCurrentTest] = useState(data || []);
  const [currentQuestion, setCurrentQuestion] = useState(initialState);
  const [dropDown, setDropDown] = useState(false);
  const [difficultyDropDown, setDifficultyDropDown] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

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
    return (
      currentQuestion?.question.length > 5 &&
      currentQuestion?.answer &&
      currentQuestion?.choices?.length === 4 &&
      currentQuestion?.section !== null
    );
  };

  const handleAddTest = async () => {
    if (!selectedSection) {
      console.error("Section is not selected");
      return;
    }

    const updatedQuestion = { ...currentQuestion, section: selectedSection };

    console.log("Request payload:", updatedQuestion);

    try {
      const response = await axios.post(
        `https://csuite-production.up.railway.app/api/question/66bc5fbb7b56debaadf7377e/sections/${selectedSection}/questions`,
        updatedQuestion,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
      console.log("Response:", response);
      if (response.status === 201 || response.status === 200) {
        addTest(currentTest);
        closeTest();
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
                    {currentQuestion?.answer?.value ? currentQuestion?.answer?.value : "Not selected"}
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
                  name=""
                  id=""
                  placeholder="Enter choice one"
                  value={currentQuestion?.choices[0] || ""}
                  onChange={(e) => handleChoiceInput(0, e.target.value)}
                />
              </div>
              <div className="choice ela-choice">
                <p>Choice two</p>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Enter choice two"
                  value={currentQuestion?.choices[1] || ""}
                  onChange={(e) => handleChoiceInput(1, e.target.value)}
                />
              </div>
              <div className="choice ela-choice">
                <p>Choice three</p>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Enter choice three"
                  value={currentQuestion?.choices[2] || ""}
                  onChange={(e) => handleChoiceInput(2, e.target.value)}
                />
              </div>
              <div className="choice ela-choice">
                <p>Choice four</p>
                <input
                  type="text"
                  name=""
                  id=""
                  placeholder="Enter choice four"
                  value={currentQuestion?.choices[3] || ""}
                  onChange={(e) => handleChoiceInput(3, e.target.value)}
                />
              </div>
            </div>
          </div>
          <div
            className=" course-delete-btn save-next-mobile "
            onClick={() => handleNext()}
            style={{
              background: !questionValidation() && "gray",
              pointerEvents: !questionValidation() && "none",
            }}
          >
            Save and Next
          </div>
        </div>
        <div className="ela-question-info-cnt">
          <div className="ela-description-cnt">
            <p>Set Duration</p>
            <div className="ela-timer-input-cnt">
              <div className="ela-timer-cover">
                <input
                  type="text"
                  name="hours"
                  id="hours"
                  className="ela-timer-input description-input"
                  value={currentQuestion?.duration?.hours || ""}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      duration: {
                        ...currentQuestion?.duration,
                        hours: e.target.value,
                      },
                    })
                  }
                />
                <p>Hours</p>
              </div>
              <div className="ela-timer-cover">
                <input
                  type="text"
                  name="minutes"
                  id="minutes"
                  className="ela-timer-input description-input"
                  value={currentQuestion?.duration?.minutes || ""}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      duration: {
                        ...currentQuestion?.duration,
                        minutes: e.target.value,
                      },
                    })
                  }
                />
                <p>Minutes</p>
              </div>
              <div className="ela-timer-cover">
                <input
                  type="text"
                  name="seconds"
                  id="seconds"
                  className="ela-timer-input description-input"
                  value={currentQuestion?.duration?.seconds || ""}
                  onChange={(e) =>
                    setCurrentQuestion({
                      ...currentQuestion,
                      duration: {
                        ...currentQuestion?.duration,
                        seconds: e.target.value,
                      },
                    })
                  }
                />
                <p>Seconds</p>
              </div>
            </div>
          </div>
          <div className="ela-description-cnt">
            <p>Description</p>
            <textarea
              className="description-input"
              placeholder="Add a description"
              value={currentQuestion?.description || ""}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div className="ela-difficulty-cnt">
            <p>Difficulty</p>
            <div className="select-answer-cnt">
              <p onClick={() => setDifficultyDropDown(true)}>
                {currentQuestion?.difficulty || "Select Difficulty"}
              </p>
              {difficultyDropDown && (
                <div className="drop-down-cnt">
                  <div
                    className="drop-down-choice"
                    onClick={() =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        difficulty: "Easy",
                      })
                    }
                  >
                    <p>Easy</p>
                  </div>
                  <div
                    className="drop-down-choice"
                    onClick={() =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        difficulty: "Medium",
                      })
                    }
                  >
                    <p>Medium</p>
                  </div>
                  <div
                    className="drop-down-choice"
                    onClick={() =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        difficulty: "Hard",
                      })
                    }
                  >
                    <p>Hard</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="ela-tags-cnt">
            <p>Tags</p>
            <input
              type="text"
              placeholder="Enter tags"
              className="description-input"
              value={currentQuestion?.tags || ""}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  tags: e.target.value,
                })
              }
            />
          </div>
          <div
            className="course-delete-btn save-next-mobile"
            onClick={() => handleAddTest()}
            style={{
              background: !questionValidation() && "gray",
              pointerEvents: !questionValidation() && "none",
            }}
          >
            Save Test
          </div>
        </div>
      </div>
    </div>
  );
};

export default ELA;
