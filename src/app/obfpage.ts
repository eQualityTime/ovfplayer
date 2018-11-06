interface Serializable<T> {
    deserialize(input: any): T;
}

export class Grid implements Serializable<Grid> {
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

export class LoadBoardAction implements Serializable<LoadBoardAction> {
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

export class Button implements Serializable<Button> {
  id: string;
  label: string;
  vocalization: string;
  imageId: string;
  soundId: string;
  backgroundColor: string;
  borderColor: string;
  actions: string[];
  loadBoardAction: LoadBoardAction;

  deserialize(input: any): Button {
    this.id = String(input.id);
    this.label = input.label;
    this.vocalization = input.vocalization;
    this.imageId = input.image_id || input.image_id === 0 ? String(input.image_id) : undefined;
    this.soundId = input.sound_id || input.sound_id === 0 ? String(input.sound_id) : undefined;
    this.backgroundColor = input.background_color;
    this.borderColor = input.border_color;

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
}

export class Image implements Serializable<Image> {
  id: string;
  width: number;
  height: number;
  data: string;
  url: string;

  deserialize(input: any): Image {
    this.id = String(input.id);
    this.width = input.width;
    this.height = input.height;
    this.data = input.data;
    this.url = input.url;

    return this;
  }

  getSource(): string {
    return this.data || this.url;
  }
}

export class Sound implements Serializable<Sound> {
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

export class OBFPage implements Serializable<OBFPage> {

  format: string;
  id: string;
  locale: string;
  name: string;
  descriptionHtml: string;
  grid: Grid;
  buttons: Button[];
  images: Image[];
  sounds: Sound[];

  deserialize(input: any): OBFPage {
    this.format = input.format;
    this.id = String(input.id);
    this.locale = input.locale;
    this.name = input.name;
    this.descriptionHtml = input.description_html;
    this.grid = new Grid().deserialize(input.grid);
    this.buttons = input.buttons.map(button => new Button().deserialize(button));
    this.images = input.images.map(image => new Image().deserialize(image));
    this.sounds = input.sounds.map(sound => new Sound().deserialize(sound));

    return this;
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
