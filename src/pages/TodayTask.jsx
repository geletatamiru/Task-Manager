import React,{useState} from 'react'
import "./TodayTask.css";
import CreateTask from '../components/CreateTask';
import TasksList from '../components/TasksList';
import TaskItem from '../components/TaskItem';

export default function TodayTask() {
  const [show,setShow] = useState(false);
  return (
    <div className='today-container'>
      <h2>Today's Tasks</h2>
      <TasksList />
      <TaskItem />
      {
        
        show && <CreateTask onShow={() => setShow(false)}/>
      }
      <button style={{display: show ? "none" : "flex"}} onClick={() => {setShow(true)}}>Add task</button>
    </div>
  )
}
