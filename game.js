'use strict';
class Vector {
  constructor(x=0, y=0) {
    this.x = x;
    this.y = y;
  }

  plus(vectorObj) {
    if(vectorObj instanceof Vector) {
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
    if (Vector.prototype.isPrototypeOf(posVect) && Vector.prototype.isPrototypeOf(sizeVect) && Vector.prototype.isPrototypeOf(speedVect)) {
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
    if (!Actor.prototype.isPrototypeOf(actorObj)) {
        throw new Error('wrong object type!');
    }
    if (actorObj === 0) {
        throw new Error('no parameter provided!');
    }

    if (actorObj === this) {
      return false;
    }

    if ((this.left >= actorObj.right) || (this.top >= actorObj.bottom) ||
       (actorObj.left >= this.right) || (actorObj.top >= this.bottom)) {
         return false;
    } else {
      return true;
    }
  }
}

class Level {
  constructor(grid, actors) {
    this.grid = grid || [];
    this.actors = actors || [];
    this.status = null;
    this.finishDelay = 1;
  }

  get player() {
    return this.actors.find(actor => actor.type === 'player');
  }

  get height() {
    return this.grid.length;
  }

  get width() {
    if (this.grid.length === 0) {
      return 0;
    } else {
      return this.grid.map(row => row.length).sort((a,b) => b-a)[0];
    }
  }

  isFinished() {
    if ((this.status !== null) && (this.finishDelay < 0)) {
      return true;
    } else {
      return false;
    }
  }

  actorAt(actorObj) {
    if (!('speed' in actorObj)) {
      throw new Error('Not a moving object!');
    }
    return this.actors.find(actor => actorObj.isIntersect(actor)===true);
  }

  obstacleAt(newPos, actorSize) {
    if (!Vector.prototype.isPrototypeOf(newPos) && !Vector.prototype.isPrototypeOf(actorSize)){
      throw new Error('Not an instance of Vector!');
    }

    let left = Math.floor(newPos.x);
    let right = Math.ceil(left + actorSize.x);
    let top = Math.floor(newPos.y);
    let bottom = Math.ceil(top + actorSize.y);

    if ((left < 0) || (top < 0) || (right > this.width)) {
      return 'wall';
    } else if (bottom > this.height) {
      return 'lava';
    } else {
      let area = [];
      for(let i = top + 1; i < bottom + 1; i++) {
        area.push(...this.grid[i].slice(left, right+1));
      }
      return area.find(v  => v !== undefined);
    }
  }

  removeActor(actorObj) {
    let delIndex = this.actors.indexOf(actorObj);
    if(delIndex === -1) {
      return;
    } else {
      this.actors.splice(delIndex, 1);
    }
  }

  noMoreActors(type) {
    let result = this.actors.findIndex(v => v.type === type);
    if (result === -1) {
      return true;
    } else {
      return false;
    }
  }

  playerTouched(type, actor) {
    if (this.status !== null) {
      return;
    }

    if ((type === 'lava') || (type === 'fireball')) {
      this.status = 'lost';
      return;
    }
    if ((type === 'coin') && (actor.type === 'coin')){
      this.removeActor(actor);
      if (this.noMoreActors('coin')) {
        this.status = 'won';
      }
    }
  }
}

class LevelParser {
  constructor(glossary) {
    this.glossary = glossary || [];
    this.actorsArr = [];
  }

  actorFromSymbol(symbol) {
    if (symbol === undefined) {
      return undefined;
    }
    if (symbol in this.glossary) {
      return this.glossary[symbol];
    }
  }

  obstacleFromSymbol(symbol) {
    switch (symbol) {
      case 'x':
        return 'wall';
      case '!':
        return 'lava';
      default:
        return undefined;
    }
  }

  createGrid(plan) {
    return plan.map(v => v.split('').map(v => v.replace(/[^x!]/, undefined))
      .map(v => v.replace(/x/, 'wall'))
      .map(v => v.replace(/!/, 'lava'))
    );
  }

  defineActorSymbols(symbol) {
    if ((symbol === '@') || (symbol === 'o') || (symbol === '=') || (symbol === '|') || (symbol === 'v') || (symbol === 'z')){
      return true;
    } else {
      return false;
    }
  }

  filterActors(v) {
    return v !== undefined;
  }

  createActors(plan) {
    plan.forEach((v, i) => {
      this.y = i;
      this.actorsArr.push(...v.split('').map((v, i) => {
        if(this.defineActorSymbols(v)){
          var ConstrActor = this.actorFromSymbol(v);
          if (ConstrActor !== undefined) {
          return new ConstrActor(new Vector(i, this.y));
          } else {
            return undefined;
          }
        } else {
          return undefined;
        }
      }).filter(this.filterActors));
    });
    return this.actorsArr;
  }

  parse(plan) {
    return new Level(this.createGrid(plan), this.createActors(plan));
  }
}
