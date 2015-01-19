import Immutable = require('immutable');

var refs = Immutable.Map<string, Ref>().asMutable();

class Ref {

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

export = Ref;