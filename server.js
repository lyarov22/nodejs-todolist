const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Настройка базы данных
const uri = 'mongodb+srv://admin:admin@cluster0.ajtwjbe.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Определение схемы задач
const taskSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
});

// Создание модели задачи
const Task = mongoose.model('Task', taskSchema);

// Создание приложения Express

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Получение списка задач
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.send(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// Создание новой задачи
app.post('/tasks', async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      completed: false,
    });
    const savedTask = await task.save();
    res.send(savedTask);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// Обновление задачи
app.put('/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: { completed: req.body.completed } },
      { new: true }
    );
    res.send(updatedTask);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// Удаление задачи
app.delete('/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    res.send(deletedTask);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// Запуск сервера
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
