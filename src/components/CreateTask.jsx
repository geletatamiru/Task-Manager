import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Timestamp } from "firebase/firestore";
import { addTask } from "../state/taskSlice";
import "./CreateTask.css";

export default function CreateTask({ onShow }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const [task, setTask] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0], // Default today's date in YYYY-MM-DD
    priority: "Priority 1",
  });

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!task.title.trim()) {
      alert("Title is required!");
      return;
    }

    // Convert the date to Firestore Timestamp
    const taskDate = new Date(task.date);  // Convert to Date object
    const firestoreTimestamp = Timestamp.fromDate(taskDate); // Convert to Firestore Timestamp

    // Create the task object to be added to Firestore
    const newTask = {
      ...task,
      date: firestoreTimestamp, // Store the date as a Firestore Timestamp
      completed: false,
      userId: user?.uid || "guest",
    };
    setTask({ title: "", description: "", date: new Date().toISOString().split("T")[0], priority: "Priority 1" });
    dispatch(addTask(newTask));
  };

  const handleClick = () => {
    onShow();
    setTask({ title: "", description: "", date: new Date().toISOString().split("T")[0], priority: "Priority 1" });
  };

  return (
    <form onSubmit={handleSubmit} className="form-input">
      <div className="title-desc">
        <input
          className="Title"
          type="text"
          name="title"
          placeholder="Title"
          value={task.title}
          onChange={handleChange}
          required
        />
        <input
          className="desc"
          type="text"
          name="description"
          placeholder="Description"
          value={task.description}
          onChange={handleChange}
        />
      </div>
      <div className="date-priority">
        <input
          className="date"
          type="date"
          name="date"
          value={task.date}
          onChange={handleChange}
        />
        <select className="priority" name="priority" value={task.priority} onChange={handleChange}>
          <option value="Priority 1">Priority 1</option>
          <option value="Priority 2">Priority 2</option>
          <option value="Priority 3">Priority 3</option>
          <option value="Priority 4">Priority 4</option>
        </select>
      </div>
      <div className="buttons">
        <button className="cancel-btn" type="button" onClick={handleClick}>
          Cancel
        </button>
        <button className="add-btn" type="submit">Add Task</button>
      </div>
    </form>
  );
}
