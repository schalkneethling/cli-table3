var utils = require('../src/utils');
var chai = require('chai');
var expect = chai.expect;
var colors = require('colors/safe');
var fs = require('fs');

function runExample(fn,logName,logTable,logCode,logSeparator,screenshot){
  function printExample(name,makeTable,expected){
    var code = makeTable.toString().split('\n').slice(1,-2).join('\n');

    logName(name);
    logTable(makeTable().toString());
    logCode(code);
    logSeparator('\n');
  }

  fn(printExample,screenshot);
}

function logExample(fn){
  runExample(fn,
    function(name){
      console.log(colors.gray('=========  ') + name + colors.gray('  ================'));
    },
    console.log,
    console.log,
    console.log,
    identity
  )
}

function stripColors(str){
  return str.split( /\u001b\[(?:\d*;){0,5}\d*m/g).join('');
}

function identity(str){
  return str;
}

function mdExample(fn,file){
  var buffer = [];

  runExample(fn,
    function(name){
      buffer.push('#### ' + name);
    },
    function(table){
      table = stripColors(table);

      buffer.push('    ' + (table.split('\n').join('\n    ')));
    },
    function(code){
      buffer.push('```javascript');
      buffer.push(stripColors(code));
      buffer.push('```');
    },
    function(sep){
      buffer.push(stripColors(sep));
    }
  );

  fs.writeFileSync(file,buffer.join('\n'));
}

function testExample(name,fn,expected){
  it(name,function(){
    expect(fn().toString()).to.equal(expected.join('\n'));
  });
}

function runTest(fn){
  describe('@api Table', function () {
    fn(testExample,identity);
  });
}

module.exports = {
  mdExample:mdExample,
  logExample:logExample,
  runTest:runTest
};