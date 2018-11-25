const request = require('request');
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

// request.get(lplUrl, function(err, resp, body) {
//   if (err) return console.error(err);

//   const html = body.toString();
//   const $ = cheerio.load(html);
//   list.description = $('#mw-content-text p').eq(0).text();

//   $('h2 ~ .div-col li a').each(function(i) {
//     const $a = $(this);
//     list.itemListElement.push({
//       "@type": 'ListItem',
//       item: {
//         '@id': url.resolve(plplUrl.protocol + '//' + plplUrl.host, $a.attr('href')),
//         '@type': 'ComputerLanguage',
//         name: $a.text()
//       }
//     });
//   });

//   list.itemListElement = uniqBy(
//     list.itemListElement.concat(ml.map(function(item) {
//       return {
//         "@type": 'ListItem',
//         item: {
//           '@id': item.url,
//           '@type': 'ComputerLanguage',
//           name: item.name
//         }
//       };
//     })).sort(function(a, b) {
//       return a.item.name.localeCompare(b.item.name);
//     }).map(function(itemListElement, i) {
//       return Object.assign(itemListElement, { position: i });
//     }),
//     function(itemListElement) {
//       return itemListElement.item['@id'];
//     }
//   );

//   list.numberOfItems = list.itemListElement.length;
  
//   // loop through each, visit the respective page and grab wikidataPageUrl
//   for (element in list.itemListElement) {
//     request.get(list.itemListElement[element].item['@id'], (error, response, body) => {
//       console.log('FFFFFF')
//       if (body) {
//         const html = body.toString();
//         const $ = cheerio.load(html)
//         const wikidataPage = $('#t-wikibase a').attr('href')
//         list.itemListElement[element].item['wikidata'] = wikidataPage
//       }
//     });
//     console.log('TTTTT')
//     console.log(list.itemListElement[element].item)
//   }
//   // list.itemListElement.forEach(element => {
//   //   request.get(element.item['@id'], (error, response, body) => {
//   //     if (body) {
//   //       const html = body.toString();
//   //       const $ = cheerio.load(html)
//   //       const wikidataPage = $('#t-wikibase a').attr('href')
//   //       console.log('WikidataPae', wikidataPage)
//   //       element.item['wikidataPage'] = wikidataPage
//   //     }
//   //   })

//   //   console.log(list)
//   // });

//   fs.writeFile('../data/programming-languages.json', JSON.stringify(list, null, 2), function(err) {
//     if (err) return console.error(err);
//   });
// });

const queryWikipedia = () => axios.get(lplUrl);
const queryWikiData = (url) => api.get(url);

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
  
  return list
}


process()
.then(data => {
  console.log('Done process!', data)
})