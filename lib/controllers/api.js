'use strict';

var mongoose = require('mongoose'),
    Version = mongoose.model('Version');

exports.versions = function(req, res) {
  return Version.find(function (err, things) {
    if (!err) {
      return res.json(things);
    } else {
      return res.send(err);
    }
  });
};
