# Package Manager

Use pnpm 11 or newer as the project package manager.

## Why

pnpm 11 gives this project better default protection against fast-moving npm supply-chain incidents. The TanStack package compromise disclosed on May 11, 2026 is the motivating example: malicious package versions were published and removed within minutes, and installs during that narrow window could expose credentials from local machines or CI runners.

pnpm 11 helps reduce that risk in two important ways:

- It defaults `minimumReleaseAge` to 1 day, which prevents freshly published package versions from being resolved immediately after release.
- It defaults `blockExoticSubdeps` to `true`, which blocks dependency patterns such as GitHub-ref subdependencies that can be abused in supply-chain attacks.

These protections are not a complete security guarantee. They are a project baseline that makes accidental exposure less likely when an upstream package is compromised.

## Rules

- Use pnpm 11 or newer for installing, updating, and running package scripts.
- Commit `pnpm-lock.yaml` when dependencies are installed or changed.
- Do not introduce `package-lock.json`, `yarn.lock`, or `bun.lockb` unless the developer explicitly approves changing package managers.
- Keep dependency installs locked in CI by using the committed lockfile.
- Prefer package-manager security settings that preserve pnpm 11's default supply-chain protections.
