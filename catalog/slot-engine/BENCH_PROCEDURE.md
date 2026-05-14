# Procédure de bench — slot-engine

Workflow pour produire une nouvelle baseline scorée à partir d'un run Anatoly
sur le fixture `slot-engine`.

## Architecture

- **Machine de run** : distro WSL `temp` (Ubuntu 24.04) avec GPU CUDA (RTX
  3090 Ti, 23 Go VRAM) accessible via Docker. Anatoly y tourne en mode
  `advanced-gguf` (containers GGUF nomic-embed-code + Qwen3-8B sur ports
  11437/11438, swap séquentiel pour économiser la VRAM).
- **Machine de score** : WSL principal (où vit `anatoly-bench`). Lit le
  répertoire de run produit par Anatoly et le compare au catalogue de défauts
  pour calculer F1.
- **Accès SSH VM** : `ssh -i .ssh/anatoly-vm-key -p 2222 rviau@localhost`. La
  passthrough GPU NVIDIA via SSH demande `export PATH=/usr/lib/wsl/lib:$PATH`
  + `sudo ldconfig` une fois par session.

## Pré-requis VM

```bash
# une fois pour exposer le GPU à la session SSH
export PATH=/usr/lib/wsl/lib:$PATH
sudo ldconfig

# vérifier que le backend advanced-gguf est dispo
anatoly local-embeddings status
# attendu : "Backend: advanced-gguf (configured)" + GPU détecté
```

Le GGUF Docker démarre paresseusement au premier embed call. Pas besoin de le
pré-lancer.

## Choisir la version d'Anatoly à bencher

Le `Makefile` dans `~/project/anatoly` supporte trois modes de checkout sur la
VM, à utiliser selon le contexte :

| Commande | Effet | Quand l'utiliser |
|---|---|---|
| `make update` | Pull `origin/main` (défaut `BRANCH=main`) | Bench d'une version déjà mergée sur main |
| `make update BRANCH=feature/xyz` | Checkout + pull `origin/feature/xyz` | **Bench d'une feature en cours** — recommandé pour ne pas polluer `main` avec des commits non-bench-validés |
| `make update COMMIT=abc1234` | Checkout détaché sur SHA `abc1234` | Bench d'un commit précis, sans souci de branche |

**Workflow recommandé pour bench d'une nouvelle feature :**

1. Côté dev (laptop) : push la feature sur une branche dédiée, **pas sur main**.
   ```bash
   git checkout -b feature/my-epic
   # ... commits ...
   git push -u origin feature/my-epic
   ```
2. Côté VM : `make update BRANCH=feature/my-epic`.
3. Bench. Si OK → merge la branche sur main. Si KO → fix sur la branche et
   re-bench.

Cette approche évite de bencher sur `main` une version dont on n'est pas
encore sûr. Si l'on benche directement sur main et qu'on découvre une
régression, le rollback est plus coûteux qu'un simple changement de branche.

```bash
# probe la version actuelle sur la VM
ssh ... 'anatoly --version'
# 0.9.6 (195fbeb-dirty)   ← SHA du HEAD VM
```

## Lancer un run

Script `/tmp/launch-run.sh` à pousser sur la VM :

```bash
#!/bin/bash
export PATH=/usr/lib/wsl/lib:$PATH
export NVM_DIR=$HOME/.nvm; . $NVM_DIR/nvm.sh; nvm use 20.19 >/dev/null
pkill -f "anatoly run" 2>/dev/null
sleep 1
cd ~/project/anatoly-bench/catalog/slot-engine/project
anatoly run --plain --no-cache >> /tmp/anatoly-run.log 2>&1
echo "RUN_DONE" >> /tmp/anatoly-run.log
```

Puis exécution non-bloquante :

```bash
ssh ... '
  cd ~/project/anatoly-bench/catalog/slot-engine/project/.anatoly
  # Nettoyage des artefacts transitoires (layout post-Epic 52)
  rm -rf runs cache/llm tasks runtime/*.lock state/deliberation-memory.json state/calibration.json
  rm -f /tmp/anatoly-run.log
  nohup bash /tmp/launch-run.sh > /tmp/launch-run.log 2>&1 &
'
```

### Layout des artefacts (post-Epic 52)

Depuis Epic 52 (cache layout overhaul), la structure de `.anatoly/` est :

```
project/.anatoly/
├── cache/                    # LLM call caches + RAG vector store + doc-build
│   ├── rag/lancedb/         # ← À préserver (index RAG, embeddings code+nlp)
│   ├── doc-build/           # ← À préserver (manifest internal-doc generation)
│   └── llm/                 # ← À nettoyer si --no-cache (sinon préservé)
├── state/                    # State persistant
│   ├── internal-docs/       # ← À préserver (équivalent ancien .anatoly/docs/)
│   ├── deliberation-memory.json  # ← À nettoyer (transitoire entre runs)
│   ├── calibration.json     # ← À nettoyer (recalculé chaque run)
│   └── doc-conflicts.yaml   # ← À préserver (arbitrages humains)
├── runs/                     # ← À nettoyer (output du run précédent)
├── runtime/                  # ← À nettoyer (lock files, PID)
├── setup/                    # ← À préserver (wizard state)
├── shared -> ~/.anatoly/shared
└── user -> ~/.anatoly/user
```

### Ce qu'on préserve entre runs

