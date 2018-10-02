import { Subject, Unsubscribable, animationFrameScheduler } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import {
  Directive,
  OnChanges,
  OnInit,
  DoCheck,
  OnDestroy,
  Input,
  HostListener,
  ElementRef,
  NgZone,
  Inject,
  SimpleChanges
} from '@angular/core';

import { DOCUMENT } from '@angular/common';

import { escapeHTML, nl2br, prevNode, hide, getComputedStyle } from './utils';

const DEBOUNCE_TIME = 20;

@Directive({
  selector: 'textarea[autogrow]' // tslint:disable-line
})
export class NgxAutogrowDirective
  implements OnChanges, OnInit, DoCheck, OnDestroy {
  private readonly grow$ = new Subject<void>();
  private readonly document: Document;

  private dummy: HTMLPreElement;
  private container: HTMLDivElement;
  private growSub: Unsubscribable;
  private content: string;

  @Input()
  rows?: string | number;

  constructor(
    private readonly element: ElementRef,
    private readonly zone: NgZone,
    @Inject(DOCUMENT) document: any
  ) {
    this.document = document;
  }

  private get el(): HTMLTextAreaElement {
    return this.element.nativeElement;
  }

  ngOnChanges({ rows }: SimpleChanges): void {
    if (rows != null && rows.currentValue) {
      this.setMinHeight(rows.currentValue);
    }
  }

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.growSub = this.grow$
        .pipe(debounceTime(DEBOUNCE_TIME, animationFrameScheduler))
        .subscribe(() => this.grow());
    });

    this.el.style.overflow = 'hidden';
    this.createDummy();
  }

  @HostListener('input')
  @HostListener('change')
  ngDoCheck(): void {
    this.zone.runOutsideAngular(() => {
      this.grow$.next();
    });
  }

  ngOnDestroy() {
    this.el.removeAttribute('style');
    if (this.dummy != null && this.dummy.parentNode != null) {
      this.dummy.parentNode.removeChild(this.dummy);
    }
    this.growSub.unsubscribe();
  }

  private grow(): void {
    if (this.el == null || this.dummy == null) {
      return;
    }

    if (this.updateDummyHTML()) {
      this.updateDummyStyle();

      hide(this.dummy, false);

      const height = getComputedStyle(this.dummy).getPropertyValue('height');
      this.el.style.height = height;

      hide(this.dummy, true);
    }
  }

  private createDummy(): void {
    if (!this.dummy) {
      const prevEl = prevNode(this.el) as HTMLElement;
      if (prevEl != null && prevEl.classList.contains('autogrow-dummy')) {
        this.container = prevEl as HTMLDivElement;
        this.dummy = prevEl.firstChild as HTMLPreElement;
      } else {
        this.container = this.document.createElement('div');
        (this.container.style as any).contain = 'strict';
        this.container.style.width = '0';
        this.container.style.height = '0';
        this.container.style.overflow = 'hidden';
        this.container.style.visibility = 'hidden';
        this.container.style.position = 'absolute';
        this.container.style.left = '-99999px';
        this.dummy = this.document.createElement('pre');
        this.container.appendChild(this.dummy);
        this.el.parentNode!.insertBefore(this.container, this.el);
        this.container.classList.add('autogrow-dummy');
      }
    }
    this.dummy.style.position = 'absolute';
    this.dummy.style.whiteSpace = 'pre-wrap';
    this.dummy.style.boxSizing = 'border-box';
    hide(this.dummy, true);
  }

  private updateDummyHTML(): boolean {
    const content = nl2br(escapeHTML(this.el.value)) + '<br><br>';
    const contentChanged = content !== this.content;

    if (contentChanged) {
      this.dummy.innerHTML = this.content = content;
    }

    return contentChanged;
  }

  private updateDummyStyle(): void {
    const dstyle = this.dummy.style;
    const ostyle = getComputedStyle(this.el);

    dstyle.wordWrap = ostyle.getPropertyValue('word-wrap');
    dstyle.width = ostyle.getPropertyValue('width');
    dstyle.padding = ostyle.getPropertyValue('padding');
    dstyle.fontFamily = ostyle.getPropertyValue('font-family');
    dstyle.fontSize = ostyle.getPropertyValue('font-size');
    dstyle.lineHeight = ostyle.getPropertyValue('line-height');
  }

  private setMinHeight(rows: number | string) {
    const computedStyle = getComputedStyle(this.el);
    const lineHeight =
      computedStyle.lineHeight === 'normal'
        ? `${computedStyle.fontSize} * 1.2`
        : computedStyle.lineHeight;
    const minHeight =
      computedStyle.boxSizing === 'border-box'
        ? `calc(${rows} * ${lineHeight} + ${computedStyle.paddingTop} + ${
            computedStyle.paddingBottom
          })`
        : `calc(${rows} * ${lineHeight})`;

    this.el.style.minHeight = minHeight;
  }
}
