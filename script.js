let tasks = JSON.parse(localStorage.getItem("tasks")) || [
  {
    id: "1",
    title: "Layihə strukturunu qurmaq",
    description: "HTML və CSS fayllarını hazırlamaq.",
    status: "todo",         
    priority: "high"       
  },
  {
    id: "2",
    title: "Dinamik render funksiyası",
    description: "JS massivindən məlumatı DOM-a vermək.",
    status: "in-progress",
    priority: "medium"
  },
  {
    id: "3",
    title: "GitHub reponu sazlamaq",
    description: "İlk push əməliyyatını etmək.",
    status: "done",
    priority: "low"
  }
];

function saveTasksToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

const todoList = document.getElementById("todo-list");
const inProgressList = document.getElementById("in-progress-list");
const doneList = document.getElementById("done-list");

const countTodo = document.getElementById("count-todo");
const countInProgress = document.getElementById("count-in-progress");
const countDone = document.getElementById("count-done");

const taskModal = document.getElementById("taskModal");
const openModalBtn = document.getElementById("openModalBtn");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const taskForm = document.getElementById("taskForm");

const taskIdInput = document.getElementById("taskId");
const taskTitleInput = document.getElementById("taskTitleInput");
const taskDescInput = document.getElementById("taskDescInput");
const taskStatusInput = document.getElementById("taskStatusInput");
const taskPriorityInput = document.getElementById("taskPriorityInput");
const modalTitle = document.getElementById("modalTitle");

// --- Axtarış və Filtr Elementləri ---
const searchInput = document.getElementById("searchInput");
const priorityFilter = document.getElementById("priorityFilter");

function renderTasks() {
  todoList.innerHTML = "";
  inProgressList.innerHTML = "";
  doneList.innerHTML = "";

  let todoCount = 0;
  let inProgressCount = 0;
  let doneCount = 0;

  // Input dəyərlərini alırıq
  const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";
  const selectedPriority = priorityFilter ? priorityFilter.value : "all";

  // Tapşırıqları axtarış mətni və prioritetə görə süzgəcdən keçiririk
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm);

    const matchesPriority =
      selectedPriority === "all" || task.priority === selectedPriority;

    return matchesSearch && matchesPriority;
  });

  filteredTasks.forEach((task) => {
    const card = document.createElement("div");
    card.classList.add("task-card");
    card.setAttribute("draggable", "true");

    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", task.id);
      card.classList.add("dragging");
    });

    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
    });

    const badge = document.createElement("span");
    badge.classList.add("priority-badge", task.priority);
    badge.textContent = task.priority;

    const title = document.createElement("h3");
    title.textContent = task.title;

    const desc = document.createElement("p");
    desc.textContent = task.description;

    const actions = document.createElement("div");
    actions.classList.add("card-actions");

    const editBtn = document.createElement("button");
    editBtn.classList.add("btn-icon", "btn-edit");
    editBtn.textContent = "✏️ Redaktə";
    editBtn.onclick = () => openEditModal(task.id);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("btn-icon", "btn-delete");
    deleteBtn.textContent = "🗑️ Sil";
    deleteBtn.onclick = () => deleteTask(task.id);

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(badge);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(actions); 

    if (task.status === "todo") {
      todoList.appendChild(card);
      todoCount++;
    } else if (task.status === "in-progress") {
      inProgressList.appendChild(card);
      inProgressCount++;
    } else if (task.status === "done") {
      doneList.appendChild(card);
      doneCount++;
    }
  });

  countTodo.textContent = todoCount;
  countInProgress.textContent = inProgressCount;
  countDone.textContent = doneCount;

  if (todoCount === 0) todoList.innerHTML = '<div class="empty-msg">Tapşırıq yoxdur</div>';
  if (inProgressCount === 0) inProgressList.innerHTML = '<div class="empty-msg">Tapşırıq yoxdur</div>';
  if (doneCount === 0) doneList.innerHTML = '<div class="empty-msg">Tapşırıq yoxdur</div>';
}

// --- Axtarış və Filtr Event Listener-ləri ---
if (searchInput) {
  searchInput.addEventListener("input", renderTasks);
}
if (priorityFilter) {
  priorityFilter.addEventListener("change", renderTasks);
}

const columns = document.querySelectorAll(".column");

columns.forEach((column) => {
  column.addEventListener("dragover", (e) => {
    e.preventDefault();
    column.classList.add("drag-over");
  });

  column.addEventListener("dragleave", () => {
    column.classList.remove("drag-over");
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();
    column.classList.remove("drag-over");

    const taskId = e.dataTransfer.getData("text/plain");
    const newStatus = column.getAttribute("data-status");

    tasks = tasks.map((t) =>
      t.id === taskId ? { ...t, status: newStatus } : t
    );

    saveTasksToLocalStorage(); 
    renderTasks();
  });
});

openModalBtn.addEventListener("click", () => {
  taskForm.reset();
  taskIdInput.value = "";
  modalTitle.textContent = "Yeni Tapşırıq";
  taskModal.classList.add("active");
});

function closeModal() {
  taskModal.classList.remove("active");
}
closeModalBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = taskIdInput.value;
  const title = taskTitleInput.value.trim();
  const description = taskDescInput.value.trim();
  const status = taskStatusInput.value;
  const priority = taskPriorityInput.value;

  if (!title) return;

  if (id) {
    tasks = tasks.map((t) =>
      t.id === id ? { ...t, title, description, status, priority } : t
    );
  } else {
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      status,
      priority
    };
    tasks.push(newTask);
  }

  saveTasksToLocalStorage(); 
  closeModal();
  renderTasks();
});

function openEditModal(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  taskIdInput.value = task.id;
  taskTitleInput.value = task.title;
  taskDescInput.value = task.description;
  taskStatusInput.value = task.status;
  taskPriorityInput.value = task.priority;

  modalTitle.textContent = "Tapşırığı Redaktə Et";
  taskModal.classList.add("active");
}

function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasksToLocalStorage();
  renderTasks();
}

renderTasks();