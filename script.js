const STORAGE_KEY = 'questPlannerTasks';
const taskForm = document.getElementById('taskForm');
const taskListEl = document.getElementById('taskList');
const taskCountEl = document.getElementById('taskCount');
const taskTotalEl = document.getElementById('taskTotal');
const taskSearchInput = document.getElementById('taskSearch');
const taskSortSelect = document.getElementById('taskSort');
const tagFilterSelect = document.getElementById('tagFilter');
const recurrenceDetailsEl = document.getElementById('recurrenceDetails');
const recurrenceIntervalInput = document.getElementById('recurrenceInterval');
const weeklyDaysEl = document.getElementById('weeklyDays');
const recurrenceEndInput = document.getElementById('recurrenceEnd');
const taskListSection = document.getElementById('taskListSection');
const calendarSection = document.getElementById('calendarSection');
const currentMonthLabel = document.getElementById('currentMonthLabel');
const calendarGrid = document.getElementById('calendarGrid');
const prevMonthBtn = document.getElementById('prevMonthBtn');
const nextMonthBtn = document.getElementById('nextMonthBtn');
const viewButtons = document.querySelectorAll('.view-toggle');
const detailModal = document.getElementById('taskDetailModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const detailTitle = document.getElementById('detailTitle');
const detailTime = document.getElementById('detailTime');
const detailPriority = document.getElementById('detailPriority');
const detailNotes = document.getElementById('detailNotes');
const detailStatus = document.getElementById('detailStatus');
const taskEditModal = document.getElementById('taskEditModal');
const closeEditModalBtn = document.getElementById('closeEditModalBtn');
const editTaskForm = document.getElementById('editTaskForm');
const editTitleInput = document.getElementById('editTaskTitle');
const editTimeInput = document.getElementById('editTaskTime');
const editPrioritySelect = document.getElementById('editTaskPriority');
const editNotesInput = document.getElementById('editTaskNotes');
const editTagsInput = document.getElementById('editTaskTags');
const editRecurrenceSelect = document.getElementById('editTaskRecurrence');
const importPreviewModal = document.getElementById('importPreviewModal');
const closeImportPreviewBtn = document.getElementById('closeImportPreviewBtn');
const importCancelBtn = document.getElementById('importCancelBtn');
const importMergeBtn = document.getElementById('importMergeBtn');
const importReplaceBtn = document.getElementById('importReplaceBtn');
const importPreviewCount = document.getElementById('importPreviewCount');
const importPreviewTable = document.getElementById('importPreviewTable');
let editIndex = null;
let pendingImportData = null;

const defaultTasks = [
    {
        title: '檢查今日任務清單',
        time: '2026-06-09T09:30',
        priority: 'normal',
        notes: '確認是否有重要會議與專案交付時間。',
        done: false
    },
    {
        title: '準備遊戲任務報告',
        time: '2026-06-09T14:00',
        priority: 'high',
        notes: '整理任務欄 UI、功能說明與進度內容。',
        done: false
    }
];

let tasks = loadTasks();
let currentView = 'list';
let currentMonth = new Date();
let draggedIndex = null;

renderTasks();
renderCalendar();
setupEventListeners();

function setupEventListeners() {
    taskForm.addEventListener('submit', event => {
        event.preventDefault();

        const titleInput = document.getElementById('taskTitle');
        const timeInput = document.getElementById('taskTime');
        const priorityInput = document.getElementById('taskPriority');
        const notesInput = document.getElementById('taskNotes');

        const title = titleInput.value.trim();
        const time = timeInput.value;
        const priority = priorityInput.value;
        const notes = notesInput.value.trim();
        const tags = document.getElementById('taskTags').value.split(',').map(s=>s.trim()).filter(Boolean);
        const recurrence = document.getElementById('taskRecurrence').value;
        const recurrenceInterval = Number(recurrenceIntervalInput.value) || 1;
        const recurrenceEnd = recurrenceEndInput.value || null;
        const weeklyDays = Array.from(weeklyDaysEl.querySelectorAll('input[type=checkbox]:checked')).map(cb=>Number(cb.value));

        if (!title || !time) {
            return;
        }

        tasks.unshift({
            title,
            time,
            priority,
            notes,
            tags,
            recurrence,
            recurrenceDetails: {
                interval: recurrenceInterval,
                weekdays: weeklyDays,
                endDate: recurrenceEnd
            },
            done: false
        });

        saveTasks();
        renderTasks();
        renderCalendar();

        taskForm.reset();
        titleInput.focus();
    });

    // recurrence details show/hide
    const recurrenceSelect = document.getElementById('taskRecurrence');
    recurrenceSelect.addEventListener('change', () => {
        const v = recurrenceSelect.value;
        recurrenceDetailsEl.classList.toggle('hidden', v === 'none');
        weeklyDaysEl.classList.toggle('hidden', v !== 'weekly');
    });

    // tag filter
    tagFilterSelect.addEventListener('change', () => renderTasks());


    taskSearchInput.addEventListener('input', () => {
        renderTasks();
    });

    taskSortSelect.addEventListener('change', () => {
        renderTasks();
    });

    prevMonthBtn.addEventListener('click', () => {
        currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        renderCalendar();
    });

    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            setView(button.dataset.view);
        });
    });

    // import/export
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');
    const exportBtn = document.getElementById('exportBtn');

    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', handleImportFile);
    exportBtn.addEventListener('click', () => exportTasks());

    closeModalBtn.addEventListener('click', () => {
        detailModal.classList.add('hidden');
    });

    detailModal.addEventListener('click', event => {
        if (event.target === detailModal) {
            detailModal.classList.add('hidden');
        }
    });

    closeEditModalBtn.addEventListener('click', () => {
        taskEditModal.classList.add('hidden');
    });

    taskEditModal.addEventListener('click', event => {
        if (event.target === taskEditModal) {
            taskEditModal.classList.add('hidden');
        }
    });

    editTaskForm.addEventListener('submit', event => {
        event.preventDefault();
        if (editIndex === null) return;

        const newTags = editTagsInput.value.split(',').map(s=>s.trim()).filter(Boolean);
        const newRecurrence = editRecurrenceSelect.value;

        tasks[editIndex] = {
            ...tasks[editIndex],
            title: editTitleInput.value.trim(),
            time: editTimeInput.value,
            priority: editPrioritySelect.value,
            notes: editNotesInput.value.trim(),
            tags: newTags,
            recurrence: newRecurrence
        };

        // refresh tag filter options
        populateTagFilter();

        saveTasks();
        renderTasks();
        renderCalendar();
        taskEditModal.classList.add('hidden');
    });

    // import preview modal handlers
    closeImportPreviewBtn.addEventListener('click', () => {
        importPreviewModal.classList.add('hidden');
        pendingImportData = null;
    });

    importCancelBtn.addEventListener('click', () => {
        importPreviewModal.classList.add('hidden');
        pendingImportData = null;
    });

    importPreviewModal.addEventListener('click', event => {
        if (event.target === importPreviewModal) {
            importPreviewModal.classList.add('hidden');
            pendingImportData = null;
        }
    });

    importMergeBtn.addEventListener('click', () => {
        if (pendingImportData) {
            mergeImportedTasks(pendingImportData, false);
            importPreviewModal.classList.add('hidden');
            pendingImportData = null;
        }
    });

    importReplaceBtn.addEventListener('click', () => {
        if (pendingImportData) {
            mergeImportedTasks(pendingImportData, true);
            importPreviewModal.classList.add('hidden');
            pendingImportData = null;
        }
    });
}

