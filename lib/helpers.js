/* ---------------------------------------------------- +/

## Helpers ##

Functions that need to be available both on the server and client. 

/+ ---------------------------------------------------- */

//
if (Meteor.isServer) {
    Meteor.methods({
        writeCoils: function(address, states) {
            if (can.createItem(Meteor.user())) {
              writeServerCoils(address,states);
              //test('blah');

            }

        }
    });



}
