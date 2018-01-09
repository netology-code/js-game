'use strict';

describe('Класс Fireball', () => {
  let time, speed, position;

  beforeEach(() => {
    time = 5;
    speed = new Vector(1, 0);
    position = new Vector(5, 5);
  });

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

      expect(nextPosition).to.eql(new Vector(6, 5));
    });

    it('Если передать время первым аргументом, то вернет новую позицию увелеченную на вектор скорости помноженный на переданное время', () => {
      const ball = new Fireball(position, speed);

      const nextPosition = ball.getNextPosition(time);

      expect(nextPosition).to.eql(new Vector(10, 5));
    });
  });

  describe('Метод handleObstacle', () => {
    it('Меняет вектор скорости на противоположный', () => {
      const ball = new Fireball(position, speed);

      ball.handleObstacle();

      expect(ball.speed).to.eql(new Vector(-1, -0));
    });
  });

  describe('Метод act', () => {
    it('Если препятствий нет, меняет позицию на ту что получена с помощью getNextPosition', () => {
      const level = {
        obstacleAt() {
          return undefined;
        }
      };
      const ball = new Fireball(position, speed);
      const nextPosition = new Vector(10, 5);

      ball.act(time, level);

      expect(ball.speed).to.eql(speed);
      expect(ball.pos).to.eql(nextPosition);
    });

    it('При столкновении с препятствием не меняет позицию объекта, меняет вектор скорости на противоположный', () => {
      const level = {
        obstacleAt() {
          return 'wall';
        }
      };
      const ball = new Fireball(position, speed);

      ball.act(time, level);

      expect(ball.speed).to.eql(new Vector(-1, -0));
      expect(ball.pos).to.eql(position);
    });

    it('Вызывает level.obstacleAt со своим вектором размера', () => {
      const ball = new Fireball(position, speed);
      let isCalled = false;
      const level = {
        obstacleAt(pos, size) {
          expect(size).to.eql(new Vector(1, 1));
          isCalled = true;
        }
      };

      ball.act(time, level);
      expect(isCalled).to.be.true;
    });

    it('Вызывает level.obstacleAt с вектором новой позиции', () => {
      const ball = new Fireball(position, speed);
      let isCalled = false;
      const level = {
        obstacleAt(pos, size) {
          expect(pos).to.eql(new Vector(10, 5));
          isCalled = true;
        }
      };

      ball.act(time, level);
      expect(isCalled).to.be.true;
    });
  });
});
