var fs = require('fs');
try {
    fs.writeFileSync("./web/result.js", "var data = [];");
    fs.writeFileSync("./output.json", "");
    console.log('Resetted successfully.');
} catch(e) {
    console.log('Results file could not be resetted.');
    console.log(e);
}