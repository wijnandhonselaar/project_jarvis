module.exports = {   id: 1251,
    name: 'Philips hue',
        sokVersion: 0.1,
    description: 'Integer posuere erat a ante venenatis dapibus posuere.',
    type: 'Sensor',
    image: '',
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
                            },
                            {
                                type: 'length',
                                min: '3',
                                max: '10'
                            }
                        ]
                    }]
                }
            },
            requestInterval: 5000,
            httpMethod : 'POST',
            returns: 'Boolean',
            description : 'Changes the color of the philips hue lamp'
        },
        numbertest: {
            name : 'paramtest',
            parameters: {
                nummer: {
                    name : 'string',
                    required: true,
                    list: [],
                    accepts: [{
                        type: 'number',
                        limit: [
                            {
                                type: 'number',
                                min: '1',
                                max: '512'
                            }
                        ]
                    }]
                }
            },
            requestInterval: 5000,
            httpMethod : 'POST',
            returns: 'Boolean',
            description : 'Changes the color of the philips hue lamp'
        },
        booltest: {
            name : 'paramtest',
            parameters: {
                bool: {
                    name : 'boolean',
                    required: true,
                    list: [],
                    accepts: [{
                        type: 'boolean',
                        limit: [
                            {
                                type: 'boolean',
                                min: '',
                                max: ''
                            }
                        ]
                    }]
                }
            },
            requestInterval: 5000,
            httpMethod : 'POST',
            returns: 'Boolean',
            description : 'Changes the color of the philips hue lamp'
        },
        listtest: {
            name : 'paramtest',
            parameters: {
                value: {
                    name : 'number',
                    required: true,
                    list: [1,2,3,4,5],
                    accepts: [{
                        type: 'number',
                        limit: []
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