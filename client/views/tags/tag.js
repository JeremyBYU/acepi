Template.tag.rendered = function() {
    //console.log('Here is my data in the tag rendered view ');
    //console.log(this.data);
}

Template.tag.helpers({
	selectedTag: function(){
		console.log('Am i being read?');
		console.log(Tags.findOne({_id: 'tyApf5B5WBTirB48J'}));
		return Tags.findOne({_id: 'tyApf5B5WBTirB48J'});
	}


});
