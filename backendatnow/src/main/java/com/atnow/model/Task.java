package com.atnow.model;

import java.awt.Point;
import java.util.Date;

import com.googlecode.objectify.Ref;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Load;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Parent;
import com.google.api.server.spi.config.AnnotationBoolean;
import com.google.api.server.spi.config.ApiResourceProperty;

@Entity
public class Task {
    
    @Id private Long taskId;
    private String title;
    private String description;
    @Index  private String category;
    private Long timeRequested;
    private Long expiration;
    private String taskLocation;
    private Point requesterLocation;
    private boolean completed;
    @Index private float price;
    @Load Ref<UserDetail> requester;
    //@Load Ref<UserDetail> completer;
    
    public enum TaskCategory {
        FOOD("food"),
        HOME("home"),
        RIDE("ride");
        
        private final String taskCategory;
        
        TaskCategory(final String taskCategory) {
            this.taskCategory = taskCategory;
        }

        public String getTaskCategory() {
            return taskCategory;
        }

        @Override
        public String toString() {
            return taskCategory;
        }
    }
    
    public Task() {
        
    }
    
    public Task(String description, String title, String category, Long taskId, UserDetail requester, UserDetail completer, Long timeRequested,
            String taskLocation, Point requesterLocation, Long expiration, boolean completed, float price) {
        super();
        this.description = description;
        this.category = category;
        this.taskId = taskId;
        this.timeRequested = timeRequested;
        this.taskLocation = taskLocation;
        this.requesterLocation = requesterLocation;
        this.expiration = expiration;
        this.completed = completed;
        this.price = price;
        this.title = title;
    }

    @ApiResourceProperty(ignored = AnnotationBoolean.TRUE) 
    public Key<Task> getKey(){
        System.out.println(Key.create(Task.class, this.taskId));
        return Key.create(Task.class, this.taskId);
    }

    public String getTitle() {
        return title;
    }
    
    public void setTitle(final String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }
    
    public void setDescription(final String description) {
        this.description = description;
    }
    
    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getTaskId() {
        return taskId;
    }
    
    public void setRequester(UserDetail req){
        requester = Ref.create(req);
    }
    
    public UserDetail getRequester(){
        return requester.get();
    }
    
/*    public void setCompleter(UserDetail comp){
        completer = Ref.create(comp);
    }
    
    public UserDetail getCompleter(){
        return completer.get();
    }
*/    
    public Long getTimeRequested() {
        return timeRequested;
    }
    
    public void setTimeRequested(final Long timeRequested) {
        this.timeRequested = timeRequested;
    }
    
    public String getTaskLocation() {
        return taskLocation;
    }
    
    public void setTaskLocation(final String taskLocation) {
        this.taskLocation = taskLocation;
    }
    
    public Point getRequesterLocation() {
        return requesterLocation;
    }
    
    public void setRequesterLocation(final Point requesterLocation) {
        this.requesterLocation = requesterLocation;
    }
    
    public Long getExpiration() {
        return expiration;
    }
    
    public void setExpiration(final Long expiration) {
        this.expiration = expiration;
    }
    
    public boolean isCompleted() {
        return completed;
    }
    
    public void setCompleted(final boolean completed) {
        this.completed = completed;
    }
    
    public float getPrice() {
        return price;
    }

    public void setPrice(final float price) {
        this.price = price;
    }
    //TODO: Create encoder and decoder for documents
}
