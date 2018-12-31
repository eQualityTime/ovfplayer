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

export class OBZBoardSet implements ImageResolver, SoundResolver {
  private boards: {[key: string]: OBFBoard} = {};
  private images: {[key: string]: string} = {};
  private sounds: {[key: string]: string} = {};
  rootBoardKey: string;

  public getBoard(boardKey: string): OBFBoard {
    return this.boards[boardKey];
  }

  public setBoard(boardKey: string, board: OBFBoard) {
    this.boards[boardKey] = board;
    board.setImageResolver(this);
    board.setSoundResolver(this);
  }

  public setImage(imageKey: string, imageData: string) {
    this.images[imageKey] = imageData;
  }

  public setSound(soundKey: string, soundData: string) {
    this.sounds[soundKey] = soundData;
  }

  public getImageData(imagePath: string): string {
    return this.images[imagePath];
  }

  public getSoundData(soundPath: string): string {
    return this.sounds[soundPath];
  }
}
