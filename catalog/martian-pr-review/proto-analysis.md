# Proto-analysis : Anatoly vs Martian golden comments

**Date :** 2026-05-13
**Sample :** 5 PRs (1 par repo / 1 par langage) sur les 50 du dataset offline Martian
**Comments analysés :** 20
**Méthodo :** paper analysis. Pas d'exécution Anatoly. Pour chaque golden comment, classification (a) axe Anatoly qui couvrirait le défaut, (b) tier de détectabilité.

## Échantillon

| Repo | PR | Lang | Comments |
|---|---|---|---|
| Sentry | [getsentry/sentry#67876](https://github.com/getsentry/sentry/pull/67876) — GitHub OAuth Security Enhancement | Python | 3 |
| Grafana | [grafana/grafana#79265](https://github.com/grafana/grafana/pull/79265) — Anonymous: Add configurable device limit | Go | 5 |
| Cal.com | [calcom/cal.com#10967](https://github.com/calcom/cal.com/pull/10967) — fix: handle collective multiple host on destinationCalendar | TypeScript | 5 |
| Discourse | [discourse-graphite#1](https://github.com/ai-code-review-evaluation/discourse-graphite/pull/1) — automatically downsize large images | Ruby | 3 |
| Keycloak | [keycloak/keycloak#37429](https://github.com/keycloak/keycloak/pull/37429) — Add HTML sanitizer for translated message resources | Java | 4 |

## Grille de classification

**Axes Anatoly :** `correction` · `utility` · `duplication` · `overengineering` · `best-practices` · `tests` · `documentation` · `n/a` (hors scope)

**Tiers de détectabilité :**

- **T1 / local** — défaut visible dans la diff d'un seul fichier, pattern langage ou null-check classique. Anatoly devrait catch.
- **T2 / cross-file** — nécessite de suivre un symbole vers un autre fichier du projet. Anatoly's symbol graph couvre ça (axe correction notamment).
- **T3 / domain** — requiert connaissance industrie ou du domaine projet (OAuth state, RNG sécurisé, conventions d'API). Couvert par roadmap items 5a (industry-knowledge prompting) et 5c (user-provided invariants).
- **T4 / sub-symbol** — défaut dans un bloc sous-symbole. Couvert par roadmap item 6 (architecturalement coûteux).
- **T5 / nope** — non détectable par analyse statique d'un seul snapshot (régression vs comportement antérieur, faute de traduction).

## Classification par comment

### Sentry #67876 — Python

| # | Severity | Comment (résumé) | Axe | Tier | Notes |
|---|---|---|---|---|---|
| 1 | Medium | Null reference si `github_authenticated_user` state absent | `correction` | T1 | Null-deref classique, accessible function-local |
| 2 | Medium | OAuth state utilise `pipeline.signature` (statique) au lieu d'un random per-request | `best-practices` | T3 | Connaissance industrie OAuth — roadmap 5a applicable |
| 3 | High | Accès `integration.metadata[sender][login]` sans guard `sender in metadata` | `correction` | T1 | Dict-access sans check, function-local |

### Grafana #79265 — Go

| # | Severity | Comment (résumé) | Axe | Tier | Notes |
|---|---|---|---|---|---|
| 1 | High | Race condition : check-then-create sans transaction | `correction` | T2 | TOCTOU concurrency — Anatoly peut catch via pattern recognition mais sensible |
| 2 | Medium | Auth maintenant bloquée si `ErrDeviceLimitReached` — comportement précédent était async non-bloquant | `correction` | T5 | **Régression vs comportement antérieur — non détectable depuis snapshot post-PR seul** |
| 3 | Medium | `dbSession.Exec(args...)` — type mismatch (compile error supposé) | `correction` | T1 | Type-level, function-local. Si le PR a mergé, comment est probablement nuancé/over-strict |
| 4 | Low | Retourner `ErrDeviceLimitReached` quand 0 rows updated est misleading | `correction` | T1 | Error semantics, function-local |
| 5 | Low | Incohérence fenêtre temporelle : `device.UpdatedAt` vs `time.Now().UTC()` | `correction` | T1 | Logique fine mais function-local |

### Cal.com #10967 — TypeScript

| # | Severity | Comment (résumé) | Axe | Tier | Notes |
|---|---|---|---|---|---|
| 1 | High | Null deref `mainHostDestinationCalendar` si `evt.destinationCalendar` null/empty | `correction` | T1 | Null-flow classique |
| 2 | Low | Optional chaining `?.integration` redondant après check ternaire | `best-practices` | T1 | Style — Anatoly best-practices doit être calibré pour ces nits |
| 3 | High | `externalId === externalCalendarId` cherche un calendrier qui matche lui-même | `correction` | T2 | Logic error — accessible via data-flow local-ish |
| 4 | Medium | Inversion `IS_TEAM_BILLING_ENABLED` : `slug` set quand `true` au lieu de `false` | `correction` | T2 | Pattern suspect des deux propriétés set en même temps visible localement |
| 5 | Low | Interface `Calendar.createEvent(event, credentialId)` mais Lark/Office365 implémentent `createEvent(event)` | `correction` | T2 | Cross-file interface check — TS compiler aurait dû catch, donc probablement `any` quelque part |

### Discourse-graphite #1 — Ruby

| # | Severity | Comment (résumé) | Axe | Tier | Notes |
|---|---|---|---|---|---|
| 1 | Medium | `downsize` défini deux fois — la seconde override la première qui devient unreachable | `duplication` + `utility` | T1 | **Slam dunk Anatoly** — duplication intra-fichier + dead code |
| 2 | Low | `maxSizeKB = 10 * 1024` hardcodé ignore `Discourse.SiteSettings['max_..._size_kb']` | `best-practices` | T3 | Convention domain — internal-docs injection (roadmap shipped v10) pourrait surfacer |
| 3 | Medium | Passing 80% comme dimensions casse pour animated GIFs (gifsicle attend WxH) | `correction` | T3 | Connaissance outil externe (gifsicle) — pretraining LLM peut couvrir |

### Keycloak #37429 — Java

| # | Severity | Comment (résumé) | Axe | Tier | Notes |
|---|---|---|---|---|---|
| 1 | Medium | Traduction en italien au lieu de lituanien dans `messages_lt.properties` | `n/a` | — | **Hors scope Anatoly** — pas d'axe i18n |
| 2 | Medium | `totpStep1` utilise chinois traditionnel dans fichier `zh_CN` (simplifié) | `n/a` | — | **Hors scope Anatoly** |
| 3 | Low | Anchor sanitization consomme matcher groups sans validation | `correction` | T1 | Logic bug function-local |
| 4 | Low | Typo nom de méthode `santizeAnchors` → `sanitizeAnchors` | `best-practices` | T1 | Naming — best-practices axis doit être calibré pour typos |

## Agrégat

**Distribution par axe :**

| Axe | Count | % |
|---|---:|---:|
| `correction` | 12 | 60% |
| `best-practices` | 4 | 20% |
| `duplication` | 1 | 5% |
| `utility` (combo avec duplication) | 1 | 5% |
| `n/a` (hors scope) | 2 | 10% |

Note : `tests`, `documentation`, `overengineering` = 0 sur l'échantillon. Les golden comments sont massivement orientés **bugs de logique** (correction) et **conventions sécuritaires/style** (best-practices). Très peu de dead code, presque pas de smell d'abstraction.

**Distribution par tier :**

| Tier | Count | % |
|---|---:|---:|
| T1 local | 11 | 55% |
| T2 cross-file | 4 | 20% |
| T3 domain | 3 | 15% |
| T5 nope (régression) | 1 | 5% |
| N/A (hors scope axe) | 2 | 10% (1 Italian translation + 1 zh_CN/zh_TW) |

Note: une entrée Keycloak est `n/a` axe (translation correctness) — comptée comme N/A axe ; comme tier sa détectabilité est non-applicable.

## Plafond structurel estimé

```
Plafond aujourd'hui (T1 + T2 sur axes scorés actuellement)        = 15/20 = 75%
Plafond après roadmap 5a + 5c (industry-knowledge + invariants)   = 18/20 = 90%
Miss permanent (axes hors scope + régression détection)           =  2/20 = 10%
```

**Calibration vs slot-engine :** sur slot-engine où le matching est en notre faveur (axes parfaitement alignés, file/line précis), Anatoly atteint ~70% F1 global. Sur Martian, le matching est **plus lâche** (LLM-judge, pas de file/line requirement) — recall peut être plus haut, mais précision dépend de combien de findings additionnels Anatoly émet sur les fichiers du diff sans contrepartie golden.

**Estimation grossière pour Anatoly sur le leaderboard Martian :**

| Métrique | Estimation post-`--diff` mode + filtre fichiers PR |
|---|---|
| Recall | 50-60% (multiplier 75% structurel × ~70-80% efficacité réelle d'Anatoly sur slot-engine) |
| Precision | 50-65% (dépend du bruit Anatoly sur fichiers touchés mais hors-scope du PR-intent) |
| F1 | **50-60%** |

**Comparaison leaderboard actuel ([benchmark-pr-mapping](https://github.com/agentic-review-benchmarks/benchmark-pr-mapping)) :**

```
Qodo - Exhaustive  60.1% F1  (63.8% / 56.7%)
Qodo - Precise     55.4% F1  (74.5% / 44.2%)
Augment            44.1% F1
Copilot            42.8% F1
Cursor             39.3% F1
Greptile           39.0% F1
Codex              37.6% F1
Coderabbit         28.0% F1
Sentry             23.7% F1
```

Anatoly à 50-60% F1 estimé → **podium plausible**, entre Qodo Exhaustive et Qodo Precise.

## Caveats

1. **Échantillon = 5/50 PRs** (10%). La distribution des golden comments sur les 50 complètes peut être différente — plus d'i18n (Keycloak biaise vers `n/a`), plus de régression-vs-prior (Grafana en a déjà 1/5).
2. **"Plafond structurel" ≠ "performance réelle"**. Sur slot-engine, même sur défauts parfaitement fittés, Anatoly atteint ~70% recall — l'écart vient des bugs implémentation/prompt non encore corrigés.
3. **`--diff` mode n'existe pas encore dans Anatoly**. Ce proto suppose que ce mode (a) restreindrait le scan aux fichiers de la diff, (b) garderait le scoring per-symbol mais filtré. Coût d'implémentation : 1-2 semaines côté Anatoly (epic à ouvrir).
4. **Filtre fichiers = sur-restrictif**. Un défaut introduit par le PR peut surfacer une cassure dans un fichier non touché. Le filtre par fichiers de la diff manquerait ce cas. Filtre plus malin : symboles dont la signature ou les call-sites changent dans le diff.
5. **Précision menacée par les findings out-of-PR-scope**. Anatoly peut flagger 10 vrais bugs préexistants dans `integration.py` (Sentry) qui ne sont pas dans les golden comments du PR — chacun = 1 FP côté Martian. Le filtre PR-scope mitige mais n'élimine pas (un bug préexistant *qu'un reviewer humain n'aurait pas commenté* peut quand même être réel).

## Conclusion

**Signal : positif et solide.** 75% des golden comments sont structurellement dans le scope d'Anatoly aujourd'hui. 90% le seraient avec les items roadmap 5a et 5c shippés. Anatoly mappé sur ce benchmark serait plausiblement compétitif (~50-60% F1, entre Qodo Exhaustive et Qodo Precise).

**Reco actualisée :**

1. **Ouvrir un epic Anatoly `--diff` mode** — c'est le bloqueur structurel. Tant qu'Anatoly audite le projet entier, on est inéligible au format Martian.
2. **Pendant le développement du `--diff` mode**, élargir le proto-analysis à 15-20 PRs (vs 5) pour valider que la distribution observée (60% correction, 20% best-practices, 10% n/a, 5% T5, 5% duplication) tient sur l'ensemble. Si la part `n/a` ou T5 grimpe à >25%, le plafond chute et la priorité change.
3. **Reporter la décision d'intégration côté `anatoly-bench`** jusqu'à ce que `--diff` soit shippé. Refaire cette analyse en exécution réelle à ce moment-là.

Cette analyse remplace l'option (2) de mes recommandations précédentes (mirroir interne sans changer Anatoly) : option (2) est désormais déconseillée — elle produirait un score trompeusement bas qui ne reflète pas le potentiel structurel d'Anatoly.
