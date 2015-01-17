# ---- rmongo ----
library(rmongodb)

host <- "research.jmu.rocks"
username <- "public"
password <- "public"
db <- "eu_miner"

mongo <- mongo.create(host=host, db=db, username=username, password=password)
collection <- "eu_miner.reduced"

# Initialize empty vectors
name <- c()
twitter_handle <- c()
twitter_birthday <- c()
gender <- c()
european_party <- c()
nationality <- c()
born <- c()
tweets <- c()
retweets <- c()
name_replies <- c()
status_replies <- c()
favorites <- c()

cur <- mongo.find(mongo, collection)
# Initerate through each entry in the cursor and append values to the vectors.
# This is done to format the data neatly into a data frame
# TODO: See if this can be done with the built in function. Main issue is unwinding the _id field.
while (mongo.cursor.next(cur)) {
  val <- mongo.bson.to.list(mongo.cursor.value(cur))
  tweets <- c(tweets, val[["total_tweets"]])
  retweets <- c(retweets, val[["total_retweets"]])
  name_replies <- c(name_replies, val[["total_screen_name_replies"]])
  status_replies <- c(status_replies, val[["total_status_id_replies"]])
  favorites <- c(favorites, val[["total_favorites"]])
  for (i in val["_id"]) {
    name <- c(name, i[["name"]])
    twitter_handle <- c(twitter_handle, i[["twitter_handle"]])
    twitter_birthday <- c(twitter_birthday, i[["twitter_birthday"]])
    gender <- c(gender, i[["gender"]])
    european_party <- c(european_party, i[["european_party"]])
    nationality <- c(nationality, i[["nationality"]])
    born <- c(born, i[["born"]])
  }
}
df <- data.frame(name, twitter_handle, twitter_birthday, gender, european_party, nationality, born, tweets, retweets, name_replies, status_replies, favorites)