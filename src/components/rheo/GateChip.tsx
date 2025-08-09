'use client';

export function GateChip({ label, passed }: { label: string; passed: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 text-sm rounded-full border
      ${passed ? 'bg-rheo-accent text-white border-transparent' : 'bg-white/70 text-rheo-subtle border-rheo-border'}`}>
      {passed ? '✓' : '•'} {label}
    </span>
  );
}
