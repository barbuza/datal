import Layer = require('./Layer');
import Entities = require('./Entities');

class FunctionLayer implements Layer {

  fn:(entities:Entities) => Entities;

  constructor(fn:(entities:Entities) => Entities) {
    this.fn = fn;
  }

  apply(entities:Entities):Entities {
    return this.fn(entities);
  }

}

export = FunctionLayer;
