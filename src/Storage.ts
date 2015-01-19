import Immutable = require('immutable');

import Entities = require('./Entities');
import Entity = require('./Entity');
import Ref = require('./Ref');
import DataLayer = require('./DataLayer');
import LayerHandle = require('./LayerHandle');
import Layer = require('./Layer');


function callListener(listener:() => void) {
  listener();
}

var empty = Immutable.Map<Ref, Entity>();

class Storage {

  private entities = empty;
  private cache = empty.asMutable();
  private layers = Immutable.List<Layer>();
  private listeners = Immutable.Set<() => void>();
  private layersCache = Immutable.List<Entities>();

  private notify():void {
    var layersCacheSize = this.layersCache.size;
    var newLayers = this.layers.slice(layersCacheSize);
    var entities = newLayers.reduce(this.applyLayer, this.layersCache.last() || empty, this);

    if (!Immutable.is(entities, this.entities)) {
      this.entities = entities;
      this.cache = empty.asMutable();
      this.listeners.forEach(callListener);
    }
  }

  private applyLayer(entities:Entities, layer:Layer):Entities {
    entities = layer.apply(entities);
    this.layersCache = this.layersCache.push(entities);
    return entities;
  }

  public adopt(data:any):LayerHandle {
    return this.addLayer(new DataLayer(data));
  }

  public addLayer(layer:Layer):LayerHandle {
    this.layers = this.layers.push(layer);
    var handle = new LayerHandle(layer, this);
    this.notify();
    return handle;
  }

  public removeLayer(layer:Layer):void {
    var index = this.layers.indexOf(layer);
    if (index !== -1) {
      this.layersCache = this.layersCache.slice(0, index).toList();
      this.layers = this.layers.remove(index);
      this.notify();
    }
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
