package com.atnow.api;

import java.io.IOException;
import java.util.Date;
import java.util.List;

import javax.inject.Named;
import javax.jdo.PersistenceManager;
import javax.jdo.Query;

import com.atnow.helper.Constants;
import com.atnow.model.Task;
import com.atnow.helper.PMF;
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
		PersistenceManager pm = PMF.get().getPersistenceManager();
		try {
			Query query = pm.newQuery(Task.class);
			if (limit == null) {
				limit = DEFAULT_LIMIT;
			}
			query.setRange(0, new Long(limit));
			return (List<Task>) pm.newQuery(query).execute();
		} finally {
			pm.close();
		}
		
	}
	
	@ApiMethod(name = "tasks.insert")
	public Task insert(Task task, User user) throws OAuthRequestException, IOException {
		if (user != null) {
			task.setTimeRequested(new Date());
			System.out.println(user);
			task.setRequesterId(user.getUserId());
			task.setCompleted(false);
			//TODO: set user location in task
			PersistenceManager pm = PMF.get().getPersistenceManager();
			pm.makePersistent(task);
			pm.close();
			return task;
		}
		throw new OAuthRequestException("invalid user");
		
	}
}
