/// <reference path="node_modules/immutable/dist/immutable.d.ts" />

import Immutable = require('immutable');

module datal {

  export interface Entity extends Immutable.Map<string, any> {

  }

  var refs = Immutable.Map<string, Ref>().asMutable();

  export class Ref {

    id:string;
    private _hashCode:number;

    constructor(id:string) {
      if (refs.has(id)) {
        return refs.get(id);
      }
      refs.set(id, this);
      this.id = id;
      this._hashCode = refs.size;
    }

    hashCode():number {
      return this._hashCode;
    }

    toString():string {
      return 'Ref { ' + this.id + ' }';
    }

    toJSON():{id:string} {
      return {
        id: this.id
      };
    }

  }

  export interface Entities extends Immutable.Map<Ref, Entity> {

  }

  export interface Layer {

    apply(entities:Entities):Entities

  }

  export class DataLayer implements Layer {

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

  export class FunctionLayer implements Layer {

    private fn:(entities:Entities) => Entities;

    constructor(fn:(entities:Entities) => Entities) {
      this.fn = fn;
    }

    apply(entities:Entities):Entities {
      return this.fn(entities);
    }

  }

  function callListener(listener:() => void) {
    listener();
  }

  var empty = Immutable.Map<Ref, Entity>();

  export class Storage {

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

    adopt(data:any):LayerHandle {
      return this.addLayer(new DataLayer(data));
    }

    addLayer(layer:Layer):LayerHandle {
      this.layers = this.layers.push(layer);
      var handle = new LayerHandle(layer, this);
      this.notify();
      return handle;
    }

    removeLayer(layer:Layer):void {
      var index = this.layers.indexOf(layer);
      if (index !== -1) {
        this.layersCache = this.layersCache.slice(0, index).toList();
        this.layers = this.layers.remove(index);
        this.notify();
      }
    }

    addListener(listener:() => void):void {
      this.listeners = this.listeners.add(listener);
    }

    removeListener(listener:() => void):void {
      this.listeners = this.listeners.remove(listener);
    }

    read(ref:any):Entity {
      if (typeof ref === 'string') {
        ref = new Ref(ref);
      }
      if (!this.entities.has(ref)) {
        return null;
      }
      return this.entities.get(ref);
    }

    get(ref:any):Entity {
      if (typeof ref === 'string') {
        ref = new Ref(ref);
      }
      if (!this.cache.has(ref)) {
        if (!this.entities.has(ref)) {
          return null;
        }
        var traverse = (item:any):any => {
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
        };
        traverse(ref);
      }
      return this.cache.get(ref);
    }

    has(ref:any, ...fields:Array<string>):boolean {
      var entity = this.get(ref);
      if (!entity) {
        return false;
      }
      return fields.every((name:string) => entity.has(name));
    }

  }

  export class LayerHandle {
    private layer:Layer;
    private storage:Storage;

    constructor(layer:Layer, storage:Storage) {
      this.layer = layer;
      this.storage = storage;
    }

    remove():void {
      this.storage.removeLayer(this.layer);
    }
  }

}

export = datal;
