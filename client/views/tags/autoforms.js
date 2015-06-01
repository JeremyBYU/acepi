Template.afObjectField_customRemoval.helpers({
    getAddress: function() {

        return this.name + '.address';

    },
    getTable: function() {

        return this.name + '.table';

    },
    getName: function() {

        return this.name + '.name';

    },
    getDataType: function() {

        return this.name + '.dataType';

    }


});

Template.quickForm_custom.helpers({
  quickFieldsAtts: function () {
    // These are the quickForm attributes that we want to forward to
    // the afQuickFields component.
    return _.pick(this.atts, "id-prefix");
  },
  submitButtonAtts: function bsQuickFormSubmitButtonAtts() {
    var qfAtts = this.atts;
    var atts = {};

    if (typeof qfAtts.buttonClasses === "string") {
      atts["class"] = qfAtts.buttonClasses;
    } else {
      atts["class"] = "ui blue submit button";
    }

    return atts;
  },
  qfAutoFormContext: function() {
    var ctx = _.clone(this.qfAutoFormContext || {});

    ctx = AutoForm.Utility.addClass(ctx, "ui form");

    delete ctx["id-prefix"];

    return ctx;
  }
});
