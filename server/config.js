//variable for weather meteor is running on windows or raspberry pi
//will change to modbus TCPIP instead of serial based on this variable
env_windows = true;


//Contains options for connection options
connection = {};
connection.modbus =
{
    coilReadLength: 25,
    maxCoilGroups: 5
};

connection.options = {
    autostart: true,
    coilScanInterval: 2000,
    suppressTransactionErrors: true,
    retryOnException: false,
    maxConcurrentRequests: 1,
    defaultUnit: 1,
    defaultMaxRetries: 1,
    defaultTimeout: 1000,

    rtu:{
    	serialPort : '/dev/ttyACM0',
    	baudRate: 9600,
    	type: 'serial'

    },

    ip:{
    	type: 'tcp',
    	host: '127.0.0.1',
    	port: 502,
    	autoConnect: true,
    	autoReconnect: true,
    	minConnectTime: 2500,
    	maxReconnectTime: 5000
    }
};

