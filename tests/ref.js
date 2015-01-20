var Immutable = require('immutable');
var Ref = require('../lib/Ref');

exports.equal = function(test) {
  test.strictEqual(new Ref('1'), new Ref('1'));
  test.done();
};

exports.immutable = function(test) {
  test.ok(Immutable.is(new Ref('1'), new Ref('1')));
  test.done();
};

exports.id = function(test) {
  test.strictEqual(new Ref('1').id, '1');
  test.done();
};
