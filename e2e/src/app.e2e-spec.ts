import { AppPage } from './app.po';
import { browser, logging } from 'protractor';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display all text areas', () => {
    page.navigateTo();
    expect(page.getTextareaCount()).toBe(3);
  });

  it('should set the height initially', () => {
    page.navigateTo();

    expect(page.getTextareaHeight(0)).toBeGreaterThan(30);
    expect(page.getTextareaHeight(0)).toBeLessThan(50);

    expect(page.getTextareaHeight(1)).toBeGreaterThan(50);
    expect(page.getTextareaHeight(1)).toBeLessThan(100);

    expect(page.getTextareaHeight(2)).toBeGreaterThan(500);
  });

  it('should adjust the height to content', () => {
    page.navigateTo();

    page.setTextareaValue(0, 'Lorem\nipsum\ndolor\nsit\namet,\nconsectetur\nadipiscing\nelit');
    expect(page.getTextareaHeight(0)).toBeGreaterThan(100);

    page.setTextareaValue(1, 'Lorem\nipsum\ndolor\nsit\namet,\nconsectetur\nadipiscing\nelit');
    expect(page.getTextareaHeight(1)).toBeGreaterThan(100);

    page.reset();

    expect(page.getTextareaHeight(0)).toBeGreaterThan(30);
    expect(page.getTextareaHeight(0)).toBeLessThan(50);

    expect(page.getTextareaHeight(1)).toBeGreaterThan(50);
    expect(page.getTextareaHeight(1)).toBeLessThan(100);

    expect(page.getTextareaHeight(2)).toBeGreaterThan(30);
    expect(page.getTextareaHeight(2)).toBeLessThan(50);
  });

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
