package com.atnow.ofy;

import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.ObjectifyFactory;
import com.atnow.model.Task;
import com.atnow.model.UserDetail;

public class OfyService
{
    static {
        factory().register(Task.class);
        factory().register(UserDetail.class);
    }
    public static Objectify ofy(){
        return ObjectifyService.ofy();
    }

    public static ObjectifyFactory factory() {
        return ObjectifyService.factory();
    }
}