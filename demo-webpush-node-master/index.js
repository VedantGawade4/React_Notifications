const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cors = require('cors')
const webpush = require('web-push')

var users = []

const app = express()

dotenv.config()

app.use(cors())

app.use(bodyParser.json())

webpush.setVapidDetails(process.env.WEB_PUSH_CONTACT, process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY)

app.get('/', (req, res) => {
  res.send('Hello world! 1.1')
})

app.post('/notifications/subscribe', (req, res) => {
  const subscription = req.body

  console.log(subscription)

  const payload = JSON.stringify({
    title: 'Hello!',
    body: 'It works.',
  })

  //add user to database
  users.push(subscription);

  users.forEach(userSub => {
    webpush.sendNotification(userSub, payload)
    .then(result => console.log(result))
    .catch(e => console.log(e.stack))
  });
  

  res.status(200).json({'success': true})
});

app.listen(9000, () => console.log('The server has been started on the port 9000'))
