Template.tagList.rendered = function() {
    //console.log('Here is my data in the tagList rendered view ');
    //console.log(this.data);
    $('.sortable.table').tablesort();
    $('.ui.checkbox')
        .checkbox();

}


Template.tagList.helpers({
    selectedTag: function() {
        //console.log('Am i being read?');
        //console.log(Tags.findOne({_id: 'tyApf5B5WBTirB48J'}));
        myTag = Session.get("selectedTag");
        if(myTag._id == 'NaN'){
        	return "";
        }
        else
        	return myTag;
        /*return Tags.findOne({
            _id: 'tyApf5B5WBTirB48J'
        });*/
    },
    isSelected: function(tag_id) {
        if (Session.get("selectedTag")._id == tag_id) {

            return true;
        } else {
            return false;
        }


    }


});

Template.tagList.events({
    'click tr': function(event, template) {
        //console.log(this);
        Session.set("selectedTag", this);


    },
    'click tr .toEdit': function(event, template) {
        event.preventDefault();
        console.log('clicked add');


        return false;

    },
    'click tr .delete': function(event, template) {
        event.preventDefault();
        console.log('clicked delete');
        return false;

    }
});
