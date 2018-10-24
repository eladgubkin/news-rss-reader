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
const nana10 = 'http://rss.nana10.co.il/?s=127';

const needHtmlStrip = ['Jerusalem Post', 'ynet', 'Walla', 'Mako', 'Israel Hayom', 'Haaretz', 'Times of Israel', 'Nana 10'];

google.load('feeds', '1');

function rssReader(rss, site) {
  const feed = new google.feeds.Feed(rss);

  const container = document.getElementById('feed');
  container.innerHTML = '';
  container.setAttribute('class', '');

  feed.load(function(result) {
    if (!result.error) {
      container.setAttribute('class', 'animated slideInUp');

      for (let i = 0; i < result.feed.entries.length; i++) {
        const entry = result.feed.entries[i];

        const article = document.createElement('article');

        const h1 = document.createElement('h1');
        const paragraph = document.createElement('p');
        const a = document.createElement('a');
        const time = document.createElement('time');

        a.innerHTML = '<i class="fas fa-external-link-alt"></i> ';
        time.innerHTML = '<i class="far fa-clock"></i> ';

        h1.appendChild(document.createTextNode(entry.title));
        a.appendChild(document.createTextNode(`Full Article - ${site}`));

        if (needHtmlStrip.includes(site)) {
          paragraph.appendChild(document.createTextNode(strip(entry.content)));
          if (site === 'Jerusalem Post') {
            h1.setAttribute('dir', 'ltr');
            paragraph.setAttribute('dir', 'ltr');
          } else {
            h1.setAttribute('dir', 'rtl');
            paragraph.setAttribute('dir', 'rtl');
          }
        } else {
          paragraph.appendChild(document.createTextNode(entry.content));
          h1.setAttribute('dir', 'ltr');
          paragraph.setAttribute('dir', 'ltr');
        }
        time.appendChild(document.createTextNode(entry.publishedDate));

        a.href = entry.link;
        a.target = '_blank';

        const linkContainer = document.createElement('strong');
        linkContainer.appendChild(a);

        article.appendChild(h1);
        article.appendChild(paragraph);
        article.appendChild(linkContainer);
        article.appendChild(time);

        container.appendChild(article);
      }
    }
  });
}

// func to strip out the html from content
function strip(html) {
  var doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}
