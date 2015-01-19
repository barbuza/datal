import Immutable = require('immutable');

import Ref = require('./Ref');
import Entity = require('./Entity');

interface Entities extends Immutable.Map<Ref, Entity> {

}

export = Entities;
