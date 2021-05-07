var path = require('path');
var express = require('express');
var router = express.Router();

// api 

const callbackFile = (req, res) => {
    const options = {
        root: path.join(__dirname, '../', 'jsons'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    }    
    const fileName = req.params.json;
    res.sendFile(fileName + '.json', options, (err) => {
        if (err) {
            console.log(`Sent: ${err.status}.json`)
            res.sendFile(`${err.status}.json`, options, eror => { console.log(eror) })
        }
        else {
            console.log(`Sent: ${fileName}.json`)
        }
    })
}
  
router.all('/:json', callbackFile)


module.exports = router;
