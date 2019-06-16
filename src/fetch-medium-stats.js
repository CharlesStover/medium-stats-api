const fs = require('fs');
const fetch = require('node-fetch');

const SID = process.env.SID || '';
const UID = process.env.UID || ''
const USERNAME = process.env.USERNAME || 'Anonymous';

const ONE_DAY = 1000 * 60 * 60 * 24;
const STATS = [
  'claps',
  'friendsLinkViews',
  'internalReferrerViews',
  'reads',
  'syndicatedViews',
  'updateNotificationSubscribers',
  'upvotes',
  'views',
];

const cacheMediumStats = () => {
  return fetch(
    `https://medium.com/@${USERNAME}/stats?filter=not-response&limit=9999`, {
    headers: {
      accept: 'application/json',
      cookie: `sid=${SID}; uid=${UID}`,
    },
  })
    .then(response => response.text())
    .then(response => {

      // Strip "])}while(1);</x>"
      const sanitized = response.substring(response.indexOf('{'));
      const parsed = JSON.parse(sanitized);
      const reduced = parsed.payload.value.reduce(
        (articles, article) => {

          // Instantiate the article with 0 stats, a reading time, and a
          //   preview image.
          if (!Object.prototype.hasOwnProperty.call(articles, article.title)) {
            articles[article.title] = {
              previewImage: article.previewImage.id,
              readingTime: article.readingTime,
            };
            for (const stat of STATS) {
              articles[article.title][stat] = 0;
            }
          }

          // Sum all the stats.
          for (const stat of STATS) {
            articles[article.title][stat] += article[stat];
          }

          // Only update the preview image if this is the original publication.
          if (article.collectionId === '') {
            articles[article.title].previewImage = article.previewImage.id;
          }
          return articles;
        },
        Object.create(null)
      );
      const stringified = JSON.stringify(reduced);

      return new Promise((resolve, reject) => {
        fs.writeFile('./cache.txt', stringified, err => {
          if (err) {
            reject(err);
          } else {
            resolve(stringified);
          }
        });
      });
    });
};

module.exports = function fetchMediumStats() {
  return new Promise((resolve, reject) => {
    fs.stat(
      './cache.txt',
      (statError, stats) => {
        if (statError) {
          console.error(
            `Error statting cache file on ${new Date().toUTCString()}: ` +
            statError.message,
          );
          cacheMediumStats()
            .then(resolve)
            .catch(reject);
          return;
        }
        if (stats.mtimeMs < Date.now() - ONE_DAY) {
          console.log(`Fetching stats on ${new Date().toUTCString()}.`);
          cacheMediumStats()
            .then(resolve)
            .catch(reject);
          return;
        }
        fs.readFile(
          './cache.txt',
          (readError, data) => {
            if (readError) {
              console.error(
                `Error reading cache file on ${new Date().toUTCString()}: ` +
                readError.message,
              );
              cacheMediumStats()
                .then(resolve)
                .catch(reject);
              return;
            }
            resolve(data);
          }
        );
      }
    );
  });
};
