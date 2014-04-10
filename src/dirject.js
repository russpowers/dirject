// Originally Copyright (C) 2013 eBay Software Foundation
// That was taken from Kraken and modified to suit my needs

var fs = require('fs');
var path = require('path');
var assert = require('assert');
var Promise = require('bluebird');


function loaddir(directory) {
    return scan(resolve(directory));
}

function scan(file, controllers) {
    var stats;

    controllers = controllers || [];
    if (typeof file !== 'string') {
        return controllers;
    }

    assert.ok(fs.existsSync(file), 'Service directory not found. (\'' + file + '\')');

    stats = fs.statSync(file);
    if (stats.isDirectory())  {
        fs.readdirSync(file).forEach(function (child) {
            scan(path.join(file, child), controllers);
        });
    } else if (stats.isFile() && file.match(/\.(js|coffee)$/i)) {
        controllers.push(file);
    }

    return controllers;
}

function resolve(file) {
    if (!file) {
        return undefined;
    }

    if (Array.isArray(file)) {
        file = path.join.apply(undefined, file);
    }

    file = path.resolve(file);
    return file;
}

function dirject(container, receiver, directory) {
	var promises = [];
  loaddir(settings.directory).forEach(function (file) {
      var service = require(file);
      if (typeof service === 'function') {
          promises.push(container.inject(service, receiver));
      }
  });

  return Promise.all(promises);
}


module.exports = dirject;
