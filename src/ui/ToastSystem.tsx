export interface ToastData {
  id: number;
  message: string;
  icon: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  createdAt: number;
}

const TOAST_DURATION = 4000;

const typeColors: Record<string, string> = {
  info: 'rgba(42,31,14,0.95)',
  success: 'rgba(14,42,20,0.95)',
  warning: 'rgba(60,45,10,0.95)',
  danger: 'rgba(60,14,14,0.95)',
};

const borderColors: Record<string, string> = {
  info: '#c9a84c',
  success: '#38a169',
  warning: '#d69e2e',
  danger: '#e53e3e',
};

let container: HTMLDivElement | null = null;

function ensureContainer(): HTMLDivElement {
  if (container && document.body.contains(container)) return container;
  container = document.createElement('div');
  container.style.cssText =
    'position:fixed;top:70px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;gap:6px;z-index:9999;pointer-events:none;';
  document.body.appendChild(container);
  return container;
}

export function pushToast(message: string, icon: string, type: ToastData['type'] = 'info') {
  const c = ensureContainer();
  const el = document.createElement('div');
  el.style.cssText = `
    background:${typeColors[type]};
    border:1px solid ${borderColors[type]};
    border-radius:6px;
    padding:6px 16px;
    font-size:13px;
    color:#f4e4c1;
    white-space:nowrap;
    opacity:1;
    transition:opacity 0.3s;
    font-family:inherit;
  `;
  el.textContent = `${icon} ${message}`;
  c.appendChild(el);

  setTimeout(() => {
    el.style.opacity = '0';
    setTimeout(() => { if (el.parentNode) el.remove(); }, 400);
  }, TOAST_DURATION);
}

export function getActiveToasts(): ToastData[] {
  return [];
}

export function ToastContainer() {
  return null;
}
