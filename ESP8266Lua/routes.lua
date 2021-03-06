local pins = require 'pins'
local routes = {
    GET = {
        sok = function(conn)
            send(conn, nil, dobbie.fileTransfer.fileSize)
            dobbie.fileTransfer.hasFile = true
            dobbie.fileTransfer.fileSize = globalmethods.getFileSize("sok.json")
            dobbie.streamFile(conn, "sok.json")
            print("Sending sok definition...")
            gpio.mode(pins.handshakePin, gpio.OUTPUT)
            gpio.write(pins.handshakePin, gpio.HIGH)
        end,
        status = function(conn)
            return json.encode({ 
                state = gpio.read(pins.powerPin)
            })
        end
    },
    POST = {
        on = function(conn, postParams)
            gpio.mode(pins.powerPin, gpio.OUTPUT)
            gpio.write(pins.powerPin, gpio.HIGH)
            dobbie.setEventTimer()
            return '{"state":true}'
        end,
        off = function(conn, postParams)
            gpio.mode(pins.powerPin, gpio.OUTPUT)
            gpio.write(pins.powerPin, gpio.LOW)
            return '{"state":false}'
        end
    }
}

return routes
