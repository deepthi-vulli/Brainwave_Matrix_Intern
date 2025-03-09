document.addEventListener('DOMContentLoaded', function() {
  const plannerContainer = document.getElementById('plannerContainer');
  const currentDayEl = document.getElementById('currentDay');
  const datePicker = document.getElementById('datePicker');

  // Get today's date in YYYY-MM-DD format
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  datePicker.value = todayStr; // set default to today

  // Update header date text
  function updateHeader(dateStr) {
    const dateObj = new Date(dateStr);
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    currentDayEl.textContent = dateObj.toLocaleDateString(undefined, options);
  }

  updateHeader(todayStr);

  // Generate planner for the selected date
  function generatePlanner(selectedDateStr) {
    // Clear existing planner cards
    plannerContainer.innerHTML = '';

    // Determine color coding based on date comparison:
    // if selected date === today, use current hour; if before today, all are past; if after, all are future.
    let selectedDate = new Date(selectedDateStr);
    let comparison;
    const currentDateStr = todayStr;
    if (selectedDateStr === currentDateStr) {
      comparison = 'today';
    } else if (selectedDateStr < currentDateStr) {
      comparison = 'past';
    } else {
      comparison = 'future';
    }
    
    // If today, get current hour; otherwise, set a dummy hour (0 for past, 23 for future)
    let currentHour = comparison === 'today' ? new Date().getHours() : (comparison === 'past' ? 24 : -1);

    // Create 24 cards (hours 0 to 23)
    for (let hour = 0; hour < 24; hour++) {
      // Create card element
      const card = document.createElement('div');
      card.classList.add('card');
      card.setAttribute('data-hour', hour);

      // Determine card color class based on comparison:
      if (comparison === 'today') {
        if (hour < currentHour) {
          card.classList.add('past');
        } else if (hour === currentHour) {
          card.classList.add('present');
        } else {
          card.classList.add('future');
        }
      } else if (comparison === 'past') {
        card.classList.add('past');
      } else if (comparison === 'future') {
        card.classList.add('future');
      }

      // Card header with hour label in 12h format
      const cardHeader = document.createElement('div');
      cardHeader.classList.add('card-header');
      let hourLabel;
      if (hour === 0) {
        hourLabel = '12 AM';
      } else if (hour < 12) {
        hourLabel = hour + ' AM';
      } else if (hour === 12) {
        hourLabel = '12 PM';
      } else {
        hourLabel = (hour - 12) + ' PM';
      }
      const cardTitle = document.createElement('h2');
      cardTitle.classList.add('card-title');
      cardTitle.textContent = hourLabel;
      cardHeader.appendChild(cardTitle);
      card.appendChild(cardHeader);

      // Task input row
      const taskInputDiv = document.createElement('div');
      taskInputDiv.classList.add('task-input');

      const taskInput = document.createElement('input');
      taskInput.type = 'text';
      taskInput.placeholder = 'Add a new task...';

      const addBtn = document.createElement('button');
      addBtn.textContent = 'Add';

      taskInputDiv.appendChild(taskInput);
      taskInputDiv.appendChild(addBtn);
      card.appendChild(taskInputDiv);

      // Task list container
      const taskList = document.createElement('ul');
      taskList.classList.add('task-list');
      card.appendChild(taskList);

      // Construct a unique key for localStorage for this date and hour
      const storageKey = `tasks-${selectedDateStr}-${hour}`;
      const savedData = localStorage.getItem(storageKey);
      let tasks = savedData ? JSON.parse(savedData) : [];

      // Function to render tasks for this hour
      function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
          const li = document.createElement('li');
          li.classList.add('task-item');

          const span = document.createElement('span');
          span.classList.add('task-text');
          span.textContent = task;

          const deleteBtn = document.createElement('button');
          deleteBtn.classList.add('deleteBtn');
          deleteBtn.textContent = 'Delete';
          deleteBtn.addEventListener('click', () => {
            tasks.splice(index, 1);
            localStorage.setItem(storageKey, JSON.stringify(tasks));
            renderTasks();
          });

          li.appendChild(span);
          li.appendChild(deleteBtn);
          taskList.appendChild(li);
        });
      }
      renderTasks();

      // Add new task event
      addBtn.addEventListener('click', () => {
        const newTask = taskInput.value.trim();
        if (newTask) {
          tasks.push(newTask);
          localStorage.setItem(storageKey, JSON.stringify(tasks));
          renderTasks();
          taskInput.value = '';
        }
      });

      // Append card to container
      plannerContainer.appendChild(card);
    }
  }

  // Generate planner for default selected date (today)
  generatePlanner(todayStr);

  // When user changes date via date picker, update header and re-generate planner
  datePicker.addEventListener('change', function() {
    const selectedDateStr = this.value;
    updateHeader(selectedDateStr);
    generatePlanner(selectedDateStr);
  });
});
