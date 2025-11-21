// Global variables
let currentPage = 0;
let currentSearch = '';
let editingTaskId = null;

// API configuration
const API_BASE = '/api';
const AUTH_HEADER = 'Basic ' + btoa('admin:password123');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    
    // Setup form submission
    document.getElementById('taskForm').addEventListener('submit', handleTaskSubmit);
});

// Navigation functions
function showTasks() {
    document.getElementById('tasks-section').classList.add('active');
    document.getElementById('audit-logs-section').classList.remove('active');
    
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
    
    loadTasks();
}

function showAuditLogs() {
    document.getElementById('tasks-section').classList.remove('active');
    document.getElementById('audit-logs-section').classList.add('active');
    
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');
    
    loadAuditLogs();
}

// Task management functions
async function loadTasks(page = 0, search = '') {
    try {
        currentPage = page;
        currentSearch = search;
        
        let url = `${API_BASE}/tasks?page=${page}&size=5`;
        if (search) {
            url += `&search=${encodeURIComponent(search)}`;
        }
        
        const response = await fetch(url, {
            headers: {
                'Authorization': AUTH_HEADER
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load tasks');
        }
        
        const data = await response.json();
        displayTasks(data.content);
        displayPagination(data);
        
    } catch (error) {
        console.error('Error loading tasks:', error);
        alert('Failed to load tasks. Please check your credentials.');
    }
}

function displayTasks(tasks) {
    const tbody = document.getElementById('tasksTableBody');
    tbody.innerHTML = '';
    
    tasks.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.id}</td>
            <td>${escapeHtml(task.title)}</td>
            <td>${escapeHtml(task.description)}</td>
            <td>${formatDate(task.createdAt)}</td>
            <td>
                <button onclick="editTask(${task.id})" class="btn btn-primary btn-small">Edit</button>
                <button onclick="deleteTask(${task.id})" class="btn btn-danger btn-small">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function displayPagination(data) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = data.first;
    prevBtn.onclick = () => loadTasks(currentPage - 1, currentSearch);
    pagination.appendChild(prevBtn);
    
    // Page info
    const pageInfo = document.createElement('span');
    pageInfo.textContent = `Page ${data.number + 1} of ${data.totalPages}`;
    pagination.appendChild(pageInfo);
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.disabled = data.last;
    nextBtn.onclick = () => loadTasks(currentPage + 1, currentSearch);
    pagination.appendChild(nextBtn);
}

function searchTasks() {
    const searchInput = document.getElementById('searchInput');
    const search = searchInput.value.trim();
    loadTasks(0, search);
}

// Modal functions
function openCreateModal() {
    editingTaskId = null;
    document.getElementById('modalTitle').textContent = 'Create Task';
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskDescription').value = '';
    document.getElementById('taskModal').style.display = 'block';
}

function editTask(id) {
    editingTaskId = id;
    document.getElementById('modalTitle').textContent = 'Edit Task';
    
    // Find task data from current table
    const rows = document.querySelectorAll('#tasksTableBody tr');
    for (let row of rows) {
        if (row.cells[0].textContent == id) {
            document.getElementById('taskTitle').value = row.cells[1].textContent;
            document.getElementById('taskDescription').value = row.cells[2].textContent;
            break;
        }
    }
    
    document.getElementById('taskModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('taskModal').style.display = 'none';
    editingTaskId = null;
}

async function handleTaskSubmit(event) {
    event.preventDefault();
    
    const title = document.getElementById('taskTitle').value.trim();
    const description = document.getElementById('taskDescription').value.trim();
    
    // Client-side validation
    if (!title || !description) {
        alert('Title and description are required');
        return;
    }
    
    if (title.length > 100) {
        alert('Title must be 100 characters or less');
        return;
    }
    
    if (description.length > 500) {
        alert('Description must be 500 characters or less');
        return;
    }
    
    // Sanitize inputs
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedDescription = sanitizeInput(description);
    
    const taskData = {
        title: sanitizedTitle,
        description: sanitizedDescription
    };
    
    try {
        let url = `${API_BASE}/tasks`;
        let method = 'POST';
        
        if (editingTaskId) {
            url += `/${editingTaskId}`;
            method = 'PUT';
        }
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': AUTH_HEADER
            },
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save task');
        }
        
        closeModal();
        loadTasks(currentPage, currentSearch);
        
    } catch (error) {
        console.error('Error saving task:', error);
        alert(error.message);
    }
}

async function deleteTask(id) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/tasks/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': AUTH_HEADER
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete task');
        }
        
        loadTasks(currentPage, currentSearch);
        
    } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
    }
}

// Audit logs functions
async function loadAuditLogs() {
    try {
        const response = await fetch(`${API_BASE}/logs`, {
            headers: {
                'Authorization': AUTH_HEADER
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to load audit logs');
        }
        
        const logs = await response.json();
        displayAuditLogs(logs);
        
    } catch (error) {
        console.error('Error loading audit logs:', error);
        alert('Failed to load audit logs');
    }
}

function displayAuditLogs(logs) {
    const tbody = document.getElementById('auditLogsTableBody');
    tbody.innerHTML = '';
    
    logs.reverse().forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${formatDate(log.timestamp)}</td>
            <td><span class="action-type action-${getActionClass(log.action)}">${log.action}</span></td>
            <td>${log.taskId || '-'}</td>
            <td><div class="updated-content">${escapeHtml(log.updatedContent || '-')}</div></td>
        `;
        tbody.appendChild(row);
    });
}

// Utility functions
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function sanitizeInput(input) {
    return input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                .replace(/<[^>]*>/g, '')
                .trim();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString();
}

function getActionClass(action) {
    if (action.includes('Create')) return 'create';
    if (action.includes('Update')) return 'update';
    if (action.includes('Delete')) return 'delete';
    return 'create';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('taskModal');
    if (event.target === modal) {
        closeModal();
    }
}