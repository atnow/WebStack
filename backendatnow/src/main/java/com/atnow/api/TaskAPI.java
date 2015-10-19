package com.atnow.api;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.inject.Named;

import com.atnow.ofy.OfyService;
import com.googlecode.objectify.ObjectifyService;

import com.atnow.helper.Constants;
import com.atnow.model.Task;
import com.atnow.model.UserDetail;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Nullable;
import com.google.appengine.api.oauth.OAuthRequestException;
import com.google.appengine.api.users.User;

@Api(
	name = "atnow",
	version = "v1",
	clientIds = {Constants.WEB_CLIENT_ID, Constants.ANDROID_CLIENT_ID, Constants.IOS_CLIENT_ID, Constants.API_EXPLORER_CLIENT_ID},
	scopes = {Constants.EMAIL_SCOPE}
		)
public class TaskAPI {

	private static final String DEFAULT_LIMIT = "100";
	
	@ApiMethod(name = "tasks.ping")
	public Task ping() {
		Task pong = new Task();
		pong.setDescription("pong");
		return pong;
	}
	
	@ApiMethod(name = "tasks.list")
	@SuppressWarnings("unchecked")
	public List<Task> listTasks(@Nullable @Named("limit") String limit, 
			@Nullable @Named("order") String order) throws OAuthRequestException, IOException {
		return null;
	}

	public List<Task> listTasksByPrice(@Nullable @Named("limit") String limit,
			@Nullable @Named("order") String order, @Named("price")float price){
		System.out.println("Price is "+price);
		List<Task> tasks = OfyService.ofy().load().type(Task.class).filter("price >", price).list();
		return tasks;
	}
	
	@ApiMethod(name = "tasks.insert")
	public Task insert(Task task, User user) throws OAuthRequestException, IOException {
		if (user != null) {
			task.setRequester(OfyService.ofy().load().type(UserDetail.class).id(user.getUserId()).now());	
			task.setTimeRequested(new Date());
			task.setCompleted(false);
			OfyService.ofy().save().entity(task).now();
			//TODO: set user location in task

			return task;
		}
		throw new OAuthRequestException("invalid user");
		
	}
}
