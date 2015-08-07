/*
This file is used to capture all functions and interactions of the modbus slave device
In addition it holds functions that will initialize Mongo collections used for its scanning


*/

/*
Purpose: This will create a replica "live" collection of the Tags collection

*/
configureLiveTagCollection = function() {
    var allTags = Tags.find({}, {
        fields: {
            'tag': 1,
            'description': 1,
            'params': 1
        }
    }).fetch();

    _.each(allTags, function(tag) {
        _.each(tag.params, function(param) {
            var tag_param = tag.tag + '_' + param.name;
            var new_livetag = {
                tagid: tag._id,
                tag_param: tag_param,
                description: tag.description,
                value: 0
            };
            LiveTags.insert(new_livetag);
        });
    });
};
/*
Purpose: This will configure all the Modbus Collections
LiveTags = Replica of Tags but with updated Values
ScanGroups = Collection containing scanning groups of Coil Read
Read_HR = Collection of scanning groups of Holding Register Reads

*/
configureModbusCollections = function() {
    //Clear the Live Tag Collection
    LiveTags.remove({});
    configureLiveTagCollection();

    //Clear the Scan Group Collection
    ScanGroups.remove({});

    configureModbusCoilCollections();


    //TODO  Read_HR.remove({});
    configureModbusHoldingRegisterCollections();
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
    //console.log(cleanCoils);
    for (i = 0; i < connection.modbus.maxCoilGroups && cleanCoils.length > 0; i++) {
        var low_tag = _.min(cleanCoils, function(tag) {
            //console.log(cleanCoils.address);
            return tag.address;
        });

        var low_address = low_tag.address; //Get the lowest address of all the coils
        var next_range = low_address + connection.modbus.coilReadLength; //create an upper range from the config parameter (default +25)
        //console.log('next Range' + next_range);

        //Group the coils within the range (true Group) and those without the range.
        //add the true Group to the ScanGroups table
        //remove the trueGroup from the cleanCoils list
        var group = _.groupBy(cleanCoils, function(tag) {
            //console.log(tag.address);
            return tag.address <= next_range;
        });

        trueGroup = group.true;
        cleanCoils = group.false || [];

        //console.log('Less Than ',trueGroup);
        //console.log('Not less than',cleanCoils);

        //create ScanGroups document containing the tags within the address range.
        ScanGroups.insert({
            groupNum: i,
            table: "Coil",
            startAddress: low_address,
            endAddress: next_range,
            tags: trueGroup,
            active: true,
            errorCount: 0
        });



    }
};
configureModbusHoldingRegisterCollections = function(){
  //make two Scan Groups, one that hold integers and one that holds floating points.
  //Get a list of all Holding Registers (neeed address, tag_id, tag_param)
  var allHoldingRegisters = Tags.find({
      "params.table": "Holding Register"
  }, {
      fields: {
          'tag': 1,
          'params': 1
      }
  }).fetch();

  //New array just containg the Integers and their addesses
  var cleanIntegers = new Array();
  //New array just containing the Floating Points and their addresses.
  var cleanFloats = new Array();
  _.each(allHoldingRegisters, function(tag) {
      //console.log(tag);
      _.each(tag.params, function(param) {
          if (param.table == "Holding Register") {
              //Maybe separate floating and integer
              var tag_param = tag.tag + '_' + param.name;
              var new_number = {
                  tagid: tag._id,
                  tag_param: tag_param,
                  address: param.address
              };
              if(param.dataType == "Integer"){
                  cleanIntegers.push(new_number);
              }
              else if(param.dataType == "Floating Point") {
                  cleanFloats.push(new_number);
              }
          }

      });
  });

  //refractor all of this into a method to be shared....
  //console.log(cleanCoils);
  for (i = 0; i < connection.modbus.maxHoldingRegisterGroups && cleanIntegers.length > 0; i++) {
      var low_tag = _.min(cleanIntegers, function(tag) {
          //console.log(cleanCoils.address);
          return tag.address;
      });

      var low_address = low_tag.address; //Get the lowest address of all the coils
      var next_range = low_address + connection.modbus.holdingRegisterLength; //create an upper range from the config parameter (default +25)
      //console.log('next Range' + next_range);

      //Group the Integers within the range (true Group) and those without the range.
      //add the true Group to the ScanGroups table
      //remove the trueGroup from the cleanCoils list
      var group = _.groupBy(cleanIntegers, function(tag) {
          //console.log(tag.address);
          return tag.address <= next_range;
      });

      trueGroup = group.true;
      cleanIntegers = group.false || [];

      //console.log('Less Than ',trueGroup);
      //console.log('Not less than',cleanCoils);

      //create ScanGroups document containing the tags within the address range.
      ScanGroups.insert({
          groupNum: i,
          table: "Integer",
          startAddress: low_address,
          endAddress: next_range,
          tags: trueGroup,
          active: true,
          errorCount: 0
      });
  }
};
createScanGroups = function(type,list,groupLength,maxGroups){
    for (i = 0; i < maxGroups && list.length > 0; i++) {
        var low_tag = _.min(list, function(tag) {
            //console.log(cleanCoils.address);
            return tag.address;
        });

        var low_address = low_tag.address; //Get the lowest address of all the coils
        var next_range = low_address + connection.modbus.holdingRegisterLength; //create an upper range from the config parameter (default +25)
        //console.log('next Range' + next_range);

        //Group the Integers within the range (true Group) and those without the range.
        //add the true Group to the ScanGroups table
        //remove the trueGroup from the cleanCoils list
        var group = _.groupBy(list, function(tag) {
            //console.log(tag.address);
            return tag.address <= next_range;
        });

        trueGroup = group.true;
        list = group.false || [];

        //console.log('Less Than ',trueGroup);
        //console.log('Not less than',cleanCoils);

        //create ScanGroups document containing the tags within the address range.
        ScanGroups.insert({
            groupNum: i,
            table: "Integer",
            startAddress: low_address,
            endAddress: next_range,
            tags: trueGroup,
            active: true,
            errorCount: 0
        });
    }
  };



};
updateLiveTags = function(data, scanGroup) {
    var startAddress = scanGroup.startAddress;
    _.each(scanGroup.tags, function(tag) {
        var index = tag.address - startAddress;
        //console.log('tag.address: '+ tag.address + ' . startArddress: ' + startAddress);
        var tagName = tag.tag_param;
        var newValue = data[index];
        console.log('Updating Tag ' + tagName + ' to value of ' + newValue);
        LiveTags.update({
            tag_param: tagName
        }, {
            $set: {
                value: newValue,
                quality: true
            }
        });
    });

};


