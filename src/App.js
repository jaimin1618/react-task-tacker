// LIBRARIES IMPORT
import { useState } from "react";
import { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom"; // IMPORTING FROM react-router-dom

// STYLIES IMPORT
import "./index.css";

// COMPONENTS IMPORT FORM ./components;
import Header from "./components/Header";
import Tasks from "./components/Tasks";
import AddTask from "./components/AddTask";
import Footer from "./components/Footer";
import About from "./components/About";
const url = process.env.REACT_APP_BACKEND_API_URL;

// --- APP MAIN ---
const App = () => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTask] = useState([]);

  useEffect(() => {
    const getTasks = async () => {
      const tasksFromServer = await fetchTasks();
      setTask(tasksFromServer);
    };

    getTasks();
  }, []);

  // Fetch ALL Tasks from dummy server
  const fetchTasks = async () => {
    console.log(url);
    const res = await fetch(url);
    const data = await res.json();
    console.log(data);
    return data;
  };

  // Fetch Task by ID
  const fetchTask = async (id) => {
    const res = await fetch(`${url}/${id}`);
    const data = await res.json();
    return data;
  };

  // Add Tasks
  const addTask = async (task) => {
    /*
        const id = tasks.length + 1;
        const newTask = {id, ...task};
        setTask([...tasks, newTask]);
        */
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(task),
    });

    const data = await res.json();
    console.log(task);
    console.log("Data:", data);
    setTask([...tasks, data]);
  };

  // Delete Task
  const deleteTask = async (id) => {
    await fetch(`${url}/${id}`, {
      method: "DELETE",
    });

    setTask(tasks.filter((task) => task.id !== id));
  };

  // Toggle Reminder
  const toggleReminder = async (id) => {
    const taskToToggle = await fetchTask(id);
    const updTask = {
      ...taskToToggle,
      reminder: !taskToToggle.reminder,
    };

    const res = await fetch(`${url}/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updTask),
    });

    const data = await res.json();

    setTask(
      tasks.map((task) =>
        task.id === id ? { ...task, reminder: data.reminder } : task
      )
    );
  };

  return (
    <Router>
      <div className="container">
        <Header
          title="Task Tracker"
          onAdd={() => setShowAddTask(!showAddTask)}
          displayForm={showAddTask}
        />

        <Route
          path="/"
          exact
          render={(props) => (
            <>
              {showAddTask && <AddTask onsubmit={addTask} />}
              {tasks.length > 0 ? (
                <Tasks
                  tasks={tasks}
                  ondelete={deleteTask}
                  ontoggle={toggleReminder}
                />
              ) : (
                "No Tasks Found"
              )}
            </>
          )}
        />

        <Route path="/about" component={About} />
        <Footer />
      </div>
    </Router>
  );
};

/*  OOP METHOD FOR MAKING COMPONENTS
import React from 'react';
class App extends React.Component {
    render () {
        return <Header title="Task App" />;
    }
}
*/

export default App;
