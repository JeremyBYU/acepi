mytag = 1;
/*
This file hold all information for tag configuration.  Alarming should be placed elseware. 


===Fields===
Tag - String
description - String (null)
param1 - String 
param1_table - String (specific type)
param1_address - (number)
param2 - String 
param2_table - String (specific type)
param2_address - (number)
param3 - String 
param3_table - String (specific type)
param3_address - (number)


*/
Tags = new Meteor.Collection("tags");


Tags.allow({
    insert: function(userId, doc) {
        //return can.createItem(userId);
        return true;
    },
    update: function(userId, doc, fieldNames, modifier) {

        return true;
        //return can.editItem(userId, doc);
    },
    remove: function(userId, doc) {
        return true;
        //return can.removeItem(userId, doc);
    }
});

// Methods
/*if (Meteor.isServer) {
    Meteor.methods({
        createTag: function(item) {
            if (can.createItem(Meteor.user()))
                Items.insert(item);
        },
        removeTag: function(item) {
            if (can.removeItem(Meteor.user(), item)) {
                Items.remove(item._id);
            } else {
                throw new Meteor.Error(403, 'You do not have the rights to delete this item.')
            }
        }
    });

}*/

Schemas.Tag = new SimpleSchema({
    tag: {
        type: String,
        label: "Tag",
        max: 20
    },
    description: {
        type: String,
        label: "Description",
        defaultValue: "",
        max: 40
    },
    params: {
        type: Array,
        label: "Parameter",
        optional: false,
        minCount: 1,
        maxCount: 5
    },
    "params.$": {
        type: Object,
        optional: false
    },
    "params.$.name": {
        type: String
    },
    "params.$.table": {
        type: String,
        label: "Address Table",
        allowedValues: [
            "Coil",
            "Holding Register"
        ]
    },
    "params.$.address": {
        type: Number,
        label: "Address",
        min: 0,
        max: 10000
    },   
    markDelete: {
        type: Boolean,
        label: 'Delete',
        defaultValue : false
    }
});

Tags.attachSchema(Schemas.Tag);
