import Entities = require('./Entities');

interface Layer {

  apply(entities:Entities):Entities

}

export = Layer;
