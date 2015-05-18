x = 1;

configureModbusCollections = function() {
    Read_Coils.remove({});
    configureModbusCoilCollections();




};
configureModbusCoilCollections = function() {
    //Get a list of all coils (neeed address, tag_id, tag_param)
    var allCoils = Tags.find({
        "params.table": "Coil"
    }, {
        fields: {
            'tag': 1,
            'params': 1
        }
    }).fetch();


    //New array just containg the coils and their addess.
    var cleanCoils = new Array();
    _.each(allCoils, function(tag) {
        //console.log(tag);
        _.each(tag.params, function(param) {
            if (param.table == "Coil") {
                var tag_param = tag.tag + '_' + param.name;
                var new_coil = {
                    tagid: tag._id,
                    tag_param: tag_param,
                    address: param.address
                };
                cleanCoils.push(new_coil);
            }

        });
    });
    console.log(cleanCoils);
    for (i = 0; i < 2 && cleanCoils.length > 0; i++) {
        var low_tag = _.min(cleanCoils, function(tag) {
            //console.log(cleanCoils.address);
            return tag.address;
        });

        var low_address = low_tag.address;
        var next_range = low_address + connection.modbus.coilReadLength;
        console.log('next Range' + next_range);

        var group = _.groupBy(cleanCoils, function(tag) {
            //console.log(tag.address);
            return tag.address <= next_range;
        });
      
        trueGroup = group.true;
        cleanCoils = group.false || [];

        console.log('Less Than ',trueGroup);
        console.log('Not less than',cleanCoils);
        

        Read_Coils.insert({
            groupNum: i,
            startAddress: low_address,
            endAddress: next_range,
            tags: trueGroup,
            active: true
        });

    }





    /*//console.log(allCoils);
    Read_Coils.insert({
        groupNum: 1,
        startAddress: 1,
        endAddress: 100,
        active: true
    });*/

}

//This function will write coils and handle error messages
writeServerCoils = function(coil_address, states) {
    t2 = master.writeMultipleCoils(coil_address, states, {
        unit: 1,
        maxRetries: 10,
        timeout: 1000,
        //interval: 3000,
        onComplete: function(err, response) {
            //console.log(states);
            if (err) {
                console.err(err.message);
                console.err('I make the error here!');
            } else {

                console.log(response);
                //console.log(response.exceptionCode);                

                //console.log(response.values.readUInt16BE(0));
            }


        }
    });
    //console.log(t2);
};
