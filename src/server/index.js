const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const https = require('https');
const http = require('http');
const parseString = require('xml2js').parseString;
const moment = require('moment');

const app = express();
app.use(bodyParser.json());
app.use(express.static('../client'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

app.post('/api', (req, res) => {
  const rssFeeds = JSON.parse(fs.readFileSync('rss_feeds.json', 'utf8'));
  const name = req.body.name;
  const index = req.body.index;

  const options = {
    hostname: rssFeeds[index][name].hostname,
    path: rssFeeds[index][name].path,
    method: 'GET'
  };

  const needHttps = ['abc', 'jpost', 'israelHayom'];
  needHttps.includes(name) ? (protocol = https) : (protocol = http);

  const request = protocol.request(options, response => {
    let responseBody = '';
    console.log(`${name} - Server Status: ${response.statusCode} `);
    response.setEncoding('UTF-8');

    response.on('data', data => {
      responseBody += data;
    });

    response.on('end', () => {
      parseString(responseBody, function(err, result) {
        if (err) throw err;

        const articles = [];
        const items = result.rss.channel[0].item;

        // Sort dates
        items
          .sort((a, b) => {
            const dateA = new Date(a.pubDate);
            const dateB = new Date(b.pubDate);
            return dateA - dateB;
          })
          .reverse();

        items.forEach(item => {
          const article = {
            name: rssFeeds[index][name].websiteName,
            title: item.title,
            desc: item.description,
            link: item.link,
            time: moment(item.pubDate.join('')).fromNow()
          };

          articles.push(article);
        });

        res.json(articles);
      });
    });

    response.on('error', err => {
      if (err) console.log(`${err.name} - ${err.message}`);
    });
  });

  request.end();

  request.on('error', err => {
    console.log(`${err.name} - ${err.message}`);
  });
});

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});
