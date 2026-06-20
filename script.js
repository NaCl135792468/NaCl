const STORAGE_KEY = 'schedulePlanner.Tasks';
const taskForm = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const taskTotal = document.getElementById('taskTotal');
const selectedDateInput = document.getElementById('selectedDate');
const selectedDateLabel = document.getElementById('selectedDateLabel');
const panelTitle = document.getElementById('panelTitle');
const taskPriority = document.getElementById('taskPriority');
const taskTags = document.getElementById('taskTags');
const taskNotes = document.getElementById('taskNotes');
const taskTitle = document.getElementById('taskTitle');
const taskDateTime = document.getElementById('taskDateTime');
const importSuggestionButton = document.getElementById('importSuggestion');
const backupToGasButton = document.getElementById('backupToGas');
const gasUrlInput = document.getElementById('gasUrl');
const taskListView = document.getElementById('taskListView');
const calendarView = document.getElementById('calendarView');
const calendarGrid = document.getElementById('calendarGrid');
const calendarMonthLabel = document.getElementById('calendarMonthLabel');
const prevMonth = document.getElementById('prevMonth');
const nextMonth = document.getElementById('nextMonth');
const viewButtons = document.querySelectorAll('.view-switch .btn');
const editModal = document.getElementById('editModal');
const closeEditModal = document.getElementById('closeEditModal');
const cancelEdit = document.getElementById('cancelEdit');
const editForm = document.getElementById('editForm');
const editTitle = document.getElementById('editTitle');
const editDateTime = document.getElementById('editDateTime');
const editPriority = document.getElementById('editPriority');
const editTags = document.getElementById('editTags');
const editNotes = document.getElementById('editNotes');

let tasks = loadTasks();
let selectedDate = new Date();
let currentView = 'list';
let calendarMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
let editingTaskId = null;

initialize();

function initialize() {
  selectedDateInput.value = formatInputDate(selectedDate);
  selectedDateLabel.textContent = formatSelectedDate(selectedDate);
  updateViewVisibility();
  renderTaskSummary();
  renderTaskList();
  renderCalendar();
  bindEvents();
}

function bindEvents() {
  taskForm.addEventListener('submit', handleAddTask);
  selectedDateInput.addEventListener('change', handleDateChange);
  prevMonth.addEventListener('click', () => {
    calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
    renderCalendar();
  });
  nextMonth.addEventListener('click', () => {
    calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
    renderCalendar();
  });
  viewButtons.forEach(button => {
    button.addEventListener('click', () => setView(button.dataset.view));
  });
  closeEditModal.addEventListener('click', closeEditDialog);
  cancelEdit.addEventListener('click', closeEditDialog);
  editForm.addEventListener('submit', handleEditTask);
  importSuggestionButton.addEventListener('click', handleImportSuggestion);
  backupToGasButton.addEventListener('click', handleBackupToGas);
  editModal.addEventListener('click', event => {
    if (event.target === editModal) closeEditDialog();
  });
}

function handleAddTask(event) {
  event.preventDefault();
  const title = taskTitle.value.trim();
  const datetime = taskDateTime.value;
  const priority = taskPriority.value;
  const tags = parseTags(taskTags.value);
  const notes = taskNotes.value.trim();

  if (!title || !datetime) return;

  const newTask = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title,
    datetime,
    priority,
    tags,
    notes,
    done: false,
    createdAt: new Date().toISOString()
  };

  tasks.unshift(newTask);
  saveTasks();
  taskForm.reset();
  taskPriority.value = 'normal';
  selectedDateInput.value = formatInputDate(new Date(datetime));
  selectedDate = new Date(datetime);
  calendarMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  selectedDateLabel.textContent = formatSelectedDate(selectedDate);
  renderAll();
}

function handleDateChange() {
  const newDate = new Date(selectedDateInput.value);
  if (!isValidDate(newDate)) return;
  selectedDate = newDate;
  calendarMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  selectedDateLabel.textContent = formatSelectedDate(selectedDate);
  renderAll();
}

