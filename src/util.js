const fs = require('fs')

exports.saveToFile = (filename, data) => {
    console.log(filename)
    fs.writeFile(filename, JSON.stringify(data, null, 2), function(err) {
        if (err) return console.error(err)
    })
}