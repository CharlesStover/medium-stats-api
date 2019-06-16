const http = require('http');
const fetchMediumStats = require('./fetch-medium-stats');

const HEADERS = {
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Origin': process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
  'Content-Type': 'application/json; charset=utf-8',
};

const ONE_MINUTE = 60000;

const TWELVE_HOURS = 43200000;

http.createServer((_request, response) => {
  fetchMediumStats()
    .then(articles => {
      response.writeHead(200, {
        ...HEADERS,
        'Cache-Control': 'max-age=43200, public', // 12 hours
        'Expires': new Date(Date.now() + TWELVE_HOURS).toUTCString(),
      });
      response.write(articles);
      response.end();
    })
    .catch(err => {
      console.error(err.message);
      response.writeHead(400, {
        ...HEADERS,
        'Cache-Control': 'max-age=60, public', // 1 minute
        'Expires': new Date(Date.now() + ONE_MINUTE).toUTCString()
      });
      response.write(JSON.stringify({
        message: err.message,
      }));
      response.end();
    });
})
  .listen(3010, () => {
    console.log('Started successfully.');
  });
