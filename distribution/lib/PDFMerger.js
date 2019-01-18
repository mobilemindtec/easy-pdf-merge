'use strict';

var fs = require('fs');
var exec = require('child_process').exec;
var path = require('path');

function checkSrc(src, callback) {

  if (!Array.isArray(src)) return callback('Source is not an Array');else if (src.length < 2) return callback('There must be atleast 2 input files');

  var norm_src = [];

  for (var i = 0; i < src.length; i++) {

    if (typeof src[i] === 'string') {

      /*
      //Check if source file exists
       fs.stat(src[i],function(err,stats){
         if(err)
          return callback('Can\'t access file : ' + src[i]);
         if(!stats.isFile())
          return callback(src[i] + ' is not a File');
       });*/

      norm_src.push('"' + src[i] + '"');
    } else return callback('Source : ' + src[i] + ' + , is not a file name');
  }

  callback(null, norm_src);
}

exports.pager = function(src, dest, opts, callback){

  var defaultOpts = {
    maxBuffer: 1024 * 500, // 500kb
    javaOpts: ""
  };

  // this will help to fix the old code using the function without opts
  if (!callback) {
    callback = opts;
    opts = defaultOpts;
  }

  // if opts is null, we will set the default options
  if (!opts) {
    opts = defaultOpts;
  }

  opts.javaOpts = opts.javaOpts || "" 
  opts.maxBuffer = opts.maxBuffer || 1024 * 500  

  var dirClassPathArr = __dirname.split(path.sep);

  dirClassPathArr.pop();
  dirClassPathArr.pop();
  dirClassPathArr.push('jar');
  dirClassPathArr.push('pdfbox.jar');

  var dirPathArr = __dirname.split(path.sep);

  dirPathArr.pop();
  dirPathArr.pop();
  dirPathArr.push('jar');
  dirPathArr.push('pdfboxpager.jar');

  var jarClassPath = dirClassPathArr.join(path.sep);
  var jarPath = dirPathArr.join(path.sep);

  var command = ['java ' + opts.javaOpts +  ' -cp "' + jarPath + ":" + jarClassPath + '" br.com.mobilemind.api.pdf.Main'];


  command = command.concat('"' + src + '"');
  command = command.concat('"' + dest + '"');

  if(opts.debug)
    console.log("DEBUG: java commend " + command.join(' '))

  var child = exec(command.join(' '), opts, function (err, stdout, stderr) {

    if (err) return callback(err);

    callback(null);
  });

  child.on('error', function (err) {
    return callback('Execution problem. ' + err);
  });

}

exports.merge = function (src, dest, opts, callback) {

  var defaultOpts = {
    maxBuffer: 1024 * 500, // 500kb
    javaOpts: ""
  };

  // this will help to fix the old code using the function without opts
  if (!callback) {
    callback = opts;
    opts = defaultOpts;
  }

  // if opts is null, we will set the default options
  if (!opts) {
    opts = defaultOpts;
  }

  opts.javaOpts = opts.javaOpts || "" 
  opts.maxBuffer = opts.maxBuffer || 1024 * 500

  var dirPathArr = __dirname.split(path.sep);

  dirPathArr.pop();
  dirPathArr.pop();
  dirPathArr.push('jar');
  dirPathArr.push('pdfbox.jar');

  var jarPath = dirPathArr.join(path.sep);

  var command = ['java ' + opts.javaOpts + ' -jar "' + jarPath + '" PDFMerger'];

  checkSrc(src, function (err, norm_src) {

    if (err) return callback(err);

    command = command.concat(norm_src);

    command.push('"' + dest + '"');

    if(opts.debug)
      console.log("DEBUG: java commend " + command.join(' '))    

    var child = exec(command.join(' '), opts, function (err, stdout, stderr) {

      if (err) return callback(err);

      callback(null);
    });

    child.on('error', function (err) {
      return callback('Execution problem. ' + err);
    });
  });
};