Le bench scorant la performance des axes sur un fixture dont le code source
ne change pas, certains artefacts générés par Anatoly sont **déterministes**
vis à vis du code + des embeddings, et donc réutilisables sans biais :

- `state/internal-docs/` — doc interne (`bootstrap-doc`). Coûte ~$1 et
  plusieurs minutes en regénération LLM. Versionnée dans le repo bench.
- `cache/rag/lancedb/` — index RAG (chunks + embeddings code + nlp). Sert de
  référence pour les axes `duplication` et `correction`. Gratuit en local
  GGUF mais ~30-60s à reconstruire.
- `cache/doc-build/manifest.json` — état d'incrémentalité du doc-pipeline.
- `state/doc-conflicts.yaml` — arbitrages humains (epic 55).

On nettoie uniquement les artefacts spécifiques au run :

- `runs/` (output du dernier run)
- `cache/llm/` (cache des appels LLM — neutralisé par `--no-cache` mais propre)
- `tasks/`, `runtime/*.lock` (état transitoire)
- `state/deliberation-memory.json`, `state/calibration.json` (recalculés)

Pas de `anatoly reset` : la commande supprime `state/internal-docs/` et
`cache/rag/`, ce qui force des regénérations coûteuses sans valeur ajoutée
pour le bench.

### Pourquoi `--no-cache` ?

Pour invalider le cache des appels LLM (`cache/llm/`). Sans ça, deux runs
successifs sur le même code rejoueraient les mêmes réponses depuis le cache,
ce qui masque la variance inter-run. On veut benchmarker le comportement
réel d'Anatoly, pas sa capacité à mettre en cache.

## Surveiller le run

Le marqueur `RUN_DONE` en fin de log signale la complétion :

```bash
until ssh ... 'grep -q "^RUN_DONE" /tmp/anatoly-run.log'; do sleep 30; done
```

Durée typique sur RTX 3090 Ti (slot-engine, ~13 fichiers, 5 axes scorés) :

| Phase | Durée |
|-------|-------|
| `bootstrap-doc` (uniquement la 1ère fois après reset) | 8-12 min, ~$1 |
| `rag-index` (rebuild si `cache/rag/` absent) | 30-60 s, gratuit (GGUF local) |
| `review` (5 axes scorés) | 8-12 min, ~$5 |
| `doc-conflict-detection` (epic 55 — split bootstrap/update post-epic-56) | 30-60 s, ~$0.10 |

## Copier le run vers le local

```bash
RUN_ID=$(ssh ... 'cat ~/project/anatoly-bench/catalog/slot-engine/project/.anatoly/runs/latest/run-status.json | grep runId | cut -d\" -f4')
scp -r -i .ssh/anatoly-vm-key -P 2222 \
  rviau@localhost:~/project/anatoly-bench/catalog/slot-engine/project/.anatoly/runs/$RUN_ID \
  ~/projects/anatoly-bench/catalog/slot-engine/project/.anatoly/runs/
```

## Scorer

```bash
cd ~/projects/anatoly-bench
npm run build  # si jamais le source du bench a changé

VERSION=v18   # incrémenter par rapport à la dernière baseline
DATE=$(date +%Y-%m-%d)
SPEC=catalog/slot-engine/SPEC.md
RUN=catalog/slot-engine/project/.anatoly/runs/$RUN_ID

node dist/cli.js score \
  --spec $SPEC \
  --report $RUN \
  --json baselines/${DATE}_slot-engine-${VERSION}.json \
  --md   baselines/${DATE}_slot-engine-${VERSION}.md
```

Le score JSON contient `global_f1`, `per_axis`, `misses` et
`false_positives` ; le Markdown surface aussi métadonnées de run (commit,
durée, coût, tokens).

## Comparer aux baselines précédentes

```bash
for f in baselines/*-slot-engine-v*.json; do
  echo "$(basename $f): $(grep -oE '"global_f1":[^,]+' $f)"
done
```

## Pièges connus

- **GPU non visible en SSH** → `export PATH=/usr/lib/wsl/lib:$PATH && sudo
  ldconfig`. Sinon Anatoly fallback sur `lite` (ONNX), incompatible avec une
  baseline `advanced-gguf`.
- **`local-embeddings status` montre le backend** : `advanced-gguf
  (configured)` = config OK, `lite (recommended)` = GPU pas vu.
- **`--no-cache` n'invalide pas la doc interne** : elle persiste dans
  `state/internal-docs/` indépendamment du cache LLM.
- **Tuer un run en cours** : `pkill -9 -f "anatoly run"` côté VM. Les
  containers Docker GGUF restent up — c'est normal, ils sont swappés par
  `ensureModel()` au prochain run.
- **Le symlink `.anatoly/runs/latest`** pointe vers le dernier run terminé.
  Pratique pour `--report .anatoly/runs/latest` mais en bench on préfère le
  runId explicite pour la traçabilité.
- **Bench sur une feature branch** : utilise `make update BRANCH=feature/xyz`
  côté VM **après avoir poussé la branche**. Évite de pousser sur `main`
  avant que le bench ait validé la version. Si la VM est sur une autre
  branche que `main`, vérifier avec `git rev-parse --abbrev-ref HEAD` avant
  de bench.
- **Erreur `cannot resolve commit` au `make update`** : la branche n'a pas
  été pushée sur `origin`. `git push -u origin feature/xyz` côté dev d'abord.
