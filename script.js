if (!localStorage.getItem('tasks')) {
    localStorage.setItem('tasks', '[]');
}

let tasks = JSON.parse(localStorage.getItem('tasks'));
let currentFilter = 'all';

const newTask = document.getElementById('new-task-title');
const addBtn = document.getElementById('add-task');
const tasksDiv = document.getElementById('tasks');
const allFilterSpan = document.getElementById('all');
const completedFilterSpan = document.getElementById('completed');
const incompleteFilterSpan = document.getElementById('incomplete');
let selectedFilterSpan = document.querySelector('.selected');

addBtn.addEventListener('click', addTask);
allFilterSpan.addEventListener('click', filterTasks);
completedFilterSpan.addEventListener('click', filterTasks);
incompleteFilterSpan.addEventListener('click', filterTasks);

function renderTasks() {
    tasksDiv.innerHTML = '';
    if (currentFilter === 'all') {
        renderAll();
    } else if (currentFilter === 'completed') {
        renderCompleted();
    } else if (currentFilter === 'incomplete') {
        renderIncomplete();
    }
}

function renderAll() {
    if (tasks.length === 0) {
        tasksDiv.innerHTML = `
            <img src="empty.jpeg" alt="">
            <p>Your tasklist is empty</p>
        `;
    } else {
        for (let i = 0; i < tasks.length; ++i) {
            createTask(i, tasks[i]);
        }
    }
}

function renderCompleted() {
    const completedTasks = tasks.filter(task => task.completed === true);
    if (completedTasks.length === 0) {
        tasksDiv.innerHTML = `
            <img   src="empty.jpeg" alt="">
            <p>You don't have any completed tasks</p>
        `;
    } else {
        for (let i = 0; i < completedTasks.length; ++i) {
            createTask(tasks.indexOf(completedTasks[i]), completedTasks[i]);
        }
    }
}

function renderIncomplete() {
    const inCompleteTasks = tasks.filter(task => task.completed === false);
    if (inCompleteTasks.length === 0) {
        tasksDiv.innerHTML = `
            <img src="empty.jpeg" alt="">
            <p>You don't have any incomplete tasks</p>
        `;
    } else {
        for (let i = 0; i < inCompleteTasks.length; ++i) {
            createTask(tasks.indexOf(inCompleteTasks[i]), inCompleteTasks[i]);
        }
    }
}

function addTask() {
    let titleValue = newTask.value.trim();
    newTask.value = '';
    if (titleValue.length === 0) {
        return;
    }
    let task = {
        title: titleValue,
        completed: false
    }
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function editTask(e) {
    let index = e.target.parentElement.dataset.taskId;
    let updatedTitle = prompt('Edit Task', tasks[index].title).trim();
    if (updatedTitle === null || updatedTitle === '') {
        return;
    }
    tasks[index].title = updatedTitle;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function deleteTask(e) {
    if (confirm('Do you want to delete this task?')) {
        let index = e.target.parentElement.dataset.taskId;
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderTasks();
    }
}

function markAsComplete(e) {
    let index = e.target.parentElement.dataset.taskId;
    tasks[index].completed = e.target.checked;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

function createTask(taskId, task) {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task');
    taskDiv.dataset.taskId = taskId;

    const checkboxInput = document.createElement('input');
    checkboxInput.setAttribute('type', 'checkbox');
    checkboxInput.checked = task.completed;
    checkboxInput.id = `task${taskId}`;
    checkboxInput.addEventListener('change', markAsComplete);

    const taskTitle = document.createElement('label');
    taskTitle.classList.add('task-title');
    taskTitle.textContent = task.title;
    taskTitle.setAttribute('for', `task${taskId}`);

    const editIcon = document.createElement('i');
    editIcon.setAttribute('class', 'far fa-edit edit-btn');
    editIcon.addEventListener('click', editTask);

    const deleteIcon = document.createElement('i');
    deleteIcon.setAttribute('class', 'far fa-trash-alt del-btn');
    deleteIcon.addEventListener('click', deleteTask);

    taskDiv.appendChild(checkboxInput);
    taskDiv.appendChild(taskTitle);
    taskDiv.appendChild(editIcon);
    taskDiv.appendChild(deleteIcon);
    tasksDiv.appendChild(taskDiv);
}

function filterTasks(e) {
    selectedFilterSpan.classList.remove('selected');
    selectedFilterSpan = e.target;
    selectedFilterSpan.classList.add('selected');
    currentFilter = selectedFilterSpan.id;
    renderTasks();
}

renderTasks();