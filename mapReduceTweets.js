var checkReply = function(x) {
  if(typeof x == "undefined" || x == "NaN") {
    return 0;
  } else {
    return 1;
  }
};

if (typeof String.prototype.startsWith != 'function') {
  // see below for better implementation!
  String.prototype.startsWith = function (str){
    return this.indexOf(str) === 0;
  };
}

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};

// db object is not available in MapReduce anymore since version 2.4 of MongoDB.
// To get around this, we'll have to stage a new collection that joins the collections.
// WARNING: This functions takes a while to complete
// To test count of MEPs in staging: db.staging.aggregate({$group: {_id: "$name"} }, {$group: {_id: 1, count: {$sum: 1} } })
var stageFunc = function(meps) {
  var used_meps = [];
	var start_date = ISODate("2014-09-01T00:00:00.00.000Z");
	var end_date = ISODate("2014-11-30T00:00:00.000Z");
	var no_tweets_found = 0;
	var no_tweets_date_rage = 0;
	var tweets_found = 0;
	var count = 0;
  meps.forEach(function(mep) {
    count += 1;
    if(mep.tweets.length > 0) {
      used_meps.push(mep.name);
      var valid_tweets = 0;
      tweets_found += 1;
      mep.tweets.forEach(function(i) {
    	  _tweet = db.tweet.findOne({_id: i, tweeted_at: {"$gte": start_date, "$lte": end_date}});
        var uncodeable = 0;
        var non_native_lang = 0;
        var native_lang = 0;
        var retweet = 0;
        if(_tweet) {
          valid_tweets += 1;
          if(_tweet.text.startsWith('RT')) {
            retweet = 1;
          }
          db.staging.insert({
              name: mep.name,
              native_lang: mep.native_lang,
              twitter_handle: mep.twitter_handle,
              twitter_birthday: mep.twitter_birthday,
              gender: mep.gender,
              european_party: mep.european_party,
              domestic_party: mep.domestic_party,
              nationality: mep.nationality,
              born: mep.born,
              tweets: 1,
              favorites: _tweet.favorite_count,
              in_reply_to_screen_name: checkReply(_tweet.in_reply_to_screen_name),
              in_reply_to_status_id: checkReply(_tweet.in_reply_to_status_id),
              text: _tweet.text,
              tweet_id: _tweet._id,
              retweet: retweet,
          }
            );
        }
  	  });
      if(valid_tweets === 0) {
          no_tweets_date_rage += 1;
          used_meps.push(mep.name);
              db.staging.insert({
              name: mep.name,
              native_lang: mep.native_lang,
              twitter_handle: mep.twitter_handle,
              twitter_birthday: mep.twitter_birthday,
              gender: mep.gender,
              european_party: mep.european_party,
              domestic_party: mep.domestic_party,
              nationality: mep.nationality,
              born: mep.born,
              tweets: 0,
              favorites: 0,
              in_reply_to_screen_name: 0,
              in_reply_to_status_id: 0,
              retweet: 0,
          }
        );
      }
    } else {
      used_meps.push(mep.name);
      no_tweets_found += 1;
      db.staging.insert({
              name: mep.name,
              native_lang: mep.native_lang,
              twitter_handle: mep.twitter_handle,
              twitter_birthday: mep.twitter_birthday,
              gender: mep.gender,
              european_party: mep.european_party,
              domestic_party: mep.domestic_party,
              nationality: mep.nationality,
              born: mep.born,
              tweets: 0,
              favorites: 0,
              in_reply_to_screen_name: 0,
              in_reply_to_status_id: 0,
              retweet: 0,
          }
        );
    }
if(!mep.name in used_meps) {
  print(mep.name);
}
if(mep.name in used_meps) {
  print(mep.name);
}
});
print(tweets_found);
print(no_tweets_date_rage);
print(no_tweets_found);
print(count);
}

db.staging.aggregate({
  $group: {_id: {
    name: "$name",
    twitter_handle: "$twitter_handle",
    twitter_birthday: "$twitter_birthday",
    gender: "$gender",
    european_party: "$european_party",
    domestic_party: "$domesitc_party",
    nationality: "$nationality",
    born: "$born",
    native_lang: "$native_lang"
    },
  total_tweets: {$sum: "$tweets"},
  total_retweets: {$sum: "$retweet"},
  total_screen_name_replies: {$sum: "$in_reply_to_screen_name"},
  total_status_id_replies: {$sum: "$in_reply_to_status_id"},
  total_favorites: {$sum: "$favorites"},
  }
}, 
{
  $out: "reduced"
}
);
