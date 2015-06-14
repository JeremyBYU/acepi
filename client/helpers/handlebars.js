/* ---------------------------------------------------- +/

## Handlebars Helpers ##

Custom Handlebars helpers.

/+ ---------------------------------------------------- */
//Simple function to set Session variable determining if logged in
Meteor.autorun(function() {
    if(!(!!Meteor.userId() == Session.get("meteor_loggedin"))){
        Session.set("meteor_loggedin", !!Meteor.userId());

    }
});
//Simple Helper to get Session Variables
Handlebars.registerHelper('myHelper', function(myArgument){
  return "Hello, " + myArgument;
});
Handlebars.registerHelper('session', function(input){
    return Session.get(input);

});

clearForm = function() {
    //Clear the selected Tag
    Session.set('selectedTag', {
            _id: 'NaN'
        })
    //Clear the creating new Tag session variable
    //Session.set('newTag', false);

    //reset the form, need to add 100ms delay because it resets to early
    setTimeout(function() {
        AutoForm.resetForm('TagForm');
    }, 100);


};
