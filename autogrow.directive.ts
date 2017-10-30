import { Subject } from 'rxjs/Subject';
import { ISubscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/debounceTime';
import { animationFrame } from 'rxjs/scheduler/animationFrame';

import {
  Directive,
  OnInit,
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
    implements OnInit, AfterViewInit, AfterContentChecked, OnDestroy {
  private dummy: HTMLPreElement;
  private container: HTMLDivElement;
  private grow$ = new Subject<void>();
  private grower$ = this.grow$.debounceTime(20, animationFrame);
  private growSub: ISubscription;
  private content: string;

  private triggerGrow = () => this.grow$.next();

  constructor(private element: ElementRef) {
  }

  private get el(): HTMLTextAreaElement {
    return this.element.nativeElement;
  }

  ngOnInit(): void {
    this.growSub = this.grower$.subscribe(() => this.grow());
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
    this.grow$.next();
  }

  ngAfterContentChecked(): void {
    this.grow$.next();
  }

  ngOnDestroy() {
    this.el.removeAttribute('style');
    if (this.dummy) {
      this.dummy.parentNode!.removeChild(this.dummy);
    }
    this.growSub.unsubscribe();
  }

  @HostListener('input', ['$event.target'])
  private onInput(textArea: HTMLTextAreaElement): void {
    this.grow$.next();
  }

  @HostListener('change', ['$event.target'])
  private onChange(textArea: HTMLTextAreaElement): void {
    this.grow$.next();
  }

  @HostListener('keyup', ['$event.target'])
  private onKeyup(textArea: HTMLTextAreaElement): void {
    this.grow$.next();
  }

  private grow(): void {
    if (!this.el || !this.dummy) {
      return;
    }

    this.updateDummyStyle();
    this.updateDummyHTML();

    this.hide(this.dummy, false);

    const height = this.getComputedStyle(this.dummy).getPropertyValue('height');
    this.el.style.height = height;

    this.hide(this.dummy, true);
  }

  private createDummy(): void {
    if (!this.dummy) {
      const prevEl = <HTMLElement>this.prev(this.el);
      if (prevEl && prevEl.classList.contains('autogrow-dummy')) {
        this.container = <HTMLDivElement>prevEl;
        this.dummy = <HTMLPreElement>prevEl.firstChild;
      } else {
        this.container = document.createElement('div');
        (this.container.style as any).contain = 'strict';
        this.container.style.width = '0';
        this.container.style.height = '0';
        this.container.style.overflow = 'hidden';
        this.container.style.visibility = 'hidden';
        this.container.style.position = 'absolute';
        this.container.style.left = '-99999px';
        this.dummy = document.createElement('pre');
        this.container.appendChild(this.dummy);
        this.el.parentNode!.insertBefore(this.container,
          this.el);
        this.container.classList.add('autogrow-dummy');
      }
    }
    this.dummy.style.position = 'absolute';
    this.dummy.style.whiteSpace = 'pre-wrap';
    this.dummy.style.boxSizing = 'border-box';
    this.hide(this.dummy, true);
  }

  private updateDummyHTML(): void {
    const content = this.nl2br(this.escapeHTML(this.el.value)) + '<br><br>';

    if (content !== this.content) {
      this.dummy.innerHTML = this.content = content;
    }
  }

  private updateDummyStyle(): void {
    const dstyle = this.dummy.style;
    const ostyle = this.getComputedStyle(this.el);

    dstyle.wordWrap   = ostyle.getPropertyValue('word-wrap');
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
    el.style.display = s ? 'none' : 'block';
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
