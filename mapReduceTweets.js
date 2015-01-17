var checkReply = function(x) {
  if(typeof x == "undefined" || x == "NaN") {
    return 0
  } else {
    return 1
  }
}

var mapFunc = function() {
	var start_date = new Date(2014, 9, 1);
	var end_date = new Date(2014, 11, 30);
  var mep = this;
  if(this.tweets.length > 0) {
    this.tweets.forEach(function(i) {
  	  _tweet = db.tweet.findOne({_id: i, tweeted_at: {"$gte": start_date, "$lte": end_date}});
      if(_tweet) {
        emit({
            name: mep.name,
            twitter_handle: mep.twitter_handle,
            twitter_birthday: mep.twitter_birthday,
            gender: mep.male,
            european_party: mep.european_party,
            domestic_party: mep.domestic_party,
            nationality: mep.nationality,
            born: mep.born,
        },
        {
          tweets: 1,
          retweets: _tweet.retweet_count,
          favorites: _tweet.favorite_count,
          in_reply_to_screen_name: checkReply(_tweet.in_reply_to_screen_name),
          in_reply_to_status_id: checkReply(_tweet.in_reply_to_status_id),
          
        }
          );
      }
	  })
  } else {
    emit("test");
  }
}

// Testing function
var emit = function(key, value) {
	print(key.name + " " + value.retweets + " " + value.tweets + " " + value.in_reply_to_screen_name, + " " + value.in_reply_to_status_id);
}

var reduceFunc = function(key, values) {

}