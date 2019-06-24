# express-zip-stream

express-zip-stream allows you to serve zip files with [express](http://expressjs.com/), without creating any intermediary files on disk.

```js
const app = require('express')();
const zip = require('express-zip-serve');

app.get('/', function(req, res) {
  res.zip([
    { path: '/path/to/file1.name', name: '/path/in/zip/file1.name' }
    { path: '/path/to/file2.name', name: 'file2.name' }
  ]);
});

app.listen(3131);
```

## API

```js
/**
 * Responds with a ZIP attachment containing `files`, with an optional
 * "save as" `filename` (default is attachment.zip), and then calls `cb`
 * when finished.
 *
 * @param {Array} files { name: <name>, path: <path> }
 * @param {String|Function} filename that will be shown in "save as" dialog, UTF-8
 * @param {Function} cb(err, bytesZipped) optional
 */
res.zip = function(files, filename, cb) {
```

## Credits

[express-csv](https://github.com/nulltask/express-csv)
[zip-stream](https://github.com/ctalkington/node-zip-stream)