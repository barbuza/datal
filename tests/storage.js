var datal = require('../index');

exports.merge = function(test) {
  var storage = new datal.Storage();
  storage.addLayer(new datal.DataLayer({id: '1', foo: 'bar'}));
  storage.addLayer(new datal.DataLayer({id: '1', spam: 'eggs'}));
  test.deepEqual(storage.get('1').toJS(), {id: '1', foo: 'bar', spam: 'eggs'});
  test.done();
};

exports.remove = function(test) {
  var storage = new datal.Storage();
  var l1 = storage.addLayer(new datal.DataLayer({id: '1', foo: 'bar'}));
  storage.addLayer(new datal.DataLayer({id: '1', spam: 'eggs'}));
  storage.addLayer(new datal.DataLayer({id: '1', bar: 'foo'}));
  l1.remove();
  test.deepEqual(storage.get('1').toJS(), {id: '1', spam: 'eggs', bar: 'foo'});
  test.done();
};

exports.has = function(test) {
  var storage = new datal.Storage();
  storage.addLayer(new datal.DataLayer({id: '1', foo: 'bar', spam: 'eggs'}));
  test.ok(!storage.has('1', 'foo', 'bar'));
  test.ok(storage.has('1', 'foo', 'spam'));
  test.done();
};
