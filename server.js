const express = require('express');
const path = require('path');
const app = express();
const port = 3000;


app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// const express = require('express');
// const path = require('path');
// const app = express();
// const port = 3000;

// // Enable JSON parsing for request bodies
// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));

// // In-memory storage for todos
// let todoStore = [];

// // Serve the main HTML file
// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

// // Get all todos
// app.get('/api/todos', (req, res) => {
//     res.json(todoStore);
// });

// // Create new todo
// app.post('/api/todos', (req, res) => {
//     const newTodo = req.body;
//     todoStore.push(newTodo);
//     res.json(todoStore);
// });

// // Update todo list
// app.put('/api/todos', (req, res) => {
//     todoStore = req.body;
//     res.json(todoStore);
// });

// // Delete todo
// app.delete('/api/todos/:item', (req, res) => {
//     const itemToDelete = req.params.item;
//     todoStore = todoStore.filter(todo => todo.item !== itemToDelete);
//     res.json(todoStore);
// });

// app.listen(port, () => {
//     console.log(`Server is running at http://localhost:${port}`);
// });
