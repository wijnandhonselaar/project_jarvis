local globalmethods = {
    getFileSize = function (filename)
        if file.open(filename, "r") then
             local file_size = file.seek("end");
             return file_size
        end
        return 0 
    end,
    explode = function (inputstr, sep)
        if sep == nil then
                sep = "%s"
        end
        local t={} ; i=1
        for str in string.gmatch(inputstr, "([^"..sep.."]+)") do
                t[i] = str
                i = i + 1
        end
        return t
    end
}

return globalmethods

