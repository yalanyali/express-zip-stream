const async = require('async')
const http = require('http')
const express = require('express')
const fs = require('fs')
const res = express.response || http.ServerResponse.prototype
const zipstream = require('zip-stream')

// Options for the zip stream
exports.options = { level: 1 }

/**
 * Responds with a ZIP attachment containing `files`, with an optional
 * "save as" `filename` (default is attachment.zip), and then calls `cb`
 * when finished.
 *
 * @param {Array} files { name: <name>, path: <path> }
 * @param {String|Function} filename that will be shown in "save as" dialog
 * @param {Function} cb(err, bytesZipped) optional
 */

res.zip = function (files, filename, cb) {
  if (typeof filename === 'function') {
    cb = filename
    filename = undefined
  }

  if (typeof filename === 'undefined') {
    filename = 'attachment.zip'
  }

  cb = cb || function () {}

  this.header('Content-Type', 'application/zip')

  // UTF-8 on Content-Disposition header to avoid "The header content contains invalid characters" error thrown by Express
  // https://tools.ietf.org/html/rfc6266#section-6
  this.header('Content-Disposition', 'attachment;filename*=UTF-8\'\'' + encodeURIComponent(filename))

  var zip = zipstream(exports.options)
  zip.pipe(this) // res is a writable stream

  var addFile = function (file, cb) {
    zip.entry(fs.createReadStream(file.path), { name: file.name }, cb)
  }

  async.forEachSeries(files, addFile, function (err) {
    if (err) return cb(err)
    zip.finalize()
    cb(null, zip.getBytesWritten())
  })
}
