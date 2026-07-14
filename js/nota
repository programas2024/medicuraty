(function () {
    const STORAGE_KEY = 'medicurativo.security.log';
    const MAX_LOG_ENTRIES = 25;

    const getLog = () => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch (error) {
            return [];
        }
    };

    const saveLog = (entry) => {
        const entries = getLog();
        entries.unshift(entry);
        const trimmed = entries.slice(0, MAX_LOG_ENTRIES);
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
        } catch (error) {
            console.warn('No se pudo guardar el registro de seguridad.', error);
        }
    };

    const reportAttempt = (reason, details = {}) => {
        const entry = {
            reason,
            details,
            timestamp: new Date().toISOString(),
            url: window.location.href
        };
        saveLog(entry);
        console.warn(`[Medicurativo Security] ${reason}`, details);

        if (document.body && !document.getElementById('medicurativo-security-banner')) {
            const banner = document.createElement('div');
            banner.id = 'medicurativo-security-banner';
            banner.textContent = 'Actividad sospechosa bloqueada.';
            banner.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:999999;background:#8e44ad;color:#fff;padding:10px 14px;border-radius:999px;font-size:12px;font-weight:700;box-shadow:0 10px 25px rgba(0,0,0,.2);';
            document.body.appendChild(banner);
            setTimeout(() => banner.remove(), 3500);
        }
    };

    const isAllowedShortcut = (event) => {
        const key = event.key?.toLowerCase() || '';
        const code = event.code?.toLowerCase() || '';
        const ctrlOrMeta = event.ctrlKey || event.metaKey;
        const shift = event.shiftKey;
        const alt = event.altKey;

        if (event.key === 'F12' || code === 'f12') return false;
        if (ctrlOrMeta && (key === 'u' || key === 's' || key === 'p' || key === 'j')) return false;
        if (ctrlOrMeta && shift && (key === 'i' || key === 'c')) return false;
        if (alt && key === 'f4') return false;
        if (ctrlOrMeta && shift && code === 'tab') return false;
        return true;
    };

    document.addEventListener('keydown', (event) => {
        if (!isAllowedShortcut(event)) {
            event.preventDefault();
            event.stopPropagation();
            reportAttempt('Atajo bloqueado', {
                key: event.key,
                code: event.code,
                ctrlKey: event.ctrlKey,
                metaKey: event.metaKey,
                shiftKey: event.shiftKey,
                altKey: event.altKey
            });
        }
    }, true);

    document.addEventListener('contextmenu', (event) => {
        const target = event.target;
        const editable = target && target.closest && target.closest('input, textarea, select, [contenteditable="true"]');
        if (!editable) {
            event.preventDefault();
            reportAttempt('Menú contextual bloqueado', { tag: target?.tagName || 'unknown' });
        }
    }, true);

    document.addEventListener('dragstart', (event) => {
        const target = event.target;
        if (target && target.tagName === 'IMG') {
            event.preventDefault();
            reportAttempt('Intento de arrastre bloqueado', { tag: target.tagName });
        }
    }, true);

    document.addEventListener('selectstart', (event) => {
        const target = event.target;
        if (target && !['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
            event.preventDefault();
        }
    }, true);

    document.addEventListener('copy', (event) => {
        const target = event.target;
        if (!target || !target.closest || !target.closest('input, textarea, select, [contenteditable="true"]')) {
            reportAttempt('Copia bloqueada', { tag: target?.tagName || 'unknown' });
            event.preventDefault();
        }
    }, true);

    window.addEventListener('beforeunload', (event) => {
        if (window.__medicurativoUnsavedChanges) {
            event.preventDefault();
            event.returnValue = '';
        }
    });

    window.getMedicurativoSecurityLog = () => getLog();
    window.clearMedicurativoSecurityLog = () => {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.warn('No se pudo limpiar el registro de seguridad.', error);
        }
    };
})();
