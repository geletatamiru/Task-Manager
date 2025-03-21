import UpcomingTaskList from "../components/UpcomingTaskList";
import "./UpcomingTasks.css";

export default function UpcomingTasks() {
  return (
    <div className="upcoming-container">
      <h1>Upcoming</h1>
      <UpcomingTaskList />
    </div>
  )
}
