var fs = require('fs');
try {
    fs.writeFileSync("./web/result.js", "var data = [];");
    console.log('Resetted successfully.');
} catch(e) {
    console.log('Results file could not be resetted.');
    console.log(e);
}