function setView(view) {
  currentView = view;
  viewButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.view === view);
  });
  updateViewVisibility();
}

function updateViewVisibility() {
  taskListView.classList.toggle('hidden', currentView !== 'list');
  calendarView.classList.toggle('hidden', currentView !== 'calendar');
  panelTitle.textContent = currentView === 'calendar' ? '日曆檢視' : '清單檢視';
}

function getTasksForDate(date) {
  const key = formatKeyDate(date);
  return tasks
    .filter(task => formatKeyDate(new Date(task.datetime)) === key)
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));
}

function renderTaskList() {
  const dayTasks = getTasksForDate(selectedDate);
  taskList.innerHTML = '';

  if (!dayTasks.length) {
    const emptyItem = document.createElement('li');
    emptyItem.className = 'task-card';
    emptyItem.innerHTML = '<p class="task-notes">目前此日期沒有任務。請新增一筆或切換日期查看。</p>';
    taskList.appendChild(emptyItem);
    return;
  }

  dayTasks.forEach(task => {
    const item = document.createElement('li');
    item.className = `task-card ${task.done ? 'completed' : ''}`;
    item.innerHTML = `
      <div>
        <div class="task-meta">
          <h3>${escapeHtml(task.title)}</h3>
          <span class="badge badge-${task.priority}">${formatPriority(task.priority)}</span>
        </div>
        <div class="task-meta">
          <div class="task-time">${formatDisplayDate(task.datetime)}</div>
          ${task.tags.length ? `<div class="tag-list">${task.tags.map(tag => `<span class="tag-item">${escapeHtml(tag)}</span>`).join('')}</div>` : ''}
        </div>
        <p class="task-notes">${escapeHtml(task.notes || '無備註')}</p>
      </div>
      <div class="task-actions">
        <button class="btn btn-secondary" data-action="toggle" data-id="${task.id}">${task.done ? '取消完成' : '完成'}</button>
        <button class="btn btn-secondary" data-action="edit" data-id="${task.id}">編輯</button>
        <button class="btn btn-danger" data-action="delete" data-id="${task.id}">刪除</button>
      </div>
    `;

    item.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', handleTaskAction);
    });

    taskList.appendChild(item);
  });
}

function renderCalendar() {
  calendarMonthLabel.textContent = calendarMonth.toLocaleString('zh-TW', { year: 'numeric', month: 'long' });
  calendarGrid.innerHTML = '';

  const start = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1);
  const startDay = start.getDay();
  const gridStart = new Date(start);
  gridStart.setDate(start.getDate() - startDay);

  for (let cellIndex = 0; cellIndex < 42; cellIndex += 1) {
    const cellDate = new Date(gridStart);
    cellDate.setDate(gridStart.getDate() + cellIndex);
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'calendar-cell';
    if (cellDate.getMonth() !== calendarMonth.getMonth()) cell.classList.add('other-month');
    if (formatKeyDate(cellDate) === formatKeyDate(selectedDate)) cell.classList.add('selected');

    const dayLabel = document.createElement('div');
    dayLabel.className = 'calendar-cell-header';
    dayLabel.innerHTML = `<span>${cellDate.getDate()}</span>${cellDate.toDateString().slice(0,3)}`;
    cell.appendChild(dayLabel);

    const tasksForDate = getTasksForDate(cellDate);
    if (tasksForDate.length) {
      const badge = document.createElement('div');
      badge.className = 'calendar-task-count';
      badge.textContent = `${tasksForDate.length} 筆任務`;
      cell.appendChild(badge);
    }

    cell.addEventListener('click', () => {
      selectedDate = new Date(cellDate);
      selectedDateInput.value = formatInputDate(selectedDate);
      selectedDateLabel.textContent = formatSelectedDate(selectedDate);
      renderAll();
      setView('list');
    });

    calendarGrid.appendChild(cell);
  }
}