function setView(view) {
    currentView = view;
    taskListSection.classList.toggle('hidden', view !== 'list');
    calendarSection.classList.toggle('hidden', view !== 'calendar');
    viewButtons.forEach(button => button.classList.toggle('active', button.dataset.view === view));
}

function loadTasks() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) {
                return parsed.map(task => ({
                    ...task,
                    priority: task.priority || 'normal',
                    done: typeof task.done === 'boolean' ? task.done : false
                }));
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

function populateTagFilter() {
    const sel = tagFilterSelect;
    const prev = sel.value;
    const allTags = new Set();
    tasks.forEach(t => (t.tags || []).forEach(tag => allTags.add(tag)));
    sel.innerHTML = '<option value="">全部標籤</option>';
    Array.from(allTags).sort().forEach(tag => {
        const opt = document.createElement('option');
        opt.value = tag;
        opt.textContent = tag;
        sel.appendChild(opt);
    });
    if (prev) sel.value = prev;
}

function getVisibleTasks() {
    const keyword = taskSearchInput.value.trim().toLowerCase();
    const tagFilter = tagFilterSelect.value;
    const filtered = tasks
        .map((task, index) => ({ task, index }))
        .filter(({ task }) => {
            if (!keyword) return true;
            return [task.title, task.notes, task.time, task.priority]
                .join(' ')
                .toLowerCase()
                .includes(keyword);
        });
    let result = filtered;
    if (tagFilter) {
        result = result.filter(({ task }) => (task.tags || []).includes(tagFilter));
    }
    const sortMode = taskSortSelect.value;
    if (sortMode === 'manual') {
        return result;
    }

    return result.sort((a, b) => {
        if (sortMode === 'time') {
            return new Date(a.task.time) - new Date(b.task.time);
        }
        if (sortMode === 'priority') {
            const priorityOrder = { high: 0, normal: 1, low: 2 };
            return priorityOrder[a.task.priority] - priorityOrder[b.task.priority];
        }
        if (sortMode === 'done') {
            return Number(a.task.done) - Number(b.task.done);
        }
        return a.index - b.index;
    });
}

function renderTasks() {
    populateTagFilter();
    const visibleTasks = getVisibleTasks();
    taskListEl.innerHTML = '';
    taskCountEl.textContent = visibleTasks.length;
    taskTotalEl.textContent = tasks.length;

    if (visibleTasks.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'task-card';
        empty.innerHTML = '<p class="task-notes">目前沒有符合條件的任務。請調整搜尋或排序條件。</p>';
        taskListEl.appendChild(empty);
        return;
    }

    visibleTasks.forEach(({ task, index }) => {
        const card = createTaskCard(task, index);
        taskListEl.appendChild(card);
    });
}

function createTaskCard(task, index) {
    const card = document.createElement('article');
    card.className = 'task-card';
    card.draggable = taskSortSelect.value === 'manual';
    card.dataset.index = index;

    if (card.draggable) {
        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);
        card.addEventListener('dragover', handleDragOver);
        card.addEventListener('dragleave', handleDragLeave);
        card.addEventListener('drop', handleDrop);
    }

    const meta = document.createElement('div');
    meta.className = 'task-meta';

    const header = document.createElement('div');
    header.className = 'task-header';

    const title = document.createElement('h3');
    title.className = 'task-title';
    title.textContent = task.title;
    if (task.done) {
        title.style.textDecoration = 'line-through';
        title.style.opacity = '0.7';
    }

    const priority = document.createElement('span');
    priority.className = `priority-badge priority-${task.priority}`;
    priority.textContent = task.priority === 'high' ? '高' : task.priority === 'low' ? '低' : '中';

    header.appendChild(title);
    header.appendChild(priority);

    // tags badges
    if (task.tags && task.tags.length) {
        const tagContainer = document.createElement('div');
        tagContainer.className = 'task-tags';
        task.tags.forEach(tag => {
            const t = document.createElement('span');
            t.className = 'tag-badge';
            t.textContent = tag;
            t.style.background = tagColor(tag);
            tagContainer.appendChild(t);
        });
        header.appendChild(tagContainer);
    }

    const time = document.createElement('div');
    time.className = 'task-time';
    time.textContent = formatTaskTime(task.time);

    const notes = document.createElement('p');
    notes.className = 'task-notes';
    notes.textContent = task.notes || '無額外說明。';

    meta.appendChild(header);
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
        renderCalendar();
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn btn-danger';
    deleteButton.textContent = '刪除';
    deleteButton.addEventListener('click', () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks();
        renderCalendar();
    });

    actions.appendChild(doneButton);

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'btn btn-secondary';
    editButton.textContent = '編輯';
    editButton.addEventListener('click', () => openEditTask(index));

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);
    card.appendChild(meta);
    card.appendChild(actions);
    return card;
}

