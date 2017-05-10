'use strict';

describe('Класс Fireball', () => {
  const time = 5;
  const speed = new Vector(1, 0);
  const position = new Vector(5, 5);

  describe('Конструктор new Fireball', () => {
    it('Созданный объект является экземпляром Actor', () => {
      const ball = new Fireball();

      expect(ball).to.be.an.instanceof(Actor);
    });

    it('Имеет свойство type равное fireball', () => {
      const ball = new Fireball();

      expect(ball.type).to.equal('fireball');
    });

    it('Имеет свойство speed равное вектору Vector переданному вторым аргументом', () => {
      const ball = new Fireball(undefined, speed);

      expect(ball.speed).to.eql(speed);
    });

    it('Свойство pos равно вектору Vector переданному первым аргументом', () => {
      const ball = new Fireball(position);

      expect(ball.pos).to.equal(position);
    });
  });

  describe('Метод getNextPosition', () => {
    it('Вернет ту же позицию для объекта с нулевой скоростью', () => {
      const zeroSpeed = new Vector(0, 0);
      const ball = new Fireball(position, zeroSpeed);

      const nextPosition = ball.getNextPosition();

      expect(nextPosition).to.eql(position);
    });

    it('Вернет новую позицию, увеличенную на вектор скорости', () => {
      const ball = new Fireball(position, speed);

      const nextPosition = ball.getNextPosition();

      expect(nextPosition).to.eql(position.plus(speed));
    });

    it('Если передать время первым аргументом, то вернет новую позицию увелеченную на вектор скорости помноженный на переданное время', () => {
      const ball = new Fireball(position, speed);

      const nextPosition = ball.getNextPosition(time);

      expect(nextPosition).to.eql(position.plus(speed.times(time)));
    });
  });

  describe('Метод handleObstacle', () => {
    it('Меняет вектор скорости на противоположный', () => {
      const ball = new Fireball(position, speed);

      ball.handleObstacle();

      expect(ball.speed).to.eql(speed.times(-1));
    });
  });
});
