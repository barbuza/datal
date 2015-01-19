import Immutable = require('immutable');

import Entities = require('./Entities');
import Entity = require('./Entity');
import Ref = require('./Ref');
import DataLayer = require('./DataLayer');
import LayerHandle = require('./LayerHandle');
import Layer = require('./Layer');


function applyLayer(entities:Entities, layer:Layer):Entities {
  return layer.apply(entities);
}

function callListener(listener:() => void) {
  listener();
}

var empty = Immutable.Map<Ref, Entity>();

class Storage {

  private entities = empty;
  private cache = empty.asMutable();
  private layers = Immutable.OrderedSet<Layer>();
  private listeners = Immutable.Set<() => void>();

  private notify():void {
    var entities = this.layers.reduce(applyLayer, empty);
    if (!Immutable.is(entities, this.entities)) {
      this.entities = entities;
      this.cache = empty.asMutable();
      this.listeners.forEach(callListener);
    }
  }

  public adopt(data:any):LayerHandle {
    return this.addLayer(new DataLayer(data));
  }

  public addLayer(layer:Layer):LayerHandle {
    this.layers = this.layers.add(layer);
    var handle = new LayerHandle(layer, this);
    this.notify();
    return handle;
  }

  public removeLayer(layer:Layer):void {
    this.layers = this.layers.remove(layer);
    this.notify();
  }

  public addListener(listener:() => void):void {
    this.listeners = this.listeners.add(listener);
  }

  public removeListener(listener:() => void):void {
    this.listeners = this.listeners.remove(listener);
  }

  public get(ref:any):Entity {
    if (typeof ref === 'string') {
      ref = new Ref(ref);
    }
    if (!this.cache.has(ref)) {
      if (!this.entities.has(ref)) {
        return null;
      }
      var traverse = function(item:any):any {
        if (item instanceof Ref) {
          var entity:Entity;
          if (this.cache.has(item)) {
            entity = this.cache.get(item);
          } else {
            entity = this.entities.get(item).map(traverse).toMap();
            this.cache.set(item, entity);
          }
          return entity;
        } else if (item instanceof Immutable.Iterable) {
          return item.map(traverse);
        }
        return item;
      }.bind(this);
      traverse(ref);
    }
    return this.cache.get(ref);
  }

}

export = Storage;
