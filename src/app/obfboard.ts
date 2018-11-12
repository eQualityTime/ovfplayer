import { ImageResolver } from './image-resolver';

export class Grid {
  rows: number;
  columns: number;
  order: string[][];

  deserialize(input: any): Grid {
    this.rows = input.rows;
    this.columns = input.columns;
    this.order = input.order.map(row => row.map(cell => cell || cell === 0 ? String(cell) : undefined));

    return this;
  }
}

export class LoadBoardAction {
  id: string;
  name: string;
  url: string;
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
  id: string;
  label: string;
  vocalization: string;
  imageId: string;
  soundId: string;
  backgroundColor: string;
  borderColor: string;
  actions: string[];
  loadBoardAction: LoadBoardAction;
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
  id: string;
  width: number;
  height: number;
  data: string;
  url: string;
  path: string;
  contentType: string;
  parent: OBFBoard;
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
  id: string;
  data: string;
  url: string;
  duration: number;

  deserialize(input: any): Sound {
    this.id = String(input.id);
    this.data = input.data;
    this.url = input.url;
    this.duration = input.duration;

    return this;
  }
}

export class OBFBoard {

  format: string;
  id: string;
  locale: string;
  name: string;
  descriptionHtml: string;
  grid: Grid;
  buttons: Button[];
  images: Image[];
  sounds: Sound[];
  imageResolver: ImageResolver;

  deserialize(input: any): OBFBoard {
    this.format = input.format;
    this.id = String(input.id);
    this.locale = input.locale;
    this.name = input.name;
    this.descriptionHtml = input.description_html;
    this.grid = new Grid().deserialize(input.grid);
    this.buttons = input.buttons.map(button => new Button().deserialize(button, this));
    this.images = input.images.map(image => new Image().deserialize(image, this));
    this.sounds = input.sounds.map(sound => new Sound().deserialize(sound));

    return this;
  }

  setImageResolver(imageResolver: ImageResolver) {
    this.imageResolver = imageResolver;
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
