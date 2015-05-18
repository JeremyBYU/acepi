//Helper Function to initialize delete checkbox state on startup

initializeCheckboxes = function(dataContext) {
    $('.ui.checkbox')
        .checkbox();
    //console.log(dataContext.tags.fetch());
    //get allthe marked for delete tags
    var markedTags = _.filter(dataContext.tags.fetch(), function(tag) {
        return tag.markDelete === true;
    });
    //console.log(markedTags);
    //check all the marked for delete tags.
    _.each(markedTags,function(tag){
        var checkboxID = 'check_' + tag.tag;  
        $('.ui .checkbox#' + checkboxID).checkbox('check');
    });
};


//Called when the document is initially rendred.
Template.tagOverview.rendered = function() {
    //console.log('Here is my data in the tagOverview rendered view ');
    //console.log(this.data);
    //$('.sortable.table').tablesort();
    initializeCheckboxes(this.data);

}

Template.tagOverview.helpers({
    selectedTag: function() {
        //console.log('Am i being read?');
        //console.log(Tags.findOne({_id: 'tyApf5B5WBTirB48J'}));
        myTag = Session.get("selectedTag");
        if (myTag._id == 'NaN') {
            return "";
        } else
            return myTag;
        /*return Tags.findOne({
            _id: 'tyApf5B5WBTirB48J'
        });*/
    },
    creatingNewTag: function() {
        if (Session.get("newTag")) {
            return true;

        } else {
            return false;
        }
    }
});


Template.tagOverview.events({
    'click .back': function(event, template) {
        //console.log(this);
        Session.set('newTag', false);
        clearForm();

    }

});


Template.tagTable.events({
    'click tbody tr .selectable': function(event, template) {
        //Selecting a row to edit       
        Session.set("selectedTag", this);
    },
    'click tr .toAdd': function(event, template) {
        event.preventDefault();
        //console.log('clicked add');
        if (Meteor.Device.isDesktop()) {
            Session.set('newTag', true);
            clearForm();
            return false;
        } else {
            Router.go('tag_new')
        }


    },
    'click tr .delete': function(event, template) {
        event.preventDefault();
        console.log('clicked delete');
        Meteor.call('removeMarkedTags');
        return false;
    },
    'click .checkbox': function(event, template) {
        //console.log('clicked checkbox');
        //console.log(this);
        var newMark = !this.markDelete
        Tags.update(this._id, {
            $set: {
                markDelete: newMark
            }
        });


    }
});


Template.tagTable.helpers({
    selectedTag: function() {
        //console.log('Am i being read?');
        //console.log(Tags.findOne({_id: 'tyApf5B5WBTirB48J'}));
        myTag = Session.get("selectedTag");
        if (myTag._id == 'NaN') {
            return "";
        } else
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


    },
    creatingNewTag: function() {
        if (Session.get("newTag")) {
            return true;

        } else {
            return false;
        }


    },
    deleteChecked: function() {
        //console.log(this.markDelete);
        //console.log(this.tag);
        var checkboxID = 'check_' + this.tag;
        if (this.markDelete) {
            $('.ui .checkbox#' + checkboxID).checkbox('check');
            return true;
        } else {
            $('.ui .checkbox#' + checkboxID).checkbox('uncheck');
            return false;

        }
    }


});
