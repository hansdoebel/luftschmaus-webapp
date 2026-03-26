SHELL := /bin/bash

KUBE_DIR := kubernetes
CRDS_SCHEMA := https://raw.githubusercontent.com/datreeio/CRDs-catalog/main/{{.Group}}/{{.ResourceKind}}_{{.ResourceAPIVersion}}.json

.PHONY: lint eslint yamllint kubeconform kustomize test test-frontend test-backend help

lint: eslint yamllint kubeconform kustomize
	@printf '\033[32m[✓]\033[0m All lint checks passed\n'

test: test-frontend test-backend
	@printf '\033[32m[✓]\033[0m All tests passed\n'

eslint:
	@printf '  Running eslint...\n'
	@bun run lint \
		&& printf '\033[32m[✓]\033[0m eslint\n' \
		|| { printf '\033[31m[X]\033[0m eslint\n'; exit 1; }

yamllint:
	@if ! command -v yamllint >/dev/null 2>&1; then \
		printf '\033[33m[-]\033[0m yamllint not installed (brew install yamllint)\n'; \
	else \
		printf '  Running yamllint...\n'; \
		yamllint -d '{extends: relaxed, rules: {line-length: {max: 200}}}' $(KUBE_DIR)/ .woodpecker/ \
			&& printf '\033[32m[✓]\033[0m yamllint\n' \
			|| { printf '\033[31m[X]\033[0m yamllint\n'; exit 1; }; \
	fi

kubeconform:
	@if ! command -v kubeconform >/dev/null 2>&1; then \
		printf '\033[33m[-]\033[0m kubeconform not installed (brew install kubeconform)\n'; \
	else \
		printf '  Running kubeconform on rendered overlays...\n'; \
		kubectl kustomize $(KUBE_DIR)/overlays/development/ | kubeconform -strict -summary -ignore-missing-schemas -schema-location default -schema-location '$(CRDS_SCHEMA)' - \
			&& kubectl kustomize $(KUBE_DIR)/overlays/staging/ | kubeconform -strict -summary -ignore-missing-schemas -schema-location default -schema-location '$(CRDS_SCHEMA)' - \
			&& kubectl kustomize $(KUBE_DIR)/overlays/production/ | kubeconform -strict -summary -ignore-missing-schemas -schema-location default -schema-location '$(CRDS_SCHEMA)' - \
			&& printf '\033[32m[✓]\033[0m kubeconform\n' \
			|| { printf '\033[31m[X]\033[0m kubeconform\n'; exit 1; }; \
	fi

kustomize:
	@printf '  Running kustomize build...\n'
	@kubectl kustomize $(KUBE_DIR)/overlays/development/ >/dev/null \
		&& kubectl kustomize $(KUBE_DIR)/overlays/staging/ >/dev/null \
		&& kubectl kustomize $(KUBE_DIR)/overlays/production/ >/dev/null \
		&& printf '\033[32m[✓]\033[0m kustomize\n' \
		|| { printf '\033[31m[X]\033[0m kustomize\n'; exit 1; }

test-frontend:
	@printf '  Running frontend tests...\n'
	@cd frontend && bun test \
		&& printf '\033[32m[✓]\033[0m frontend tests\n' \
		|| { printf '\033[31m[X]\033[0m frontend tests\n'; exit 1; }

test-backend:
	@printf '  Running backend tests...\n'
	@cd backend && bun run test \
		&& printf '\033[32m[✓]\033[0m backend tests\n' \
		|| { printf '\033[31m[X]\033[0m backend tests\n'; exit 1; }

help:
	@echo "Targets:"
	@echo "  make lint           Run all lint checks"
	@echo "  make test           Run all tests"
	@echo "  make eslint         JavaScript/JSX linting"
	@echo "  make yamllint       YAML syntax and style"
	@echo "  make kubeconform    Kubernetes schema validation"
	@echo "  make kustomize      Kustomize build validation (dev/staging/prod)"
	@echo "  make test-frontend  Frontend tests (bun test)"
	@echo "  make test-backend   Backend tests (vitest)"
