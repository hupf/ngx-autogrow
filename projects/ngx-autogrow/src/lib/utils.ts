export function escapeHTML(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

export function nl2br(s: string): string {
  return s.replace(/\n/g, '<br>');
}

export function prevNode(el: Node): Node | void {
  let currentElement: Node | null = el;
  // tslint:disable-next-line
  while ((currentElement = currentElement.previousSibling)) {
    if (currentElement.nodeType !== Node.COMMENT_NODE) {
      return el;
    }
  }
}

export function hide(el: HTMLElement, s: boolean): void {
  el.style.display = s ? 'none' : 'block';
}

export function getComputedStyle(el: HTMLElement): CSSStyleDeclaration {
  // FF < 4 needs a second parameter...
  return window.getComputedStyle(el, null as any);
}
