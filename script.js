let tasks = [
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

function renderTasks() {
  todoList.innerHTML = "";
  inProgressList.innerHTML = "";
  doneList.innerHTML = "";

  let todoCount = 0;
  let inProgressCount = 0;
  let doneCount = 0;

  tasks.forEach((task) => {
    const card = document.createElement("div");
    card.classList.add("task-card");

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
  renderTasks();
}

renderTasks();