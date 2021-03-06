/* ::START::LICENCE::
Copyright eQualityTime ©2018, ©2019, ©2020, ©2021
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
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDefined,
  IsInt,
  IsUrl,
  ValidateNested,
  validateSync,
  ValidationError,
} from 'class-validator';
import { ImageResolver } from './image-resolver';
import { SoundResolver } from './sound-resolver';
import { FatalOpenVoiceFactoryError, ErrorCodes } from './errors';
import { Check2DArray, OneOf } from './custom-validation';

function stringify(value: any): string {
  return value || value === 0 ? String(value) : undefined;
}

export class Grid {

  @IsDefined()
  @IsInt()
  rows: number;

  @IsDefined()
  @IsInt()
  columns: number;

  @Check2DArray('columns', 'rows')
  order: string[][];

  deserialize(input: any): Grid {
    this.rows = input.rows;
    this.columns = input.columns;
    this.order = input.order.map(row => row.map(cell => stringify(cell)));
    return this;
  }
}

export class LoadBoardAction {

  @OneOf(['url', 'dataUrl', 'path'], { message: 'Load board should have one of dataUrl, url or path'})
  id: string;

  name: string;

  @IsOptional()
  @IsUrl()
  url: string;

  @IsOptional()
  @IsUrl()
  dataUrl: string;

  path: string;

  deserialize(input: any): LoadBoardAction {
    this.id = input.id;
    this.name = input.name;
    this.url = input.url;
    this.dataUrl = input.dataUrl || input.data_url;
    this.path = input.path;

    return this;
  }
}

export class Button {

  @IsNotEmpty({ message: 'Button id must be specified'})
  @IsString({ message: 'Button id must be a string'})
  id: string;

  @IsNotEmpty()
  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  vocalization: string;

  @IsOptional()
  @IsString()
  imageId: string;

  @IsOptional()
  @IsString()
  soundId: string;

  backgroundColor: string;
  borderColor: string;
  actions: string[];
  loadBoardAction: LoadBoardAction;

  @IsDefined()
  parent: OBFBoard;

  deserialize(input: any, parent: OBFBoard): Button {
    this.id = stringify(input.id);
    this.label = input.label;
    this.vocalization = input.vocalization;
    this.imageId = stringify(input.imageId) || stringify(input.image_id);
    this.soundId = stringify(input.soundId) || stringify(input.sound_id);
    this.backgroundColor = input.backgroundColor || input.background_color;
    this.borderColor = input.borderColor || input.border_color;
    this.parent = parent;

    if (input.actions && input.actions.length > 0) {
      this.actions = input.actions;
    } else {
      this.actions = (input.action !== undefined && input.action !== '') ? [input.action] : [];
    }

    if (input.loadBoardAction || input.load_board) {
      this.loadBoardAction = new LoadBoardAction().deserialize(input.loadBoardAction || input.load_board);
    }

    return this;
  }

  getVocalization(): string {
    return this.vocalization || this.label;
  }

  getImage(): Image {
    return this.imageId && this.parent.getImage(this.imageId);
  }
}

export class Image {

  @OneOf(['url', 'data', 'path', 'symbol'], { message: 'Image with id "$value" must specifiy data, a url or a path' })
  @IsString({ message: 'Image id must be a string' })
  @IsNotEmpty({ message: 'Image id must be specified'})
  id: string;

  @IsOptional()
  @IsInt()
  width: number;

  @IsOptional()
  @IsInt()
  height: number;

  @IsOptional()
  data: string;

  @IsOptional()
  @IsUrl()
  url: string;

  @IsOptional()
  symbol: string;

  @IsOptional()
  @IsString()
  path: string;

  contentType: string;

  @IsDefined()
  parent: OBFBoard;

  @IsOptional()
  @IsString()
  svgData: string;

  deserialize(input: any, parent: OBFBoard): Image {
    this.id = stringify(input.id);
    this.width = input.width;
    this.height = input.height;
    this.data = input.data;
    this.url = input.url;
    this.path = input.path;
    this.contentType = input.contentType || input.content_type;
    this.parent = parent;
    this.symbol = JSON.stringify(input.symbol);

    return this;
  }

  getDataBlob(): Blob {
    return this.parent.imageResolver.getImageData(this.path);
  }
}

export class Sound {

  @IsNotEmpty({ message: 'Sound id must be specified'})
  @IsString({ message: 'Sound id must be a string'})
  @OneOf(['url', 'data', 'path'], { message: 'Sound with id "$value" must specifiy data, a url or a path' })
  id: string;

  @IsOptional()
  data: string;

  @IsOptional()
  @IsUrl()
  url: string;

  @IsOptional()
  path: string;

  contentType: string;

  duration: number;

  @IsDefined()
  parent: OBFBoard;

  deserialize(input: any, parent: OBFBoard): Sound {
    this.id = stringify(input.id);
    this.data = input.data;
    this.url = input.url;
    this.path = input.path;
    this.contentType = input.contentType || input.content_type;
    this.duration = input.duration;
    this.parent = parent;

    return this;
  }

  getSource(): string {
    if (this.path && this.parent.soundResolver) {
      const soundData = this.parent.soundResolver.getSoundData(this.path);
      return `data:${this.contentType};base64,${soundData}`;
    }
    return this.data || this.url;
  }
}

export class OBFBoard {

  format: string;

  @IsNotEmpty({ message: 'Board id must be specified'})
  @IsString({ message: 'Board id must be a string'})
  id: string;

  locale: string;

  name: string;

  @IsOptional()
  @IsString()
  descriptionHtml: string;

  @ValidateNested()
  @IsDefined()
  grid: Grid;

  @ValidateNested({
    each: true
  })
  @IsDefined()
  buttons: Button[];

  @ValidateNested({
    each: true
  })
  images: Image[];

  @ValidateNested({
    each: true
  })
  sounds: Sound[];

  imageResolver: ImageResolver;

  soundResolver: SoundResolver;

  deserialize(input: any): OBFBoard {
    this.format = input.format;
    this.id = stringify(input.id);
    this.locale = input.locale;
    this.name = input.name;
    this.descriptionHtml = input.descriptionHtml || input.description_html;
    this.grid = new Grid().deserialize(input.grid);
    this.buttons = input.buttons.map(button => new Button().deserialize(button, this));
    this.images = input.images.map(image => new Image().deserialize(image, this));
    this.sounds = input.sounds.map(sound => new Sound().deserialize(sound, this));

    const errors = validateSync(this);
    if (errors && errors.length > 0) {
      const all_errors: string[] = [];
      errors.forEach(err => all_errors.push(...this.messagesFromError(err)));
      console.log(all_errors.join('\n'));
      throw new FatalOpenVoiceFactoryError(ErrorCodes.OBF_VALIDATION, all_errors.join('\n'));
    }

    // filter out images we can't display AFTER collecting error messages
    this.images = this.images.filter(image => image.data || image.path || image.url);

    return this;
  }

  private messagesFromError(error: ValidationError): string[] {
    const ret: string[] = [];
    console.log(error);
    if (error.constraints) {
      ret.push(...Object.values(error.constraints));
    }
    if (error.children) {
      error.children.forEach(err => ret.push(...this.messagesFromError(err)));
    }
    return ret;
  }

  setImageResolver(imageResolver: ImageResolver) {
    this.imageResolver = imageResolver;
  }

  setSoundResolver(soundResolver: SoundResolver) {
    this.soundResolver = soundResolver;
  }

  getButton(id: string): Button {
    return id === null ? null : this.buttons.find(button => button.id === id);
  }

  getImage(id: string): Image {
    return id === null ? null : this.images.find(image => image.id === id);
  }

  getSound(id: string): Sound {
    return id === null ? null : this.sounds.find(sound => sound.id === id);
  }
}
