Template.tag.events({
    'click .back': function(event, template) { 
    	Router.go('tags');
    }
});

Template.tagNew.events({
    'click .back': function(event, template) {
    	Router.go('tags');
    }
});