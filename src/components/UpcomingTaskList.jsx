// src/components/UpcomingTaskList.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUpcomingTasks } from "../state/taskSlice";
import TaskItem from "./TaskItem";
import "./UpcomingTaskList.css";
const getTomorrowDate = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toDateString();
};

const UpcomingTaskList = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const { upcomingTasks, upcomingStatus, upcomingError } = useSelector((state) => state.tasks);
  const tomorrow = getTomorrowDate();
  useEffect(() => {
    if (user?.uid && upcomingStatus === 'idle') {
      dispatch(fetchUpcomingTasks(user.uid));
    }
  }, [dispatch, user?.uid, upcomingStatus]);

  const groupedTasks = {
    tomorrow: [],
    specificDates: {},
  };

  upcomingTasks.forEach((task) => {
    const taskDate = new Date(task.date).toDateString();
    if (taskDate === tomorrow) {
      groupedTasks.tomorrow.push(task);
    } else {
      groupedTasks.specificDates[taskDate] =
        groupedTasks.specificDates[taskDate]
          ? [...groupedTasks.specificDates[taskDate], task]
          : [task];
    }
  });
  if (upcomingStatus === "loading") return <p className="loading">Loading upcoming tasks...</p>;
  if (upcomingStatus === "failed") return <p className="error">Error: {upcomingError}</p>;
  return (
    <div className="upcoming-tasks-list-container">
          <h2 className="upcoming-task-heading">Tomorrow</h2>
          <ul className="upcoming-tasks-list">
            {groupedTasks.tomorrow.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>
        {Object.keys(groupedTasks.specificDates).map((date) => (
        <div className="later-container" key={date}>
          <h2 className="upcoming-task-heading">{date}</h2>
          <ul className="upcoming-tasks-list">
            {groupedTasks.specificDates[date].map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default UpcomingTaskList;
