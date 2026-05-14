# Google Drive File Provider Repair Toolkit

> macOS repair toolkit case study for diagnosing and conservatively restoring Google Drive File Provider state without deleting Drive data.

## Summary
Google Drive File Provider Repair Toolkit is a standalone macOS operations project built around a real Drive for desktop failure mode: a valid app and extension existed locally, but the File Provider extension and domain disappeared from macOS registration surfaces. The toolkit diagnoses the current state, offers dry-run repair, re-registers the app and extension, restarts the per-user file provider path, clears only matching stale IPC sockets after process cycling, and inspects sync state for explicit files or folders. The public case study is framed around conservative recovery: no Drive cache deletion, no CloudStorage deletion, no account disconnect, and no mirrored/streamed data removal.

## Project Link
https://zack-dev-cm.github.io/projects/google-drive-file-provider-repair-toolkit.md

## Key Features
- Diagnoses Google Drive app, File Provider extension, domain registration, endpoint reachability, stale roots, and per-path sync state
- Runs safe repair with dry-run support before changing local Launch Services, pluginkit, Drive, or fileproviderd state
- Collects shareable diagnostic bundles and unified-log excerpts for manual escalation without deleting user data
- Includes explicit guardrails against deleting Drive caches, CloudStorage content, accounts, or mirrored/streamed files

## Tech Stack
- macOS
- Shell
- File Provider
- Google Drive
- Diagnostics
- Local-first Tooling

## Benchmarks & Analytics
- Command families: 6 (diagnose, repair, collect logs, inspect recovery, inspect sync, wait sync)
- Destructive data actions: 0 (0 cache, CloudStorage, account, or user-data deletion paths in reviewed repair flow, 2026-04-17)
- Source review date: 2026-04-17 (project evidence review)
