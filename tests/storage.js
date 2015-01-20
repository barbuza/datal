var Storage = require('../lib/Storage');
var DataLayer = require('../lib/DataLayer');

exports.merge = function(test) {
  var storage = new Storage();
  storage.addLayer(new DataLayer({id: '1', foo: 'bar'}));
  storage.addLayer(new DataLayer({id: '1', spam: 'eggs'}));
  test.deepEqual(storage.get('1').toJS(), {id: '1', foo: 'bar', spam: 'eggs'});
  test.done();
};

exports.remove = function(test) {
  var storage = new Storage();
  var l1 = storage.addLayer(new DataLayer({id: '1', foo: 'bar'}));
  storage.addLayer(new DataLayer({id: '1', spam: 'eggs'}));
  storage.addLayer(new DataLayer({id: '1', bar: 'foo'}));
  l1.remove();
  test.deepEqual(storage.get('1').toJS(), {id: '1', spam: 'eggs', bar: 'foo'});
  test.done();
};
