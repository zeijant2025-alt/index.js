const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('NAKAKONEKTA ANG WEBHOOK');
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

app.post('/webhook', (req, res) => {
  if (req.body.object === 'page') {
    req.body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message && !event.message.is_echo) {
          handleMessage(event.sender.id, event.message.text);
        }
      });
    });
    res.status(200).send('OK');
  }
});

function handleMessage(senderId, text) {
  let reply = `Nakatanggap: "${text}"`;
  if (text.toLowerCase().includes('kamusta')) {
    reply = 
  }
  sendMessage(senderId, reply);
}

function sendMessage(senderId, text) {
  axios.post(`https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
    recipient: { id: senderId },
    message: { text: text }
  });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Tumatakbo sa port ${PORT}`));
        
