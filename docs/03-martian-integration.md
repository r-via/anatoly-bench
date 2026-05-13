# Intégration Martian code-review-benchmark — raison d'être et état

**Date :** 2026-05-13
**Statut :** proto-analysis livré. Décision : attente epic Anatoly `--diff` avant industrialisation.
**Fixture associé :** [catalog/martian-pr-review/](../catalog/martian-pr-review/)

---

## 1. Pourquoi ce fixture existe

[withmartian/code-review-benchmark](https://github.com/withmartian/code-review-benchmark) est en train de devenir le benchmark de référence pour les outils de PR-review IA. 9 outils déjà trackés (CodeRabbit, Cursor, Copilot, Qodo, Greptile, Codex, Augment, Sentry), [méthodologie publique](https://github.com/withmartian/code-review-benchmark/blob/main/methodology/summary.md), 50 PRs offline + une track online via signaux comportementaux OSS. Qodo le met en avant publiquement [comme preuve de leur #1](https://www.qodo.ai/blog/qodo-ranked-1-ai-code-review-tool-in-martians-code-review-benchmark/).

Le doc methodology invite explicitement les tool builders à s'engager sur leur "shared evaluation harness" : inputs `(diff, file context, repo context, config files)`, outputs `(comments with file, line, description, severity)`. C'est une porte ouverte qu'Anatoly devrait franchir avant que l'interface se fige (stage 3 de leur roadmap = devenir un standard à la SWE-Bench).

## 2. Le décalage de paradigme

| | anatoly-bench / slot-engine | martian-pr-review |
|---|---|---|
| Scope | projet entier | diff d'un PR |
| Ground truth | YAML `(axis, file, line, verdict, weight)` | free-text `{comment, severity}` |
| Scorer | bipartite match déterministe | LLM-as-judge sémantique |
| Langages | TS | TS, Python, Go, Java, Ruby |

Conséquence : le scorer existant d'anatoly-bench ne s'applique pas tel quel. Soit on annote file/line à la main sur 580 comments (coûteux), soit on intègre le LLM-judge de Martian comme track dédiée, soit on candidate directement chez eux.

## 3. État actuel — proto-analysis 5 PRs

Détails complets : [catalog/martian-pr-review/proto-analysis.md](../catalog/martian-pr-review/proto-analysis.md).

20 golden comments classifiés (axe Anatoly + tier de détectabilité) sur 5 PRs, 1 par langage. Résultat :

- **Plafond structurel aujourd'hui : 75%** (15/20 comments dans le scope des axes scorés d'Anatoly, tier T1+T2 = local ou cross-file).
- **Plafond après roadmap 5a + 5c shippés : 90%** (T3 = défauts domain-knowledge débloqués par industry-knowledge prompting et user-provided invariants).
- **Miss permanent : 10%** (axe `n/a` : i18n translation correctness ; tier T5 : régression vs comportement antérieur, non détectable depuis un seul snapshot post-PR).

Distribution observée des comments : **60% `correction`**, **20% `best-practices`**, 5% duplication, 0% utility/overengineering/tests/documentation, 15% hors scope. C'est exactement l'axe le plus mature d'Anatoly (`correction` est le plus stable sur slot-engine).

**Estimation grossière Anatoly post-`--diff` mode : 50-60% F1.** Comparaison [leaderboard agentic-review-benchmarks](https://github.com/agentic-review-benchmarks/benchmark-pr-mapping) : Qodo Exhaustive 60.1%, Qodo Precise 55.4%, Augment 44.1%, Copilot 42.8%, le reste sous 40%. Podium plausible.

## 4. Bloqueur unique : Anatoly `--diff` mode

Anatoly audite aujourd'hui des working trees entiers. Pour être éligible au format Martian, il faut un mode qui :

- consomme `(base ref, head ref)` au lieu d'un working dir
- restreint les findings au scope du diff (fichiers touchés + symboles dont la signature ou les call-sites changent)
- émet en format Martian : `{file, line, description, severity}` au lieu du shard markdown actuel

Effort estimé côté Anatoly : 1-2 semaines. C'est un **epic Anatoly**, pas un epic bench.

## 5. Décision

**Ne pas mirroir le pipeline Martian en interne avant l'epic Anatoly `--diff`.** Sans ce mode, Anatoly en mode project-audit produirait un score trompeusement bas (la majorité des findings tomberait hors-scope du PR → FPs côté Martian) qui ne reflète pas son potentiel structurel à 75%+.

**Plan séquencé :**

1. **Ouvrir l'epic `--diff` dans Anatoly** ([r-via/anatoly](https://github.com/r-via/anatoly)). Référencer ce doc et la proto-analysis.
2. **Pendant l'implémentation**, élargir le proto-analysis de 5 → 15-20 PRs pour valider que la distribution (60% correction, 20% best-practices, 10% n/a, 5% T5) tient sur un échantillon plus large. Si la part `n/a` ou T5 grimpe à >25%, le plafond chute et la priorité change.
3. **Contacter Martian** pour confirmer leur "shared evaluation harness" et participer à sa définition pendant qu'elle est encore malléable.
4. **Quand `--diff` est shippé** : refaire l'analyse en exécution réelle, porter le scorer Martian (step3_judge_comments.py) comme track dédiée dans anatoly-bench, publier les premiers baselines sous `baselines/martian-*`.

---

## Historique des décisions

- **2026-05-13** — proto-analysis 5 PRs livré. Reco : attente `--diff` côté Anatoly avant d'industrialiser. Fixture stub créé en [catalog/martian-pr-review/](../catalog/martian-pr-review/).
