/*
This file is part of OVFPlayer.
OVFPlayer is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

OVFPlayer is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with OVFPlayer.  If not, see <https://www.gnu.org/licenses/>.
*/
import { TestBed, inject } from '@angular/core/testing';

import { OBFBoard, Grid, Button, Image, Sound, LoadBoardAction } from './obfboard';

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
        url: 'http://a.b'
      }
    ],
    sounds: [
      {
        id: 1,
        url: 'http://b.c'
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
    expect(image.url).toBe('http://a.b');
    expect(image.parent).toBe(board);
  });

  it('should provide sounds', () => {
    const board = testBoard;
    const sound = board.getSound('1');
    expect(sound).toBeTruthy();
    expect(sound.url).toBe('http://b.c');
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
