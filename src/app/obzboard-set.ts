import { OBFBoard } from './obfboard';
import { ImageResolver } from './image-resolver';

export class OBZBoardSet extends ImageResolver {
  private boards: {[key: string]: OBFBoard} = {};
  private images: {[key: string]: string} = {};
  rootBoardKey: string;

  public getBoard(boardKey: string): OBFBoard {
    return this.boards[boardKey];
  }

  public setBoard(boardKey: string, board: OBFBoard) {
    this.boards[boardKey] = board;
    board.setImageResolver(this);
  }

  public setImage(imageKey: string, imageData: string) {
    this.images[imageKey] = imageData;
  }

  public getImageData(imagePath: string): string {
    return this.images[imagePath];
  }
}
