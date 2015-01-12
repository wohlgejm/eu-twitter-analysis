/*
db.mep.aggregate([
  {$unwind: "$tweets"},
	{$project: {
	_id: {
		name: "$name",
		gender: "$gender",
		tweet: db.tweet.findOne({_id: "$tweets"})
		}
	},
	{$limit: 10},
],
{allowDiskUse: true}
)
*/

var mapFunc = function() {
	var start_date = new Date(2014, 9, 1);
	var end_date = new Date(2014, 11, 30);
	this.tweets.forEach(function(i) {
		emit(this.name, {db.tweet.findOne({_id: i, tweeted_at: {"$gte": start_date, "$lte": end_date}})});
	})
}

var emit = function(key, value) {
	print(key + value);
}

var reduceFunc = function(key, values) {

}