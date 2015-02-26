var checkReply = function(x) {
  if(typeof x == "undefined" || x == "NaN") {
    return 0
  } else {
    return 1
  }
}

// db object is not available in MapReduce anymore since version 2.4 of MongoDB.
// To get around this, we'll have to stage a new collection that joins the collections.
// WARNING: This functions takes a while to complete
// To test count of MEPs in staging: db.staging.aggregate({$group: {_id: "$name"} }, {$group: {_id: 1, count: {$sum: 1} } })
var stageFunc = function(meps) {
	var start_date = ISODate("2014-09-01T00:00:00.00.000Z");
	var end_date = ISODate("2014-11-30T00:00:00.000Z");
  meps.forEach(function(mep) {
    if(mep.tweets.length > 0) {
      var valid_tweets = 0;
      mep.tweets.forEach(function(i) {
    	  _tweet = db.tweet.findOne({_id: i, tweeted_at: {"$gte": start_date, "$lte": end_date}});
        var uncodeable = 0;
        var non_native_lang = 0;
        var native_lang = 0;
        if(_tweet) {
          valid_tweets += 1;
          if (_tweet.lang == "Uncodable") {
            uncodeable = 1;
          }
          else if(mep.native_lang == _tweet.lang) {
            native_lang = 1;
          }
          else {
            non_native_lang = 1;
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
              retweets: _tweet.retweet_count,
              favorites: _tweet.favorite_count,
              in_reply_to_screen_name: checkReply(_tweet.in_reply_to_screen_name),
              in_reply_to_status_id: checkReply(_tweet.in_reply_to_status_id),
              text: _tweet.text,
              tweet_id: _tweet._id,
              native_lang_tweet: native_lang,
              non_native_lang: non_native_lang,
          }
            );
        }
  	  })
      if(valid_tweets == 0) {
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
              retweets: 0,
              favorites: 0,
              in_reply_to_screen_name: 0,
              in_reply_to_status_id: 0,
              native_lang_tweet: 0,
              non_native_lang: 0,
            
          }
        );
      }
    } else {
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
              retweets: 0,
              favorites: 0,
              in_reply_to_screen_name: 0,
              in_reply_to_status_id: 0,
              native_lang_tweet: 0,
              non_native_lang: 0,            
          }
        );
    }
})
}

var mapFunc = function() {
  emit({
      name: this.name,
      twitter_handle: this.twitter_handle,
      twitter_birthday: this.twitter_birthday,
      gender: this.male,
      european_party: this.european_party,
      domestic_party: this.domestic_party,
      nationality: this.nationality,
      born: this.born,
      navtive_lang: this.native_lang,
  }, 
  {
    tweets: this.tweets,
    favorites: this.favorites,
    retweets: this.retweets,
    in_reply_to_screen_name: this.in_reply_to_screen_name,
    in_reply_to_status_id: this.in_reply_to_status_id
  }
    )
}

// TODO: Clean this up so I don't repeat all the values
var reduceFunc = function(key, values) {
  var total_tweets = 0;
  var total_retweets = 0;
  var total_screen_name_replies = 0;
  var total_status_replies = 0;
  var total_favorites = 0;
  print(key.name);
  values.forEach(function(value) {
    total_tweets += value["tweets"]
    total_retweets += value["retweets"]
    total_screen_name_replies += value["in_reply_to_screen_name"]
    total_status_replies += value["in_reply_to_status_id"]
    total_favorites += value["favorites"]
  })
  return {
    total_tweets: total_tweets,
    total_retweets: total_retweets,
    total_screen_name_replies: total_screen_name_replies,
    total_status_replies: total_status_replies,
    total_favorites: total_favorites
  }
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
  total_retweets: {$sum: "$retweets"},
  total_screen_name_replies: {$sum: "$in_reply_to_screen_name"},
  total_status_id_replies: {$sum: "$in_reply_to_status_id"},
  total_favorites: {$sum: "$favorites"},
  total_native: {$sum: "$native_lang_tweet"},
  total_non_native: {$sum: "$non_native_lang"}
  }
}, 
{
  $out: "reduced"
}
)
