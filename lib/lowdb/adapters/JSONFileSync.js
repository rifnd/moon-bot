const { TextFileSync } = require('./TextFileSync.js');
const stable = require('json-stable-stringify')
class JSONFileSync {
    constructor(filename) {
        this.adapter = new TextFileSync(filename);
    }
    read() {
        const data = this.adapter.read();
        if (data === null) {
            return null;
        }
        else {
            return JSON.parse(data);
        }
    }
    write(obj) {
        this.adapter.write(stable(obj));
    }
}
module.exports = { JSONFileSync };
