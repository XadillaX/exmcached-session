/**
 * XadillaX created at 2015-12-25 15:54:48 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
"use strict";

var DEFAULT_AGE = 86400;

var util = require("util");

var Memcached = require("memcached");

var emptyFunc = function() {};

module.exports = function(session) {
    var Store = session.Store;

    var MemcachedStore = function(options) {
        options = options || {};
        Store.call(this, options);

        this.prefix = options.prefix || "MS_";
        if(!options.client) {
            if(!options.hosts) options.hosts = [ "127.0.0.1:11211" ];
            options.client = new Memcached(options.hosts, options);
        }

        this.client = options.client;
    };

    util.inherits(MemcachedStore, Store);

    MemcachedStore.prototype._getKey = function(key) {
        return this.prefix + ":" + key;
    };

    MemcachedStore.prototype.get = function(key, callback) {
        if(undefined === callback) callback = emptyFunc;
        key = this._getKey(key);
        this.client.get(key, function(err, result) {
            if(err) return callback(err);
            if(!result) return callback();

            try {
                callback(
                    undefined,
                    callback(undefined, JSON.parse(result.toString())));
            } catch(e) {
                callback(e);
            }
        });
    };

    MemcachedStore.prototype.set = function(key, data, callback) {
        if(undefined === callback) callback = emptyFunc;

        try {
            var age = parseInt(data.cookie.maxAge / 1000) || DEFAULT_AGE;
            var session = JSON.stringify(data);
            this.client.set(this._getKey(key), session, age, callback);
        } catch(e) {
            callback(e);
        }
    };

    MemcachedStore.prototype.destroy = function(key, callback) {
        if(undefined === callback) callback = emptyFunc;
        this.client.del(this._getKey(key), callback);
    };

    MemcachedStore.prototype.length = function(callback) {
        if(undefined === callback) callback = emptyFunc;
        this.client.items(callback);
    };

    MemcachedStore.prototype.clear = function(callback) {
        if(undefined === callback) callback = emptyFunc;
        this.client.flush(callback);
    };

    return MemcachedStore;
};
