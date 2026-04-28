# Rapport Anatoly — feedback depuis anatoly-bench

**Date :** 2026-04-24
**Fixture évalué :** slot-engine (TypeScript, 13 modules, 454 LOC, 25 défauts catalogués sur 5 axes)
**Runs analysés :** 3 runs consécutifs d'Anatoly sur le même code
**Score actuel :** F1 global = 43.2%

---

## 1. Méthodologie

Le bench ingère le rapport sharded d'Anatoly (`axes/*/shard.*.md`) et le compare à un catalogue de défauts plantés manuellement dans le fixture via un matching bipartite strict par axe : `(file, line ± tolerance, symbol, verdict)`.

Un match = 1 TP. Défaut catalogué sans finding qui matche = 1 FN. Finding sans expectation qui matche = 1 FP. F1 par axe = moyenne harmonique recall/precision. F1 global = moyenne non pondérée des F1 par axe.

Le fixture `slot-engine` est un moteur de machine à sous avec 25 défauts plantés (7 correction, 5 utility, 4 duplication, 4 overengineering, 5 best-practices). Les axes `tests` et `documentation` sont exclus de ce fixture (configuration `scored_axes` + `.anatoly.yml enabled:false`) parce que le projet ne porte ni tests ni JSDoc, donc la précision y serait mécaniquement détruite.

---

## 2. Résultats synthétiques

### Scores par axe (run v3, 2026-04-24_162154)

| Axe              | F1     | Recall | Precision | TP | FP | FN |
|------------------|-------:|-------:|----------:|---:|---:|---:|
| correction       |  61.5% |  57.1% |     66.7% |  4 |  2 |  3 |
| utility          |  60.0% |  60.0% |     60.0% |  3 |  2 |  2 |
| duplication      |   0.0% |   0.0% |    100.0% |  0 |  0 |  4 |
| overengineering  |  40.0% |  25.0% |    100.0% |  1 |  0 |  3 |
| best-practices   |  54.5% |  60.0% |     50.0% |  3 |  3 |  2 |
| **global**       | **43.2%** |      |           |    |    |    |

### Progression sur 3 runs

| Run | Global | correction | utility | duplication | overengineering | best-practices |
|-----|-------:|-----------:|--------:|------------:|----------------:|---------------:|
| v1  | 27.7%* | 53.3%      | 60.0%   | 0.0%        | 0.0%            | 40.0%          |
| v2  | 40.7%  | 53.3%      | 60.0%   | 0.0%        | 40.0%           | 50.0%          |
| v3  | 43.2%  | 61.5%      | 60.0%   | 0.0%        | 40.0%           | 54.5%          |

\* v1 incluait `tests` et `documentation` (retirés ensuite de `scored_axes`). L'écart v1→v2 reflète surtout ce changement de périmètre. Les comparaisons meaningful commencent à v2.

**Observation transverse :** `utility` est la seule métrique parfaitement stable. `correction` et `best-practices` progressent via la suppression de faux positifs, pas via de nouvelles détections. `duplication` est cassé de bout en bout.

---

## 3. Bugs confirmés

### 3.1. `duplication` axis : verdict incohérent avec `duplicate_target` ⚠️ BLOQUANT

**Symptôme :** sur 3 runs successifs, l'axe `duplication` a produit **0 findings** alors que le fixture contient 4 cas de duplication sémantique très nets :

- `rng.ts::weightedPick` vs `reels.ts::pickFromWeighted` — même algorithme, variables renommées
- `legacy.ts::computeLegacyPayout` vs `engine.ts::evaluateLine` — même calcul de payout par ligne
- `engine.ts::evaluateLine` (inline) vs `wild.ts::applyWildBonus` — formule wild multiplier dupliquée
- `paytable.ts::lineWins` vs `engine.ts::checkLine` — même prédicat "is winning line"

Cost metrics : l'axe a tourné (12 calls, coût mesuré), mais zéro finding publié.

**Root cause identifiée :** sur inspection d'un payload, un symbole peut présenter le verdict `duplication: UNIQUE` avec `duplicate_target` populé à 95% de similarité. Contradiction d'état :

