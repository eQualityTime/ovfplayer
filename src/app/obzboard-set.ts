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
