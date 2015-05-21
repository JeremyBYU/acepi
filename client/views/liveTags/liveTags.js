Template.liveTags.helpers({
    onlyTag: function() {
        //console.log('Am i being read?');
        //console.log(Tags.findOne({_id: 'tyApf5B5WBTirB48J'}));
        console.log('My tag is: ', this.tag_param);
        myTag = this.tag_param.split('_');
        return myTag[0];    

    },
    onlyParam: function() {
        //console.log('Am i being read?');
        //console.log(Tags.findOne({_id: 'tyApf5B5WBTirB48J'}));
        console.log('My tag is: ', this.tag_param);
        myParam = this.tag_param.split('_');
        return myParam[1];    

    }
});