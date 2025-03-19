import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodaysTasks } from "../state/taskSlice";
import TaskItem from "./TaskItem";
import "./TasksList.css";

const today = (date = new Date()) => {
  const options = { month: "short", day: "numeric", weekday: "long" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  const today = new Date().toDateString() === date.toDateString() ? "Today" : "";

  const [weekday, month, day] = formattedDate.split(" ");
  return `${month} ${day} ‧ ${today} ‧ ${weekday}`;
};

const TasksList = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const todayDate = today();
  const { tasks, status, error } = useSelector((state) => state.tasks);

  useEffect(() => {
    if(user?.uid && status === 'idle'){
      dispatch(fetchTodaysTasks(user.uid));
    }
  },[dispatch, user?.uid, status])
  let content;
  if(status === 'loading'){
    content = <p>"Loading..."</p>
  }else if(status === 'succeeded'){
    content = (
      <ul className="tasks-list">
          {tasks.map((task) => {
            return <TaskItem key={task.id} task={task} />
          })}
        </ul>
    )
  } else if (status === 'failed'){
    content = <p>{error}</p>
  }
  return (
    <div className="tasks-list-container">
      <h2 className="tasks-heading">{todayDate}</h2>
      {
        content
      }
    </div>
  );
};

export default TasksList;
