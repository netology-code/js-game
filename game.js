'use strict';
class Vector {
  constructor (x=0, y=0) {
    this.x = x;
    this.y = y;
}
plus(vector) {
  if(!(vector instanceof Vector)) {
    throw Error ('Можно прибавлять к вектору только вектор типа Vector');
  }
  return new Vector (this.x + vector.x, this.y + vector.y);
}
times(q) {
  return new Vector (this.x * q, this.y * q);
}
}
//Проверила, работет

class Actor {
  constructor (pos = new Vector(0,0), size = new Vector(1,1), speed = new Vector(0,0)) {
    if ((!(pos instanceof Vector)) || (!(size instanceof Vector)) || (!(speed instanceof Vector))){
      throw Error('Параметр должен быть объектом типа Vector');
    } 
    this.pos = pos;
    this.size = size;
    this.speed = speed;
    Object.defineProperty(this, 'type', {
      writable: false,
      value: 'actor'
      });
}

act () {
}

get left() {
  return this.pos.x;
}
get top() {
  return this.pos.y;
}
get right() {
  return this.pos.x + this.size.x;
}
get bottom() {
  return this.pos.y + this.size.y;
}

isIntersect(moveObj) {
  if (!(moveObj instanceof Actor)) {
    throw Error('Объект должен быть объектом типа Actor');
} 
  if (moveObj === undefined) return false;
  if (moveObj === this) return false;
  if ((moveObj.left >= this.right) || (moveObj.top >= this.bottom) || (moveObj.right <= this.left) || (moveObj.bottom <= this.top)) {return false;
  } else {return true;
  }
}
}
//Проверила, работает

class Level {
  constructor (grid = [], actors= []) {
    this.grid = grid;
    this.actors = actors;
    Object.defineProperty(this, 'type', {
      value: 'player'
      });
    this.height = this.grid.length;
    this.width = Math.max(...this.grid.map(function (el) {
return el.length;
}));
    this.status = null;
    this.finishDelay = 1;
  }

isFinished() {
  if((this.status !== null) && (this.finishDelay < 0)) {
    return true;
  } return false;
}

actorAt(moveObj) {
  if (!(moveObj instanceof Actor)) {
    throw Error('Объект должен быть объектом типа Actor');
} 
  if (moveObj === undefined) {
    throw Error('Отсутствуют аргументы');
} 
  if (moveObj.isIntersect()===true) return Actor;
  return undefined;
}

obstacleAt(newPos, size) {
  //Не поняла, что надо передать первым аргументом
  if((!(newPos instanceof Vector)) || (!(size instanceof Vector))) {
    throw Error('Аргументы не являются объектом типа Vector');
  }
  //здесь надо думать, как обозначить границы объекта. И что-то здесь не работает. А, надо же все препятствия на поле возвращать
  
  var leftSide = Math.floor(newPos.x);
  var rightSide = Math.ceil(newPos.x + size.x);
  var topSide = Math.floor(newPos.y);
  var bottomSide = Math.ceil(newPos.y + size.y);
  if((leftSide < 0) || (rightSide > this.width) || (topSide > this.height)) {
    return 'wall';
  } else if(bottomSide < 0) {
    return 'lava';
  } else return undefined;
}

removeActor(moveObj) {
  if(this.actors.includes(moveObj)) {
    let actorIndex = this.actors.indexOf(moveObj);
    this.actors.splice(actorIndex, 1);
  }
}

noMoreActors(moveObj) {
  if(moveObj.type !== 'actor') {
    return true;
  } return false;
}

playerTouched(type, moveObj) {
  if (this.status !== null) {
    if((type === 'lava') || (type === 'fireball')) {
      this.status = 'lost';
      return this.status;
    }
    else if((type === 'coin') && (moveObj instanceof Coin)) // второе условие ?
  {
      this.removeActor(moveObj);
      if(this.noMoreActors(moveObj)) {
        this.status = 'won';
      }
    }
  }
}
}

