import React from "react";
import { useDispatch } from "react-redux";
import { deleteTask } from "../state/taskSlice";
import "./TaskItem.css";

export default function TaskItem({ task }) {
  const dispatch = useDispatch();
  if(!task) return null;
  const handleCheckboxClick = () => {
    
  }
  const handleDelete = () => {
      dispatch(deleteTask(task.id)).unwrap()
  }

  return (
    <div className="task-item">
      <div className="checkbox-container">
        <input type="checkbox" onChange={handleCheckboxClick} checked={task.completed}/>
      </div>
      <div className="title-desc-container">
        <p className="task-title">{task.title}</p>
        <p className="task-desc">{task.description}</p>
      </div>
      <div className="buttons-container">
        <button className="edit">Edit</button>
        <button onClick={handleDelete} className="delete">Delete</button>
      </div>
    </div>
  );
}
