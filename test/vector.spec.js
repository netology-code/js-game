'use strict';

describe('Класс Vector', () => {
  const x = 3, y = 7, left = 5, top = 10, n = 5;

  describe('Конструктор new Vector()', () => {
    it('создает объект со свойствами x и y равными аргументам конструктора', () => {
      const position = new Vector(left, top);

      expect(position.x).is.equal(left);
      expect(position.y).is.equal(top);
    });

    it('без аргументов создает объект со свойствами x и y равными 0', () => {
      const position = new Vector();

      expect(position.x).is.equal(0);
      expect(position.y).is.equal(0);
    });

  });

  describe('Метод plus()', () => {
    it('бросает исключение, если передать не вектор', () => {
      const position = new Vector(x, y);

      function fn() {
        position.plus({ left, top });
      }

      expect(fn).to.throw(Error);
    });

    it('создает новый вектор', () => {
      const position = new Vector(x, y);

      const newPosition = position.plus(new Vector(left, top));

      expect(newPosition).is.instanceof(Vector);
    });

    it('координаты нового вектора равны сумме координат суммируемых', () => {
      const position = new Vector(x, y);

      const newPosition = position.plus(new Vector(left, top));

      expect(newPosition.x).is.equal(8);
      expect(newPosition.y).is.equal(17);
    });
  });

  describe('Метод times()', () => {
    it('создает новый вектор', () => {
      const position = new Vector(x, y);

      const newPosition = position.times(n);

      expect(newPosition).is.instanceof(Vector);
    });

    it('координаты нового вектора увеличины в n раз', () => {
      const position = new Vector(x, y);

      const newPosition = position.times(n);

      expect(newPosition.x).is.equal(15);
      expect(newPosition.y).is.equal(35);
    });
  });

});
