'use strict';

describe('Класс Player', () => {
  let position;

  beforeEach(() => {
    position = new Vector(10, 5);
  });

  describe('Конструктор', () => {
    it('Создает объект реальная позиция которого отличается от той что передана в конструктор на вектор 0:-0,5', () => {
      const player = new Player(position);

      expect(player.pos).to.eql(new Vector(10, 4.5));
    });

    it('Создает объект размером 0,8:1,5', () => {
      const player = new Player();

      expect(player.size).to.eql(new Vector(0.8, 1.5));
    });

    it('Имеет свойство type равное player', () => {
      const player = new Player();

      expect(player.type).to.equal('player');
    });
  });
});
