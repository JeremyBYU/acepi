master = {}; //placeholder for master connection, can be serial or tcp/ip

//placeholder for the Meteor Timers
modbus_timer = {
    coils: null,
    holding_regsiter: null
};


//Unfortunate Asynchronous Trickery
//Meteor runs on a single thread so I have to wrap the asychronous modbus master.on function into a sychronous shell
asyncMasterOn = function(event, cb) {
    master.on(event, cb);
};
syncMasterOn = Meteor.wrapAsync(asyncMasterOn);


Meteor.startup(function() {
    modbus = Meteor.npmRequire('h5.modbus');
    configureModbusCollections();
    
    //modbus_timer.coils = Meteor.setInterval(scanCoils,connection.options.coilScanInterval);

    if (!env_windows) {
        var SerialPort = Meteor.npmRequire('serialport').SerialPort;
        var serialPort = new SerialPort(connection.options.rtu.serialPort, {
            baudRate: connection.options.rtu.baudRate
        });
        //create the master connection
        master = modbus.createMaster({
            transport: {
                type: 'rtu',
                eofTimeout: 10,
                connection: {
                    type: connection.options.rtu.type,
                    serialPort: serialPort
                }
            },
            suppressTransactionErrors: connection.options.suppressTransactionErrors,
            retryOnException: connection.options.retryOnException,
            maxConcurrentRequests: connection.options.maxConcurrentRequests,
            defaultUnit: connection.options.defaultUnit,
            defaultMaxRetries: connection.options.defaultMaxRetries,
            defaultTimeout: connection.options.defaultTimeout
        });

    } else {
        var net = Meteor.npmRequire('net');
        var socket = new net.Socket();

        //create the master connection
        master = modbus.createMaster({
            transport: {
                type: 'ip',
                eofTimeout: 10,
                connection: {
                    type: connection.options.ip.type,
                    socket: socket,
                    host: connection.options.ip.host,
                    port: connection.options.ip.port,
                    autoConnect: connection.options.ip.autoConnect,
                    autoReconnect: connection.options.ip.autoReconnect,
                    minConnectTime: connection.options.ip.minConnectTime,
                    maxReconnectTime: connection.options.ip.maxReconnectTime

                }
            },
            suppressTransactionErrors: connection.options.suppressTransactionErrors,
            retryOnException: connection.options.retryOnException,
            maxConcurrentRequests: connection.options.maxConcurrentRequests,
            defaultUnit: connection.options.defaultUnit,
            defaultMaxRetries: connection.options.defaultMaxRetries,
            defaultTimeout: connection.options.defaultTimeout
        });
    }

    //MONGODB Database for current connections
    //TO DO ERROR HANDLING
    syncMasterOn('error', function(err) {
        console.error('[master#error] %s', err.message);
        stopAllScanning();
    });
    syncMasterOn('disconnected', function() {
        console.log('[master#disconnected]');
        stopAllScanning();
        //TODO Stop all Timers!
    });

    //asyncMaster('connected',function(){console.log('test');});
    syncMasterOn('connected', function() {

        console.log('[master#connected]');
        console.log('Beggining Scanning of Coils')
        startAllScanning();

    });
    /*    master.on('connected', function() {
            //TODO Begin Scanning
            console.log('[master#connected]');
            console.log('Beggining Scanning of Coils')
            if (modbus_timer.coils == null) {
                console.log('Creating Coil Timer');
                //modbus.timer.coils = Meteor.setInterval(scanCoils,connection.options.coilScanInterval);

            } else {


            }

        });*/

})
