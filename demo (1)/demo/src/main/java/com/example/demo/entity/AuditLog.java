package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private LocalDateTime timestamp;
    
    @Column(nullable = false)
    private String action;
    
    @Column(name = "task_id")
    private Long taskId;
    
    @Column(name = "updated_content", columnDefinition = "TEXT")
    private String updatedContent;
    
    public AuditLog() {
        this.timestamp = LocalDateTime.now();
    }
    
    public AuditLog(String action, Long taskId, String updatedContent) {
        this();
        this.action = action;
        this.taskId = taskId;
        this.updatedContent = updatedContent;
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    
    public Long getTaskId() { return taskId; }
    public void setTaskId(Long taskId) { this.taskId = taskId; }
    
    public String getUpdatedContent() { return updatedContent; }
    public void setUpdatedContent(String updatedContent) { this.updatedContent = updatedContent; }
}