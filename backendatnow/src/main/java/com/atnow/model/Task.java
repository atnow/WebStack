package com.atnow.model;

import java.awt.Point;
import java.util.Date;

import com.googlecode.objectify.Ref;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Load;
import com.googlecode.objectify.annotation.Index;
import com.googlecode.objectify.annotation.Parent;

@Entity
public class Task {
	
	@Id private Long taskId;
	private String description;
	private String category;
	private Date timeRequested;
	private String taskLocation;
	private Point requesterLocation;	
	private Date expiration;
	private boolean completed;
	@Index private float price;
	@Load Ref<UserDetail> requester;
	//@Load Ref<UserDetail> completer;
	
	public enum TaskCategory {
		FOOD("food"),
		HOME("home"),
		RIDE("ride");
		
		private String taskCategory;
		
		TaskCategory(String taskCategory) {
			this.taskCategory = taskCategory;
		}

		public String getTaskCategory() {
			return taskCategory;
		}
	}
	
	public Task() {
		
	}
	
	public Task(String description, TaskCategory category, Long taskId, UserDetail requester, UserDetail completer, Date timeRequested,
			String taskLocation, Point requesterLocation, Date expiration, boolean completed, float price) {
		super();
		this.description = description;
		this.category = category.getTaskCategory();
		this.taskId = taskId;
		this.timeRequested = timeRequested;
		this.taskLocation = taskLocation;
		this.requesterLocation = requesterLocation;
		this.expiration = expiration;
		this.completed = completed;
		this.price = price;
	//	this.setRequester(requester);
	//	this.setCompleter(completer);
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

	public void setCategory(TaskCategory category) {
		this.category = category.getTaskCategory();
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
	
/*	public void setCompleter(UserDetail comp){
		completer = Ref.create(comp);
	}
	
	public UserDetail getCompleter(){
		return completer.get();
	}
*/	
	public Date getTimeRequested() {
		return timeRequested;
	}
	
	public void setTimeRequested(final Date timeRequested) {
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
	
	public Date getExpiration() {
		return expiration;
	}
	
	public void setExpiration(final Date expiration) {
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
