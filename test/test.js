/**
 * XadillaX created at 2015-12-25 16:58:22 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

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
        hosts: "127.0.0.1:11211",
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
