import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  addTaskToFirestore, 
  deleteTaskFromFirestore,
  toggleCompletedInFirestore,
  fetchTodaysTasksFromFirestore,
  fetchUpcomingTasksFromFirestore,
  fetchCompletedTasksFromFirestore
} from "../firebase/firebase";
export const fetchTodaysTasks = createAsyncThunk(
  "tasks/fetchTodaysTasks",
  async (userId, { rejectWithValue }) => {
    try {
      const tasks = await fetchTodaysTasksFromFirestore(userId);
      return tasks.map(task => ({
        ...task,
        date: task.date ? task.date.toMillis() : null, // Handle potential null dates
      })); 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchUpcomingTasks = createAsyncThunk(
  "tasks/fetchUpcomingTasks",
  async (userId, { rejectWithValue }) => {
    try {
      const tasks = await fetchUpcomingTasksFromFirestore(userId);
      return tasks.map(task => ({
        ...task,
        date: task.date ? task.date.toMillis() : null, // Handle potential null dates
      })); 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const fetchCompletedTasks = createAsyncThunk(
  "tasks/fetchCompletedTasks",
  async (userId, { rejectWithValue }) => {
    try {
      const completedTasks = await fetchCompletedTasksFromFirestore(userId);
      console.log(completedTasks);
      return completedTasks.map(task => ({
        ...task,
        date: task.date ? task.date.toMillis() : null
    }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  })
export const addTask = createAsyncThunk(
  "tasks/addTask",
  async (task, { rejectWithValue }) => {
    try {
      const addedTask = await addTaskToFirestore(task);
      return addedTask;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId) => {
    try {
      await deleteTaskFromFirestore(taskId);
      return taskId;
    } catch (error) {
      throw error;
    }
  }
);
export const toggleCompleted = createAsyncThunk(
  'tasks/toggleCompleted',
  async (data) => {
    try {
      await toggleCompletedInFirestore(data)
      return data;
    } catch (error) {
      throw error;
    }
  }
);
const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    todaysTasks: [],
    upcomingTasks: [],
    completedTasks: [],
    todaysStatus: "idle",   
    upcomingStatus: "idle",
    completedStatus: "idle", 
    todaysError: null,   
    upcomingError: null,
    completedError: null 
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodaysTasks.pending, (state) => {
        state.todaysStatus = "loading";
      })
      .addCase(fetchTodaysTasks.fulfilled, (state, action) => {
        state.todaysStatus = "succeeded";
        
        state.todaysTasks = action.payload;
      })
      .addCase(fetchTodaysTasks.rejected, (state, action) => {
        state.todaysStatus = "failed";
        state.todaysError = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        const taskDate = new Date(action.payload.date); // Convert to Date object
        const today = new Date();
        
        // Check if the task's date is today (ignoring time)
        const isToday =
          taskDate.getFullYear() === today.getFullYear() &&
          taskDate.getMonth() === today.getMonth() &&
          taskDate.getDate() === today.getDate();
      
        if (isToday) {
          state.todaysTasks.push(action.payload);
        }else {
          state.upcomingTasks.push(action.payload);
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.todaysTasks = state.todaysTasks.filter(task => task.id !== action.payload); // Filter out the deleted task
        state.upcomingTasks = state.upcomingTasks.filter(task => task.id !== action.payload); // Filter out the deleted task
      })
      .addCase(toggleCompleted.fulfilled, (state, action) => {
        const todayTask = state.todaysTasks.find(task => task.id === action.payload.id);
        const upcomingTask = state.upcomingTasks.find(task => task.id === action.payload.id);

        if(action.payload.completed == true){
          state.completedTasks.push({id: action.payload.id,title: action.payload.title,date: action.payload.date})
        }else if(action.payload.completed == false){
          state.completedTasks = state.completedTasks.filter(task => task.id !== action.payload.id);
        }
        if (todayTask) {
          todayTask.completed = action.payload.completed; // Toggle completed status
        }
        if(upcomingTask){
          upcomingTask.completed = action.payload.completed; // Toggle completed status
        }
        
      })
      .addCase(fetchUpcomingTasks.pending, (state) => {
        state.upcomingStatus = "loading";
      })
      .addCase(fetchUpcomingTasks.fulfilled, (state, action) => {
        state.upcomingStatus = "succeeded";
        state.upcomingTasks = action.payload;
      })
      .addCase(fetchUpcomingTasks.rejected, (state, action) => {
        state.upcomingStatus = "failed";
        state.upcomingError = action.payload;
      })
      .addCase(fetchCompletedTasks.pending, (state) => {
        state.completedStatus = "loading";
      })
      .addCase(fetchCompletedTasks.fulfilled, (state, action) => {
        state.completedStatus = "succeeded";
        state.completedTasks = action.payload;
      })
      .addCase(fetchCompletedTasks.rejected, (state, action) => {
        state.completedStatus = "failed";
        state.completedError = action.payload;
      });
  }   
});

export default taskSlice.reducer;