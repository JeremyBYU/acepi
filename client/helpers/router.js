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



    //route to show the tag list
    this.route('tags', {
        path: 'tags',
        template: 'tagOverview',
        waitOn: function() {
            return Meteor.subscribe('allTags');
        },
        data: function() {

            return {
                tags: Tags.find()
            };

        },
        onBeforeAction: function() {
            Session.setDefault('selectedTag', {
                _id: 'NaN'
            });
            Session.setDefault('newTag', false);
            this.next();
        }
    });
    //Route to create new Tags, used for mobile
    this.route('tag_new', {
        path: '/tags/new',
        template: 'tagNew',
        waitOn: function() {
            return Meteor.subscribe('allTags');
        },
        data: function() {

            return {
                tags: Tags.find()
            };

        }
    });
    //Route to edit Tags, used for mobile
    this.route('tag', {
        path: '/tags/:_id',
        template: 'tag',
        waitOn: function() {
            return Meteor.subscribe('singleTag', this.params._id);
        },
        data: function() {
            return Tags.findOne(this.params._id);

        }
    });
    //Page that will show all Live Data
    this.route('liveTags', {
        path: '/liveTags',
        template: 'liveTags',
        waitOn: function() {
            return Meteor.subscribe('allLiveTags');
        },
        data: function() {

            return {
                liveTags: LiveTags.find()
            };

        },
        onBeforeAction: function() {
            this.next();
        }
    });


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
