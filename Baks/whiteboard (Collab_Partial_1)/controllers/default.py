# -*- coding: utf-8 -*-
# this file is released under public domain and you can use without limitations

#########################################################################
## This is a samples controller
## - index is the default action of any application
## - user is required for authentication and authorization
## - download is for downloading files uploaded in the db (does streaming)
## - call exposes all registered services (none by default)
#########################################################################

from google.appengine.api import channel
from django.utils import simplejson as json

def index():
    """
    example action using the internationalization operator T and flash
    rendered by views/default/index.html or views/generic.html
    """
    return dict()

@auth.requires_login()
def new():
    return dict()

@auth.requires_login()
def collections():
    return dict()

@auth.requires_login()
def editor():
	docId = request.vars.docId
	doc = db.document[docId]
	if not doc :
		redirect(URL(r=request,f='index'))
	if(not doc.public_read and auth.user.id not in doc.private_readers):
		redirect(URL(r=request,f='index'))
	
	for friend_id in doc.online_users:
		channel_msg = json.dumps({'type':'userOnline','userId':auth.user.id,'userName':auth.user.first_name})
		channel.send_message(db.auth_user[friend_id].channel_id, channel_msg)
	
	if auth.user.id not in doc.online_users:
		new_online_users = doc.online_users
		if(doc.online_users) :
#			print doc.online_users
			new_online_users.append(auth.user.id)
#			print doc.online_users.append(auth.user.id)
		else :
			new_online_users = [auth.user.id]
		
		doc.update_record(online_users=new_online_users)
	
	chat_token = channel.create_channel(auth.user.channel_id)
	return dict(chat_token=chat_token,doc=doc,collab=True)

def contact():
    return dict()

@auth.requires_login()
def updateStatus(): #Went Offline
	docId = request.vars.docId
	doc = db.document[docId]
	
	if auth.user.id in doc.online_users :
		new_online_users = doc.online_users.remove(auth.user.id)
		doc.update_record(online_users=new_online_users)

@auth.requires_login()
def changeDoc():
	elements = request.vars.elements
	layer = request.vars.layer
	print elements
	docId = request.vars.docId
	doc = db.document[docId]
	if(doc.public_read or auth.user.id in doc.private_readers) :
		for friend_id in doc.online_users:
			if friend_id != auth.user.id:
				channel_msg = json.dumps({'type':'changeDoc','elements':elements,'layer':layer,'remove':request.vars.remove})
				channel.send_message(db.auth_user[friend_id].channel_id, channel_msg)
	return dict()

def user():
    """
    exposes:
    http://..../[app]/default/user/login
    http://..../[app]/default/user/logout
    http://..../[app]/default/user/register
    http://..../[app]/default/user/profile
    http://..../[app]/default/user/retrieve_password
    http://..../[app]/default/user/change_password
    use @auth.requires_login()
        @auth.requires_membership('group name')
        @auth.requires_permission('read','table name',record_id)
    to decorate functions that need access control
    """
    return dict(form=auth(),collab=False)


def download():
    """
    allows downloading of uploaded files
    http://..../[app]/default/download/[filename]
    """
    return response.download(request,db)


def call():
    """
    exposes services. for example:
    http://..../[app]/default/call/jsonrpc
    decorate with @services.jsonrpc the functions to expose
    supports xml, json, xmlrpc, jsonrpc, amfrpc, rss, csv
    """
    return service()


@auth.requires_signature()
def data():
    """
    http://..../[app]/default/data/tables
    http://..../[app]/default/data/create/[table]
    http://..../[app]/default/data/read/[table]/[id]
    http://..../[app]/default/data/update/[table]/[id]
    http://..../[app]/default/data/delete/[table]/[id]
    http://..../[app]/default/data/select/[table]
    http://..../[app]/default/data/search/[table]
    but URLs must be signed, i.e. linked with
      A('table',_href=URL('data/tables',user_signature=True))
    or with the signed load operator
      LOAD('default','data.load',args='tables',ajax=True,user_signature=True)
    """
    return dict(form=crud())
