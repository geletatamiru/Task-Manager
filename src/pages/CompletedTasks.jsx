import CompletedTaskList from "../components/CompletedTaskList";
import "./CompletedTasks.css";

export default function CompletedTasks() {
  return (
    <div className="completed-tasks-page">
      <h1>Completed Tasks</h1>
      <CompletedTaskList />
    </div>
  )
}
