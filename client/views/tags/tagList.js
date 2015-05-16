Template.tagList.rendered = function() {
    //console.log('Here is my data in the tagList rendered view ');
    //console.log(this.data);
    $('.sortable.table').tablesort();
    $('.ui.checkbox')
        .checkbox();
}


Template.tagList.helpers({
	selectedTag: function(){
		//console.log('Am i being read?');
		//console.log(Tags.findOne({_id: 'tyApf5B5WBTirB48J'}));
		return Tags.findOne({_id: 'tyApf5B5WBTirB48J'});
	}


});