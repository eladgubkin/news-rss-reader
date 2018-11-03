function post(id, index) {
  fetch('/api', {
    method: 'POST',
    body: JSON.stringify({ name: id, index: index }),
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  })
    .then(response => response.json())
    .then(response => {
      const needHtmlStrip = ['Jerusalem Post', 'ynet', 'Walla', 'Mako', 'Israel Hayom', 'Haaretz', 'Times of Israel', 'Nana 10'];

      const container = document.getElementById('feed');
      container.innerHTML = '';
      container.setAttribute('class', '');
      container.setAttribute('class', 'animated slideInUp');

      for (let i = 0; i < response.length; i++) {
        const article = document.createElement('article');
        const h1 = document.createElement('h1');
        const paragraph = document.createElement('p');
        const a = document.createElement('a');
        const time = document.createElement('time');

        a.innerHTML = '<i class="fas fa-external-link-alt"></i> ';
        time.innerHTML = '<i class="far fa-clock"></i> ';

        h1.appendChild(document.createTextNode(response[i].title));
        time.appendChild(document.createTextNode(response[i].time));
        a.appendChild(document.createTextNode(`Full Article - ${response[i].name}`));

        if (needHtmlStrip.includes(response[i].name)) {
          paragraph.appendChild(document.createTextNode(strip(response[i].desc)));
          if (response[i].name === 'Jerusalem Post') {
            h1.setAttribute('dir', 'ltr');
            paragraph.setAttribute('dir', 'ltr');
          } else {
            h1.setAttribute('dir', 'rtl');
            paragraph.setAttribute('dir', 'rtl');
          }
        } else {
          paragraph.appendChild(document.createTextNode(response[i].desc));
          h1.setAttribute('dir', 'ltr');
          paragraph.setAttribute('dir', 'ltr');
        }

        a.href = response[i].link;
        a.target = '_blank';

        const linkContainer = document.createElement('strong');
        linkContainer.appendChild(a);

        article.appendChild(h1);
        article.appendChild(paragraph);
        article.appendChild(linkContainer);
        article.appendChild(time);

        container.appendChild(article);
      }
    });
}

// func to strip out the html from content
function strip(html) {
  var doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}
