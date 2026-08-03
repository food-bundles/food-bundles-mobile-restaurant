# Autonomous kickoff prompt — FoodBundles Restaurant (React Native)

Use this **after** the discovery prompt has been answered and you are ready to leave the
build running unattended. Prerequisites, once:

```powershell
cd C:\Users\emash\FoodBundles\food-bundles-mobile-restaurant
git init ; git add -A ; git commit -m "chore: design reference + agent instructions"
git branch -M main ; git checkout -b feat/mobile-ui
# if you have a remote:  git remote add origin <url> ; git push -u origin feat/mobile-ui
```

`.claude/settings.json` already pre-approves git, npm, npx, node, PowerShell and the file
tools, with force-push, history rewrites, publishing and network fetches denied. Start
Claude Code normally:

```powershell
claude
```

If it still pauses for permission on something, restart with
`claude --dangerously-skip-permissions` — only do that with the repo committed, since it
removes the safety net entirely.

---

## Paste this

Work autonomously per the Autonomous Mode protocol in CLAUDE.md. The design discovery is
done and Premium is settled at 100,000 RWF/month (28,000 weekly) — correct the landing
copy to match.

Build the whole app, phase by phase, in the order listed in PROGRESS.md. For every phase:
plan it, build it, run all three gates (tsc --noEmit, eslint --max-warnings 0, the
200-line check), fix everything they surface, self-review your diff against that phase's
skill checklist, commit with a conventional message, push to feat/mobile-ui, rewrite
PROGRESS.md, then say "Phase N complete. Starting Phase N+1." and immediately continue.

Do not ask me for approval between phases. Do not stop to summarise. Do not wait for a
reply at any point.

When the design does not settle something, decide it yourself: follow CLAUDE.md and the
skills first, then the prototype, then an existing pattern, and failing all three take the
most conservative option — no new tokens, no new components, no invented copy. Give
yourself about 30 seconds of thought per open question, then decide and log it under
"Decisions taken autonomously" in PROGRESS.md with a one-line rationale. Never block on a
question tool; nobody is here to answer.

Stop only for the four conditions in the protocol: destructive or irreversible actions,
anything needing a real credential or payment, a domain-rule contradiction you cannot
resolve conservatively, or a broken environment after three repair attempts. Everything
else — naming, file splits, spacing, extraction, mock copy for unspecified fields,
animation curves, folder layout — is yours to decide.

Non-negotiables hold throughout: no file over 200 lines including styles; fully mocked
with no fetch, no API client and no TODO comments; no hardcoded colour, font, radius,
duration or currency string in any component; every touchable at least 44×44 with an
accessibility label and all text at 4.5:1 or better; every user-facing chrome string in
src/i18n across EN, Kinyarwanda and French; all 51 screens reachable through real
navigation with loading, empty and error states wherever data appears.

Go until every phase in PROGRESS.md is done. Then give me one short report: phases
completed, screens built, decisions logged, anything deferred.

---

## While you are away

Nothing to do. When you return:

```powershell
git log --oneline feat/mobile-ui        # one commit per phase
type PROGRESS.md                        # phase log + decisions
npx expo start                          # walk the flows
```

Read **Decisions taken autonomously** first — that is where anything you might want
changed will be, and each entry is written to be cheap to reverse.
