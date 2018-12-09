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
  ArrayMinSize,
  ArrayMaxSize
} from 'class-validator';
import { ImageResolver } from './image-resolver';
import { SoundResolver } from './sound-resolver';
import { FatalOpenVoiceFactoryError, ErrorCodes } from './errors';
import { Check2DArray } from './custom-validation';

export class Grid {

  @IsDefined()
  @IsInt()
  rows: number;

  @IsDefined()
  @IsInt()
  columns: number;

  @Check2DArray('columns', 'rows', { message: 'Grid order is not correct size for specified rows and columns'})
  order: string[][];

  deserialize(input: any): Grid {
    this.rows = input.rows;
    this.columns = input.columns;
    this.order = input.order.map(row => row.map(cell => cell || cell === 0 ? String(cell) : undefined));
    return this;
  }
}

export class LoadBoardAction {

  @IsNotEmpty()
  @IsString()
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
    this.dataUrl = input.data_url;
    this.path = input.path;

    return this;
  }
}

export class Button {

  @IsNotEmpty()
  @IsString()
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
    this.id = String(input.id);
    this.label = input.label;
    this.vocalization = input.vocalization;
    this.imageId = input.image_id || input.image_id === 0 ? String(input.image_id) : undefined;
    this.soundId = input.sound_id || input.sound_id === 0 ? String(input.sound_id) : undefined;
    this.backgroundColor = input.background_color;
    this.borderColor = input.border_color;
    this.parent = parent;

    if (input.actions && input.actions.length > 0) {
      this.actions = input.actions;
    } else {
      this.actions = (input.action !== undefined && input.action !== '') ? [input.action] : [];
    }

    if (input.load_board) {
      // TODO: if there is a board to load we should probably load it now so it will get cached by the service worker
      this.loadBoardAction = new LoadBoardAction().deserialize(input.load_board);
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

  @IsNotEmpty()
  @IsString()
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

  path: string;

  contentType: string;

  @IsDefined()
  parent: OBFBoard;

  @IsOptional()
  svgData: string;

  deserialize(input: any, parent: OBFBoard): Image {
    this.id = String(input.id);
    this.width = input.width;
    this.height = input.height;
    this.data = input.data;
    this.url = input.url;
    this.path = input.path;
    this.contentType = input.content_type;
    this.parent = parent;

    return this;
  }

  isSVG(): boolean {
    return 'image/svg+xml' === this.contentType || (this.path && this.path.toLowerCase().endsWith('.svg'));
  }

  getSource(): string {
    if (this.path && this.parent.imageResolver) {
      const imageData = this.parent.imageResolver.getImageData(this.path);
      if (this.isSVG()) {
        if (!this.svgData) {
          // Make SVGs scale nicely in the grid regardless of original size
          const imgData = imageData.substring(imageData.indexOf('<svg'));
          const htmlTag = document.createElement('div');
          htmlTag.innerHTML = imgData;
          const svgTag = htmlTag.getElementsByTagName('svg')[0];
          svgTag.setAttribute('height', '100%');
          svgTag.setAttribute('width', '100%');
          this.svgData = htmlTag.innerHTML;
        }
        return this.svgData;
      } else {
        return `data:${this.contentType};base64,${imageData}`;
      }
    }
    return this.data || this.url;
  }
}

export class Sound {

  @IsNotEmpty()
  @IsString()
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
    this.id = String(input.id);
    this.data = input.data;
    this.url = input.url;
    this.path = input.path;
    this.contentType = input.content_type;
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

  @IsNotEmpty()
  @IsString()
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
    this.id = input.id && String(input.id);
    this.locale = input.locale;
    this.name = input.name;
    this.descriptionHtml = input.description_html;
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
