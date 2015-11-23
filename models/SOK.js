module.exports = {   id: 1251,
    name: 'Philips hue',
        sokVersion: 0.1,
    description: 'Integer posuere erat a ante venenatis dapibus posuere.',
    type: 'Sensor',
    commands: {
        on : {
            name: 'on',
                parameters: [],
                requestInterval: 5000,
                httpMethod: 'POST',
                returns: 'Boolean',
                description: 'Philips hue will be turned on'
        },
        off: {
            name : 'off',
                parameters: [],
                requestInterval: 5000,
                httpMethod: 'POST',
                returns: 'Boolean',
                description: 'Philips hue will be turned off'
        },
        status: {
            name : 'status',
                parameters: [],
                requestInterval: 5000,
                httpMethod: 'GET',
                returns: {
                    Celsius: 'number',
                    Fahrenheit: 'number',
                    Kelvin: 'number'
            },
            description: 'Retrieves status of philips hue lamp'
        },
        stringtest: {
            name : 'paramtest',
            parameters: {
                naam: {
                    name : 'string',
                    required: true,
                    list: [],
                    accepts: [{
                        type: 'string',
                        limit: [
                            {
                                type: 'length',
                                min: '1',
                                max: '5'
                            }
                        ]
                    }]
                }
            },
            requestInterval: 5000,
            httpMethod : 'POST',
            returns: 'Boolean',
            description : 'Changes the color of the philips hue lamp'
        }
    }
};