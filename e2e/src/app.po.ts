import { browser, by, element, promise, Key } from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getTextareaCount(): promise.Promise<number> {
    return element.all(by.css('app-root textarea')).count();
  }

  getTextareaHeight(index: number): promise.Promise<number> {
    return element.all(by.css(`app-root textarea`)).get(index).getSize().then(size => size.height);
  }

  setTextareaValue(index: number, value: string): void {
    const area = element.all(by.css(`app-root textarea`)).get(index);
    area.clear();
    value.split('\n').forEach(line => {
      area.sendKeys(line);
      area.sendKeys(Key.ENTER);
    });
  }

  reset(): void {
    element(by.tagName('button')).click();
  }
}
