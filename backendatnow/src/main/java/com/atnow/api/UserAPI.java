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
public class UserAPI {
    
    @ApiMethod(name = "users.insert")
    public UserDetail insert(UserDetail userDetail, User user) throws OAuthRequestException, IOException {
        if (user != null) {
            userDetail.setUserId(user);
            OfyService.ofy().save().entity(userDetail).now();
            //TODO: set user location in task

            return userDetail;
        }
        throw new OAuthRequestException("invalid user");
        
    }
    
    @ApiMethod(name = "users.getUserById")
    public UserDetail getUserById(@Named("Id") String Id, User user){
    
        return    OfyService.ofy().load().type(UserDetail.class).id(Id).now();     
    }
    
    @ApiMethod(name = "users.listUsers")
    public List<UserDetail> listUsers(){
        List<UserDetail> users = OfyService.ofy().load().type(UserDetail.class).list();
        return users;
    }

}
