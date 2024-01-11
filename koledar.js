let currentDate = new Date();

document.addEventListener('DOMContentLoaded', function () {
  updateCalendar();

  setInterval(function () {
    updateCalendar();
  }, 60000); // Posodabljanje vsako minuto
});

function updateCalendar() {
    const currentDayElement = document.getElementById('currentDay');
    const currentMonthElement = document.getElementById('currentMonth');
    const calendarElement = document.getElementById('calendar');
  
    currentDayElement.textContent = `${getDayName(currentDate.getDay())}, ${currentDate.getDate()}.`;
    currentMonthElement.textContent = `${getMonthName(currentDate.getMonth())}, ${currentDate.getFullYear()}`;
  
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  
    let calendarHTML = '';

    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
        const dayClassName = dayDate.toDateString() === currentDate.toDateString() ? 'day currentDay' : 'day';
    
        // Check if there are tasks for the day
        const tasksKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
        const tasks = JSON.parse(localStorage.getItem(tasksKey)) || {};
        const dayTasks = tasks[i] || [];
    
        calendarHTML += `<div class="${dayClassName}" onclick="openTaskModal(${currentDate.getMonth()}, ${currentDate.getFullYear()}, ${i})">${i}`;
        
        if (dayTasks.length > 0) {
          calendarHTML += `<div class="task-marker"></div>`;
        }
        
        calendarHTML += `</div>`;
      }
    
      calendarElement.innerHTML = calendarHTML;
    
      // Load tasks for the current month
      loadTasks(currentDate.getMonth(), currentDate.getFullYear());
    }

function openTaskModal(month, year, day) {
    const modalContent = document.getElementById('modalContent');
    const modal = document.getElementById('myModal');
    modalContent.innerHTML = `
      <h2>Dodaj opravilo</h2>
      <input type="text" id="taskInput" placeholder="Vnesi opravilo">
      <button onclick="addTask(${month}, ${year}, ${day})">Dodaj</button>
      <h2>Opravila za dan ${day}.${month + 1}.${year}</h2>
      <div id="tasksList"></div>
    `;
    loadTasksInModal(month, year, day);
    modal.style.display = 'block';
}

function closeModal() {
  const modal = document.getElementById('myModal');
  modal.style.display = 'none';
}

function addTask(month, year, day) {
    const taskInput = document.getElementById('taskInput');
    const task = taskInput.value.trim();
    if (task !== '') {
      saveTask(month, year, day, task);
      taskInput.value = '';
      loadTasksInModal(month, year, day);
      closeModal(); // Zapri modalno okno po dodajanju opravila
      updateCalendar(); // Posodobi koledar po dodajanju opravila
    }
  }

function saveTask(month, year, day, task) {
  const tasksKey = `${year}-${month + 1}`;
  let tasks = JSON.parse(localStorage.getItem(tasksKey)) || {};

  if (!tasks[day]) {
    tasks[day] = [];
  }

  tasks[day].push({ task, completed: false });
  localStorage.setItem(tasksKey, JSON.stringify(tasks));

  loadTasks(month, year); // Reload tasks
  updateCalendar(); // Reload calendar to update task markers
}

function loadTasksInModal(month, year, day) {
  const tasksKey = `${year}-${month + 1}`;
  const tasks = JSON.parse(localStorage.getItem(tasksKey)) || {};
  const tasksList = document.getElementById('tasksList');
  tasksList.innerHTML = '';
  const dayTasks = tasks[day] || [];
  dayTasks.forEach((taskObj, index) => {
    const taskClass = taskObj.completed ? 'completed' : '';
    tasksList.innerHTML += `<div class="task ${taskClass}" onclick="toggleTask(${month}, ${year}, ${day}, ${index})">${taskObj.task} <span class="delete" onclick="deleteTaskInModal(${month}, ${year}, ${day}, ${index})">&#10006;</span></div>`;
  });
}

function deleteTaskInModal(month, year, day, index) {
  deleteTask(month, year, day, index);
  loadTasksInModal(month, year, day);
  updateCalendar(); // Reload calendar to update task markers
}

function deleteTask(month, year, day, index) {
  const tasksKey = `${year}-${month + 1}`;
  let tasks = JSON.parse(localStorage.getItem(tasksKey)) || {};

  if (tasks[day] && tasks[day][index]) {
    tasks[day].splice(index, 1);

    // Če ni več opravil za ta dan, odstrani dan iz seznama
    if (tasks[day].length === 0) {
      delete tasks[day];
    }

    localStorage.setItem(tasksKey, JSON.stringify(tasks));

    loadTasks(month, year); // Ponovno naloži opravila
    updateCalendar(); // Ponovno naloži koledar za posodobitev označevalcev opravil
  }
}

function getDayName(dayIndex) {
  const days = ['Ned', 'Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob'];
  return days[dayIndex];
}

function getMonthName(monthIndex) {
  const months = ['Januar', 'Februar', 'Marec', 'April', 'Maj', 'Junij', 'Julij', 'Avgust', 'September', 'Oktober', 'November', 'December'];
  return months[monthIndex];
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  updateCalendar();
}

function previousMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  updateCalendar();
}
