var Immutable = require('immutable');
var datal = require('../index');

exports.equal = function(test) {
  test.strictEqual(new datal.Ref('1'), new datal.Ref('1'));
  test.done();
};

exports.immutable = function(test) {
  test.ok(Immutable.is(new datal.Ref('1'), new datal.Ref('1')));
  test.done();
};

exports.id = function(test) {
  test.strictEqual(new datal.Ref('1').id, '1');
  test.done();
};
