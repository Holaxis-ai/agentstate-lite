import { join } from "node:path";

/** Claude/Codex config-root conventions shared by hook targeting and skill discovery. */
export const HOST_CONFIG_ROOTS = {
  claude: { env: "CLAUDE_CONFIG_DIR", fallbackDirectory: ".claude" },
  codex: { env: "CODEX_HOME", fallbackDirectory: ".codex" },
} as const;

export type HostConfigRoot = (typeof HOST_CONFIG_ROOTS)[keyof typeof HOST_CONFIG_ROOTS];

/** Resolve a host root with shell `${VAR:-fallback}` semantics: empty overrides also fall back. */
export function resolveHostConfigRoot(
  config: HostConfigRoot,
  home: string,
  env: NodeJS.ProcessEnv,
): string {
  const configured = env[config.env];
  return configured === undefined || configured.length === 0
    ? join(home, config.fallbackDirectory)
    : configured;
}

/** Render the equivalent shell expression used by the generated skill's discovery loop. */
export function renderShellHostConfigRoot(config: HostConfigRoot): string {
  return `"\${${config.env}:-$HOME/${config.fallbackDirectory}}"`;
}
