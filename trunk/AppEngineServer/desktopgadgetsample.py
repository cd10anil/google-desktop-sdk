import wsgiref.handlers
import random
import logging

from google.appengine.ext import db
from google.appengine.ext import webapp
from xml.dom import minidom

# A simple sharded-counter.
class Counter(db.Model):
  count = db.IntegerProperty(default=0)

  @classmethod
  def getCount(self):
    total = 0
    for counter in Counter.all():
      total += counter.count
    return total

  @classmethod
  def increment(self):
    key_name = 'GD_Q__%d' % (random.randint(1, 10))
    randomShard = Counter.get_or_insert(key_name=key_name)
    def updateCounter(key):
      shard = Counter.get(key)
      shard.count += 1
      shard.put()
    db.run_in_transaction(updateCounter, randomShard.key())

# Model that stores Question information.
class Question(db.Model):
  text = db.StringProperty(required=True)
  yesCount = db.IntegerProperty(default=0)
  totalCount = db.IntegerProperty(default=0)
  randomValue = db.FloatProperty()

# Handler for 'GET' requests for a question.
class QuestionRequestHandler(webapp.RequestHandler):
  def get(self):
    self.response.headers['Content-Type'] = 'text/plain'

    # Query for the number of questions which is stored in Counter table.
    totalQuestions = Counter.getCount()
    if(totalQuestions == 0):
      self.response.out.write("NO_QUESTIONS")
      return

    randomSelection = random.random();
    # Select the question with the largest 'randomValue' but within
    # 'randomSelection'.
    try:
      question = Question.all().filter('randomValue <=', randomSelection).order('-randomValue').get()
      # If randomSelection is too small, we just pick the first question.
      # Warning: This strategy isn't fair on all questions.
      if not question:
        question = Question.all().get()
    except db.Error:
      self.response.out.write('DATABASE_ERROR')

    self.response.out.write("%s\n%s\n" % (str(question.key()), question.text))

# Handler for 'POST' requests submitting a user's vote.
class VoteHandler(webapp.RequestHandler):
  def post(self):
    self.response.headers['Content-Type'] = 'text/plain'

    voteStr = self.request.get('vote')
    questionId = self.request.get('qid')

    if not questionId or not voteStr:
      self.response.out.write('INVALID_REQUEST')
      return

    vote = bool(int(voteStr))

    def updateVote(key, vote):
      question = Question.get(key)
      if not question:
        self.response.out.write('QUESTION_NOT_FOUND')
        return

      if vote:
        question.yesCount += 1

      question.totalCount += 1
      question.put()

    questionKey = db.Key(encoded=questionId)
    db.run_in_transaction(updateVote, questionKey, vote)
    self.response.out.write('OK')

# Handler for 'GET' requests for the top questions.
class TopQuestionsHandler(webapp.RequestHandler):
  def get(self):
    self.response.headers['Content-Type'] = 'text/plain'

    numQuestions = self.request.get('num')
    if not numQuestions:
      numQuestions = 10
    elif (numQuestions > 25):
      numQuestions = 25

    questions = Question.all().order("-totalCount").fetch(limit=numQuestions)

    for question in questions:
      noCount = question.totalCount - question.yesCount
      self.response.out.write("%s\n%ld\n%ld\n\n" % (question.text, question.yesCount, noCount))

# Handler for home-page requests. The output of this handler is html as it
# should be accessible from a browser.
class HomePageHandler(webapp.RequestHandler):
  def get(self):
    self.response.headers['Content-Type'] = 'text/html'
    questions = Question.all().order("-totalCount").fetch(limit=10)

    self.response.out.write("""
      <html>
        <head>
          <title> Google Desktop Gadget Sample </title>
        </head>
        <body>
          <table border='1'>
      """)

    if len(questions) > 0:
      self.response.out.write("""
        <tr>
          <td width="25"></td>
          <td width="200">Question</td>
          <td width="100">+ve Votes</td>
          <td width="100">-ve Votes</td>
        </tr>
        """)

    count = 1
    for question in questions:
      self.response.out.write("""
       <tr>
         <td>%d</td>
         <td>%s</td>
         <td>%d</td>
         <td>%d</td>
       </tr>
       """ % (count, question.text, question.yesCount, (question.totalCount - question.yesCount)))
      count += 1
    self.response.out.write("""
          </table>
        </body>
      </html>
      """)

# Handler that allows submission of new questions.
# TODO(yourself) Allow only logged-in users to post questions.
# TODO(yourself) All users except the admin should have an upper limit on the
# No. of questions one can submit.
class SubmitQuestionHandler(webapp.RequestHandler):
  def post(self):
    self.response.headers['Content-Type'] = 'text/plain'

    questionText = self.request.get('question')
    if not questionText:
      self.response.out.write('INVALID_REQUEST')

    question = Question(text=questionText)
    question.randomValue = random.random()
    question.put()
    # GAE doesn't support transactions across entity groups. Hence, one of the 2 writes might not happen.
    # Thus we write the question first so that in the worst-case, our count a bit lagging from the 'actual count'
    # If the count is slightly less, the last few questions will not be displayed instantaneously.
    # But that is okay.(better than 404s/retries that can be caused by incrementing the count first)
    Counter.increment()

def main():
  application = webapp.WSGIApplication(
                                       [('/question', QuestionRequestHandler),
                                        ('/vote' , VoteHandler),
                                        ('/top', TopQuestionsHandler),
                                        ('/submit', SubmitQuestionHandler),
                                        ('/', HomePageHandler),
                                       ],
                                       debug=True)
  wsgiref.handlers.CGIHandler().run(application)

if __name__ == "__main__":
  main()
