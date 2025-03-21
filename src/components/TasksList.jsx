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
  const { todaysTasks, todaysStatus, todaysError } = useSelector((state) => state.tasks);

  useEffect(() => {
    if(user?.uid && todaysStatus === 'idle'){
      dispatch(fetchTodaysTasks(user.uid));
    }
  },[dispatch, user?.uid, todaysStatus])
  let content;
  if(todaysStatus === 'loading'){
    content = <p>"Loading..."</p>
  }else if(todaysStatus === 'succeeded'){
    content = (
      <ul className="tasks-list">
          {todaysTasks.map((task) => {
            return <TaskItem key={task.id} task={task} />
          })}
        </ul>
    )
  } else if (todaysStatus === 'failed'){
    content = <p>{todaysError}</p>
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
