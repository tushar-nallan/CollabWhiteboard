# -*- coding: utf-8 -*-
# this file is released under public domain and you can use without limitations

#########################################################################
## This is a samples controller
## - index is the default action of any application
## - user is required for authentication and authorization
## - download is for downloading files uploaded in the db (does streaming)
## - call exposes all registered services (none by default)
#########################################################################

def index():
    images = db().select(db.image.ALL, orderby=db.image.title)
    return dict(images=images)
    

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
    return dict(form=auth())


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
    
def admin():
    grid = None
    if auth.user.email=='eskiranmai94@gmail.com':
        grid=SQLFORM.smartgrid(db.image)
    else:
        query = db.image.User==auth.user.id
        constraints = {'image':query}
        grid=SQLFORM.smartgrid(db.image,constraints)
    return dict(grid=grid)

def profile():
    return dict(form=auth.profile())

def register():
    return dict(form=auth.register())

def login():
    return dict(form=auth.login())

def resetpass():
    return dict(form=auth.request_reset_password())

def upload():
    db.image.User.default=auth.user.first_name
    form=SQLFORM(db.image)
    name="Photo Gallery"
    if form.accepts(request.vars,session):
        redirect(URL(r=request,f='index'))
        session.flash=T("Upload successful")
    else:
       session.flash=T('Form has errors')    
    return dict(form=form,name=name)

        
@auth.requires_login()       
def show():
    db.image.User.default=auth.user.first_name
    image = db.image(request.args(0)) or redirect(URL('index'))
    db.comment.image_id.default = image.id
    form1 = SQLFORM(db.comment,submit_button=T('Submit'))
    if form1.process().accepted:
        response.flash = 'your comment is posted'
    comments = db(db.comment.image_id==image.id).select()
    
    db.Likes.image_id.default = image.id
    form2 = SQLFORM(db.Likes,submit_button=T('Like'))
    if form2.process().accepted:
        response.flash = 'Liked!!'
    likes = db(db.Likes.image_id==image.id).select()
    return dict(image=image, comments=comments, form1=form1, form2=form2,likes=likes)

def delete():
    a=db.image(request.args(0)) or redirect(URL('index'))
    form3=crud.delete(db.image, a.id)
    return dict(form3=form3)
