// Compatibility entry point for documented older commands.
console.warn('audit:codex is retired; running the current audit:public suite. No codex_harness score or equivalence is claimed.');
await import('./run-public-audit.mjs');
