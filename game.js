'use strict';
class Vector {
  constructor(x=0, y=0){
    this.x = x;
    this.y = y;
  }

  plus(vectorObj) {
    if(vectorObj instanceof Vector){
      var xnew = this.x + vectorObj.x;
      var ynew = this.y + vectorObj.y;
      return new this.constructor(xnew, ynew);
    } else {
      throw new Error('Можно прибавлять к вектору только вектор типа Vector!');
    }
  }

  times(factor) {
    var xnew = this.x * factor;
    var ynew = this.y * factor;
    return new this.constructor(xnew, ynew);
  }
}

class Actor {
  constructor(posVect = new Vector(0, 0), sizeVect = new Vector(1, 1), speedVect = new Vector(0, 0)) {
    if(Vector.prototype.isPrototypeOf(posVect) && Vector.prototype.isPrototypeOf(sizeVect) && Vector.prototype.isPrototypeOf(speedVect)) {
      this.pos = posVect;
      this.size = sizeVect;
      this.speed = speedVect;
      Object.defineProperty(this, 'type', {
      writable: false,
      value: 'actor'
      });
    } else {
      throw new Error('parameter is not an instance of Vector!');
    }
  }

  get left() {return this.pos.x}

  get top() {return this.pos.y}

  get right() {return this.pos.x + this.size.x}

  get bottom() {return this.pos.y + this.size.y}

  act(){}

  isIntersect(actorObj) {
    if (!Actor.prototype.isPrototypeOf(actorObj)){
        throw new Error('wrong object type!');
    }
    if(actorObj === 0){
        throw new Error('no parameter provided!');
    }

    if (actorObj === this) {
      return false;
    }

    if((this.left >= actorObj.right) || (this.top >= actorObj.bottom) ||
       (actorObj.left >= this.right) || (actorObj.top >= this.bottom)){
         return false;
    } else {
      return true;
    }
  }
}
