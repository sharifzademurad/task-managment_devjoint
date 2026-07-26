const tasks = [
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

    const title = document.createElement("h3");
    title.textContent = task.title;

    const desc = document.createElement("p");
    desc.textContent = task.description;

    const badge = document.createElement("span");
    badge.classList.add("priority-badge", task.priority);
    badge.textContent = task.priority;
    card.appendChild(badge);
    card.appendChild(title);
    card.appendChild(desc);

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

renderTasks();