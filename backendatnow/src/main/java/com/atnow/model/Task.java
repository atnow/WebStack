package com.atnow.model;

import java.awt.Point;
import java.util.Date;

import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

public class Task {
	
	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private long taskId;
	
	@Persistent
	private String description;
	
	@Persistent
	private String category;
	
	@Persistent
	private String requesterId;
	
	@Persistent
	private String completerId;
	
	@Persistent
	private Date timeRequested;
	
	@Persistent
	private String taskLocation;
	
	@Persistent
	private Point requesterLocation;
	
	@Persistent
	private Date expiration;
	
	@Persistent
	private boolean completed;
	
	
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
	
	public Task(String description, TaskCategory category, int taskId, String requesterId, String completerId, Date timeRequested,
			String taskLocation, Point requesterLocation, Date expiration, boolean completed) {
		super();
		this.description = description;
		this.category = category.getTaskCategory();
		this.taskId = taskId;
		this.requesterId = requesterId;
		this.completerId = completerId;
		this.timeRequested = timeRequested;
		this.taskLocation = taskLocation;
		this.requesterLocation = requesterLocation;
		this.expiration = expiration;
		this.completed = completed;
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

	public long getTaskId() {
		return taskId;
	}
	
	public String getRequesterId() {
		return requesterId;
	}
	
	public void setRequesterId(final String requesterId) {
		this.requesterId = requesterId;
	}
	
	public String getCompleterId() {
		return completerId;
	}
	
	public void setCompleterId(final String completerId) {
		this.completerId = completerId;
	}
	
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
	
	//TODO: Create encoder and decoder for documents
}
