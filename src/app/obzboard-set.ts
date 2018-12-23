/* ::START::LICENCE::
Copyright eQualityTime ©2018
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
import { OBFBoard } from './obfboard';
import { ImageResolver } from './image-resolver';
import { SoundResolver } from './sound-resolver';
import { Type } from 'class-transformer';

export class OBZBoardSet implements ImageResolver, SoundResolver {

  @Type(() => OBFBoard)
  private boards: Map<string, OBFBoard> = new Map();

  @Type(() => Blob)
  private images: Map<string, Blob> = new Map();

  private sounds: Map<string, string> = new Map();

  rootBoardKey: string;

  public getBoard(boardKey: string): OBFBoard {
    return this.boards.get(boardKey);
  }

  public setBoard(boardKey: string, board: OBFBoard) {
    this.boards.set(boardKey, board);
    board.setImageResolver(this);
    board.setSoundResolver(this);
  }

  public setImage(imageKey: string, imageData: Blob) {
    this.images.set(imageKey, imageData);
  }

  public setSound(soundKey: string, soundData: string) {
    this.sounds.set(soundKey, soundData);
  }

  public getImageData(imagePath: string): Blob {
    return this.images.get(imagePath);
  }

  public getSoundData(soundPath: string): string {
    return this.sounds.get(soundPath);
  }

  public resolveIntegrity(): OBZBoardSet {
    this.boards.forEach((value: OBFBoard, key: string) => {
      value.setImageResolver(this);
      value.setSoundResolver(this);
      value.resolveIntegrity();
    });
    return this;
  }
}
