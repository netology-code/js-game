'use strict';

describe('Класс Coin', () => {
  let position;

  beforeEach(() => {
    position = new Vector(5, 5);
  });

  describe('Конструктор new Coin', () => {
    it('Создает экземпляр Actor', () => {
      const coin = new Coin();

      expect(coin).to.be.an.instanceof(Actor);
    });

    it('Имеет свойство type равное coin', () => {
      const coin = new Coin();

      expect(coin.type).to.equal('coin');
    });

    it('Имеет размер Vector(0.6, 0.6)', () => {
      const coin = new Coin();

      expect(coin.size).to.eql(new Vector(0.6, 0.6));
    });

    it('Реальная позициия сдвинута на Vector(0.2, 0.1)', () => {
      const coin = new Coin(position);
      const realPosition = new Vector(5.2, 5.1);

      expect(coin.pos).to.eql(realPosition);
    });

    it('Имеет свойство spring равное случайному числу от 0 до 2π', () => {
      const coin = new Coin();

      expect(coin.spring).to.be.within(0, 2 * Math.PI);
    });

    it('Имеет свойство springSpeed равное 8', () => {
      const coin = new Coin();

      expect(coin.springSpeed).to.equal(8);
    });

    it('Имеет свойство springDist равное 0.07', () => {
      const coin = new Coin();

      expect(coin.springDist).to.equal(0.07);
    });
  });

  describe('Метод updateSpring', () => {
    it('Увеличит свойство spring на springSpeed', () => {
      const coin = new Coin();
      const initialSpring = coin.spring;

      coin.updateSpring();

      expect(coin.spring).to.equal(initialSpring + 8);
    });

    it('Если передать время, увеличит свойство spring на springSpeed умноженное на время', () => {
      const time = 5;
      const coin = new Coin();
      const initialSpring = coin.spring;

      coin.updateSpring(time);

      expect(coin.spring).to.equal(initialSpring + 40);
    });
  });

  describe('Метод getSpringVector', () => {
    it('Вернет вектор', () => {
      const coin = new Coin();

      const vector = coin.getSpringVector();

      expect(vector).to.be.an.instanceof(Vector);
    });

    it('Координата x этого вектора равна нулю', () => {
      const coin = new Coin();

      const vector = coin.getSpringVector();

      expect(vector.x).to.equal(0);
    });

    it('Координата y этого вектора равна синусу от spring, умноженному на springDist', () => {
      const coin = new Coin();

      const vector = coin.getSpringVector();

      expect(vector.y).to.equal(Math.sin(coin.spring) * 0.07);
    });
  });

  describe('Метод getNextPosition', () => {
    it('Увеличит sping на springSpeed', () => {
      const coin = new Coin(position);
      const initialSpring = coin.spring;

      coin.getNextPosition();

      expect(coin.spring).to.equal(initialSpring + 8);
    });

    it('Если передать время, увеличит свойство spring на springSpeed умноженное на время', () => {
      const time = 5;
      const coin = new Coin();
      const initialSpring = coin.spring;

      coin.getNextPosition(time);

      expect(coin.spring).to.equal(initialSpring + 40);
    });

    it('Вернет вектор', () => {
      const coin = new Coin(position);

      const newPosition = coin.getNextPosition();

      expect(newPosition).to.be.an.instanceof(Vector);
    });

    it('Координата x новой позиции не изменится', () => {
      const coin = new Coin(position);
      const realPosition = coin.pos;

      const newPosition = coin.getNextPosition();

      expect(newPosition.x).to.equal(realPosition.x);
    });

    it('Координата y новой позиции будет в пределах исходного значения y и y + 1', () => {
      const coin = new Coin(position);

      const newPosition = coin.getNextPosition();
      expect(newPosition.y).to.be.within(position.y, position.y + 1);
    });

    it('Вернет новую позицию увеличив старую на вектор подпрыгивания', () => {
      const coin = new Coin(position);
      const realPosition = coin.pos;

      const newPosition = coin.getNextPosition();
      const springVector = coin.getSpringVector();

      expect(newPosition).to.eql(realPosition.plus(springVector));
    });

    it('Увеличивается вектор исходной позиции, а не текущей', () => {
      const coin = new Coin(position);
      const realPosition = coin.pos;
      
      coin.pos = coin.getNextPosition();

      const newPosition = coin.getNextPosition();
      const springVector = coin.getSpringVector();

      expect(newPosition).to.eql(realPosition.plus(springVector));
    });
  });

  describe('Метод act', () => {
    it('Обновит текущую позицию на ту что вернет getNextPosition', () => {
      const time = 5;
      const coin = new Coin(position);
      const spring = coin.spring;
      const newPosition = coin.getNextPosition(time);
      coin.spring = spring;

      coin.act(time);

      expect(coin.pos).to.eql(newPosition);
    });
  });
});
