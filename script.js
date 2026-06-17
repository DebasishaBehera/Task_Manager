const taskContainer = document.getElementById("taskContainer");
const taskTitleInput = document.getElementById("taskTitleInput");
const taskCategorySelect = document.getElementById("taskCategorySelect");
const addBtn = document.getElementById("addTaskBtn");
const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.getElementById("themeLabel");
const totalSpan = document.getElementById("totalCount");
const doneSpan = document.getElementById("doneCount");
const pendingSpan = document.getElementById("pendingCount");
const clearAllBtn = document.getElementById("clearAllBtn");

const grandparent = document.getElementById("grandparent");
const parent = document.getElementById("parent");
const childBtn = document.getElementById("childBtn");
const eventLog = document.getElementById("eventLog");

let taskIdCounter = 0;
const STORAGE_KEYS = {
  tasks: "taskflow.tasks",
  theme: "taskflow.theme",
};

let tasks = loadTasks();

function loadTasks() {
  const savedTasks = localStorage.getItem(STORAGE_KEYS.tasks);

  try {
    const parsedTasks = JSON.parse(savedTasks);
    parsedTasks.forEach((task) => {
      taskIdCounter = Math.max(taskIdCounter, task.id);
    });
    return parsedTasks;
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEYS.tasks, JSON.stringify(tasks));
}

function loadTheme() {
  return localStorage.getItem(STORAGE_KEYS.theme) || "dark";
}

function saveTheme(theme) {
  localStorage.setItem(STORAGE_KEYS.theme, theme);
}

function renderTasks(tasksArray) {
  taskContainer.innerHTML = "";
  const fragment = document.createDocumentFragment();
  tasksArray.forEach((task) => {
    const card = createTaskCard(task);
    fragment.appendChild(card);
  });
  taskContainer.appendChild(fragment);
  tasks = tasksArray;
  saveTasks();
  updateStats();
}

function createTaskCard(task) {
  const card = document.createElement("div");
  card.className = "task-card" + (task.completed ? " completed" : "");
  card.setAttribute("data-id", task.id);
  card.setAttribute("data-status", task.completed ? "done" : "pending");
  card.setAttribute("data-category", task.category);

  const titleEl = document.createElement("div");
  titleEl.className = "task-title";
  titleEl.textContent = task.title;

  const catEl = document.createElement("span");
  catEl.className = "task-category";
  catEl.textContent = task.category;

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "edit-btn";
  editBtn.innerHTML = '<i class="fas fa-pen"></i> edit';
  editBtn.dataset.action = "edit";

  const completeBtn = document.createElement("button");
  completeBtn.className = "complete-btn";
  completeBtn.innerHTML = task.completed
    ? '<i class="fas fa-undo"></i> undo'
    : '<i class="fas fa-check"></i> complete';
  completeBtn.dataset.action = "complete";

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "delete-btn";
  deleteBtn.innerHTML = '<i class="fas fa-trash"></i> delete';
  deleteBtn.dataset.action = "delete";

  actions.append(editBtn, completeBtn, deleteBtn);
  card.append(titleEl, catEl, actions);

  return card;
}

function addTask(title, category) {
  if (!title.trim()) {
    alert("please enter a task title");
    return;
  }
  const newTask = {
    id: ++taskIdCounter,
    title: title.trim(),
    category: category || "personal",
    completed: false,
  };
  tasks.push(newTask);
  renderTasks(tasks);
  taskTitleInput.value = "";
  taskTitleInput.setAttribute("value", "");
}

function updateStats() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  totalSpan.textContent = total;
  doneSpan.textContent = done;
  pendingSpan.textContent = total - done;
}

taskContainer.addEventListener("click", function (e) {
  const target = e.target.closest("button");
  if (!target) return;
  const action = target.dataset.action;
  if (!action) return;
  const card = target.closest(".task-card");
  if (!card) return;

  const taskId = parseInt(card.getAttribute("data-id"));
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return;

  if (action === "delete") {
    tasks.splice(taskIndex, 1);
    renderTasks(tasks);
    return;
  } else if (action === "complete") {
    const currentTask = tasks[taskIndex];
    currentTask.completed = !currentTask.completed;
    renderTasks(tasks);
    return;
  } else if (action === "edit") {
    const titleEl = card.querySelector(".task-title");
    const newTitle = prompt("Edit task title:", titleEl.textContent);
    if (newTitle !== null && newTitle.trim() !== "") {
      const tasksCopy = [...tasks];
      const idx = tasksCopy.findIndex((t) => t.id === taskId);
      if (idx !== -1) {
        tasksCopy[idx].title = newTitle.trim();
        renderTasks(tasksCopy);
      }
    }
    return;
  }
});

addBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const title = taskTitleInput.value;
  const category = taskCategorySelect.value;
  addTask(title, category);
});

taskTitleInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    addBtn.click();
  }
});

clearAllBtn.addEventListener("click", function () {
  if (confirm("Delete all tasks?")) {
    tasks = [];
    taskContainer.innerHTML = "";
    saveTasks();
    updateStats();
  }
});

themeToggle.addEventListener("click", function () {
  const body = document.body;
  const current = body.getAttribute("data-theme");
  if (current === "dark") {
    body.removeAttribute("data-theme");
    themeLabel.textContent = "Dark";
    body.setAttribute("data-theme", "light");
    saveTheme("light");
  } else {
    body.setAttribute("data-theme", "dark");
    themeLabel.textContent = "Light";
    saveTheme("dark");
  }
});

grandparent.addEventListener(
  "click",
  function (e) {
    eventLog.textContent = "🧩 capturing: grandparent";
    console.log("capturing: grandparent");
  },
  true,
);

parent.addEventListener(
  "click",
  function (e) {
    eventLog.textContent = "🧩 capturing: parent";
    console.log("capturing: parent");
  },
  true,
);

childBtn.addEventListener("click", function (e) {
  eventLog.textContent = "🎯 target: child (bubbling up)";
  console.log("target: child");
});

grandparent.addEventListener(
  "click",
  function (e) {
    eventLog.textContent = "🔄 bubbling: grandparent";
    console.log("bubbling: grandparent");
  },
  false,
);

parent.addEventListener(
  "click",
  function (e) {
    eventLog.textContent = "🔄 bubbling: parent";
    console.log("bubbling: parent");
  },
  false,
);

renderTasks(tasks);

const savedTheme = loadTheme();
document.body.setAttribute("data-theme", savedTheme);
themeLabel.textContent = savedTheme === "dark" ? "Light" : "Dark";
if (!localStorage.getItem(STORAGE_KEYS.theme)) {
  saveTheme(savedTheme);
}
