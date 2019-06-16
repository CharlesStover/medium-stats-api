# Medium Stats API

An API endpoint for fetching Medium article stats.

## Use

To use this application, run the following Docker command, replacing
`<<YOUR SID HERE>>` with the contents of your `sid` cookie, `<<YOUR UID HERE>>`
with the contents of your `uid` cookie, and `<<YOUR USERNAME HERE>>` with your
Medium username (not including the `@`).

```
docker run \
  --detach \
  --env SID=<<YOUR SID HERE>> \
  --env UID=<<YOUR UID HERE>> \
  --env USERNAME=<<YOUR USERNAME HERE>> \
  --name medium-stats-api \
  --network reverse-proxy \
  --restart always \
  charlesstover/medium-stats-api
```

## Tech Stack

* Docker - containerize the API
* JavaScript - Promises for fetching and parsing data
* Node - server and file system
