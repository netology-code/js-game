'use strict';

describe('Класс Actor', () => {
  let position, size;

  beforeEach(() => {
    position = new Vector(30, 50);
    size = new Vector(5, 5);
  });

  describe('Конструктор new Actor()', () => {
    it('Создает объект со свойством pos, который является вектором', () => {
      const player = new Actor();

      expect(player.pos).is.instanceof(Vector);
    });

    it('Создает объект со свойством size, который является вектором', () => {
      const player = new Actor();

      expect(player.size).is.instanceof(Vector);
    });

    it('Создает объект со свойством speed, который является вектором', () => {
      const player = new Actor();

      expect(player.speed).is.instanceof(Vector);
    });

    it('Создает объект со свойством type, который является строкой', () => {
      const player = new Actor();

      expect(player.type).to.be.a('string');
    });

    it('Создает объект с методом act', () => {
      const player = new Actor();

      expect(player.act).is.instanceof(Function);
    });

    it('По умолчанию создается объект расположенный в точке 0:0', () => {
      const player = new Actor();

      expect(player.pos).is.eql(new Vector(0, 0));
    });

    it('По умолчанию создается объект расмером 1x1', () => {
      const player = new Actor();

      expect(player.size).is.eql(new Vector(1, 1));
    });

    it('По умолчанию создается объект со скоростью 0:0', () => {
      const player = new Actor();

      expect(player.speed).is.eql(new Vector(0, 0));
    });

    it('По умолчанию создается объект со свойством type равным actor', () => {
      const player = new Actor();

      expect(player.type).to.equal('actor');
    });

    it('Свойство type нельзя изменить', () => {
      const player = new Actor();

      function fn() {
        player.type = 'player';
      }

      expect(fn).to.throw(Error);
    });

    it('Создает объект в заданном расположении, если передать вектор первым аргументом', () => {
      const player = new Actor(position);

      expect(player.pos).is.equal(position);
    });

    it('Бросает исключение, если передать не вектор в качестве расположения', () => {

      function fn() {
        const player = new Actor({ x: 12, y: 24 });
      }

      expect(fn).to.throw(Error);
    });

    it('Создает объект заданного размера, если передать вектор вторым аргументом', () => {
      const player = new Actor(undefined, size);

      expect(player.size).is.equal(size);
    });

    it('Бросает исключение, если передать не вектор в качестве размера', () => {

      function fn() {
        const player = new Actor(undefined, { x: 12, y: 24 });
      }

      expect(fn).to.throw(Error);
    });

    it('Бросает исключение, если передать не вектор в качестве скорости', () => {

      function fn() {
        const player = new Actor(undefined, undefined, { x: 12, y: 24 });
      }

      expect(fn).to.throw(Error);
    });
  });

  describe('Границы объекта', () => {
    it('Имеет свойство left, которое содержит координату левой границы объекта по оси X', () => {
      const player = new Actor(position, size);

      expect(player.left).is.equal(30);
    });

    it('Имеет свойство right, которое содержит координату правой границы объекта оп оси X', () => {
      const player = new Actor(position, size);

      expect(player.right).is.equal(35);
    });

    it('Имеет свойство top, которое содержит координату верхней границы объекта по оси Y', () => {
      const player = new Actor(position, size);

      expect(player.top).is.equal(50);
    });

    it('Имеет свойство bottom, которое содержит координату правой границы объекта оп оси Y', () => {
      const player = new Actor(position, size);

      expect(player.bottom).is.equal(55);
    });
  });

  describe('Метод isIntersect', () => {
    it('Если передать объект не являющийся экземпляром Actor, то получим исключение', () => {
      const player = new Actor();

      function fn() {
        player.isIntersect({ left: 0, top: 0, bottom: 1, right: 1 });
      }

      expect(fn).to.throw(Error);
    });

    it('Объект не пересекается сам с собой', () => {
      const player = new Actor(position, size);

      const notIntersected = player.isIntersect(player);

      expect(notIntersected).is.equal(false);
    });

    it('Объект не пересекается с объектом расположенным очень далеко', () => {
      const player = new Actor(new Vector(0, 0));
      const coin = new Actor(new Vector(100, 100));

      const notIntersected = player.isIntersect(coin);

      expect(notIntersected).is.equal(false);
    });

    it('Объект не пересекается с объектом со смежными границами', () => {
      const player = new Actor(position, size);

      const moveX = new Vector(1, 0);
      const moveY = new Vector(0, 1);

      const coins = [
        new Actor(position.plus(moveX.times(-1))),
        new Actor(position.plus(moveY.times(-1))),
        new Actor(position.plus(size).plus(moveX)),
        new Actor(position.plus(size).plus(moveY))
      ];

      coins.forEach(coin => {
        const notIntersected = player.isIntersect(coin);

        expect(notIntersected).is.equal(false);
      });
    });

    it('Объект не пересекается с объектом расположенным в той же точке, но имеющим отрицательный вектор размера', () => {
      const player = new Actor(new Vector(0, 0), new Vector(1, 1));
      const coin = new Actor(new Vector(0, 0), new Vector(1, 1).times(-1));

      const notIntersected = player.isIntersect(coin);

      expect(notIntersected).is.equal(false);
    });

    it('Объект пересекается с объектом, который полностью содержится в нём', () => {
      const player = new Actor(new Vector(0, 0), new Vector(100, 100));
      const coin = new Actor(new Vector(10, 10), new Vector());

      const intersected = player.isIntersect(coin);

      expect(intersected).is.equal(true);
    });

    it('Объект пересекается с объектом, который частично содержится в нём', () => {
      const player = new Actor(position, size);

      const moveX = new Vector(1, 0);
      const moveY = new Vector(0, 1);

      const coins = [
        new Actor(position.plus(moveX.times(-1)), size),
        new Actor(position.plus(moveY.times(-1)), size),
        new Actor(position.plus(moveX), size),
        new Actor(position.plus(moveY), size)
      ];

      coins.forEach(coin => {
        const intersected = player.isIntersect(coin);

        expect(intersected).is.equal(true);
      });
    });

  });
});
