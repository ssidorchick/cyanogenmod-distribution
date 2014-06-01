'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VersionSchema = new Schema({
  timestamp: { type: Date, default: Date.now },
  statistics: [{ name: String, downloads: Number, _id: false }]
});

mongoose.model('Version', VersionSchema);
