// utils.js

'use strict'

var utils = {

    // https://gist.github.com/DelvarWorld/825583
    readDirRecursive : function (start, callback) {
        // Use lstat to resolve symlink if we are passed a symbol link
        fs.lstat(start, function(err, stat) {
            if(err) {
                return callback(err);
            }
            var found = {dirs: [], files: []},
                total = 0,
                processed = 0;

            function isDir(abspath) {
                fs.stat(abspath, function(err, stat) {
                    if(stat.isDirectory()) {
                        found.dirs.push(abspath);
                        // If we found a directory, recurse!
                        readDirRecursive(abspath, function(err, data) {
                            found.dirs = found.dirs.concat(data.dirs);
                            found.files = found.files.concat(data.files);
                            if(++processed === total) {
                                callback(null, found);
                            }
                        });
                    } else {
                        found.files.push(abspath);
                        if(++processed === total) {
                            callback(null, found);
                        }
                    }
                });
            }

            // Read through all the files in this directory
            if(stat.isDirectory()) {
                fs.readdir(start, function (err, files) {
                    total = files.length;
                    if(total === 0) {
                        // empty directory
                        callback(null, found);
                    }
                    for(var x=0, l=files.length; x<l; x++) {
                        isDir(path.join(start, files[x]));
                    }
                });
            } else {
                return callback(new Error("path: " + start + " is not a directory"));
            }
        });
    }
};

exports.utils = utils;