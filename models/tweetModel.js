'use strict';

var config = require('../config/kickstarter'),
    mongoose = require('mongoose');


var Schema, ObjectId, tweetSchema, tweetModel;

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

tweetSchema = new Schema({
  uid: ObjectId,
  timestamp: { type: Date, default: Date.now },
  created_at: String,
  tweet_id: Number,
  text: String,
  source: String,
  user_name: String,
  user_handle: String,
  location: String,
  user_description: String,
  followers_count: Number,
  friends_count: Number,
  time_zone: String,
  geo_enabled: Boolean,
  retweet_count: Number,
  favorite_count: Number,
  hashtags: Array,
  trends: Array,
  urls: Array,
  user_mentions: Array,
  //data: Object
});

tweetModel = mongoose.model(config.modelName, tweetSchema);


module.exports = tweetModel;