function handleTaskAction(event) {
  const action = event.currentTarget.dataset.action;
  const id = event.currentTarget.dataset.id;
  const targetTask = tasks.find(task => task.id === id);
  if (!targetTask) return;

  if (action === 'toggle') {
    targetTask.done = !targetTask.done;
    saveTasks();
    renderAll();
  }
  if (action === 'edit') {
    openEditDialog(targetTask);
  }
  if (action === 'delete') {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderAll();
  }
}

function openEditDialog(task) {
  editingTaskId = task.id;
  editTitle.value = task.title;
  editDateTime.value = task.datetime;
  editPriority.value = task.priority;
  editTags.value = task.tags.join(', ');
  editNotes.value = task.notes;
  editModal.classList.remove('hidden');
}

function closeEditDialog() {
  editingTaskId = null;
  editModal.classList.add('hidden');
}

function handleEditTask(event) {
  event.preventDefault();
  if (!editingTaskId) return;

  const task = tasks.find(item => item.id === editingTaskId);
  if (!task) return;

  task.title = editTitle.value.trim();
  task.datetime = editDateTime.value;
  task.priority = editPriority.value;
  task.tags = parseTags(editTags.value);
  task.notes = editNotes.value.trim();

  saveTasks();
  closeEditDialog();
  selectedDateInput.value = formatInputDate(new Date(task.datetime));
  selectedDate = new Date(task.datetime);
  selectedDateLabel.textContent = formatSelectedDate(selectedDate);
  renderAll();
}

function renderAll() {
  renderTaskSummary();
  renderTaskList();
  renderCalendar();
}

async function handleImportSuggestion() {
  importSuggestionButton.disabled = true;
  importSuggestionButton.textContent = '正在匯入...';
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=1');
    if (!response.ok) throw new Error('無法取得建議資料');
    const data = await response.json();
    const item = data[0];
    const now = new Date();
    const datetime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0).toISOString().slice(0, 16);
    const suggestionTask = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      title: item.title || '今日建議行程',
      datetime,
      priority: 'normal',
      tags: ['建議'],
      notes: item.body || '自動匯入的行程建議',
      done: false,
      createdAt: new Date().toISOString()
    };
    tasks.unshift(suggestionTask);
    saveTasks();
    selectedDateInput.value = formatInputDate(new Date(datetime));
    selectedDate = new Date(datetime);
    calendarMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    selectedDateLabel.textContent = formatSelectedDate(selectedDate);
    renderAll();
  } catch (err) {
    console.error(err);
    alert('匯入建議行程失敗，請稍後再試。');
  } finally {
    importSuggestionButton.disabled = false;
    importSuggestionButton.textContent = '自動填入建議行程';
  }
}

async function handleBackupToGas() {
  const url = gasUrlInput.value.trim();
  if (!url) {
    alert('請先輸入 GAS Web App URL。');
    return;
  }
  backupToGasButton.disabled = true;
  backupToGasButton.textContent = '備份中...';

  try {
    const payload = { tasks };
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'GAS 備份失敗');

    alert(`已成功備份 ${result.inserted || 0} 筆任務到 Google Sheets。`);
  } catch (err) {
    console.error(err);
    alert(`備份失敗：${err.message}`);
  } finally {
    backupToGasButton.disabled = false;
    backupToGasButton.textContent = '備份到 Google Sheets';
  }
}

function renderTaskSummary() {
  taskTotal.textContent = tasks.length;
  taskCount.textContent = getTasksForDate(selectedDate).length;
}

function formatKeyDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatInputDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function formatSelectedDate(date) {
  return `${date.toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit' })}`;
}

function formatDisplayDate(value) {
  const date = new Date(value);
  if (!isValidDate(date)) return value;
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatPriority(priority) {
  if (priority === 'high') return '高';
  if (priority === 'low') return '低';
  return '中';
}

function parseTags(value) {
  return value
    .split(/[,，]/)
    .map(tag => tag.trim())
    .filter(Boolean);
}

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(task => ({
      ...task,
      tags: Array.isArray(task.tags) ? task.tags : parseTags(task.tags || ''),
      done: Boolean(task.done)
    }));
  } catch (error) {
    console.warn('無法讀取本機資料', error);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function isValidDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
