import { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "./config";
import {
  AppBar, Toolbar, Typography, Container, TextField,
  Button, Card, CardContent, CardActions, Grid,
  Snackbar, Alert, Checkbox, Box, Paper, Divider
} from "@mui/material";

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [message, setMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch {
      showMessage("Failed to fetch todos");
    }
  };

  useEffect(() => { fetchTodos(); }, []);

  const createTodo = async () => {
    try {
      await axios.post(API_URL, { title, description, completed });
      setTitle(""); setDescription(""); setCompleted(false);
      fetchTodos();
      showMessage("Todo created!");
    } catch { showMessage("Failed to create todo"); }
  };

  const updateTodo = async () => {
    try {
      await axios.put(`${API_URL}/${editingTodo.id}`, { title, description, completed });
      setTitle(""); setDescription(""); setCompleted(false); setEditingTodo(null);
      fetchTodos();
      showMessage("Todo updated!");
    } catch { showMessage("Failed to update todo"); }
  };

  const deleteTodo = async (id) => {
    try { await axios.delete(`${API_URL}/${id}`); fetchTodos(); showMessage("Todo deleted!"); }
    catch { showMessage("Failed to delete todo"); }
  };

  const editTodo = (todo) => {
    setEditingTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description);
    setCompleted(todo.completed);
  }

  const searchTodoById = async () => {
    if (!searchId.trim()) { showMessage("Enter ID"); return; }
    try { const res = await axios.get(`${API_URL}/${searchId}`); setSearchResult(res.data); showMessage("Todo found!"); }
    catch { setSearchResult(null); showMessage("Todo not found"); }
  };

  const showMessage = (msg) => { setMessage(msg); setOpenSnackbar(true); }

  return (
    <Box sx={{ bgcolor: "#f3e8ff", minHeight: "100vh", pb: 5 }}>
      {/* Header */}
      <AppBar position="static" sx={{ mb: 4, bgcolor: "#8e7cc3", boxShadow: "0 4px 12px rgba(0,0,0,0.25)" }}>
        <Toolbar>
          <Typography variant="h5" sx={{ fontWeight: "bold", color: "#fff" }}>Lavender Todo App</Typography>
        </Toolbar>
      </AppBar>

      <Container>
        <Grid container spacing={4}>
          {/* Sidebar: Form + Search */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 4, bgcolor: "#e4d9f2", borderRadius: 4, boxShadow: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, color: "#6b4ca2" }}>
                {editingTodo ? "Edit Todo" : "Add Todo"}
              </Typography>
              <TextField
                label="Title" fullWidth margin="normal"
                value={title} onChange={(e) => setTitle(e.target.value)}
                sx={{
                  "& .MuiInputBase-root": { borderRadius: 3, bgcolor: "#f5f0ff" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#b39ddb" },
                  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9575cd" },
                }}
              />
              <TextField
                label="Description" fullWidth margin="normal"
                multiline rows={3} value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{
                  "& .MuiInputBase-root": { borderRadius: 3, bgcolor: "#f5f0ff" },
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#b39ddb" },
                  "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9575cd" },
                }}
              />
              <Box sx={{ mt: 1, mb: 2 }}>
                <Checkbox checked={completed} onChange={(e) => setCompleted(e.target.checked)} sx={{ color: "#9575cd" }} />
                <Typography component="span" sx={{ ml: 1 }}>Completed</Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  onClick={editingTodo ? updateTodo : createTodo}
                  fullWidth
                  sx={{
                    borderRadius: 3,
                    bgcolor: "#9575cd",
                    "&:hover": { bgcolor: "#7e57c2" },
                    color: "#fff",
                  }}
                >
                  {editingTodo ? "Update" : "Add"}
                </Button>
                {editingTodo && (
                  <Button
                    variant="outlined" fullWidth
                    onClick={() => { setEditingTodo(null); setTitle(""); setDescription(""); setCompleted(false); }}
                    sx={{
                      borderRadius: 3,
                      borderColor: "#6b4ca2",
                      color: "#6b4ca2",
                      "&:hover": { borderColor: "#9575cd", color: "#9575cd", bgcolor: "#f3e8ff" }
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </Box>
            </Paper>

            <Paper sx={{ p: 3, bgcolor: "#e4d9f2", borderRadius: 4, boxShadow: 4 }}>
              <Typography variant="h6" sx={{ mb: 2, color: "#6b4ca2" }}>Search Todo by ID</Typography>
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <TextField
                  label="Enter ID" value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  fullWidth
                  sx={{
                    "& .MuiInputBase-root": { borderRadius: 3, bgcolor: "#f5f0ff" },
                    "& .MuiOutlinedInput-notchedOutline": { borderColor: "#b39ddb" },
                    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#9575cd" },
                  }}
                />
                <Button
                  variant="contained"
                  sx={{ bgcolor: "#9575cd", "&:hover": { bgcolor: "#7e57c2" }, borderRadius: 3, color: "#fff" }}
                  onClick={searchTodoById}
                >
                  Get
                </Button>
              </Box>
              {searchResult && (
                <Card sx={{ p: 2, bgcolor: "#d1c4e9", borderRadius: 3, boxShadow: 3 }}>
                  <Typography>ID: {searchResult.id}</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#6b4ca2" }}>{searchResult.title}</Typography>
                  <Typography>{searchResult.description}</Typography>
                  <Typography>Completed: {searchResult.completed ? "Yes" : "No"}</Typography>
                </Card>
              )}
            </Paper>
          </Grid>

          {/* Main: Todo List */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" sx={{ mb: 2, color: "#6b4ca2" }}>All Todos</Typography>
            <Grid container spacing={2}>
              {todos.map(todo => (
                <Grid item xs={12} sm={6} key={todo.id}>
                  <Card sx={{ p: 2, bgcolor: "#d1c4e9", borderRadius: 4, boxShadow: 4 }}>
                    <CardContent>
                      <Typography variant="caption" sx={{ color: "#9575cd" }}>ID: {todo.id}</Typography>
                      <Typography variant="h6" sx={{ color: "#7e57c2" }}>{todo.title}</Typography>
                      <Typography>{todo.description}</Typography>
                      <Typography sx={{ mt: 1 }}>Completed: {todo.completed ? "Yes" : "No"}</Typography>
                    </CardContent>
                    <Divider sx={{ my: 1, borderColor: "#b39ddb" }} />
                    <CardActions sx={{ justifyContent: "space-between" }}>
                      <Button size="small" variant="outlined" sx={{ borderColor: "#9575cd", color: "#9575cd", borderRadius: 3, "&:hover": { bgcolor: "#d1c4e9" } }} onClick={() => editTodo(todo)}>Edit</Button>
                      <Button size="small" variant="outlined" sx={{ borderColor: "#6b4ca2", color: "#6b4ca2", borderRadius: 3, "&:hover": { bgcolor: "#e4d9f2" } }} onClick={() => deleteTodo(todo.id)}>Delete</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={openSnackbar} autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="info" sx={{ bgcolor: "#d1c4e9", color: "#6b4ca2" }}>{message}</Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
