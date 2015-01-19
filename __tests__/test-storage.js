jest.dontMock('immutable');
jest.dontMock('../lib/Storage');
jest.dontMock('../lib/Ref');
jest.dontMock('../lib/DataLayer');
jest.dontMock('../lib/FunctionLayer');
jest.dontMock('../lib/LayerHandle');

var Storage = require('../lib/Storage');
var DataLayer = require('../lib/DataLayer');

describe('Storage', function() {

  it('should merge layers', function() {
    var storage = new Storage();
    storage.addLayer(new DataLayer({id: '1', foo: 'bar'}));
    storage.addLayer(new DataLayer({id: '1', spam: 'eggs'}));
    expect(storage.get('1').toJS()).toEqual({id: '1', foo: 'bar', spam: 'eggs'});
  });

  it('should remove layers', function() {
    var storage = new Storage();
    var l1 = storage.addLayer(new DataLayer({id: '1', foo: 'bar'}));
    storage.addLayer(new DataLayer({id: '1', spam: 'eggs'}));
    l1.remove();
    expect(storage.get('1').toJS()).toEqual({id: '1', spam: 'eggs'});
  });

});
