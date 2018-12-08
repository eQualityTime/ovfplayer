import { OBFBoard, Grid, Button, Image, Sound, LoadBoardAction } from './obfboard';
import { ErrorCodes } from './errors';

describe('OBFBoard', () => {

  const testBoard = new OBFBoard().deserialize({
    format: 'board_format',
    id: 5,
    locale: 'en_GB',
    name: 'board_name',
    description_html: '<b>desc</b>',
    grid: {
      rows: 2,
      columns: 2,
      order: [[1, null],
      [null, 2]]
    },
    buttons: [
      {
        id: 1,
        label: 'button1'
      },
      {
        id: 2,
        label: 'button2'
      }
    ],
    images: [
      {
        id: 1,
        url: 'http://example.com'
      }
    ],
    sounds: [
      {
        id: 1,
        url: 'http://another.com'
      }
    ]
  });

  it('should be created', () => {
    const board = new OBFBoard();
    expect(board).toBeTruthy();
  });

  it('should deserialise', () => {
    const board = testBoard;
    expect(board).toBeTruthy();
    expect(board.format).toBe('board_format');
    expect(board.id).toBe('5');
    expect(board.locale).toBe('en_GB');
    expect(board.name).toBe('board_name');
    expect(board.descriptionHtml).toBe('<b>desc</b>');
    expect(board.grid.rows).toBe(2);
    expect(board.grid.columns).toBe(2);
    expect(board.grid.order).toEqual([['1', undefined], [undefined, '2']]);
  });

  it('should handle null button id', () => {
    const board = testBoard;
    expect(board.getButton(null)).toBe(null);
  });

  it('should handle null image id', () => {
    const board = testBoard;
    expect(board.getImage(null)).toBe(null);
  });

  it('should handle null sound id', () => {
    const board = testBoard;
    expect(board.getSound(null)).toBe(null);
  });

  it('should provide buttons', () => {
    const board = testBoard;
    const butt = board.getButton('2');
    expect(butt).toBeTruthy();
    expect(butt.label).toBe('button2');
    expect(butt.parent).toBe(board);
  });

  it('should provide images', () => {
    const board = testBoard;
    const image = board.getImage('1');
    expect(image).toBeTruthy();
    expect(image.url).toBe('http://example.com');
    expect(image.parent).toBe(board);
  });

  it('should provide sounds', () => {
    const board = testBoard;
    const sound = board.getSound('1');
    expect(sound).toBeTruthy();
    expect(sound.url).toBe('http://another.com');
  });
});

describe('obfboard.Grid', () => {
  it('should be created', () => {
    const grid = new Grid();
    expect(grid).toBeTruthy();
  });

  it('should deserialise', () => {
    const grid = new Grid().deserialize({
      rows: 3,
      columns: 2,
      order: [[1,    'b1'],
              [null, 'b2'],
              [5,    6]
            ]
    });
    expect(grid.rows).toBe(3);
    expect(grid.columns).toBe(2);
    // all ids should be strings now
    expect(grid.order).toEqual([['1', 'b1'], [undefined, 'b2'], ['5', '6']]);
  });
});

describe('obfboard.Button', () => {
  it('should be created', () => {
    const button = new Button();
    expect(button).toBeTruthy();
  });
});

describe('obfboard.Image', () => {
  it('should be created', () => {
    const image = new Image();
    expect(image).toBeTruthy();
  });
});

describe('obfboard.Sound', () => {
  it('should be created', () => {
    const sound = new Sound();
    expect(sound).toBeTruthy();
  });
});

describe('obfboard.LoadBoardAction', () => {
  it('should be created', () => {
    const lba = new LoadBoardAction();
    expect(lba).toBeTruthy();
  });
});

describe('obfboard.validation', () => {
  it('should validate required board id', () => {
    const input = {
      name: 'board_name',
      grid: {
        rows: 2,
        columns: 2,
        order: [[1, null],
        [null, 2]]
      },
      buttons: [],
      images: [],
      sounds: [],
    };
    try {
      new OBFBoard().deserialize(input);
      expect(true).toBe(false);
    } catch (e) {
      expect(e.errorCode).toBe(ErrorCodes.OBF_VALIDATION);
      expect(e.message).toContain('id should not be empty');
      expect(e.message).toContain('id must be a string');
    }
  });
});
