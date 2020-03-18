/* ::START::LICENCE::
Copyright eQualityTime ©2018, ©2019, ©2020
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
::END::LICENCE:: */
import { OBZBoardSet } from './obzboard-set';
import { OBFBoard } from './obfboard';
import { inject, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ProgressService } from './services/progress/progress.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('OBZBoardSet', () => {

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProgressService]
    });
  });

  it('should be created', () => {
    const boardSet = new OBZBoardSet();
    expect(boardSet).toBeTruthy();
  });

  it('should blobify images', (done) => {
    inject([HttpClient, ProgressService], (httpClient: HttpClient, progress: ProgressService) => {

      const dataBlob = new Blob(['hello']);
      spyOn(httpClient, 'get').and.returnValue(of(dataBlob));

      const boardSet = new OBZBoardSet();
      boardSet.rootBoardKey = 'root';
      boardSet.setBoard('root', testBoard);

      boardSet.blobify(httpClient, progress).subscribe({
        next(value) {
          expect(value).toBe(boardSet);
          const board = value.getBoard('root');
          expect(board).toBeTruthy();
          expect(board.images.length).toBe(1);
          const image = board.images[0];
          expect(image.url).toBeNull();
          const path = image.path;
          expect(path).toBe('url:1');
          const data = value.getImageData(path);
          expect(data).toBe(dataBlob);
          done();
        },
      });
    })();
  });
});
