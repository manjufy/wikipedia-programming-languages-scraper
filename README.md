# Programming Language Scraper (Scrape From wikipedia)

The Wikipedia page ["List of programming languages"](https://en.wikipedia.org/wiki/List_of_programming_languages) converted into JSON-LD.

_Forked from https://github.com/scienceai/list-of-programming-languages_

## How to run:

```
npm run build
```

It would create two files
```
data/programming-languages.json -> scraped from wikipedia
data/list.json - programming language list with name and slug
```

## What we got

- [DONE] Scrapes Programming language list from https://en.wikipedia.org/wiki/List_of_programming_languages
- [DONE] For each programming languages, query wikidata page to get logo/image link of the language
- [TODO] For each programming langauge, visit the wikidata page and capture the actual image link to the of the language

