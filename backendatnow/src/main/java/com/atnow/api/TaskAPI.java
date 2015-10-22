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

	
	/*public enum ListFilter {
		PRICE("price"),
		CATEGORY("category"),
		EXPIRATION("expiration"),
		LOCATION("location"),
		REQUESTTIME("request");
		
		private final String filter;

		ListFilter(final String filter) {
			this.filter = filter;
		}

		public String getListFilter() {
			return filter;
		}

		@Override
		public String toString() {
			return filter;
		}

	}*/
	


	private static final String DEFAULT_LIMIT = "100";
	
	@ApiMethod(name = "tasks.list")
	public List<Task> listTasksByFilter(
		@Nullable @Named("limit") String limit, 
		@Nullable @Named("filter") String filter, 
		@Nullable @Named("price") String price,
		@Nullable @Named("category") String category
	){
		List<Task> tasks = null; 
	
		if(filter==null){	
			tasks = OfyService.ofy().load().type(Task.class).list();
			return tasks;
		}
		switch(filter){
		case "price": 
			System.out.println("Price\n\n\n\n");
			tasks = OfyService.ofy().load().type(Task.class).filter("price >", Float.parseFloat(price)).list();
			break;
		case "category":
			tasks = OfyService.ofy().load().type(Task.class).filter("category", category).list(); 
			break;
		case "expiration":
			break;
		case "location":
			break;
		default:
			tasks = OfyService.ofy().load().type(Task.class).list();
			break;
	}
		return tasks;
	}
	
	
	@ApiMethod(name = "tasks.insert")
	public Task insert(Task task, User user) throws OAuthRequestException, IOException {
		if (user != null) {
			task.setRequester(OfyService.ofy().load().type(UserDetail.class).id(user.getUserId()).now());	
			Date date = new Date();
			task.setTimeRequested(date.getTime());
			task.setCompleted(false);
			OfyService.ofy().save().entity(task).now();
			//TODO: set user location in task

			return task;
		}
		throw new OAuthRequestException("invalid user");
		
	}
}
