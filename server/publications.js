/* ---------------------------------------------------- +/

## Publications ##

All publications-related code. 

/+ ---------------------------------------------------- */

// Publish all items

Meteor.publish('allItems', function() {
  return Items.find();
});

// Publish a single item

Meteor.publish('singleItem', function(id) {
  return Items.find(id);
});

// Publish all Tags
Meteor.publish('allTags', function() {
  return Tags.find();
});

// Publish a single Tag
Meteor.publish('singleTag', function(id) {
  return Tags.find(id);
});

// Publish all LiveTags
Meteor.publish('allLiveTags', function() {
  return LiveTags.find();
});

// Publish a single LiveTag
Meteor.publish('singleLiveTag', function(id) {
  return LiveTags.find(id);
});