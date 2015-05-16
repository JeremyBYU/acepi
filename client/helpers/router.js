/* ---------------------------------------------------- +/

## Client Router ##

Client-side Router.

/+ ---------------------------------------------------- */

// Config

Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'notFound',
});

// Filters

var filters = {

    myFilter: function() {
        // do something
    },

    isLoggedIn: function() {
        if (!(Meteor.loggingIn() || Meteor.user())) {
            alert('Please Log In First.')
            this.stop();
        } else {
            this.next();
        }
    }

}

Router.onBeforeAction(filters.isLoggedIn, {
    only: ['items']
});

// Routes

Router.map(function() {

    // Items

    this.route('items', {
        waitOn: function() {
            return Meteor.subscribe('allItems');
        },
        data: function() {
            return {
                items: Items.find()
            }
        }
    });

    this.route('item', {
        path: '/items/:_id',
        waitOn: function() {
            return Meteor.subscribe('singleItem', this.params._id);
        },
        data: function() {
            return {
                item: Items.findOne(this.params._id)
            }
        }
    });
    //main ace template
    this.route('ace', {
        path: 'ace',

    });

    /*  //Tags - Used for configuration for Modbus Tags
      this.route('tags/:_id', function() {
          //console.log(this.params._id);
          //subscription to just a single Tags, param comes from url
          this.wait(Meteor.subscribe('singleTag', this.params._id));
          //subscription to all the tags.
          this.wait(Meteor.subscribe('allTags'));
          //this is the layout, one main yield region and one 'tag' region
          this.layout('tagsLayout', {
              data: function() {
                  return {
                      tags: Tags.find()
                  };

              }
          });
          //check to see if subscription is complete
          if (this.ready()) {
              //render tagList template to the main yield region
              this.render('tagList');

              //render tag template to the tag region with the specified data context (single tag)
              this.render('tag', {
                  to: 'tag',
                  data: function() {
                      //console.log(this.params._id);
                      //console.log(Tags.findOne(this.params._id));
                      return Tags.findOne(this.params._id);
                  }
              });
          } else {
              this.render('loading');
          }



      });*/

    this.route('tags', {
        path: 'tags',
        template: 'tagList',        
        waitOn: function() {
            return Meteor.subscribe('allTags');
        },
        data: function() {
            //console.log(this.params._id);


           return { tags: Tags.find()};

            //console.log(temp.tags);
            //console.log(temp.tag);

        },
        onBeforeAction: function () {
            Session.setDefault('selectedTag', {_id:'NaN'});
            this.next();
        }
       

    });


    /*    this.route('tags', {
            path: 'tags/:_id',
            template: 'tagList',
            layoutTemplate: 'tagsLayout',
            yieldTemplates:{
                'tag': {to: 'tag'}

            },
            waitOn: function() {
                return [
                        Meteor.subscribe('singleTag',this.params._id),
                        Meteor.subscribe('allTags')];

            },
            data: function() {
                //console.log(this.params._id);
                         
                    
                    tags: Tags.find()
                }
                //console.log(temp.tags);
                //console.log(temp.tag);
                return temp;
            },
            notFoundTemplate: 'notFound'

        });*/

    // Pages

    this.route('homepage', {
        path: '/'
    });

    this.route('content');

    // Users

    this.route('login');

    this.route('signup');

    this.route('forgot');

});
