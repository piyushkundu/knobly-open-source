import type { ConsoleMessage } from '@/types/web-compiler';

// Omit same-origin, top navigation, and popup escape permissions. New windows
// opened by student code must inherit these restrictions too.
export const PREVIEW_SANDBOX = 'allow-scripts allow-forms allow-modals allow-popups';
export const MAX_PREVIEW_TEXT_LENGTH = 10000;

export function readPreviewConsoleEvent(
  event: MessageEvent,
  previewWindow: Window | null,
): Omit<ConsoleMessage, 'id'> | null {
  // Opaque sandbox origins serialize as "null"; origin alone is not identity.
  if (!previewWindow || event.source !== previewWindow || event.origin !== 'null') return null;
  const data: unknown = event.data;
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;

  const payload = data as Record<string, unknown>;
  const time = typeof payload.time === 'string'
    ? payload.time.slice(0, 64)
    : new Date().toLocaleTimeString();

  if (payload.type === 'KNOBLY_WEB_CONSOLE') {
    if (typeof payload.level !== 'string' || !['log', 'warn', 'error', 'info'].includes(payload.level) ||
        typeof payload.message !== 'string') return null;
    return {
      level: payload.level as ConsoleMessage['level'],
      message: payload.message.slice(0, MAX_PREVIEW_TEXT_LENGTH),
      time,
    };
  }

  if (payload.type === 'KNOBLY_EVAL_RESULT') {
    if (typeof payload.error === 'string') {
      return { level: 'error', message: `Error: ${payload.error.slice(0, MAX_PREVIEW_TEXT_LENGTH)}`, time };
    }
    if (payload.error == null && typeof payload.result === 'string') {
      return { level: 'log', message: `<= ${payload.result.slice(0, MAX_PREVIEW_TEXT_LENGTH)}`, time };
    }
  }
  return null;
}

/** Open only a trusted wrapper at app origin; student HTML stays in a sandbox. */
export function openSandboxedPreview(html: string): void {
  const popup = window.open('about:blank', '_blank');
  if (!popup) return;
  popup.opener = null;
  const doc = popup.document;
  doc.title = 'Knobly Web Preview';
  doc.body.style.margin = '0';

  const frame = doc.createElement('iframe');
  frame.setAttribute('sandbox', PREVIEW_SANDBOX);
  frame.referrerPolicy = 'no-referrer';
  frame.title = 'Knobly Web Output';
  frame.style.cssText = 'display:block;width:100%;height:100vh;border:0;background:white';
  frame.srcdoc = html;
  doc.body.replaceChildren(frame);
}

/** Runtime bridge injected inside the opaque frame, with no app data attached. */
export function createPreviewConsoleBridge(parentOrigin: string): string {
  const origin = new URL(parentOrigin).origin;
  if (!/^https?:\/\//.test(origin)) throw new Error('Preview requires an HTTP(S) parent origin.');
  return `(function() {
  var parentOrigin = ${JSON.stringify(origin)};
  var maxTextLength = ${MAX_PREVIEW_TEXT_LENGTH};
  function serialize(arg) {
    if (arg === null) return 'null';
    if (arg === undefined) return 'undefined';
    if (typeof arg === 'object') {
      try { return String(JSON.stringify(arg)).slice(0, maxTextLength); } catch(e) {}
    }
    return String(arg).slice(0, maxTextLength);
  }
  function sendLog(level, args) {
    try {
      window.parent.postMessage({
        type: 'KNOBLY_WEB_CONSOLE', level: level,
        message: Array.from(args).map(serialize).join(' ').slice(0, maxTextLength),
        time: new Date().toLocaleTimeString()
      }, parentOrigin);
    } catch(e) {}
  }
  ['log', 'warn', 'error', 'info'].forEach(function(level) {
    var original = console[level];
    console[level] = function() {
      original.apply(console, arguments);
      sendLog(level, arguments);
    };
  });
  window.onerror = function(message, source, lineno) {
    sendLog('error', ['[Line ' + lineno + '] ' + message]);
  };
  window.addEventListener('message', function(ev) {
    if (ev.source !== window.parent || ev.origin !== parentOrigin) return;
    var data = ev.data;
    if (!data || data.type !== 'KNOBLY_EVAL_CMD' || typeof data.code !== 'string' ||
        data.code.length > maxTextLength) return;
    try {
      var result = new Function('return (' + data.code + ')')();
      window.parent.postMessage({ type: 'KNOBLY_EVAL_RESULT', result: serialize(result), error: null }, parentOrigin);
    } catch(e) {
      window.parent.postMessage({ type: 'KNOBLY_EVAL_RESULT', result: null, error: String(e.message).slice(0, maxTextLength) }, parentOrigin);
    }
  });
})();`;
}
