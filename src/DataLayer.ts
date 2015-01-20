import Immutable = require('immutable');

import Ref = require('./Ref');
import Entity = require('./Entity');
import Entities = require('./Entities');
import Layer = require('./Layer');

class DataLayer implements Layer {

  private newEntities:Entities;

  constructor(data:any, idKey:string = 'id') {
    var newEntities = Immutable.Map<Ref, Entity>().asMutable();
    function traverse(item:any):any {
      if ((item instanceof Immutable.Map) && item.has(idKey) ) {
        var ref = new Ref(item.get(idKey));
        item = item.map(traverse);
        newEntities.set(ref, item);
        return ref;
      } else if (item instanceof Immutable.Iterable) {
        return item.map(traverse);
      }
      return item;
    }
    traverse(Immutable.fromJS(data));
    this.newEntities = newEntities.asImmutable();
  }

  apply(entities:Entities):Entities {
    return entities.mergeDeep(this.newEntities);
  }

}

export = DataLayer;
