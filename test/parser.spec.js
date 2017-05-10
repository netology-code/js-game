'use strict';

describe('Класс LevelParser', () => {
  class MyActor {}

  describe('Конструктор new LevelParser()', () => {
  });

  describe('Метод actorFromSymbol', () => {


    it('Вернет undefined, если не передать символ', () => {
      const parser = new LevelParser();

      const actor = parser.actorFromSymbol();

      expect(actor).to.be.undefined;
    });

    it('Вернет undefined, если передать символ которому не назначен конструктор движимого объекта', () => {
      const parser = new LevelParser({ y: MyActor });

      const actor = parser.actorFromSymbol('z');

      expect(actor).to.be.undefined;
    });

    it('Вернет подходящий конструктор движимого объекта, если передать символ которому он назначен', () => {
      const parser = new LevelParser({ y: MyActor });

      const actor = parser.actorFromSymbol('y');

      expect(actor).to.equal(MyActor);
    });
  });

  describe('Метод obstacleFromSymbol', () => {
    it('Вернет undefined, если не передать символ', () => {
      const parser = new LevelParser();

      const obstacle = parser.obstacleFromSymbol();

      expect(obstacle).to.be.undefined;
    });

    it('Вернет undefined, если передать неизветсный символ', () => {
      const parser = new LevelParser();

      const obstacle = parser.obstacleFromSymbol('Z');

      expect(obstacle).to.be.undefined;
    });

    it('Вернет wall, если передать символ x', () => {
      const parser = new LevelParser();

      const obstacle = parser.obstacleFromSymbol('x');

      expect(obstacle).to.equal('wall');
    });

    it('Вернет lava, если передать символ !', () => {
      const parser = new LevelParser();

      const obstacle = parser.obstacleFromSymbol('!');

      expect(obstacle).to.equal('lava');
    });
  });

  describe('Метод createGrid', () => {
    const plan = [
      'x x',
      '!!!'
    ];

    it('Вернет пустой массив, если передать пустой план', () => {
      const parser = new LevelParser();

      const grid = parser.createGrid([]);

      expect(grid).to.eql([]);
    });

    it('Вернет массив того же размера что и plan', () => {
      const parser = new LevelParser();

      const grid = parser.createGrid(plan);

      expect(grid.length).to.equal(plan.length);
    });

    it('В ряду будет столько элементов, сколько символов в строке плана', () => {
      const parser = new LevelParser();

      const grid = parser.createGrid(plan);

      grid.forEach((row, y) => {
        expect(row.length).to.equal(plan[y].length);
      });
    });

    it('Символы x определит как wall и поместит в соответствующую ячейку', () => {
      const parser = new LevelParser();

      const grid = parser.createGrid(plan);

      grid.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (plan[y][x] === 'x') {
            expect(cell).to.equal('wall');
          }
        })
      });
    });

    it('Символы ! определит как lava и поместит в соответствующую ячейку', () => {
      const parser = new LevelParser();

      const grid = parser.createGrid(plan);

      grid.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (plan[y][x] === '!') {
            expect(cell).to.equal('lava');
          }
        })
      });
    });
  });

  describe('Метод createActors', () => {
    const plan = [
      'o o',
      ' z ',
      'o o'
    ];
    class MyActor {}

    it('Вернет пустой массив, если не определить символы движущихся объектов', () => {
      const parser = new LevelParser();

      const actors = parser.createActors(plan);

      expect(actors).to.eql([]);
    });

    it('Вернет пустой массив, если передать пустой план', () => {
      const parser = new LevelParser({ o: Actor, z: MyActor });

      const actors = parser.createActors([]);

      expect(actors).to.eql([]);
    });

    it('Вернет массив со всеми движущимися объектами, если передать план', () => {
      const parser = new LevelParser({ o: Actor, z: MyActor });

      const actors = parser.createActors(plan);

      expect(actors).to.have.length(5);
    });

    it('Каждый движущийся объект будет экземпляром своего класса', () => {
      const parser = new LevelParser({ o: Actor, z: MyActor });

      const actors = parser.createActors(plan);
      const oActors = actors.filter(actor => actor instanceof Actor);
      const zActors = actors.filter(actor => actor instanceof MyActor);

      expect(oActors).to.have.length(4);
      expect(zActors).to.have.length(1);
    });

    it('Каждый движущийся объект будет иметь координаты той ячейки, где он размещен на плане', () => {
      const parser = new LevelParser({ o: Actor, z: Actor });

      const actors = parser.createActors(plan);

      expect(actors.some(actor => actor.pos.x === 0 && actor.pos.y === 0)).to.be.true;
      expect(actors.some(actor => actor.pos.x === 2 && actor.pos.y === 0)).to.be.true;
      expect(actors.some(actor => actor.pos.x === 1 && actor.pos.y === 1)).to.be.true;
      expect(actors.some(actor => actor.pos.x === 0 && actor.pos.y === 0)).to.be.true;
      expect(actors.some(actor => actor.pos.x === 2 && actor.pos.y === 2)).to.be.true;
    });
  });

  describe('Метод parse', () => {
    const plan = [
      'oxo',
      'xzx',
      'oxo'
    ];
    class MyActor {}

    it('Вернет объект уровня, Level', () => {
      const parser = new LevelParser();

      const level = parser.parse([]);

      expect(level).to.be.an.instanceof(Level);
    });

    it('Высота уровня будет равна количеству строк плана', () => {
      const parser = new LevelParser();

      const level = parser.parse(plan);

      expect(level.width).to.equal(plan.length);
    });

    it('Ширина уровня будет равна количеству символов в максимальной строке плана', () => {
      const parser = new LevelParser();

      const level = parser.parse(plan);

      expect(level.height).to.equal(plan[0].length);
    });

    it('Создаст уровень с движущимися объектами из плана', () => {
      const parser = new LevelParser({ x: Actor, z: MyActor });

      const level = parser.parse(plan);

      expect(level.actors).to.have.length(5);
    });

    it('Создаст уровень с припятствиями из плана', () => {
      const parser = new LevelParser();

      const level = parser.parse(plan);

      level.grid.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (plan[y][x] === 'x') {
            expect(cell).to.equal('wall');
          }
        })
      });
    });
  });
});
