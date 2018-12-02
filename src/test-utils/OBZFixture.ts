export class OBZFixture {

  constructor() {
  }

  static load = (fixtureName) => {
    // pull fixture from window.__obz__ array
    const fixtures = window['__obz__'];
    const noManifest = fixtures[fixtureName];
    const contents = JSON.parse(noManifest);
    // convert base64 fixture data to blob
    const byteCharacters = atob(contents.data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: 'application/octet-stream' });
  }
}
