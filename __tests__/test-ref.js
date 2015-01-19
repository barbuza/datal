jest.dontMock('immutable');
jest.dontMock('../lib/Ref');

var Immutable = require('immutable');
var Ref = require('../lib/Ref');

describe('Ref', function() {

  it('should be equal', function() {
    expect(new Ref('1')).toBe(new Ref('1'));
  });

  it('should conform to Immutable.is', function() {
    expect(Immutable.is(new Ref('1'), new Ref('1'))).toBe(true);
  });

  it('should expose id', function() {
    expect(new Ref('1').id).toBe('1');
  });

});
