'use strict';


var tweetModel = require('../models/tweetModel'),
    config = require('../config/kickstarter'),
    Twitter = require('node-tweet-stream'),
    mongoose = require('mongoose'),
    fs = require('fs');


var twitter, numTweets, numErrs, numDiscons, logStream, errStream, disStream;


// initialize streaming api
twitter = new Twitter(config.twitter_credentials);

// start streaming kickstarter related tweets
twitter.track(config.keyword);

// log files
logStream = fs.createWriteStream(config.logs.tweets, { flags: 'a', encoding: null, mode: '0666' });
errStream = fs.createWriteStream(config.logs.errors, { flags: 'a', encoding: null, mode: '0666' });
disStream = fs.createWriteStream(config.logs.disconnect, { flags: 'a', encoding: null, mode: '0666' });

// initialize mongo
mongoose.connect('mongodb://localhost/' + config.modelName);

// initialize counters
numTweets = numErrs = numDiscons = 0;


// tweet received from streaming api
twitter.on('tweet', function onTweet (tweet) {
  var out, data;

  out = '[' + ++numTweets + '] tweet received ' + tweet.text;

  // log tweet
  console.log(out);
  logStream.write(out + '\n');

  // construct new db entry
  data = {
    created_at: tweet.created_at,
    tweet_id: tweet.id,
    text: tweet.text,
    source: tweet.source,
    user_id: tweet.user.id,
    user_name: tweet.user.name,
    user_handle: tweet.user.screen_name,
    location: tweet.user.location,
    user_description: tweet.user.description,
    followers_count: tweet.user.followers_count,
    friends_count: tweet.user.friends_count,
    time_zone: tweet.user.time_zone,
    geo_enabled: tweet.user.geo_enabled,
    retweet_count: tweet.retweet_count,
    favorite_count: tweet.favorite_count,
    hashtags: tweet.entities.hashtags,
    trends: tweet.entities.trends,
    urls: tweet.entities.urls,
    user_mentions: tweet.entities.user_mentions
  };

  // save to data store
  new tweetModel(data).save();
});


// error handler
twitter.on('error', function onError (err) {
  var out;

  out = '[' + ++numErrs + '] ' + err.toString() + '\n';

  errStream.write(out);
});


// disconnect handler
twitter.on('disconnect', function onDisconnect () {
  var out;

  out = '[' + ++numDiscons + '] ' + new Date() + '\n';

  disStream.write(out);
});