class LevelParser {
  constructor (list) {
    this.list = list;
  }
    
actorFromSymbol(symbol) {
  if(Object.keys(this.dictionary).includes(symbol)) {
    return this.list(symbol);
  } else return undefined;
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

createGrid(arrOfString) {
  let arr=[];
  for (let i=0; i < arr.length; i++) {
      arr[i] = []; 
      for (let n = 0; n < arrOfString[i].length; n++) {
            arr[i][n].push(this.obstacleFromSymbol(arrOfString[i][n]));
          }
        }
    return arr;
  }

createActors(arrOfString) {
  let arrMove = [];
  if(this.actorFromSymbol.type === 'actor')
  {
    // не придумала
  }
}

parse(arrOfString) {
  return new Level();
}
}

const plan = [
  ' @ ',
  'x!x'
];

const actorsDict = Object.create(null);
actorsDict['@'] = Actor;

const parser = new LevelParser(actorsDict);
const level = parser.parse(plan);

level.grid.forEach((line, y) => {
  line.forEach((cell, x) => console.log(`(${x}:${y}) ${cell}`));
});

level.actors.forEach(actor => console.log(`(${actor.pos.x}:${actor.pos.y}) ${actor.type}`));


class Fireball extends Actor{
	constructor(pos = new Vector(0,0), speed = new Vector(0,0)){	
		super(pos, new Vector(1,1), speed);
		Object.defineProperty(this, 'type', {
      writable: false,
      value: 'fireball'
      });
	}
	
getNextPosition(time = 1) {
 return new Vector(this.pos.plus(this.speed.times(time)));
}

handleObstacle() {
  this.speed = this.speed * (-1);
}

act(time, level) {
  if(level.obstacleAt(this.newPos, this.size)) {
    this.handleObstacle();
  } else {
    this.pos = this.getNextPosition(time);
  }
}	
}

const time = 5;
const speed = new Vector(1, 0);
const position = new Vector(5, 5);

const ball = new Fireball(position, speed);

const nextPosition = ball.getNextPosition(time);
console.log(`Новая позиция: ${nextPosition.x}: ${nextPosition.y}`);

ball.handleObstacle();
console.log(`Текущая скорость: ${ball.speed.x}: ${ball.speed.y}`);


class HorizontalFireball extends Fireball {
  constructor (pos) {
    super (pos, new Vector(2, 0));
  }
}

class VerticalFireball extends Fireball {
  constructor (pos) {
    super (pos, new Vector(0, 2));
  }
}

class FireRain extends Fireball {
  constructor (pos) {
    super (pos, new Vector(1,1), new Vector(0,3));
  }
}

class Coin extends Actor {
  constructor (pos) {
    super (new Vector(x+0.2, y+0.1), new Vector(0.6, 0.6));//не знаю, как задать координаты
    Object.defineProperty(this, 'type', {
      writable: false,
      value: 'coin'
      });
      //this.pos.plus((0.2, 0.1), (0.6, 0.6)); ? а в супере задать (pos)
      this.springSpeed = 8;
      this.springDist = 0.07;
      this.spring = Math.random() * 2 * Math.PI;
  }
  
updateSpring(time = 1) {
  this.spring = this.spring + this.springSpeed * time;
}

getSpringVector() {
  return new Vector(0, Math.sin*(this.spring * this.Dist));
}

getNextPosition(time = 1) {
  //подозреваю, что это неправильно, и взят не базовый вектор положения
  return this.pos.plus(this.getSpringVector());
}

act(time) {
  this.pos = this.getNextPosition(time);
}
}

class Player extends Actor {
    constructor(pos = new Vector(x, y)) {
      // Тут тоже не умею задавать меняющиеся координаты вектора
      super(new Vector(x, y-0.5), new Vector(0.8, 1.5), new Vector(0,0));
      Object.defineProperty(this, 'type', {
        writable: false,
        value: 'player'
      });
    }

}