function tagColor(tag) {
    const colors = ['#e57373','#f06292','#ba68c8','#9575cd','#64b5f6','#4db6ac','#81c784','#fff176','#ffb74d','#a1887f'];
    let hash = 0;
    for (let i = 0; i < tag.length; i++) hash = (hash << 5) - hash + tag.charCodeAt(i);
    const idx = Math.abs(hash) % colors.length;
    return colors[idx];
}

// Import / Export helpers
function exportTasks() {
    // offer JSON and CSV and XLSX if available
    const data = tasks;
    const jsonStr = JSON.stringify(data, null, 2);
    // download JSON
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.json';
    a.click();
    URL.revokeObjectURL(url);

    // also create CSV
    const csv = tasksToCSV(tasks);
    const blobCsv = new Blob([csv], { type: 'text/csv' });
    const url2 = URL.createObjectURL(blobCsv);
    const b = document.createElement('a');
    b.href = url2;
    b.download = 'tasks.csv';
    b.click();
    URL.revokeObjectURL(url2);

    // try XLSX via SheetJS
    if (window.XLSX) {
        const ws = XLSX.utils.json_to_sheet(data.map(t => ({
            title: t.title,
            time: t.time,
            priority: t.priority,
            notes: t.notes,
            tags: (t.tags || []).join(','),
            recurrence: t.recurrence || 'none',
            done: t.done
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Tasks');
        XLSX.writeFile(wb, 'tasks.xlsx');
    }
}

function tasksToCSV(arr) {
    const headers = ['title','time','priority','notes','tags','recurrence','done'];
    const rows = [headers.join(',')];
    arr.forEach(t => {
        const row = [
            escapeCsv(t.title),
            t.time,
            t.priority,
            escapeCsv(t.notes || ''),
            (t.tags||[]).join('|'),
            t.recurrence || 'none',
            t.done ? '1' : '0'
        ];
        rows.push(row.join(','));
    });
    return rows.join('\n');
}

function escapeCsv(str) {
    if (str == null) return '';
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
        return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
}

function handleImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    const name = file.name.toLowerCase();
    reader.onload = ev => {
        const content = ev.target.result;
        let imported = null;
        try {
            if (name.endsWith('.json')) {
                imported = JSON.parse(content);
            } else if (name.endsWith('.csv')) {
                imported = parseCSV(content);
            } else if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
                if (!window.XLSX) { alert('需要連線載入SheetJS以匯入Excel'); return; }
                const wb = XLSX.read(content, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const json = XLSX.utils.sheet_to_json(ws, { defval: '' });
                imported = json.map(mapImportedRow);
            }
            if (imported) {
                if (!Array.isArray(imported)) {
                    alert('匯入資料格式錯誤');
                    return;
                }
                const normalized = imported.map(mapImportedRow);
                showImportPreview(normalized);
            }
        } catch (err) {
            alert('匯入失敗：' + err.message);
        }
    };
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
        reader.readAsBinaryString(file);
    } else {
        reader.readAsText(file);
    }
    e.target.value = '';
}

function showImportPreview(data) {
    pendingImportData = data;
    importPreviewCount.textContent = `準備匯入 ${data.length} 筆任務`;
    
    // build table
    importPreviewTable.innerHTML = '<table class="preview-table"><thead><tr><th>標題</th><th>時間</th><th>優先級</th><th>標籤</th></tr></thead><tbody></tbody></table>';
    const tbody = importPreviewTable.querySelector('tbody');
    data.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${(task.title || '無標題').substring(0, 30)}</td>
            <td>${task.time ? new Date(task.time).toLocaleString('zh-TW') : '未設定'}</td>
            <td>${task.priority === 'high' ? '高' : task.priority === 'low' ? '低' : '中'}</td>
            <td>${(task.tags || []).join('、') || '無'}</td>
        `;
        tbody.appendChild(row);
    });
    
    importPreviewModal.classList.remove('hidden');
}

function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(Boolean);
    const headers = lines.shift().split(',').map(h => h.trim());
    return lines.map(line => {
        const parts = line.split(',');
        const obj = {};
        headers.forEach((h, i) => obj[h] = parts[i] || '');
        return mapImportedRow(obj);
    });
}

function mapImportedRow(row) {
    return {
        title: row.title || row.Title || row.TITLE || '',
        time: row.time || row.Time || '',
        priority: (row.priority || 'normal').toLowerCase(),
        notes: row.notes || row.Notes || '',
        tags: (row.tags || row.Tags || '').toString().split(/[,|]/).map(s=>s.trim()).filter(Boolean),
        recurrence: row.recurrence || row.Recurrence || 'none',
        done: row.done === '1' || row.done === true || row.Done === true
    };
}

function mergeImportedTasks(list, replace = false) {
    if (!Array.isArray(list)) { alert('匯入資料格式錯誤'); return; }
    const normalized = list.map(mapImportedRow);
    if (replace) {
        tasks = normalized;
    } else {
        tasks = normalized.concat(tasks);
    }
    saveTasks();
    renderTasks();
    renderCalendar();
    const mode = replace ? '覆蓋' : '合併';
    alert(`匯入完成（${mode}）：${normalized.length} 筆`);
}

function openEditTask(index) {
    const task = tasks[index];
    editIndex = index;
    editTitleInput.value = task.title;
    editTimeInput.value = task.time;
    editPrioritySelect.value = task.priority || 'normal';
    editNotesInput.value = task.notes || '';
    taskEditModal.classList.remove('hidden');
}

function handleDragStart(event) {
    draggedIndex = Number(event.currentTarget.dataset.index);
    event.currentTarget.classList.add('dragging');
}

function handleDragEnd(event) {
    event.currentTarget.classList.remove('dragging');
    document.querySelectorAll('.task-card').forEach(card => card.classList.remove('drag-over'));
}

function handleDragOver(event) {
    event.preventDefault();
    const target = event.currentTarget;
    const targetIndex = Number(target.dataset.index);
    if (draggedIndex === null || draggedIndex === targetIndex) {
        return;
    }
    target.classList.add('drag-over');
}

function handleDragLeave(event) {
    event.currentTarget.classList.remove('drag-over');
}

function handleDrop(event) {
    event.preventDefault();
    const targetIndex = Number(event.currentTarget.dataset.index);
    if (draggedIndex === null || draggedIndex === targetIndex) {
        return;
    }

    const [movedTask] = tasks.splice(draggedIndex, 1);
    tasks.splice(targetIndex, 0, movedTask);
    saveTasks();
    renderTasks();
    renderCalendar();
}

function renderCalendar() {
    calendarGrid.innerHTML = '';
    // set title depending on view
    if (currentView === 'week') {
        // show week that contains currentMonth (or today)
        const startOfWeek = startOfWeekDate(currentMonth);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        currentMonthLabel.textContent = `${startOfWeek.toLocaleDateString('zh-TW')} — ${endOfWeek.toLocaleDateString('zh-TW')}`;
        // prepare range
        const rangeDates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            rangeDates.push(d);
        }
        const taskGroups = groupTasksInRange(rangeDates[0], rangeDates[rangeDates.length-1]);
        rangeDates.forEach(date => {
            const dateKey = formatDateKey(date);
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';
            const dayNumber = document.createElement('div');
            dayNumber.className = 'calendar-cell-day';
            dayNumber.textContent = date.getDate();
            cell.appendChild(dayNumber);
            const tasksForDate = taskGroups[dateKey] || [];
            tasksForDate.slice(0, 6).forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = 'calendar-task';
                taskItem.dataset.priority = task.priority;
                taskItem.textContent = `${task.title} (${task.priority === 'high' ? '高' : task.priority === 'low' ? '低' : '中'})`;
                taskItem.addEventListener('click', () => openTaskDetail(task));
                cell.appendChild(taskItem);
            });
            if (tasksForDate.length > 6) {
                const more = document.createElement('div');
                more.className = 'calendar-task';
                more.textContent = `還有 ${tasksForDate.length - 6} 個任務`;
                cell.appendChild(more);
            }
            calendarGrid.appendChild(cell);
        });
    } else {
        currentMonthLabel.textContent = currentMonth.toLocaleString('zh-TW', { year: 'numeric', month: 'long' });
        const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const startDay = new Date(firstDay);
        startDay.setDate(firstDay.getDate() - firstDay.getDay());
        const lastDay = new Date(startDay);
        lastDay.setDate(startDay.getDate() + 41);
        const taskGroups = groupTasksInRange(startDay, lastDay);
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDay);
            date.setDate(startDay.getDate() + i);
            const dateKey = formatDateKey(date);
            const cell = document.createElement('div');
            cell.className = 'calendar-cell';
            if (date.getMonth() !== currentMonth.getMonth()) {
                cell.classList.add('calendar-cell--muted');
            }
            const dayNumber = document.createElement('div');
            dayNumber.className = 'calendar-cell-day';
            dayNumber.textContent = date.getDate();
            cell.appendChild(dayNumber);
            const tasksForDate = taskGroups[dateKey] || [];
            tasksForDate.slice(0, 3).forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = 'calendar-task';
                taskItem.dataset.priority = task.priority;
                taskItem.textContent = `${task.title} (${task.priority === 'high' ? '高' : task.priority === 'low' ? '低' : '中'})`;
                taskItem.addEventListener('click', () => openTaskDetail(task));
                cell.appendChild(taskItem);
            });
            if (tasksForDate.length > 3) {
                const more = document.createElement('div');
                more.className = 'calendar-task';
                more.textContent = `還有 ${tasksForDate.length - 3} 個任務`;
                cell.appendChild(more);
            }
            calendarGrid.appendChild(cell);
        }
    }
}

function groupTasksInRange(startDate, endDate) {
    // returns map of dateKey -> tasks (including expanded recurring tasks within range)
    const map = {};
    const start = new Date(startDate);
    const end = new Date(endDate);
    tasks.forEach(task => {
        // base occurrence
        const tDate = new Date(task.time);
        if (!isNaN(tDate.getTime()) && tDate >= start && tDate <= end) {
            const key = formatDateKey(tDate);
            if (!map[key]) map[key] = [];
            map[key].push(task);
        }
        // recurring with details support
        if (task.recurrence && task.recurrence !== 'none') {
            const rd = task.recurrenceDetails || {};
            let occ = new Date(task.time);
            const hours = occ.getHours();
            const minutes = occ.getMinutes();
            const interval = rd.interval && rd.interval > 0 ? rd.interval : 1;
            const endLimit = rd.endDate ? new Date(rd.endDate) : null;
            const effectiveEnd = endLimit && endLimit < end ? endLimit : end;

            if (task.recurrence === 'daily') {
                const cur = new Date(start);
                cur.setHours(hours, minutes, 0, 0);
                // align to first occurrence >= original start
                while (cur < occ) cur.setDate(cur.getDate() + 1);
                while (cur <= effectiveEnd) {
                    const key = formatDateKey(cur);
                    if (!map[key]) map[key] = [];
                    map[key].push({ ...task, time: new Date(cur).toISOString() });
                    cur.setDate(cur.getDate() + interval);
                }
            } else if (task.recurrence === 'weekly') {
                const weekdays = Array.isArray(rd.weekdays) && rd.weekdays.length ? rd.weekdays : [occ.getDay()];
                // for each weekday, walk from start to end adding by interval weeks
                weekdays.forEach(wd => {
                    const cur = new Date(start);
                    cur.setHours(hours, minutes, 0, 0);
                    // move to first matching weekday
                    while (cur.getDay() !== wd) cur.setDate(cur.getDate() + 1);
                    while (cur < occ) cur.setDate(cur.getDate() + 7 * interval);
                    while (cur <= effectiveEnd) {
                        const key = formatDateKey(cur);
                        if (!map[key]) map[key] = [];
                        map[key].push({ ...task, time: new Date(cur).toISOString() });
                        cur.setDate(cur.getDate() + 7 * interval);
                    }
                });
            } else if (task.recurrence === 'monthly') {
                const dayOfMonth = occ.getDate();
                const cur = new Date(start.getFullYear(), start.getMonth(), dayOfMonth, hours, minutes, 0, 0);
                if (cur < occ) cur.setMonth(cur.getMonth() + interval);
                while (cur <= effectiveEnd) {
                    const key = formatDateKey(cur);
                    if (!map[key]) map[key] = [];
                    map[key].push({ ...task, time: new Date(cur).toISOString() });
                    cur.setMonth(cur.getMonth() + interval);
                }
            }
        }
    });
    return map;
}

function startOfWeekDate(ref) {
    const d = new Date(ref);
    // set to current date if ref is month start used earlier; prefer today
    const today = new Date();
    // use ref if it's a date representing desired week, otherwise use today
    const base = ref instanceof Date ? ref : today;
    const res = new Date(base);
    const day = res.getDay();
    res.setDate(res.getDate() - day);
    res.setHours(0,0,0,0);
    return res;
}

function openTaskDetail(task) {
    detailTitle.textContent = task.title;
    detailTime.textContent = formatTaskTime(task.time);
    detailPriority.textContent = task.priority === 'high' ? '高' : task.priority === 'low' ? '低' : '中';
    detailNotes.textContent = task.notes || '無額外說明。';
    detailStatus.textContent = task.done ? '已完成' : '等待中';
    detailModal.classList.remove('hidden');
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

function formatDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
