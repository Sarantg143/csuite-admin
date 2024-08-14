import React, { useState } from "react";
import axios from "axios";

const ELA = ({ data, closeTest, addTest }) => {
  const initialState = {
    question: "",
    answer: null,
    choices: [],
    questionNumber: null,
    section: null,
    description: "",
    difficulty: "",
    tags: "",
  };

  const [currentTest, setCurrentTest] = useState(data || []);
  const [currentQuestion, setCurrentQuestion] = useState(initialState);
  const [dropDown, setDropDown] = useState(false);
  const [difficultyDropDown, setDifficultyDropDown] = useState(false);
  const [sectionDropDown, setSectionDropDown] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [sectionDuration, setSectionDuration] = useState({ hours: 0, minutes: 0 });
  const [editingDuration, setEditingDuration] = useState(false);
  const [newDuration, setNewDuration] = useState({ hours: 0, minutes: 0 });

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
      updatedTest?.push(currentQuestion);
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

  const checkQuestionMatch = (index) => {
    if (currentTest?.indexOf(currentQuestion) === index) return "#8949ff";
    return "transparent";
  };

  const questionValidation = () => {
    return (
      currentQuestion?.question.length > 5 &&
      currentQuestion?.answer &&
      currentQuestion?.choices?.length === 4 &&
      currentQuestion?.section &&
      currentQuestion?.description &&
      currentQuestion?.difficulty
    );
  };

  const fetchSectionDuration = async (sectionNumber) => {
    try {
      const response = await axios.get(`https://csuite-production.up.railway.app/api/question/66bc5fbb7b56debaadf7377e/sections/${sectionNumber}/duration`);
      setSectionDuration(response.data.duration);
    } catch (error) {
      console.error("Error fetching section duration:", error.message);
    }
  };

  const handleUpdateDuration = async () => {
    try {
      await axios.put(`https://csuite-production.up.railway.app/api/question/66bc5fbb7b56debaadf7377e/sections/${selectedSection}/duration`, {
        duration: newDuration
      });
      setSectionDuration(newDuration);
      setEditingDuration(false);
    } catch (error) {
      console.error("Error updating section duration:", error.message);
    }
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
            style={{ background: checkQuestionMatch(index) }}
            key={index}
            onClick={() => setCurrentQuestion(test)}
          >
            <p
              className="question-number"
              style={{
                color: checkQuestionMatch(index) === "transparent" && "#8949ff",
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
        </div>
        <div className="ela-question-info-cnt">
          <div className="ela-description-cnt">
            <p>Select Section</p>
            <div
              className="ela-dropdown-box"
              onClick={() => setSectionDropDown(!sectionDropDown)}
            >
              <p>{selectedSection ? `Section ${selectedSection}` : "Choose Section"}</p>
              {sectionDropDown && (
                <div className="ela-dropdown-cnt">
                  <div
                    className="ela-dropdown-element"
                    onClick={() => {
                      setSelectedSection(1);
                      setSectionDropDown(false);
                      fetchSectionDuration(1);
                    }}
                  >
                    <p>Section 1</p>
                  </div>
                  <div
                    className="ela-dropdown-element"
                    onClick={() => {
                      setSelectedSection(2);
                      setSectionDropDown(false);
                      fetchSectionDuration(2);
                    }}
                  >
                    <p>Section 2</p>
                  </div>
                  <div
                    className="ela-dropdown-element"
                    onClick={() => {
                      setSelectedSection(3);
                      setSectionDropDown(false);
                      fetchSectionDuration(3);
                    }}
                  >
                    <p>Section 3</p>
                  </div>
                </div>
              )}
            </div>
            {selectedSection && (
              <div className="section-duration">
                <p>Duration: {sectionDuration.hours} hours {sectionDuration.minutes} minutes</p>
                {editingDuration ? (
                  <div>
                    <input
                      type="number"
                      value={newDuration.hours}
                      onChange={(e) => setNewDuration({ ...newDuration, hours: e.target.value })}
                      placeholder="Hours"
                    />
                    <input
                      type="number"
                      value={newDuration.minutes}
                      onChange={(e) => setNewDuration({ ...newDuration, minutes: e.target.value })}
                      placeholder="Minutes"
                    />
                    <button onClick={handleUpdateDuration}>Save Duration</button>
                  </div>
                ) : (
                  <button onClick={() => setEditingDuration(true)}>Edit Duration</button>
                )}
              </div>
            )}
          </div>
          <div className="ela-description-cnt">
            <p>Description</p>
            <textarea
              className="ela-description description-input"
              value={currentQuestion?.description}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  description: e.target.value,
                })
              }
            />
          </div>
          <div className="ela-description-cnt">
            <p>Select Test Difficulty</p>
            <div
              className="ela-dropdown-box"
              onClick={() => setDifficultyDropDown(!difficultyDropDown)}
            >
              <p>{currentQuestion.difficulty || "Choose Difficulty"}</p>
              {difficultyDropDown && (
                <div className="ela-dropdown-cnt">
                  <div
                    className="ela-dropdown-element"
                    onClick={() => setCurrentQuestion({ ...currentQuestion, difficulty: "Easy" })}
                  >
                    <p style={{ color: "green" }}>Easy</p>
                  </div>
                  <div
                    className="ela-dropdown-element"
                    onClick={() => setCurrentQuestion({ ...currentQuestion, difficulty: "Medium" })}
                  >
                    <p style={{ color: "orange" }}>Medium</p>
                  </div>
                  <div
                    className="ela-dropdown-element"
                    onClick={() => setCurrentQuestion({ ...currentQuestion, difficulty: "Hard" })}
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
              className="ela-tags description-input"
              value={currentQuestion?.tags}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  tags: e.target.value,
                })
              }
            />
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
        <div className="add-new-lesson-btn" onClick={() => handleAddTest()}>
          Upload
        </div>
      </div>
    </div>
  );
};

export default ELA;
