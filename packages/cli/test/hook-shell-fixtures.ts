const DIRECT = "/tmp/x/packages/cli/dist/agentstate-lite.mjs";
const directWith = (segment: string): string =>
  `/tmp/${segment}/packages/cli/dist/agentstate-lite.mjs session-start`;
const nodeWith = (segment: string): string =>
  `/opt/${segment}/bin/node /opt/${segment}/lib/node_modules/@holaxis/aslite/dist/agentstate-lite.mjs session-start`;

/** Shell-active or grammar-foreign strings that must never establish destructive ownership. */
export const SHELL_FOREIGN_COMMANDS: ReadonlyArray<{ family: string; command: string }> = [
  { family: "parameter expansion", command: directWith("${HOME}") },
  { family: "command substitution", command: directWith("$(pwd)") },
  { family: "backtick command substitution", command: directWith("`pwd`") },
  { family: "arithmetic expansion", command: directWith("$((1+1))") },
  { family: "and operator", command: `${DIRECT} session-start && echo foreign` },
  { family: "pipe operator", command: `${DIRECT} session-start | echo foreign` },
  { family: "semicolon operator", command: `${DIRECT} session-start; echo foreign` },
  { family: "output redirect", command: `${DIRECT} session-start >/tmp/hook.log` },
  { family: "input redirect", command: `${DIRECT} session-start </tmp/hook.input` },
  { family: "shell comment", command: `${DIRECT} session-start # foreign` },
  { family: "comment marker in token", command: directWith("#foreign") },
  { family: "star pathname expansion", command: directWith("*") },
  { family: "question pathname expansion", command: directWith("?") },
  { family: "bracket pathname expansion", command: directWith("[ab]") },
  { family: "brace list expansion", command: directWith("{a,b}") },
  { family: "brace sequence expansion", command: directWith("{1..2}") },
  { family: "tilde expansion", command: "~/packages/cli/dist/agentstate-lite.mjs session-start" },
  { family: "history expansion", command: directWith("!1") },
  { family: "history quick substitution", command: directWith("^old^new^") },
  { family: "unterminated single quote", command: `'${DIRECT} session-start` },
  { family: "unterminated double quote", command: `"${DIRECT} session-start` },
  { family: "unquoted escape", command: directWith(String.raw`\x`) },
  { family: "unquoted Unicode", command: directWith("café") },
  { family: "Node parameter expansion", command: nodeWith("${HOME}") },
  { family: "Node pathname expansion", command: nodeWith("*") },
  { family: "Node brace expansion", command: nodeWith("{a,b}") },
];

export const localDevExecutable = (segment: string): string =>
  `/tmp/x${segment}x/packages/cli/dist/agentstate-lite.mjs`;

export const stableNodePair = (segment: string): [string, string] => [
  `/opt/x${segment}x/bin/node`,
  `/opt/x${segment}x/lib/node_modules/@holaxis/aslite/dist/agentstate-lite.mjs`,
];
