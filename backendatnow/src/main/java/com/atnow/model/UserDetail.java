package com.atnow.model;

import java.util.List;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Load;
import com.google.appengine.api.users.User;

@Entity
public class UserDetail {
	
	@Id private String userId;
	private String eduEmail;
	private int numRatings;
	private float rating;
//	private @Load List<Ref<Task>> tasksCompleted;
//	private @Load List<Ref<Task>> tasksRequested;
	
	public UserDetail(){

	}

/*	public UserDetail(User user, String eduEmail, int numRatings, float rating, List<Long> tasksCompleted,
			List<Long> tasksRequested) {
		this.userId = user.getUserId();
		this.eduEmail = eduEmail;
		this.numRatings = numRatings;
		this.rating = rating;
		this.tasksCompleted = tasksCompleted;
		this.tasksRequested = tasksRequested;
	}
*/
	public UserDetail(User user, String eduEmail, int numRatings, float rating) {
		this.userId = user.getUserId();
		this.eduEmail = eduEmail;
		this.numRatings = numRatings;
		this.rating = rating;
	}

	public UserDetail(User user) {
		this.userId = user.getUserId();
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(User user) {
		this.userId=user.getUserId();
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
	
	/*public List<Long> getTasksCompleted() {
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
	}*/
	
	public String getEduEmail() {
		return eduEmail;
	}
	
	public void setEduEmail(final String eduEmail) {
		this.eduEmail = eduEmail;
	}
}
