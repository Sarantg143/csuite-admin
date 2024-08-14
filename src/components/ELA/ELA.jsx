import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ELAAdmin = () => {
  const [sections, setSections] = useState([]);
  const [newSection, setNewSection] = useState({
    section: '',
    duration: { hours: 0, minutes: 0 },
    questions: [],
  });
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    answer: '',
    description: '',
    difficulty: '',
    tags: '',
  });
  const [editingSectionId, setEditingSectionId] = useState(null);

  // Fetch all sections
  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await axios.get('https://csuite-production.up.railway.app/api/question/');
        setSections(response.data);
      } catch (error) {
        console.error('Error fetching sections:', error);
      }
    };
    fetchSections();
  }, []);

  // Create a new section
  const createSection = async () => {
    try {
      const response = await axios.post('https://csuite-production.up.railway.app/api/question/', { sections: [newSection] });
      setSections([...sections, response.data]);
      setNewSection({
        section: '',
        duration: { hours: 0, minutes: 0 },
        questions: [],
      });
    } catch (error) {
      console.error('Error creating section:', error);
    }
  };

  // Update an existing section
  const updateSection = async (id) => {
    try {
      const response = await axios.put(`https://csuite-production.up.railway.app/api/question/${id}`, { sections: [newSection] });
      setSections(sections.map(section => (section._id === id ? response.data : section)));
      setEditingSectionId(null);
      setNewSection({
        section: '',
        duration: { hours: 0, minutes: 0 },
        questions: [],
      });
    } catch (error) {
      console.error('Error updating section:', error);
    }
  };

  // Delete a section
  const deleteSection = async (id) => {
    try {
      await axios.delete(`/api/questions/${id}`);
      setSections(sections.filter(section => section._id !== id));
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  };

  // Add a question to the current section
  const addQuestion = () => {
    setNewSection({
      ...newSection,
      questions: [...newSection.questions, newQuestion],
    });
    setNewQuestion({
      question: '',
      options: ['', '', '', ''],
      answer: '',
      description: '',
      difficulty: '',
      tags: '',
    });
  };

  return (
    <div className="ela-admin-page">
      <h1>ELA Section Management</h1>

      <div className="section-list">
        <h2>Sections</h2>
        {sections.map((section) => (
          <div key={section._id} className="section-item">
            <h3>Section {section.section}</h3>
            <p>Duration: {section.duration.hours}h {section.duration.minutes}m</p>
            <button onClick={() => deleteSection(section._id)}>Delete Section</button>
            <button onClick={() => {
              setNewSection(section);
              setEditingSectionId(section._id);
            }}>Edit Section</button>
            <div className="questions-list">
              {section.questions.map((question, idx) => (
                <div key={idx}>
                  <p>{question.question}</p>
                  <p>Answer: {question.answer}</p>
                  <p>Difficulty: {question.difficulty}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="section-form">
        <h2>{editingSectionId ? 'Edit Section' : 'Create New Section'}</h2>
        <input
          type="number"
          placeholder="Section Number"
          value={newSection.section}
          onChange={(e) => setNewSection({ ...newSection, section: e.target.value })}
        />
        <div>
          <input
            type="number"
            placeholder="Hours"
            value={newSection.duration.hours}
            onChange={(e) => setNewSection({ ...newSection, duration: { ...newSection.duration, hours: e.target.value } })}
          />
          <input
            type="number"
            placeholder="Minutes"
            value={newSection.duration.minutes}
            onChange={(e) => setNewSection({ ...newSection, duration: { ...newSection.duration, minutes: e.target.value } })}
          />
        </div>

        <div>
          <h3>Add Question</h3>
          <input
            type="text"
            placeholder="Question"
            value={newQuestion.question}
            onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
          />
          <input
            type="text"
            placeholder="Option 1"
            value={newQuestion.options[0]}
            onChange={(e) => setNewQuestion({ ...newQuestion, options: newQuestion.options.map((opt, idx) => idx === 0 ? e.target.value : opt) })}
          />
          <input
            type="text"
            placeholder="Option 2"
            value={newQuestion.options[1]}
            onChange={(e) => setNewQuestion({ ...newQuestion, options: newQuestion.options.map((opt, idx) => idx === 1 ? e.target.value : opt) })}
          />
          <input
            type="text"
            placeholder="Option 3"
            value={newQuestion.options[2]}
            onChange={(e) => setNewQuestion({ ...newQuestion, options: newQuestion.options.map((opt, idx) => idx === 2 ? e.target.value : opt) })}
          />
          <input
            type="text"
            placeholder="Option 4"
            value={newQuestion.options[3]}
            onChange={(e) => setNewQuestion({ ...newQuestion, options: newQuestion.options.map((opt, idx) => idx === 3 ? e.target.value : opt) })}
          />
          <input
            type="text"
            placeholder="Answer"
            value={newQuestion.answer}
            onChange={(e) => setNewQuestion({ ...newQuestion, answer: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={newQuestion.description}
            onChange={(e) => setNewQuestion({ ...newQuestion, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="Difficulty"
            value={newQuestion.difficulty}
            onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value })}
          />
          <input
            type="text"
            placeholder="Tags (comma-separated)"
            value={newQuestion.tags}
            onChange={(e) => setNewQuestion({ ...newQuestion, tags: e.target.value.split(',').map(tag => tag.trim()) })}
          />
          <button onClick={addQuestion}>Add Question</button>
        </div>

        <button onClick={editingSectionId ? () => updateSection(editingSectionId) : createSection}>
          {editingSectionId ? 'Update Section' : 'Create Section'}
        </button>
      </div>
    </div>
  );
};

export default ELAAdmin;
