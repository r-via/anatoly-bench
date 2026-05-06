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
  rm -rf runs cache rag tasks anatoly.lock deliberation-memory.json
  rm -f /tmp/anatoly-run.log
  nohup bash /tmp/launch-run.sh > /tmp/launch-run.log 2>&1 &
'
```

### Pourquoi pas `anatoly reset` ?

`anatoly reset` supprime aussi `.anatoly/docs/` (la doc interne générée par
le `bootstrap-doc`). Cette doc coûte ~$1 et plusieurs minutes à regénérer ;
elle ne change pas tant que le code source du fixture ne change pas. Donc on
garde `.anatoly/docs/` intacte et on ne nettoie que :

- `runs/` (les artefacts du dernier run)
- `cache/` (cache LLM — déjà neutralisé par `--no-cache` mais propre)
- `rag/` (index RAG — sera reconstruit en quelques secondes)
- `tasks/`, `anatoly.lock`, `deliberation-memory.json` (état transitoire)

### Pourquoi `--no-cache` ?

Pour invalider le cache des appels LLM. Sans ça, deux runs successifs sur le
même code rejoueraient les mêmes réponses depuis le cache, ce qui masque la
variance inter-run. On veut benchmarker le comportement réel d'Anatoly, pas
sa capacité à mettre en cache.

## Surveiller le run

Le marqueur `RUN_DONE` en fin de log signale la complétion :

```bash
until ssh ... 'grep -q "^RUN_DONE" /tmp/anatoly-run.log'; do sleep 30; done
```

Durée typique sur RTX 3090 Ti (slot-engine, ~13 fichiers, 5 axes scorés) :

| Phase | Durée |
|-------|-------|
| `bootstrap-doc` (uniquement la 1ère fois après reset) | 8-12 min, ~$1 |
| `rag` index | 30-60 s |
| audit (5 axes scorés) | 8-12 min, ~$5 |

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

VERSION=v16   # incrémenter par rapport à la dernière baseline
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
  `.anatoly/docs/` indépendamment du cache LLM.
- **Tuer un run en cours** : `pkill -9 -f "anatoly run"` côté VM. Les
  containers Docker GGUF restent up — c'est normal, ils sont swappés par
  `ensureModel()` au prochain run.
- **Le symlink `.anatoly/runs/latest`** pointe vers le dernier run terminé.
  Pratique pour `--report .anatoly/runs/latest` mais en bench on préfère le
  runId explicite pour la traçabilité.
