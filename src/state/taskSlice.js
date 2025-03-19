import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  addTaskToFirestore, 
  deleteTaskFromFirestore
} from "../firebase/firebase";
import { fetchTodaysTasksFromFirestore } from "../firebase/firebase";
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
const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    status: "idle",
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodaysTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTodaysTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload; // Update state with real-time tasks
      })
      .addCase(fetchTodaysTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks.push(action.payload); 
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter(task => task.id !== action.payload); // Filter out the deleted task
      })
  }   
});

export const { setTasks } = taskSlice.actions;
export default taskSlice.reducer;