```json
{
  "duplication": "UNIQUE",
  "detail": "Auto-resolved: no RAG candidate above 0.68 threshold",
  "duplicate_target": {
    "file": "src/paytable.ts",
    "symbol": "lineWins",
    "similarity": "95% identical logic"
  }
}
```

Séquence probable :
1. Phase `duplication` : le RAG ne ramène pas de candidat au-dessus du seuil 0.68 → `fileHasSimilarityCandidates` à `duplication.ts:219` retourne `false` → le LLM est court-circuité → verdict auto = `UNIQUE` avec confidence 90.
2. Phase suivante (deliberation / Opus) : re-détection cross-file qui remplit `duplicate_target` mais **ne bascule pas** le verdict.

**Fix recommandé :**

> **Invariant :** `duplicate_target != null ⇒ duplication == DUPLICATE`

Imposer l'invariant à l'endroit où `duplicate_target` est populé. C'est un fix de cohérence d'état, pas de tuning — indépendant de la question du seuil RAG. Un consommateur downstream (scorer, TUI, agent) ne devrait jamais avoir à choisir entre lire le verdict ou la metadata.

**Fix secondaire (plus risqué) :** baisser le seuil RAG (0.68 → 0.5 ?) ou auditer pourquoi les embeddings sont distants sur du code 95% logiquement identique. À garder orthogonal au fix ci-dessus.

---

### 3.2. `documentation` émet des shards malgré `enabled: false`

**Symptôme :** `.anatoly.yml` contient :

```yaml
axes:
  tests:
    enabled: false
  documentation:
    enabled: false
```

Au run v3 :
- `axes/tests/` **n'existe pas** ✓ (correct)
- `axes/documentation/` **existe** avec un `shard.1.md` ✗

Le shard contient :
- 4 entrées dans "📊 Findings" avec count=0 pour chaque fichier (lignes "inactives")
- 5 bullets dans "🧹 Hygiene" listant des recommandations JSDoc

**Hypothèse :** une phase distincte (possiblement `internal-docs` — visible dans `phaseDurations` de `run-metrics.json`) continue de générer des recommandations de doc même quand l'axe est désactivé. Le drapeau `enabled: false` ne coupe que l'évaluation LLM, pas les phases d'annotation.

