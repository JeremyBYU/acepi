x = 1;
Template.ace.rendered = function() {
    $('.ui.checkbox')
        .checkbox();
}

Template.ace.events({

    // 'click .log-out': function () {
    //   Meteor.logout();
    // }
    "change .ui.checkbox input": function(event) {

        console.log("Attempting to toggle " + event.target.name);
        states = [true];
        if (event.target.checked != true) {
            states = [false];
        }
        if (event.target.name == 'coil1') {
            Meteor.call('writeCoils', 0, states);

        } else {

            Meteor.call('writeCoils', 1, states);
        }
        //Session.set("hideCompleted", event.target.checked);
    }
})
