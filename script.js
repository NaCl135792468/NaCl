const STORAGE_KEY = 'questPlannerTasks';
const taskForm = document.getElementById('taskForm');
const taskListEl = document.getElementById('taskList');
const taskCountEl = document.getElementById('taskCount');

const defaultTasks = [
    {
        title: '檢查今日任務清單',
        time: '2026-06-09T09:30',
        notes: '確認是否有重要會議與專案交付時間。',
        done: false
    },
    {
        title: '準備遊戲任務報告',
        time: '2026-06-09T14:00',
        notes: '整理任務欄 UI、功能說明與進度內容。',
        done: false
    }
];

let tasks = loadTasks();
renderTasks();

eventListeners();

function eventListeners() {
    taskForm.addEventListener('submit', event => {
        event.preventDefault();

        const titleInput = document.getElementById('taskTitle');
        const timeInput = document.getElementById('taskTime');
        const notesInput = document.getElementById('taskNotes');

        const title = titleInput.value.trim();
        const time = timeInput.value;
        const notes = notesInput.value.trim();

        if (!title || !time) {
            return;
        }

        tasks.unshift({
            title,
            time,
            notes,
            done: false
        });

        saveTasks();
        renderTasks();

        taskForm.reset();
        titleInput.focus();
    });
}

function loadTasks() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch (error) {
            console.warn('無法解析本機儲存任務，將使用預設任務。', error);
        }
    }
    return [...defaultTasks];
}

function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
    taskListEl.innerHTML = '';
    taskCountEl.textContent = tasks.length;

    if (tasks.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'task-card';
        empty.innerHTML = '<p class="task-notes">目前尚無任務。請在右側新增第一個任務。</p>';
        taskListEl.appendChild(empty);
        return;
    }

    tasks.forEach((task, index) => {
        taskListEl.appendChild(createTaskCard(task, index));
    });
}

function createTaskCard(task, index) {
    const card = document.createElement('article');
    card.className = 'task-card';

    const meta = document.createElement('div');
    meta.className = 'task-meta';

    const title = document.createElement('h3');
    title.className = 'task-title';
    title.textContent = task.title;
    if (task.done) {
        title.style.textDecoration = 'line-through';
        title.style.opacity = '0.7';
    }

    const time = document.createElement('div');
    time.className = 'task-time';
    time.textContent = formatTaskTime(task.time);

    const notes = document.createElement('p');
    notes.className = 'task-notes';
    notes.textContent = task.notes || '無額外說明。';

    meta.appendChild(title);
    meta.appendChild(time);
    meta.appendChild(notes);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const doneButton = document.createElement('button');
    doneButton.type = 'button';
    doneButton.className = task.done ? 'btn btn-success' : 'btn btn-secondary';
    doneButton.textContent = task.done ? '已完成' : '標記完成';
    doneButton.addEventListener('click', () => {
        tasks[index].done = !tasks[index].done;
        saveTasks();
        renderTasks();
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn btn-danger';
    deleteButton.textContent = '刪除';
    deleteButton.addEventListener('click', () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
    });

    actions.appendChild(doneButton);
    actions.appendChild(deleteButton);
    card.appendChild(meta);
    card.appendChild(actions);
    return card;
}

function formatTaskTime(value) {
    if (!value) {
        return '尚未設定時間';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return value;
    }
    return date.toLocaleString('zh-TW', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}
