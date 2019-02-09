import { Injectable } from '@angular/core';
import { Button } from './obfboard';
import { LocalStorage } from 'ngx-store';

interface Scripts {
  name: string;
  src: string;
}
export const ScriptStore: Scripts[] = [
  {
    name: 'lib1',
    src: 'https://dl.dropbox.com/s/yf06gz438yz9ftb/helloLib.js?dl=1'
  },
  {
    name: 'iftttLib',
    src: '/assets/libraries/iftttLib.js'
  }
];

declare var document: any;

@Injectable({
  providedIn: 'root'
})
export class CustomActionService {

  private scripts: any = {};

  @LocalStorage()
  private _iftttLibConfig;

  constructor() {
    ScriptStore.forEach((script: any) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src
      };
    });
  }

  load(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  // TODO: tidy this up and get config involved
  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      // resolve if already loaded
      if (this.scripts[name].loaded) {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      } else {
        // load script
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = this.scripts[name].src;
        if (script.readyState) {  // IE
          script.onreadystatechange = () => {
            if (script.readyState === 'loaded' || script.readyState === 'complete') {
              script.onreadystatechange = null;
              this.scripts[name].loaded = true;
              resolve({ script: name, loaded: true, status: 'Loaded' });
            }
          };
        } else {  // Others
          script.onload = () => {
            this.scripts[name].loaded = true;
            resolve({ script: name, loaded: true, status: 'Loaded' });
          };
        }
        script.onerror = (error: any) => resolve({ script: name, loaded: false, status: 'Loaded' });
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
  }

  handle(button: Button, action: string) {

    if (action.startsWith(':ext_ovf_js:')) {
      console.log(action);
      const jsCall = action.slice(12);
      // TODO: this doesn't make sense now!  Load everything up front?
      // Or interogate for namespace...(would still require loading!)
      this.load('iftttLib').then(data => {
        console.log('script loaded ', data);
        let func = window;
        for (const ns of jsCall.split('.')) {
          // TODO: sometimes this will fail!
          func = func[ns];
        }
        if (typeof func === 'function') {
          const context = {
            'button': button
          };
          const config = this._iftttLibConfig;
          (<any>func)(context, config);
        }
      }).catch(error => console.log(error));
    }
  }
}
