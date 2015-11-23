local pins = require 'pins'
local globalmethods = require 'globalmethods'
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
                power = gpio.read(pins.powerPin)
            })
        end
    },
    POST = {
        on = function(conn)
            gpio.mode(pins.powerPin, gpio.OUTPUT)
            gpio.write(pins.powerPin, gpio.HIGH)
            return "true";
        end,
        off = function(conn)
            gpio.mode(pins.powerPin, gpio.OUTPUT)
            gpio.write(pins.powerPin, gpio.LOW)
            return "true";
        end
    }
}

return routes
