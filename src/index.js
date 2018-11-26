const fs = require('fs');
const url = require('url');
const ml = require('./ml');
const cheerio = require('cheerio');
const uniqBy = require('lodash/uniqBy');
const packageJson = require('../package');
const lplUrl = 'http://en.wikipedia.org/wiki/List_of_programming_languages';
const plplUrl = url.parse(lplUrl);
const axios = require('axios')

const list = {
  '@context': 'http://schema.org',
  '@type': ['ItemList', 'CreativeWork'],
  'inLanguage': 'English',
  'version': packageJson.version,
  'dateModified': (new Date()).toISOString(),
  'isBasedOnUrl': lplUrl,
  'itemListOrder': 'schema:ItemListOrderAscending',
  'numberOfItems': 0,
  'itemListElement': [],
};
const queryWikipedia = () => axios.get(lplUrl);
const queryWikiData = url => axios.get(url);
console.time();
const process = async () => {
  const wikipediaData = await queryWikipedia()
  const html = wikipediaData.data.toString();
  const $ = cheerio.load(html);
  list.description = $('#mw-content-text p').eq(0).text();

  $('h2 ~ .div-col li a').each(function(i) {
    const $a = $(this);
    list.itemListElement.push({
      "@type": 'ListItem',
      item: {
        '@id': url.resolve(plplUrl.protocol + '//' + plplUrl.host, $a.attr('href')),
        '@type': 'ComputerLanguage',
        name: $a.text()
      }
    });
  });
  
  list.itemListElement = uniqBy(
    list.itemListElement.concat(ml.map(function(item) {
      return {
        "@type": 'ListItem',
        item: {
          '@id': item.url,
          '@type': 'ComputerLanguage',
          name: item.name
        }
      };
    })).sort(function(a, b) {
      return a.item.name.localeCompare(b.item.name);
    }).map(function(itemListElement, i) {
      return Object.assign(itemListElement, { position: i });
    }),
    function(itemListElement) {
      return itemListElement.item['@id'];
    }
  );

  for (element in list.itemListElement) {
    try {
      // FIXME: make async calls 
      const wikiData = await queryWikiData(list.itemListElement[element].item['@id'])
      console.log(wikiData.status, '=>', list.itemListElement[element].item['@id'])
      if (wikiData.status === 200 ) {
        const html = wikiData.data.toString()
        const $ = cheerio.load(html)
        const wikidataPage = $('#t-wikibase a').attr('href')
        list.itemListElement[element].item['wikidata'] = wikidataPage
      }
    } catch(error) {
      list.itemListElement[element].item['wikidata'] = '';
    }
  }

  return list
}

process()
.then(data => {
  data.numberOfItems = data.itemListElement.length
  fs.writeFile('../data/programming-languages.json', JSON.stringify(data, null, 2), function(err) {
    if (err) return console.error(err);
  });

  console.timeEnd();
})