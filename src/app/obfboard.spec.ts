import { TestBed, inject } from '@angular/core/testing';

import { OBFBoard, Grid, Button, Image, Sound, LoadBoardAction } from './obfboard';

describe('OBFBoard', () => {
  it('should be created', () => {
    const board = new OBFBoard();
    expect(board).toBeTruthy();
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
    for (const row of grid.order) {
      expect(row.length).toBe(grid.columns);
    }
    expect(grid.order.length).toBe(grid.rows);
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
