/*
  Student:  (ID: YOUR ID)
  Module: Intro to JavaScript
  Assignment: JavaScript - Interactive Task Manager 
  Lecturer: Ms C. Anuli
*/

// 1. Grab the elements from the page -----
const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const prioritySelect = document.getElementById("task-priority");
const taskList = document.getElementById("task-list");
const taskStats = document.getElementById("task-stats");

// 2. Storage key and the array that holds our tasks -----
const STORAGE_KEY = "interactiveTasks";
let tasks = [];

//  3. Storage functions -----

// Save the tasks array to localStorage as JSON text
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Read the saved JSON text back into an array
function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return [];
}

// - 4. Update the UI -----
function renderTasks() {
  taskList.innerHTML = ""; // clear the list first

  // Update the stats line
  const doneCount = tasks.filter(function (t) {
    return t.completed;
  }).length;
  taskStats.textContent =
    "Total: " + tasks.length +
    " | Done: " + doneCount +
    " | Pending: " + (tasks.length - doneCount);

  if (tasks.length === 0) {
    taskList.textContent = "No tasks yet. Add one!";
    return;
  }

  tasks.forEach(function (task) {
    // the card
    const item = document.createElement("div");
    item.className = "task-item " + task.priority;
    if (task.completed) {
      item.classList.add("completed");
    }
    item.dataset.id = task.id;

    // left side: title and priority
    const info = document.createElement("div");
    info.className = "task-info";

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    const priority = document.createElement("span");
    priority.className = "task-priority";
    priority.textContent = task.priority + " priority";

    info.appendChild(title);
    info.appendChild(priority);

    // right side: buttons
    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeBtn = document.createElement("button");
    completeBtn.className = "complete-btn";
    completeBtn.dataset.action = "complete";
    completeBtn.textContent = task.completed ? "Undo" : "Complete";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.dataset.action = "delete";
    deleteBtn.textContent = "Delete";

    actions.appendChild(completeBtn);
    actions.appendChild(deleteBtn);

    // put it all together
    item.appendChild(info);
    item.appendChild(actions);
    taskList.appendChild(item);
  });
}

//  5. Add a new task -----
function addTask(title, priority) {
  const newTask = {
    id: Date.now(),
    title: title,
    priority: priority,
    completed: false,
  };
  tasks.push(newTask);
  saveTasks();
  renderTasks();
}

//  6. Mark a task complete / not complete -----
function toggleTask(id) {
  const task = tasks.find(function (t) {
    return t.id === id;
  });
  if (!task) return;

  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

//  7. Delete a task -----
function deleteTask(id) {
  tasks = tasks.filter(function (t) {
    return t.id !== id;
  });
  saveTasks();
  renderTasks();
}

//  8. Events -----

// Form submit: add a task
taskForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stop the page from reloading

  const title = titleInput.value.trim();
  if (title === "") return;

  addTask(title, prioritySelect.value);

  taskForm.reset();
  prioritySelect.value = "medium";
  titleInput.focus();
});

// Click on the list: one listener handles all buttons (event delegation)
taskList.addEventListener("click", function (event) {
  const button = event.target.closest("button");
  if (!button) return;

  const card = button.closest(".task-item");
  const id = Number(card.dataset.id);

  if (button.dataset.action === "complete") {
    toggleTask(id);
  } else if (button.dataset.action === "delete") {
    deleteTask(id);
  }
});

//  9. When the page loads, show saved tasks -----
tasks = loadTasks();
renderTasks();