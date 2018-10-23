// rss
const bbc = 'http://feeds.bbci.co.uk/news/world/rss.xml';
const cnn = 'http://rss.cnn.com/rss/edition.rss';
const abc = 'https://abcnews.go.com/abcnews/topstories';
const nyc = 'http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml';
const jpost = 'https://www.jpost.com/Rss/RssFeedsFrontPage.aspx';
const fox = 'http://feeds.foxnews.com/foxnews/latest';

const ynet = 'http://www.ynet.co.il/Integration/StoryRss2.xml';
const walla = 'http://rss.walla.co.il/feed/1?type=main';
const mako = 'http://rcs.mako.co.il/rss/news-military.xml';
const israelHayom = 'https://www.israelhayom.co.il/rss.xml';
const timesOfIsrael = 'https://www.timesofisrael.com/feed/';
const haaretz = '';

const needStrip = ['jpost', 'ynet', 'walla', 'mako'];

google.load('feeds', '2');

function rssReader(rss, site) {
  const feed = new google.feeds.Feed(rss);

  document.getElementById('feed').innerHTML = '';

  feed.load(function(result) {
    if (!result.error) {
      const container = document.getElementById('feed');
      for (let i = 0; i < result.feed.entries.length; i++) {
        const entry = result.feed.entries[i];

        const article = document.createElement('article');

        const h1 = document.createElement('h1');
        const paragraph = document.createElement('p');
        const a = document.createElement('a');
        const strong = document.createElement('strong');

        a.innerHTML = '<i class="fas fa-newspaper"></i> ';
        strong.innerHTML = '<i class="far fa-clock"></i> ';

        h1.appendChild(document.createTextNode(entry.title));
        a.appendChild(document.createTextNode(`Full Article - ${site}`));

        if (needStrip.includes(site)) {
          paragraph.appendChild(document.createTextNode(strip(entry.content)));
          h1.setAttribute('dir', 'rtl');
          paragraph.setAttribute('dir', 'rtl');
        } else {
          paragraph.appendChild(document.createTextNode(entry.content));
          h1.setAttribute('dir', 'ltr');
          paragraph.setAttribute('dir', 'ltr');
        }
        strong.appendChild(document.createTextNode(entry.publishedDate));

        a.href = entry.link;

        article.appendChild(h1);
        article.appendChild(paragraph);
        article.appendChild(a);
        article.appendChild(strong);

        container.appendChild(article);
      }
    }
  });
}

// func to strip out the html from content
function strip(html) {
  var tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}
