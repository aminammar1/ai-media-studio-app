PYTHON ?= python3.15
VENV ?= .venv
WEB_DIR ?= web
VENV_PY := $(VENV)/bin/python

.PHONY: help venv install api-install web-install run run-api run-web dev test live-test check-token web-build web-lint clean

help:
	@printf "%s\n" \
		"Available commands:" \
		"  make install       Install Python backend deps and web deps" \
		"  make run-api       Start the FastAPI backend" \
		"  make run-web       Start the Next.js frontend" \
		"  make dev           Start backend and frontend together" \
		"  make test          Run backend tests" \
		"  make live-test     Run the live Replicate backend test" \
		"  make check-token   Validate the Replicate token and model access" \
		"  make web-build     Build the Next.js app" \
		"  make web-lint      Lint the Next.js app" \
		"  make clean         Remove local caches and build output"

venv:
	@command -v $(PYTHON) >/dev/null || (echo "Missing $(PYTHON). Install Python 3.15 first." && exit 1)
	$(PYTHON) -m venv $(VENV)

install: venv
	$(VENV_PY) -m pip install --upgrade pip
	$(VENV_PY) -m pip install --pre -r requirements.txt
	$(MAKE) web-install

api-install: install

web-install:
	cd $(WEB_DIR) && npm install

run:
	$(VENV_PY) -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

run-api:
	$(VENV_PY) -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

run-web:
	cd $(WEB_DIR) && set -a; if [ -f ../.env ]; then . ../.env; fi; set +a; npm run dev

dev:
	$(MAKE) -j2 run-api run-web

test:
	$(VENV_PY) -m pytest -q

live-test:
	RUN_LIVE_REPLICATE_TEST=1 $(VENV_PY) -m pytest -q tests/test_model_live.py

check-token:
	PYTHONPATH=. $(VENV_PY) scripts/check_token.py

web-build:
	cd $(WEB_DIR) && npm run build

web-lint:
	cd $(WEB_DIR) && npm run lint

clean:
	$(PYTHON) -c "import shutil; [shutil.rmtree(p, ignore_errors=True) for p in ['.pytest_cache', '__pycache__', 'app/__pycache__', 'tests/__pycache__', 'web/.next', 'web/node_modules']]"
