response.title = ' '.join(word.capitalize() for word in request.application.split('_'))

## read more at http://dev.w3.org/html5/markup/meta.name.html
response.meta.author = 'Tushar Chandra <tusharchandra1992@gmail.com>'
response.meta.description = 'Collaborative Whiteboard'
response.meta.keywords = 'paint, multiple, users, collaborative, canvas'
response.meta.generator = 'Web2py Web Framework'
response.meta.copyright = 'Copyright 2012'

## your http://google.com/analytics id
response.google_analytics_id = None