//cb is an an object containing functions that are callbacks!!!
AsyncMasterReadCoils = function(coil_address, quantity, cb) {
    master.readCoils(coil_address, quantity, cb)
};
SyncMasterReadCoils = Meteor.wrapAsync(AsyncMasterReadCoils);
//Report Modbus Erro
//Increment Error Count


reportModbusError = function(scanGroup) {
    var errors = ScanGroups.find({
        'groupNum': scanGroup.groupNum
    }).fetch()[0].errorCount;
    errors = errors + 1;
    console.log('Scan Group #' + scanGroup.groupNum + ' is reporting an error. They currently have ' + errors + ' errors');
    if (errors > connection.options.defaultMaxRetries) {
        console.log('Exceeded Max Retries, disabling group #', scanGroup.groupNum);
        ScanGroups.update({
            groupNum: scanGroup.groupNum
        }, {
            $set: {
                active: false
            }
        });
    }
    ScanGroups.update({
        groupNum: scanGroup.groupNum
    }, {
        $inc: {
            errorCount: 1
        }
    });

};

syncReportModbusError = Meteor.wrapAsync(reportModbusError);

readCoils = function(coil_address, quantity, scanGroup) {
    //Neccessary Evil for Asychronous Transaction!
    transaction = master.readCoils(coil_address, quantity);
    transaction.setMaxRetries(0);
    var AsyncTransactionOn = function (event, cb) {
        transaction.on(event, cb)
    };
    SyncTransactionOn = Meteor.wrapAsync(AsyncTransactionOn);
    SyncTransactionOn('timeout', function() {
        console.error('[transaction#timeout] Scan Group #:', scanGroup.groupNum);

    });
    SyncTransactionOn('error', function(err) {
        console.error('[transaction#error] Scan Group #: ' + scanGroup.groupNum + '.  Err Msg: ' + err.message);
        //stopAllScanning();

    });
    SyncTransactionOn('complete', function(err, response) {
        //if an error occurs, could be a timeout
        if (err) {
            console.error('Error Message on Complete w/ ScanGroup #:', scanGroup.groupNum)
            console.error(err.message);

        } else
        if (response.isException()) {
            console.log('Got an Exception Message. Scan Group #:', scanGroup.groupNum)
            console.log(response.toString());
            reportModbusError(scanGroup);
        } else {
            var coils;
            console.log('Succesfully completed scanning of Scan Group #:', scanGroup.groupNum);
            //update LiveTags from the response and scanGroup
            coils = response.getStates().map(Number);
            console.log('Response: ' + coils);
            updateLiveTags(coils, scanGroup);

            //console.log(response.getStates().map(Number));
            return response.getStates().map(Number);
        }
    });




    //console.log('Inside readCoils at end');

};


scanCoilGroup = function(scanGroup) {
    //console.log(scanGroup);
    console.log("Scanning Group # ", scanGroup.groupNum);
    var address = scanGroup.startAddress;
    var quantity = scanGroup.endAddress - address;
    console.log("Address and length " + address + '  ' + quantity);
    coil_response = readCoils(address, quantity, scanGroup);
    //console.log('scan Group response ', coil_response);
    console.log('after read coil of Group', scanGroup.groupNum);
};

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
                console.error(err.message);
                console.error('I make the error here!');
            } else {

                console.log(response);
                //console.log(response.exceptionCode);

                //console.log(response.values.readUInt16BE(0));
            }


        }
    });
    //console.log(t2);

};

stopAllScanning = function() {
    console.log('Stopping all scanning');
    var timer = modbus_timer.coils;
    Meteor.clearInterval(timer);
    //set timer to null indicating it is no longer active
    modbus_timer.coils = null;
};
startAllScanning = function() {
    if (modbus_timer.coils == null) {
        console.log('Creating Coil Timer');
        modbus_timer.coils = Meteor.setInterval(scanCoils, connection.options.coilScanInterval);

    } else {
        console.log('Timer already exists..');
    }
};

scanCoils = function() {
    console.log('Begin Scanning Coils');
    //TO DO Scanning

    //Get all the read coils
    var scanGroups = ScanGroups.find({
        "active": true
    }).fetch();
    console.log('scanGroups Array:', scanGroups);
    _.each(scanGroups, function(myGroup) {
        switch (myGroup.table) {
            case "Coil":
                scanCoilGroup(myGroup);
                break;
            case "Holding Register":
                break;
            default:
                console.log("ScanGroup ID: " + scanGroup.groupNum + " has incorrect table Name");
        }

    });
    console.log('After each statement');

    //test


};
