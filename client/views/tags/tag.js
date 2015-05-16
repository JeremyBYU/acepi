Template.tag.rendered = function() {
    console.log('Here is my data in the tag rendered view ');
    console.log(this.data);
}

Template.tag.events({
    'click .back': function(event, template) { 
    	//Selecting a row to edit   
    	//console.log(event.target);    
    	Router.go('tags');
    }
});

Template.tagNew.events({
    'click .back': function(event, template) { 
    	//Selecting a row to edit   
    	//console.log(event.target);    
    	Router.go('tags');
    }
});