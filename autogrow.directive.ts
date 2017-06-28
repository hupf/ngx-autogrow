import {
  Directive,
  AfterViewInit,
  AfterContentChecked,
  OnDestroy,
  HostListener,
  ElementRef
} from '@angular/core';

@Directive({
  selector: 'textarea[autogrow]'
})
export class AutogrowDirective
    implements AfterViewInit, AfterContentChecked, OnDestroy {
  private dummy: HTMLPreElement;

  constructor(private element: ElementRef) {
  }

  private get el(): HTMLTextAreaElement {
    return this.element.nativeElement;
  }

  ngAfterViewInit(): void {
    if (this.el.rows) {
      const computedStyle = this.getComputedStyle(this.el);
      if (computedStyle.boxSizing === 'border-box') {
        this.el.style.minHeight = `calc(${this.el.rows} * ${computedStyle.lineHeight} + ` +
          `${computedStyle.paddingTop} + ${computedStyle.paddingBottom})`;
      } else {
        this.el.style.minHeight = `calc(${this.el.rows} * ${computedStyle.lineHeight})`;
      }
    }
    this.el.style.overflow = 'hidden';

    this.createDummy();
    this.grow();
  }

  ngAfterContentChecked(): void {
    this.grow();
  }

  ngOnDestroy() {
    this.el.removeAttribute('style');
    if (this.dummy) {
      this.dummy.parentNode!.removeChild(this.dummy);
    }
  }

  @HostListener('input', ['$event.target'])
  private onInput(textArea: HTMLTextAreaElement): void {
    this.grow();
  }

  @HostListener('change', ['$event.target'])
  private onChange(textArea: HTMLTextAreaElement): void {
    this.grow();
  }

  @HostListener('keyup', ['$event.target'])
  private onKeyup(textArea: HTMLTextAreaElement): void {
    this.grow();
  }

  private grow(): void {
    if (!this.el || !this.dummy) {
      return;
    }

    this.updateDummy();

    this.dummy.innerHTML = this.nl2br(this.escapeHTML(this.el.value)) + '<br><br>';

    this.hide(this.dummy, false);

    const height = this.getComputedStyle(this.dummy).getPropertyValue('height');
    this.el.style.height = height;

    this.hide(this.dummy, true);
  }

  private createDummy(): void {
    if (!this.dummy) {
      const prevEl = <HTMLElement>this.prev(this.el);
      if (prevEl && prevEl.classList.contains('autogrow-dummy')) {
        this.dummy = <HTMLPreElement>prevEl;
      } else {
        this.dummy = <HTMLPreElement>this.el.parentNode!.insertBefore(document.createElement('pre'),
          this.el);
        this.dummy.classList.add('autogrow-dummy');
      }
    }
  }

  private updateDummy(): void {
    const dstyle = this.dummy.style;
    const ostyle = this.getComputedStyle(this.el);

    dstyle.whiteSpace = 'pre-wrap';
    dstyle.boxSizing  = 'border-box';
    dstyle.wordWrap   = ostyle.getPropertyValue('word-wrap') || 'break-word';
    dstyle.width      = ostyle.getPropertyValue('width');
    dstyle.padding    = ostyle.getPropertyValue('padding');
    dstyle.fontFamily = ostyle.getPropertyValue('font-family');
    dstyle.fontSize   = ostyle.getPropertyValue('font-size');
    dstyle.lineHeight = ostyle.getPropertyValue('line-height');
  }

  private prev(el: Node): Node | void {
    let currentElement: Node | null = el;
    while (currentElement = currentElement.previousSibling) {
      if (currentElement.nodeType !== 3) {
        return el;
      }
    }
  }

  private hide(el: HTMLElement, s: boolean): void {
    el.style.display = s ? 'none' : 'inline-block';
  }

  private getComputedStyle(el: HTMLElement) {
    // FF < 4 needs a second parameter...
    return window.getComputedStyle(el, null as any);
  }

  private escapeHTML(s: string): string {
    return s.replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;')
      .replace(/'/g,  '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  private nl2br(s: string): string {
    return s.replace(/\n/g, '<br>');
  }

}
