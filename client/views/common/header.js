

Template.header.rendered = function() {
  $('.ui.sidebar').sidebar('attach events', '.menu .item', 'slide out');
  //console.log("Rendered Header Again!")
};

Template.header.helpers({
  messages: function () {
    return Messages.find();
  },
  isLoggedIn: function () {
    return !!Meteor.user();
  }
});

Template.header.events({
  'click .log-out': function () {
    Meteor.logout();
  }
});