**Impact côté bench :** faible (notre parser n'extrait rien de ces shards sans table `### `path``). Mais l'utilisateur peut croire que la désactivation ne fonctionne pas.

**Fix recommandé :** soit rendre le drapeau `enabled: false` strict (ne génère AUCUN artefact), soit documenter que le flag ne contrôle que l'axe LLM et pas les phases annexes. La première option est la plus propre.

---

### 3.3. `tests` axis : verdicts `WEAK` inconsistants avec zéro couverture

*Observé sur le run v1 (avant désactivation de l'axe tests).*

Sur 39 verdicts de l'axe tests, 11 étaient `WEAK` et 28 `NONE`. Les deux groupes avaient des details strictement équivalents du type "No test file exists. X is never tested".

`WEAK` = "couverture partielle existante mais insuffisante". Ne devrait jamais s'appliquer à un symbole dans un module sans fichier de test. La confiance sur les WEAK était d'ailleurs basse (45-60%) vs 85-90% sur les NONE, ce qui suggère que l'axe rétrograde des `UNCOVERED low-confidence` en `WEAK` faute d'information.

**Fix recommandé :** imposer l'invariant "pas de fichier de test détecté ⇒ verdict ∈ {NONE, INCONNU} jamais {WEAK}". Ou alternativement baisser la confiance au lieu de changer le verdict quand l'évidence est faible.

---

## 4. Patterns de faux positifs (axe correction)

Anatoly flag systématiquement des **défauts défensifs** (null-checks, bounds-checks, race conditions potentielles) qui ne correspondent à aucun défaut catalogué et n'impactent pas le fonctionnement observable. Récurrents sur les 3 runs :

| Finding                                                     | Fichier:Ligne         | Nature                                                  |
|-------------------------------------------------------------|-----------------------|---------------------------------------------------------|
| `EngineContainer.resolve()` retourne `undefined` cast en T | `engine.ts:17-27`     | null-deref défensif                                     |
| `spinReel(reelIndex)` sans bounds-check sur reelIndex      | `reels.ts:43-50`      | range-check défensif                                    |
| `getReelWeights(reelIndex)` idem                            | `reels.ts:56-58`      | range-check défensif                                    |
| `StandardReelBuilderFactory` ignore `_rowCount`             | `factories.ts:8-16`   | paramètre inutilisé (intentionnel via underscore)       |
| `SpinEventEmitter.emit` race si handler appelle on/off     | `events.ts:18-24`     | concurrence dans un emitter purement synchrone          |
| `weightedPick` auto-resolve sans candidat RAG               | `rng.ts:5-16`         | fallback vide ("Auto-resolved: no RAG candidate")       |

Ces flags ne sont pas "faux" en absolu — un linter défensif pourrait les lever. Mais dans le contexte d'un audit, ils signalent des problèmes théoriques sans évidence d'impact, noyant les vrais défauts business.

**Piste :** l'axe correction tire vers la **recherche de crash potentiel** ("que se passe-t-il si l'appelant passe des arguments hors contrat ?") plutôt que vers la **vérification d'invariants business** ("le code respecte-t-il sa spec ?"). Probablement lié au prompt de l'axe : formuler des invariants "the function MUST do X when called with valid inputs" plutôt que "what could go wrong if inputs are invalid" pourrait orienter vers les seconds.

---

## 5. Défauts ratés (misses) persistants sur 3 runs

### correction (3 ratés sur 7)

| ID             | Fichier        | Défaut                                                         | Pourquoi c'est raté ?                                 |
|----------------|----------------|----------------------------------------------------------------|-------------------------------------------------------|
| **INV-WILD**   | `wild.ts`      | `applyWildBonus` multiplie par `(1+wc) * 2^wc` au lieu de `2^wc` | Le défaut demande de comprendre la sémantique attendue (remplacement) vs observée (stacking). Pas de code environnant qui l'explicite. Anatoly passe à côté. |
| **INV-JACKPOT**| `jackpot.ts`   | `isJackpotHit` = `diamondCount >= 4` au lieu de `>= 5 && middleRow` | Anatoly n'émet AUCUN finding sur `jackpot.ts` (3 runs sur 3). Le fichier est silencieusement marqué OK. Probablement trop petit/trivial pour que l'axe correction s'y accroche. |
| **INV-ROUND**  | `engine.ts`    | `Math.ceil` au lieu de `Math.floor` sur la conversion fractionnaire | Mentionné en passing dans le detail de `computePayout` ("Math.ceil rounding...untested") mais pas comme finding séparé. Perdu dans le bruit. |

### utility (2 ratés sur 5)

| ID                   | Fichier       | Défaut                                            |
|----------------------|---------------|---------------------------------------------------|
| **DEAD-DEBUG-BRANCH**| `engine.ts`   | `if (DEBUG_MODE)` avec `DEBUG_MODE = false` const |
| **DEAD-TYPE**        | `types.ts`    | `type LegacySpinResult` exporté, jamais référencé |

DEAD-DEBUG-BRANCH requiert une analyse de flux de contrôle (branche statiquement unreachable). Moins trivial que "export orphelin". DEAD-TYPE sur un type-only export est probablement masqué si l'axe utility ne vectorise que les valeurs runtime.

### overengineering (3 ratés sur 4)

- OVER-DI (EngineContainer) : **trouvé** ✓
- OVER-FACTORY (AbstractReelBuilderFactory) : raté
- OVER-EVENTS (SpinEventEmitter) : raté
- OVER-STRATEGY (SpinStrategy avec 1 seule implémentation utilisée) : raté

Seul EngineContainer est flaggé comme OVER — les trois autres patterns GoF (factory abstract, event emitter pubsub, strategy à une implémentation) ne sont pas détectés. Possiblement parce qu'ils sont "correctement structurés" techniquement : seul le comptage des usages aurait permis de conclure "abstraction pour 1 seul client". L'axe overengineering semble ne pas croiser avec le graphe d'usages.

### best-practices (2 ratés sur 5)

| ID               | Fichier        | Défaut                                         |
|------------------|----------------|------------------------------------------------|
| **BP-RNG**       | `rng.ts`       | `Math.random()` utilisé pour un RNG gaming    |
| **BP-MUTATION**  | `freespin.ts`  | Mutation en place de l'argument `state`       |
| **BP-STRING-THROW** | `engine.ts` | `throw "invalid bet"` au lieu d'`Error`       |

BP-STRING-THROW est systématiquement raté alors qu'il est trivial à détecter par AST. BP-MUTATION nécessite une analyse de dataflow. BP-RNG nécessite une connaissance domaine (RNG gaming ≠ RNG général). Les 3 misses illustrent 3 classes de difficulté différentes.

---

## 6. Ce qui marche bien ✅

Pour équilibrer, voici les détections solides observées sur 3 runs :

**correction :**
- INV-RTP : `computePayout` direction du house edge — détecté avec 97% confidence et raisonnement complet ("multiplies by 1.05, giving the player a 5% bonus instead of a 5% deduction")
- INV-FREESPIN : retrigger sans décrément — détecté avec raisonnement précis sur la branche concernée

**utility :**
- DEAD-LEGACY, DEAD-ANCIENT-RTP, DEAD-STRATEGY (ConservativeStrategy) : 3 pour 3 via le graphe d'imports, zéro ambiguïté

**best-practices :**
- BP-ANY : `bet: any` → propose directement `bet: Bet` avec before/after
- BP-MAGIC-NUMBERS : détecté en générique (Rule 8 ESLint)

**documentation (run v1 avant désactivation) :**
- DOC-STALE-RTP a été détecté via analyse croisée JSDoc ↔ comportement (a relevé la contradiction "JSDoc dit 95% mais Math.ceil inflate le payout"). Raisonnement sophistiqué.

---

## 7. Priorités suggérées

Par ordre d'impact sur le score global attendu :

1. **Fixer l'invariant duplication** (§3.1) — débloque 0 → estimé 2-3 TP sur l'axe, gain mécanique `0% → ~50-75%` F1. Environ +5-7 pts sur le global.

2. **Étendre overengineering au comptage d'usages** (§5) — 1/4 → 3/4 semblable atteignable en croisant `OVER` avec "concrete subclass count ≤ 1" ou "used at ≤ 1 call site". Gain estimé +2-3 pts global.

3. **Recalibrer correction vers les invariants business** (§4) — réduire les FP défensifs améliore la précision sans dégrader le recall. Gain estimé +1-2 pts, et surtout améliore la lisibilité des rapports.

4. **Régler le flag `enabled: false`** sur documentation (§3.2) — bug UX, impact bench nul.

5. **Invariant verdict WEAK sur tests** (§3.3) — à faire quand l'axe tests sera ré-exercé par un futur fixture.

---

## 8. Limites du bench actuel

Pour ne rien cacher de la méthodologie :

- **Un seul fixture pour l'instant** (slot-engine, TS). Les scores ne sont pas représentatifs de la performance d'Anatoly sur d'autres domaines/langages.
- **Matching strict** file+symbol+verdict. Un finding qui décrit correctement le bug mais sur la mauvaise ligne peut être compté FP. La tolérance `line_tolerance: 5` est généreuse mais pas infinie.
- **Pas de juge sémantique.** On ne vérifie pas que le `reason` d'Anatoly correspond à notre `nature` attendue. Un TP peut techniquement flagger un symbole avec un bon verdict mais pour la mauvaise raison.
- **F1 global non pondéré.** Chaque axe compte pareil. Un axe cassé à 0% tire autant qu'un axe à 90%. On peut argumenter pour une pondération par difficulté × volume.
- **Variance inter-run non mesurée.** 3 runs ≠ statistiquement significatif. Les scores v2 vs v3 diffèrent de 2.5 pts pour un même code, probablement bruit LLM.

---

## 9. Annexes

- Catalogue complet : `catalog/slot-engine/SPEC.md` (bloc YAML `<!-- BUGS-CATALOG-START -->`)
- Baselines : `baselines/2026-04-24_slot-engine-v{1,2,3}.{json,md}`
- Code du scorer : `src/parser.ts`, `src/score.ts`, `src/spec-parser.ts`
- Repo : https://github.com/r-via/anatoly-bench
