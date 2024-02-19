import React, { useEffect, useState } from "react";
import AdminNavBar from "./AdminNavBar";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [page, setPage] = useState("List");
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then(response => response.json())
      .then(questions => setQuestions(questions))
      .catch(error => setError(error.message));
  }, []);

  const [newPrompt, setNewPrompt] = useState("");
  const [newAnswer1, setNewAnswer1] = useState("");
  const [newAnswer2, setNewAnswer2] = useState("");
  const [newAnswer3, setNewAnswer3] = useState("");
  const [newAnswer4, setNewAnswer4] = useState("");
  const [newCorrectIndex, setNewCorrectIndex] = useState(0);

  const handleSubmit = (event) => {
    event.preventDefault();
    const questionInfo = {
      "prompt": newPrompt,
      "answers": [newAnswer1, newAnswer2, newAnswer3, newAnswer4],
      "correctIndex": newCorrectIndex
    };

    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(questionInfo)
    })
    .then(response => response.json())
    .then(newQuestion => setQuestions([...questions, newQuestion]));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:4000/questions/${id}`, {method: "DELETE"})
      .then(response => {
        if (response.ok) {
          const visibleQuestions = questions.filter(question => question.id !== id);
          setQuestions(visibleQuestions);
        }
      });
  };

  const handleUpdate = (event, id) => {
    event.preventDefault();

    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "correctIndex": parseInt(event.target.value)
      })
    })
    .then(response => response.json())
    .then(updatedQuestion => {
      setNewCorrectIndex(updatedQuestion.correctIndex);
    });
  };

  return (
    <main>
      <AdminNavBar onChangePage={setPage} />
      {page === "Form" ? (
        <>
          <QuestionForm
            handleSubmit={handleSubmit}
            onPromptChange={(e) => setNewPrompt(e.target.value)}
            newPrompt={newPrompt}
            onAnswer1Change={(e) => setNewAnswer1(e.target.value)}
            newAnswer1={newAnswer1}
            onAnswer2Change={(e) => setNewAnswer2(e.target.value)}
            newAnswer2={newAnswer2}
            onAnswer3Change={(e) => setNewAnswer3(e.target.value)}
            newAnswer3={newAnswer3}
            onAnswer4Change={(e) => setNewAnswer4(e.target.value)}
            newAnswer4={newAnswer4}
            onNewCorrectIndexChange={(e) => setNewCorrectIndex(e.target.value)}
            newCorrectIndex={newCorrectIndex}
          />
          <button onClick={() => setPage("List")}>Back to List</button>
        </>
      ) : (
        <QuestionList handleUpdate={handleUpdate} handleDelete={handleDelete} questions={questions} />
      )}
    </main>
  );
}

export default App;
