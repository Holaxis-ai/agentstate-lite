// Stryker tap-runner preload: pin the process cwd for the hook's exit-time write.
//
// The tap-runner hook (@stryker-mutator/tap-runner setup/hook.cjs) writes its results file to a
// RELATIVE path (`stryker-output-<pid>.json`) inside a `process.on('exit')` handler, and the
// runner reads that path against the SPAWN cwd (the package dir). A test that legitimately
// `process.chdir()`s — e.g. packages/cli/test/home.test.ts pins a hermetic cwd at module load —
// makes the hook write into the wrong (possibly deleted) directory, failing the whole run with
// ENOENT.
//
// Exit handlers run in REGISTRATION order, so this file must be preloaded BEFORE the hook
// (`-r <this file> -r {{hookFile}}` in tap.nodeArgs): our handler restores the spawn cwd first,
// then the hook's handler writes where the runner expects. Tests keep full chdir freedom.
"use strict";
const spawnCwd = process.cwd();
process.on("exit", () => {
  try {
    process.chdir(spawnCwd);
  } catch {
    // The spawn dir itself is gone — nothing we can do; let the hook fail loudly.
  }
});
