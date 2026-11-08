// A display/submission trigger only. The backend retains the authoritative
// attempt deadline and grading policy; this helper never extends either.
export function startExamCountdown(deadline: number, onTick: (remaining: number) => void, onExpire: () => void) {
    let active = true;
    let interval: ReturnType<typeof setInterval> | null = null;
    let initial: ReturnType<typeof setTimeout> | null = null;
    const stop = () => {
        active = false;
        if (interval !== null) clearInterval(interval);
        if (initial !== null) clearTimeout(initial);
    };
    const tick = () => {
        if (!active) return;
        const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
        onTick(remaining);
        if (remaining === 0) { stop(); onExpire(); }
    };
    interval = setInterval(tick, 1000);
    initial = setTimeout(tick, 0);
    return stop;
}
