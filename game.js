'use strict';

class Vector {
  
  constructor(x=0,y=0) {
    this.x = x;
    this.y = y;
  }

  plus(vector) {
      if (!(vector instanceof Vector)) {
        throw new Error('передан неправильный агрумент, нужен вектор);
      }
	  
      else {
		  return sum = new Vector(this.x+vector.x, this.y+vector.y);
		}
  }
  
  times(multiplier) {
    let result = new Vector(this.x*multiplier, this.y*multiplier);
    return result;
  }
} 



class Actor {
  constructor(pos = new Vector(0, 0), size = new Vector(1, 1), speed = new Vector(0, 0)) {
    try {
      if (!(Vector.prototype.isPrototypeOf(pos) && Vector.prototype.isPrototypeOf(size) && Vector.prototype.isPrototypeOf(speed))) {
        throw "передан неправильный агрумент, нужен вектор";
      }     
      
    this.pos = pos;
    this.size = size;
    this.speed = speed;
   
    const leftconfig = {     
      get() {
        return this.pos.x;
      }    
    }
    Object.defineProperty(this,'left', leftconfig);

    const topconfig = {
      get() {
        return this.pos.y;
      }     
    }
    Object.defineProperty(this,'top', topconfig);

    const rightconfig = { 
       get() {
        return this.pos.x + this.size.x;
      }     
    }
    Object.defineProperty(this,'right', rightconfig);

    const bottomconfig = {     
       get() {
        return this.pos.y + this.size.y;
      }  
    }
    Object.defineProperty(this,'bottom', bottomconfig);

    const typeconfig = {     
      value: 'actor'
    }
    Object.defineProperty(this,'type', typeconfig);
       

    }
    catch (err) {
      console.log(`Возникла ошибка: ${err}`);
    }
  }

  act() {}

  isIntersect(test) {

    if (this === test){
      return false;
    }
  
  let res = 
    (
      (this.top < test.top) && (test.top < this.bottom) && 
      (
        (this.left < test.left) && (test.left < this.right) || (this.left < test.right) && (test.right < this.right)      
      )
    ) 
  || 
    (
      (this.top < test.bottom) && (test.bottom < this.bottom) &&
      (
        (this.left < test.left) && (test.left < this.right) || (this.left < test.right) && (test.right < this.right)
      )
      
    )    
  ||
    (
      (test.top <= this.top) && (this.top <= test.bottom) && (test.left <= this.left) && (this.left <= test.right)
    )

    return  res; 
  }

}


class Level {
  constructor(grid, actors) {
    this.grid = grid;
    this.actors = actors;
    for (let i=0; i<actors.length; i++) {
      if (actors[i].type == 'player') {
       this.player = actors[i];
       break;
      }
    }
   this.height = grid.length;
   this.width = grid[0].length;
   for (let i=1; i<grid.length; i++) {
      if (grid[i].length > this.width) {
       this.width = grid[i].length;
      }
   }
   this.status = null;
   this.finishDelay = 1;
  }
  
 isFinished() {
   return (this.status != null) && (this.finishDelay > 0);
 }

 actorAt(actor) {
  try {
    if (!Actor.prototype.isPrototypeOf(actor)) {
      throw "передан неправильный агрумент";
    } 
    for (let i=0; i<this.actors.length; i++) {
     if (actor.isIntersect(this.actors[i])){
      return this.actors[i];
     }  
    }
  return undefined;
 }
  catch (err) {
    console.log(`Возникла ошибка: ${err}`);
  }
 }

  obstacleAt(pos, size) {
    try {
      if (!(Vector.prototype.isPrototypeOf(pos) && Vector.prototype.isPrototypeOf(size))) {
        throw "передан неправильный агрумент, нужен вектор";
      }   
      if((pos.y+size.y) > this.height) {
        return 'lava';
      }
      if((pos.y < 0) || ((pos.x+size.x) > this.width) || (pos.x < 0)) {
        return 'wall';
      }
      for(let x = pos.x; x < pos.x+size.x; x++) {
        for(let y = pos.y; y < pos.y+size.y; y++) {
          if ((grid[x][y] == 'lava') || (grid[x][y] == 'wall')) {
            return grid[x][y];
          }
        }
      }
      return undefined;
    }
    catch (err) {
      console.log(`Возникла ошибка: ${err}`);
    }
  }

  removeActor(actor) {
    for (let i=0; i < this.actors.length; i++) {
      if(actor == this.actors[i]) {
        this.actors.splice(i, 1);
        break;
      }
     }  
    }

