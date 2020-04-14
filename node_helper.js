/* Magic Mirror
 * Module: MMM-DumbAssCatFacts
 *
 * By Mykle1
 *
 */
const NodeHelper = require('node_helper');
const request = require('request');
var unirest = require("unirest");

module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },


    getFacts: function(url) {
        var self = this;
        var req = unirest("GET", "https://brianiswu-cat-facts-v1.p.rapidapi.com/facts");

        req.headers({
            "x-rapidapi-host": "brianiswu-cat-facts-v1.p.rapidapi.com",
            "x-rapidapi-key": this.config.apiKey
        });
        req.end(function(res) {
            if (res.error) throw new Error(res.error);
            //    var result = JSON.parse(res); res is already parsed. Parsing again errors.
            // https://stackoverflow.com/questions/15617164/parsing-json-giving-unexpected-token-o-error
            self.sendSocketNotification("FACTS_RESULT", res);
            // console.log(res.body);
        });
    },


    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_FACTS') {
            this.getFacts(payload);
        }
        if (notification === 'CONFIG') {
            this.config = payload;
        }
    }
});
