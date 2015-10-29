#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import logging
import os 

from google.appengine.ext import ndb
import jinja2
import webapp2


jinja_env = jinja2.Environment(
  loader=jinja2.FileSystemLoader(os.path.dirname(__file__)),
  autoescape=True)

class MainHandler(webapp2.RequestHandler):
    def get(self):
    	template = jinja_env.get_template("templates/index.html")
        self.response.write(template.render({}))

class RobotHandler(webapp2.RequestHandler):
    def get(self):
    	template = jinja_env.get_template("templates/robot.html")
        self.response.write(template.render({}))

class IGEMHandler(webapp2.RequestHandler):
    def get(self):
        template = jinja_env.get_template("templates/igem.html")
        self.response.write(template.render({}))

class ResearchHandler(webapp2.RequestHandler):
    def get(self):
        template = jinja_env.get_template("templates/research.html")
        self.response.write(template.render({}))

class CompModeling(webapp2.RequestHandler):
    def get(self):
        template = jinja_env.get_template("templates/compmodeling.html")
        self.response.write(template.render({}))

class SpringHandler(webapp2.RequestHandler):
    def get(self):
        template = jinja_env.get_template("templates/springmass.html")
        self.response.write(template.render({}))

class SimonHandler(webapp2.RequestHandler):
    def get(self):
        template = jinja_env.get_template("templates/simon.html")
        self.response.write(template.render({}))

class SFOHandler(webapp2.RequestHandler):
    def get(self):
        template = jinja_env.get_template("templates/sfo.html")
        self.response.write(template.render({}))

class MechHandler(webapp2.RequestHandler):
    def get(self):
        template = jinja_env.get_template("templates/mechatronics.html")
        self.response.write(template.render({}))

class WebDevHandler(webapp2.RequestHandler):
    def get(self):
        template = jinja_env.get_template("templates/webdev.html")
        self.response.write(template.render({}))

class FavQuotesHandler(webapp2.RequestHandler): 
    def get(self): 
        template = jinja_env.get_template("templates/favquotes.html")
        self.response.write(template.render({}))

class KhanHandler(webapp2.RequestHandler):
    def get(self):
        template = jinja_env.get_template("templates/khan.html")
        self.response.write(template.render({}))

app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/index.html', MainHandler),
    ('/robot.html', RobotHandler), 
    ('/igem.html', IGEMHandler),
    ('/research.html', ResearchHandler), 
    ('/compmodeling.html', CompModeling),
    ('/springmass.html', SpringHandler),
    ('/simon.html', SimonHandler), 
    ('/sfo.html', SFOHandler),
    ('/mechatronics.html', MechHandler), 
    ('/webdev.html', WebDevHandler),
    ('/favquotes.html', FavQuotesHandler),
    ('/khan.html', KhanHandler)

], debug=True)
