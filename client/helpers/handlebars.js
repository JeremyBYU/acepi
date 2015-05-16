/* ---------------------------------------------------- +/

## Handlebars Helpers ##

Custom Handlebars helpers.

/+ ---------------------------------------------------- */

Handlebars.registerHelper('myHelper', function(myArgument){
  return "Hello, " + myArgument;
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
