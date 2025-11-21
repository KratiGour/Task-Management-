package com.example.demo.service;

import com.example.demo.entity.Task;
import com.example.demo.entity.AuditLog;
import com.example.demo.repository.TaskRepository;
import com.example.demo.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
@Service
public class TaskService {
    
    @Autowired
    private TaskRepository taskRepository;
    
    @Autowired
    private AuditLogRepository auditLogRepository;
    
    public Page<Task> getAllTasks(String search, Pageable pageable) {
        if (search != null && !search.trim().isEmpty()) {
            return taskRepository.findByTitleOrDescriptionContaining(search.trim(), pageable);
        }
        return taskRepository.findAll(pageable);
    }
    
    public Task createTask(Task task) {
        Task savedTask = taskRepository.save(task);
        logAudit("Create Task", savedTask.getId(), 
                String.format("{\"title\":\"%s\",\"description\":\"%s\"}", 
                             savedTask.getTitle(), savedTask.getDescription()));
        return savedTask;
    }
    
    public Task updateTask(Long id, Task taskDetails) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        
        String oldTitle = task.getTitle();
        String oldDescription = task.getDescription();
        
        task.setTitle(taskDetails.getTitle());
        task.setDescription(taskDetails.getDescription());
        
        Task updatedTask = taskRepository.save(task);
        
        StringBuilder changes = new StringBuilder("{");
        if (!oldTitle.equals(updatedTask.getTitle())) {
            changes.append(String.format("\"title\":\"%s\"", updatedTask.getTitle()));
        }
        if (!oldDescription.equals(updatedTask.getDescription())) {
            if (changes.length() > 1) changes.append(",");
            changes.append(String.format("\"description\":\"%s\"", updatedTask.getDescription()));
        }
        changes.append("}");
        
        logAudit("Update Task", updatedTask.getId(), changes.toString());
        return updatedTask;
    }
    
    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        taskRepository.delete(task);
        logAudit("Delete Task", id, null);
    }
    
    private void logAudit(String action, Long taskId, String updatedContent) {
        AuditLog log = new AuditLog(action, taskId, updatedContent);
        auditLogRepository.save(log);
    }
}