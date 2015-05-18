Read_Coils = new Meteor.Collection("read_coils");

//Create Blank Shema Object
Schemas = {};

Schemas.Read_Coils = new SimpleSchema({
    groupNum: {
        type: Number,
        label: "Group #"
    },   
    startAddress: {
        type: Number,
        label: "Start Address"
    },
    endAddress: {
        type: Number,
        label: "Start Address"
    },
    tags: {
        type: Array,
        label: "Tags",
        optional: true,       
    },
    "tags.$": {
        type: Object,
        optional: true
    },
    "tags.$.tagid": {
        type: String
    },
    "tags.$.tag_param": {
        type: String,
        label: "Tag.Parameter"        
    },
    "tags.$.address": {
        type: Number,
        label: "Address"
    },   
    active: {
        type: Boolean,
        label: 'Active',
        defaultValue : true
    }
});

Read_Coils.attachSchema(Schemas.Read_Coils);