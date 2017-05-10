'use strict';

describe('Класс HorizontalFireball', () => {
  describe('Конструктор new HorizontalFireball', () => {
    it('Создает экземпляр Fireball', () => {
      const ball = new HorizontalFireball();

      expect(ball).to.be.an.instanceof(Fireball);
    });

    it('Имеет скорость Vector(2, 0)', () => {
      const ball = new HorizontalFireball();

      expect(ball.speed).to.eql(new Vector(2, 0));
    });

    it('Имеет свойство type равное fireball', () => {
      const ball = new HorizontalFireball();

      expect(ball.type).to.equal('fireball');
    });
  });
});
