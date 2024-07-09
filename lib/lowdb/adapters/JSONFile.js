const { TextFile } = require('./TextFile.js');
const stable = require('json-stable-stringify')
class JSONFile {
    constructor(filename) {
        this.adapter = new TextFile(filename);
    }
    async read() {
        const data = await this.adapter.read();
        if (data === null) {
            return null;
        }
        else {
            return JSON.parse(data);
        }
    }
    write(obj) {
        return this.adapter.write(stable(obj));
    }
}
module.exports = { JSONFile };
