import * as urlParse from 'url-parse';

export class UrlUtils {
  public getSlug(url: string): string {
    const pathname = this.getPathname(url);
    const bits = pathname.split('/');
    return bits.pop();
  }

  public getPathname(url: string): string {
    return urlParse(url).pathname;
  }
}
