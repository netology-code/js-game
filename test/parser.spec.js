'use strict';

describe('Класс LevelParser', () => {
  const Mushroom = extend(Actor, { type: { value: 'mushroom' }});
  const Gift = extend(Actor, { type: { value: 'gift' }});
  class BadActor {}

  describe('Конструктор new LevelParser()', () => {
  });

  describe('Метод actorFromSymbol', () => {


    it('Вернет undefined, если не передать символ', () => {
      const parser = new LevelParser();

      const actor = parser.actorFromSymbol();

      expect(actor).to.be.undefined;
    });

    it('Вернет undefined, если передать символ которому не назначен конструктор движимого объекта', () => {
      const parser = new LevelParser({ y: Mushroom });

      const actor = parser.actorFromSymbol('z');

      expect(actor).to.be.undefined;
    });

    it('Вернет подходящий конструктор движимого объекта, если передать символ которому он назначен', () => {
      const parser = new LevelParser({ y: Mushroom });

      const actor = parser.actorFromSymbol('y');

      expect(actor).to.equal(Mushroom);
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
    let plan;

    beforeEach(() => {
      plan = [
        'x  x',
        '!!!!'
      ];
    });

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

      expect(grid[0]).to.eql(['wall',undefined,undefined,'wall']);
    });

    it('Символы ! определит как lava и поместит в соответствующую ячейку', () => {
      const parser = new LevelParser();

      const grid = parser.createGrid(plan);

      expect(grid[1]).to.eql(new Array(4).fill('lava'));
    });
  });

  describe('Метод createActors', () => {
    let plan;

    beforeEach(() => {
      plan = [
        'o   o',
        '  z  ',
        'o   o'
      ];
    });

    it('Вернет пустой массив, если передать пустой план', () => {
      const parser = new LevelParser({ o: Gift, z: Mushroom });

      const actors = parser.createActors([]);

      expect(actors).to.eql([]);
    });

    it('Вернет пустой массив, если не определить символы движущихся объектов', () => {
      const parser = new LevelParser();

      const actors = parser.createActors(plan);

      expect(actors).to.eql([]);
    });

    it('Игнорирует символы, для которых в словаре не задан символ', () => {
      const parser = new LevelParser({ z: 'mushroom' });

      const actors = parser.createActors(['m']);

      expect(actors).to.eql([]);
    });

    it('Игнорирует символы, для которых в словаре передана не функция', () => {
      const parser = new LevelParser({ z: 'mushroom' });

      const actors = parser.createActors(['z']);

      expect(actors).to.eql([]);
    });

    it('Игнорирует символы, для которых в словаре передан конструктор не Actor', () => {
      const parser = new LevelParser({ b: BadActor });

      const actors = parser.createActors(['b']);

      expect(actors).to.eql([]);
    });

    it('Создает движущиеся объекты для конструктора Actor', () => {
      const parser = new LevelParser({ z: Actor });

      const actors = parser.createActors(['z']);

      expect(actors).to.have.length(1);
    });

    it('Создает движущиеся объекты правильного типа для конструктора Actor ', () => {
      const parser = new LevelParser({ z: Actor });

      const actors = parser.createActors(['z']);

      expect(actors[0]).to.be.an.instanceof(Actor);
    });

    it('Создает движущиеся объекты для конструкторов типа Actor', () => {
      const parser = new LevelParser({ z: Mushroom });

      const actors = parser.createActors(['z']);

      expect(actors).to.have.length(1);
    });

    it('Создает движущиеся объекты правильного типа для конструкторов типа Actor ', () => {
      const parser = new LevelParser({ z: Mushroom });

      const actors = parser.createActors(['z']);

      expect(actors[0]).to.be.an.instanceof(Mushroom);
    });

    it('Вернет массив со всеми движущимися объектами, если передать план', () => {
      const parser = new LevelParser({ o: Gift, z: Mushroom });

      const actors = parser.createActors(plan);

      expect(actors).to.have.length(5);
    });

    it('Каждый движущийся объект будет экземпляром своего класса', () => {
      const parser = new LevelParser({ o: Gift, z: Mushroom });

      const actors = parser.createActors(plan);
      const oActors = actors.filter(actor => actor instanceof Gift);
      const zActors = actors.filter(actor => actor instanceof Mushroom);

      expect(oActors).to.have.length(4);
      expect(zActors).to.have.length(1);
    });

    it('Каждый движущийся объект будет иметь координаты той ячейки, где он размещен на плане', () => {
      const parser = new LevelParser({ o: Actor, z: Actor });

      const actors = parser.createActors(plan);

      expect(actors.some(actor => actor.pos.x === 0 && actor.pos.y === 0)).to.be.true;
      expect(actors.some(actor => actor.pos.x === 4 && actor.pos.y === 0)).to.be.true;
      expect(actors.some(actor => actor.pos.x === 2 && actor.pos.y === 1)).to.be.true;
      expect(actors.some(actor => actor.pos.x === 0 && actor.pos.y === 0)).to.be.true;
      expect(actors.some(actor => actor.pos.x === 4 && actor.pos.y === 2)).to.be.true;
    });
  });

  describe('Метод parse', () => {
    let plan;

    beforeEach(() => {
      plan = [
        ' oxo ',
        '!xzx!',
        ' oxo '
      ];
    });

    it('Вернет объект уровня, Level', () => {
      const parser = new LevelParser();

      const level = parser.parse([]);

      expect(level).to.be.an.instanceof(Level);
    });

    it('Высота уровня будет равна количеству строк плана', () => {
      const parser = new LevelParser();

      const level = parser.parse(plan);

      expect(level.height).to.equal(3);
    });

    it('Ширина уровня будет равна количеству символов в максимальной строке плана', () => {
      const parser = new LevelParser();

      const level = parser.parse(plan);

      expect(level.width).to.equal(5);
    });

    it('Создаст уровень с движущимися объектами из плана', () => {
      const parser = new LevelParser({ o: Gift, z: Mushroom });

      const level = parser.parse(plan);

      expect(level.actors).to.have.length(5);
    });

    it('Создаст уровень с припятствиями из плана', () => {
      const parser = new LevelParser();

      const level = parser.parse(plan);

      expect(level.grid).to.eql([
        [undefined, undefined,'wall',undefined,undefined],
        ['lava','wall',undefined,'wall','lava'],
        [undefined,undefined,'wall',undefined,undefined]
      ]);
    });
  });
});
