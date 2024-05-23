const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const TodoTask = require('./models/TodoTask');

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Failed to connect to MongoDB', err));

// Middleware
app.use(express.json());
app.set("view engine", "ejs");

// GET METHOD
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        if (err) {
            return res.status(500).send("Error retrieving tasks");
        }
        res.render("todo.ejs", { todoTasks: tasks });
    });
});

// Route to create a new todo task
app.post('/addtask', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });

    try {
        await todoTask.save();
        res.status(201).redirect("/");
    } catch (err) {
        res.status(400).send('Failed to add task');
    }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
