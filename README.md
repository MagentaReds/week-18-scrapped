# week-18-scrapped

I really kinda cheaped out on the design work on this homework, due to catching the longest cold ever and thinking about/starting on my final project.

I am using all the required technologies and packages:
Express, Express-Handlebars, Mongoose, Body-Parser, Request, Cheerio

### Database Structure
I have three collections: Article, Note, and SavedArticle.

Article has the information from The Onion that I scrapped (headline, link, and summary if there was one).

Note only has one field body.

SavedArticle has a one Article foreignKey, and an array of Note foreign keys.

If everything is working as it should, then when through Mongoose models, when you delete a SavedArticle document, then it should also automatically remove all those Note documents that were referred from the notes array from the Note collection as well.

And when running a scrape, it will only insert new Article documents if the link does not already exist in MongoDb.

### Other Notes

Besides simple styling, the User story should fit mostly what was in the supplied example movie.