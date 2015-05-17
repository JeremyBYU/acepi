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

        },
        insertTag: function(doc){
        	//console.log(doc);
        	var userID = Meteor.userId();
        	Tags.insert(doc);

        },
        updateTag: function(modifier,doc_id){
    		//console.log(doc_id);
    		//console.log(modifier);
        	Tags.update(doc_id,modifier);


        },
        removeMarkedTags: function(){
            Tags.remove({markDelete: true})


        }
    });   



}
