# Exmcached Session

Ⓜ️ Session store for expressjs with memcached.

## Installation

```sh
$ npm install --save exmcached-session
```

## Example

```javascript
var express = require("express");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var http = require("http");
var app = express();
var MemcachedStore = require("../exmcached")(session);

app.use(cookieParser());
app.use(session({
    secret: "*@&#(!@*#)!@(*)(!*@)",
    key: "boom-shakalaka",
    store: new MemcachedStore({
        hosts: [ "127.0.0.1:11211" ],
        prefix: "test"
    })
}));

app.get("/", function(req, res) {
    if (req.session.views) {
        ++req.session.views;
    } else {
        req.session.views = 1;
    }
    res.send("Viewed <strong>" + req.session.views + "</strong> times.");
});

http.createServer(app).listen(9341, function() {
    console.log("Listening on %d", this.address().port);
});
```

## Options

+ `hosts`: Memcached servers locations, this is a string.
+ `prefix`: An optional prefix for each memcache key, in case you are sharing your memcached servers with something generating its own keys.
+ ... Rest of given option will be passed directly to the node-memcached constructor.

For details see [memjs](http://amitlevy.com/projects/memjs/).

## Contribution

This repo is modified from [https://github.com/balor/connect-memcached](https://github.com/balor/connect-memcached). And that repo seems not maintained anymore (last version was published 2 years ago). So I created this repo.

You're welcome to make pull requests!

「雖然我覺得不怎麼可能有人會關注我」
