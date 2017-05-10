'use strict';

describe('Класс FireRain', () => {
  describe('Конструктор new FireRain', () => {
    it('Создает экземпляр Fireball', () => {
      const ball = new FireRain();

      expect(ball).to.be.an.instanceof(Fireball);
    });

    it('Имеет скорость Vector(0, 3)', () => {
      const ball = new FireRain();

      expect(ball.speed).to.eql(new Vector(0, 3));
    });

    it('Имеет свойство type равное fireball', () => {
      const ball = new HorizontalFireball();

      expect(ball.type).to.equal('fireball');
    });
  });

  describe('Метод handleObstacle', () => {
    const position = new Vector(5, 5);

    it('Не меняет вектор скорости', () => {
      const ball = new FireRain(position);

      ball.handleObstacle();

      expect(ball.speed).to.eql(new Vector(0, 3));
    });

    it('Меняет позицию на исходную', () => {
      const ball = new FireRain(position);
      ball.pos = new Vector(100, 100);

      ball.handleObstacle();

      expect(ball.pos).to.eql(position);
    });
  });
});
