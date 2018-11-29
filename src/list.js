/**
 * Read through the language list from data/programming-languages.json and create a following structure
 * [
        {
            name: 'C'
            slug: 'c'
            image: 'imageUlr'
        },
    ]
 */
const util = require('./util.js')
const slugify = (text) => (text.toString().toLowerCase()
.replace(/\s+/g, '-')           // Replace spaces with -
.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
.replace(/\-\-+/g, '-')         // Replace multiple - with single -
.replace(/^-+/, '')             // Trim - from start of text
.replace(/-+$/, '')          // Trim - from end of text
)

 const dataSet = require('../data/programming-languages.json')
 
 const languages = dataSet.itemListElement.reduce((result, item, index) => {
    const language = {}
    language['name'] = item.item.name
    language['slug'] = slugify(item.item.name)
    result.push(language)
    return result
}, [])

console.log(languages)
try {
    util.saveToFile('./data/list.json', languages)
    console.log('Done creating programming language list')
} catch (error) {
    console.error(error)
}