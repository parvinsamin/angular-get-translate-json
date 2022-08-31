require('./config');
var msg = 'Hello World';
console.log(msg);




var path = require('path'),
    fs = require('fs');

let finalJson = {};
function fromDir(startPath, filter) {
    // return new Promise(resolve => {
    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }
    var files = fs.readdirSync(startPath);
    const start = '{{';
    const end = '}}';
    const regexp = RegExp(start + '\\s*(\'|"|&quot;|&#39;)(.*?)\\1\\s*\\|\\s*translate\\s*(' + end + '|\\|)', 'g');

    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromDir(filename, filter); //recurse
        } else if (filename.endsWith(filter)) {
            fs.readFile(filename, 'utf8', function (err, data) {
                if (err) throw err;
                if (data) {
                    let matches = data.match(regexp);
                    if (matches) finalJson = {
                        ...finalJson, ...matches.filter(x => x).map(x => x.replace("'", '"').replace("'", '"').split('"')[1]).reduce((pre, cur) => {
                            return {
                                ...pre,
                                [cur]: ''
                            }
                        }, {})
                    };
                }
            });
        };
    };
    // resolve(finalJson);
    // })
};



function asyncCall() {
    console.log('calling');
    fromDir('../../hug-admin/src/app/pages/', '.html');
    setTimeout(() => {
        // console.log(finalJson);
        var jsonContent = JSON.stringify(finalJson);
        // console.log(jsonContent);

        // fs.writeFile("output.json", jsonContent, 'utf8', function (err) {
        //     if (err) {
        //         console.log("An error occured while writing JSON Object to File.");
        //         return console.log(err);
        //     }

        //     console.log("JSON file has been saved.");
        // });
    }, 2000)

    // expected output: "resolved"
}

asyncCall();