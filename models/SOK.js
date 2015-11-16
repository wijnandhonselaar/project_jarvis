var sok = {
    id: 12,
    name: 'Philips hue',
    type: 'actuator',
    sokVersion: 0.1,
    description: 'Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Cras mattis consectetur purus sit amet fermentum. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.',
    commands: [
        {
            name: 'on',
            parameters: [],
            requestInterval: 5000,
            httpMethod: 'POST',
            returns: 'Boolean',
            description: 'Philips hue will be turned on'
        },
        {
            name : 'off',
            parameters: [],
            requestInterval: 5000,
            httpMethod: 'POST',
            returns: 'Boolean',
            description: 'Philips hue will be turned off'
        },
        {
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
        {
            name : 'changeColor',
            parameters: [
                {
                    name : 'color',
                    required: true,
                    accepts: {
                        type: 'hex',
                        limit: [
                            {
                                type: 'hex',
                                min: '0x000000',
                                max: '0xffffff'
                            }
                        ],
                        list : ['R','G','B'] //Predefined parameter values
                    }
                }
            ],
            requestInterval: 5000,
            httpMethod : 'POST',
            returns: 'Boolean',
            description : 'Changes the color of the philips hue lamp'
        }
    ]
};

module.exports = sok;