master = {}; //placeholder for master connection, can be serial or tcp/ip


Meteor.startup(function() {

    configureModbusCollections();

    modbus = Meteor.npmRequire('h5.modbus');


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
    master.on('error', function(err) {
        console.error('[master#error] %s', err.message);
    });
    master.on('disconnected', function() {
        console.log('[master#disconnected]');
    });
    master.on('connected', function() {
        console.log('[master#connected]');
    });


    /*var connection = master.getConnection();

    connection.on('open', function() {
        console.log('[connection#open]');
    });*/
    //TODO test connection
    //TODO If connection successful begin polling from tag configuration
    //TODO create Tag Configuration

})
