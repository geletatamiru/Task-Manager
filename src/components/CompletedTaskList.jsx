import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompletedTasks } from "../state/taskSlice";
import "./CompletedTaskList.css";
const getTodayDate = () => {
  const today = new Date();
  return today.toDateString();
};

const CompletedTaskList = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const { completedTasks, completedStatus, comletedError } = useSelector((state) => state.tasks);
  const today = getTodayDate();
  useEffect(() => {
    if (user?.uid && completedStatus === 'idle') {
      dispatch(fetchCompletedTasks(user.uid));
    }
  }, [dispatch, user?.uid, completedStatus]);

  const groupedTasks = {
    today: [],
    specificDates: {},
  };

  completedTasks.forEach((task) => {
    const taskDate = new Date(task.date).toDateString();
    if (taskDate === today) {
      groupedTasks.today.push(task);
    } else {
      groupedTasks.specificDates[taskDate] =
        groupedTasks.specificDates[taskDate]
          ? [...groupedTasks.specificDates[taskDate], task]
          : [task];
    }
  });
  if (completedStatus === "loading") return <p className="completed-loading">Loading completed tasks...</p>;
  if (completedStatus === "failed") return <p className="completed-error">Error: {comletedError}</p>;
  return (
    <div className="completed-tasks-list-container">
          { groupedTasks.today.length > 0 && 
            <h2 className="completed-task-heading">Today</h2>
          }  
          <ul className="completed-tasks-list">
            {groupedTasks.today.map((task) => (
              <div className="completed-task-item" key={task.id}>You completed a task: <u>{task.title}</u></div>
            ))}
          </ul>
        {Object.keys(groupedTasks.specificDates).map((date) => (
        <div className="previous-container" key={date}>
          <h2 className="completed-task-heading">{date}</h2>
          <ul className="completed-tasks-list">
            {groupedTasks.specificDates[date].map((task) => (
              <div className="completed-task-item" key={task.id}>You completed a task: <u>{task.title}</u></div>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CompletedTaskList;
