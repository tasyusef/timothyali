// The block caret (decision 0092). A form field hides its native caret and shows the
// site's cursor block at the insertion point instead: 8 wide, one line tall, in the
// accent, blinking on the shared `.cursor` tick while motion is on. The position comes
// from a hidden mirror of the field's text up to the selection end, so it holds through
// wrapping in the textarea and through horizontal scroll in an input.
//
//   <span class="box"><input use:blockCaret /><span class="cursor caret"></span></span>
//
// The action finds the `.caret` sibling that follows the field. The `.box` is the
// positioning root and must be `position:relative`.
const COPY = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'boxSizing', 'textTransform', 'textIndent'] as const;

export function blockCaret(el: HTMLInputElement | HTMLTextAreaElement) {
  const caret = el.nextElementSibling as HTMLElement | null;
  if (!caret) return;
  const mirror = document.createElement('div');
  const mark = document.createElement('span');
  mirror.setAttribute('aria-hidden', 'true');
  Object.assign(mirror.style, { position: 'absolute', top: '0', left: '0', visibility: 'hidden', pointerEvents: 'none', overflow: 'hidden', whiteSpace: el.tagName === 'TEXTAREA' ? 'pre-wrap' : 'pre', overflowWrap: 'break-word' } as CSSStyleDeclaration);
  // an inline-block one line tall, so its offset is the line box, not the font's content box
  Object.assign(mark.style, { display: 'inline-block', width: '0', verticalAlign: 'top' });
  el.parentElement?.appendChild(mirror);
  let raf = 0;
  // inline, not the `hidden` attribute: the block keeps `display` from the global `.cursor` rule
  const show = (on: boolean) => { caret!.style.display = on ? '' : 'none'; };
  function place() {
    raf = 0;
    if (document.activeElement !== el) { show(false); return; }
    const cs = getComputedStyle(el);
    for (const p of COPY) mirror.style[p] = cs[p];
    mirror.style.width = el.offsetWidth + 'px';
    mirror.style.height = el.offsetHeight + 'px';
    const end = el.selectionEnd ?? el.value.length;
    mirror.textContent = el.value.slice(0, end);
    mirror.appendChild(mark);
    const x = Math.round(mark.offsetLeft - el.scrollLeft), y = Math.round(mark.offsetTop - el.scrollTop);
    const line = parseFloat(cs.lineHeight) || 32;
    // keep the block inside the field: a caret past the right edge sits on the last column
    const maxX = el.offsetWidth - parseFloat(cs.paddingRight) - 8;
    caret!.style.left = Math.min(x, maxX) + 'px';
    caret!.style.top = y + 'px';
    caret!.style.height = line + 'px';
    show(y >= 0 && y + line <= el.offsetHeight);
  }
  const schedule = () => { if (!raf) raf = requestAnimationFrame(place); };
  const events = ['input', 'keyup', 'click', 'select', 'scroll', 'focus', 'blur'];
  for (const e of events) el.addEventListener(e, schedule);
  document.addEventListener('selectionchange', schedule);
  window.addEventListener('resize', schedule);
  show(false);
  return {
    destroy() {
      for (const e of events) el.removeEventListener(e, schedule);
      document.removeEventListener('selectionchange', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
      mirror.remove();
    }
  };
}
