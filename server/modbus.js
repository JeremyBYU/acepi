x = 1;

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

