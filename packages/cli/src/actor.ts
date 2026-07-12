import { CliError } from "./errors.js";

export const ACTOR_ENV = "AGENTSTATE_LITE_ACTOR";

export interface ResolveActorOptions {
  /** Injectable for deterministic tests; commands use process.env. */
  env?: NodeJS.ProcessEnv;
  /** Caller-specific fixing command for a blank explicit flag/environment value. */
  help?: string;
}

/** Resolve advisory attribution once at the CLI boundary: explicit flag > environment > absent. */
export function resolveActor(explicit: string | undefined, opts: ResolveActorOptions = {}): string | undefined {
  const env = opts.env ?? process.env;
  const hasEnv = Object.prototype.hasOwnProperty.call(env, ACTOR_ENV);
  const source = explicit !== undefined ? "--actor" : hasEnv ? ACTOR_ENV : undefined;
  const raw = explicit !== undefined ? explicit : hasEnv ? env[ACTOR_ENV] ?? "" : undefined;
  if (raw === undefined) return undefined;
  const actor = raw.trim();
  if (!actor) {
    throw new CliError(
      "USAGE",
      `${source} was given an empty value — pass an actor identity or ${source === "--actor" ? "omit the flag" : `unset ${ACTOR_ENV}`}.`,
      opts.help ? { help: opts.help } : {},
    );
  }
  return actor;
}
