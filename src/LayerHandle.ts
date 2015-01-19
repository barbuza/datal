import Layer = require('./Layer');
import Storage = require('./Storage');

class LayerHandle {
  private layer:Layer;
  private storage:Storage;

  constructor(layer:Layer, storage:Storage) {
    this.layer = layer;
    this.storage = storage;
  }

  public remove():void {
    this.storage.removeLayer(this.layer);
  }
}

export = LayerHandle