  noMoreActors(type) {
    for (let i=0; i < this.actors.length; i++) {
      if (this.actors[i].type == type) {
        return false;
      }
    }
    return true;
  }

  playerTouched(type, actor) {  
    if ((type == 'lava') || (type == 'fireball')) {
      this.status = 'lost';
    }
    else if (type == 'coin') {
      this.removeActor(actor);
      if (!this.noMoreActors('coin')) {
        this.status = 'won';
      }
    }
  }
}



class LevelParser {
  constructor(dictionary){
    this.dictionary = dictionary;
  }
  // нужно ли записывать словарь?

  actorFromSymbol(sym){
    return this.dictionary[sym];  
  }

  obstacleFromSymbol(sym){
    if (sym='x') {
      return 'wall';
    }
    if (sym='!') {
      return 'lava';
    }
    return undefined;
  }

  createGrid(grid){
    for(let i=0; i < grid.length; i++) {
      grid[i] = grid[i].split('');
      for(let j=0; j < grid[i].length; j++){
        if (grid[i][j] == 'x') {
          grid[i][j] = 'wall';
        } else if (grid[i][j] == '!') {
          grid[i][j] = 'lava';
        } else {
          grid[i][j] = undefined;
        }
      }
    }
    return grid;
  }

  createActors(actors){
    var arr = [];
    for(let y=0; y < actors.length; y++){
      for(let x=0; x < actors[y].length; x++){
        let pos = new Vector(x, y);
        if (actors[y][x] in this.dictionary) {
           let item = new this.dictionary[actors[y][x]](pos);
           arr.push(item);
        }
      }
    }
    return arr;
  }

  parse(grid) {
    let actors = grid.slice();
    grid = this.createGrid(grid);
    actors = this.createActors(actors);
    return new Level(grid, actors);
  }

}


class Fireball extends Actor {
	constructor(pos, speed) {
    super(pos, new Vector(1, 1), speed);
}

  getNextPosition(t) {
    let res = new Vector(this.pos.x+t*this.speed.x, this.pos.y+t*this.speed.y);
    return res;
  }

  handleObstacle() {
    this.speed.x=-this.speed.x;
    this.speed.y=-this.speed.y;
  }

  act(t, level) {
    let next = this.getNextPosition(t);
    if (level.obstacleAt(next, this.size)) {
			this.handleObstacle();
		} 
    else {
			this.pos.x = next.x;
			this.pos.y = next.y;
    }    
  }
}


class HorizontalFireball extends Fireball {
	constructor(pos) {
    super(pos, new Vector(1, 1), new Vector(2, 0));
  }
}

class VerticalFireball extends Fireball {
	constructor(pos) {
    super(pos, new Vector(1, 1), new Vector(0, 2));
  }
}

class FireRain extends Fireball {
	constructor(pos) {
    super(pos, new Vector(1, 1), new Vector(0, 3));
    this.startpos = pos;
  }

  handleObstacle() {
    this.pos = this.startpos;
  }

}

class Coin extends Actor{
  constructor(pos) {
    super(new Vector(pos.x+0.2, pos.y+0.2), new Vector(0.6, 0,6));
    this.type = 'coin';
    this.springSpeed = 8;
    this.springDist = 0.07;
    this.spring = Math.random() * (2 * Math.PI);
  }

 updateSpring(t=1) {
    this.spring = this.spring + this.springSpeed*t;
 }

  getSpringVector(){
    let res = new Vector(0, Math.sin(this.spring) * this.springDist);
    return res;
  }

  getNextPosition(t=1){
    this.updateSpring(t);
    return this.pos.plus(this.getSpringVector());
  }

  act(t){
    this.pos = this.getNextPosition(t);
  }
}

class Player extends Actor {
    constructor(pos = new Vector(0, 0)) {
      this.size = new Vector(0.8, 1.5);
      this.pos = pos.plus(new Vector(0, -0.5));
      this.type = player;
  }
}



const schemas = [
  [
    '         ',
    '         ',
    '    =    ',
    '       o ',
    '     !xxx',
    ' @       ',
    'xxx!     ',
    '         '
  ],
  [
    '      v  ',
    '    v    ',
    '  v      ',
    '        o',
    '        x',
    '@   x    ',
    'x        ',
    '         '
  ]
];
const actorDict = {
  '@': Player,
  'v': FireRain
}
const parser = new LevelParser(actorDict);
runGame(schemas, parser, DOMDisplay)
  .then(() => console.log('Вы выиграли приз!'));


