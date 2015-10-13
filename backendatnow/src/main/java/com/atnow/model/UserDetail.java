package com.atnow.model;

import java.util.List;

import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

import com.google.appengine.api.users.User;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class UserDetail {
	
	
	@PrimaryKey
	@Persistent
	private String userId;
	
	@Persistent
	private String eduEmail;
	
	
	@Persistent
	private int numRatings;
	
	@Persistent
	private float rating;
	
	@Persistent
	private List<Long> tasksCompleted;
	
	@Persistent
	private List<Long> tasksRequested;
	
	
	
	public UserDetail(User user, String eduEmail, int numRatings, float rating, List<Long> tasksCompleted,
			List<Long> tasksRequested) {
		this.userId = user.getUserId();
		this.eduEmail = eduEmail;
		this.numRatings = numRatings;
		this.rating = rating;
		this.tasksCompleted = tasksCompleted;
		this.tasksRequested = tasksRequested;
	}
	
	public UserDetail(User user) {
		this.userId = user.getUserId();
	}

	public String getUserId() {
		return userId;
	}

	public int getNumRatings() {
		return numRatings;
	}
	
	public void setNumRatings(final int numRatings) {
		this.numRatings = numRatings;
	}
	
	public float getRating() {
		return rating;
	}
	
	public void setRating(final float rating) {
		this.rating = rating;
	}
	
	public List<Long> getTasksCompleted() {
		return tasksCompleted;
	}
	
	public void setTasksCompleted(final List<Long> tasksCompleted) {
		this.tasksCompleted = tasksCompleted;
	}
	
	public List<Long> getTasksRequested() {
		return tasksRequested;
	}
	
	public void setTasksRequested(final List<Long> tasksRequested) {
		this.tasksRequested = tasksRequested;
	}
	
	public String getEduEmail() {
		return eduEmail;
	}
	
	public void setEduEmail(final String eduEmail) {
		this.eduEmail = eduEmail;
	}
}
