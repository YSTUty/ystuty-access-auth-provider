project_name ?= ystuty-access-auth-provider
service_name ?= app_srv

base_yml := docker-compose.yml
prod_yml := docker-compose.prod.yml

dc := docker compose -p "$(project_name)"

files_base := -f $(base_yml)
files_prod := -f $(base_yml) -f $(prod_yml)

networks := ystuty-network ystuty-access-network

.DEFAULT_GOAL := help

.PHONY: help ps ps-running logs down stop restart pull \
	up-dev up-dev-build up-prod up-prod-build \
  ensure-networks

help:
	@printf '%s\n' \
	'Targets:' \
	'  up-dev                 Start app (dev)' \
	'  up-dev-build           Build and start app (dev)' \
	'  up-prod                Start app (prod)' \
	'  up-prod-build          Build and start app (prod)' \
	'  ps                     Show containers' \
	'  ps-running             Show running containers' \
	'  logs                   Follow logs (all)' \
	'  down                   Stop and remove stack' \
	'' \
	'Vars:' \
	'  project_name=..., service_name=...'

ensure-networks:
	@set -e; \
	for n in $(networks); do \
		docker network inspect $$n >/dev/null 2>&1 || docker network create $$n >/dev/null; \
	done

ensure-networks-log:
	@for n in $(networks); do \
			if ! docker network inspect "$$n" >/dev/null 2>&1; then \
					echo "Creating network $$n..."; \
					docker network create "$$n"; \
			else \
					echo "Network $$n already exists"; \
			fi \
	done

ps:
	@$(dc) ps

ps-running:
	@$(dc) ps --status running

logs:
	@$(dc) logs -f --tail=200

pull:
	@$(dc) $(files_base) pull

stop:
	@$(dc) stop

restart:
	@$(dc) restart

down:
	@$(dc) $(files_prod_db) down

up-dev: ensure-networks
	@$(dc) $(files_base) up -d $(service_name)

up-dev-build: ensure-networks
	@$(dc) $(files_base) up -d --build $(service_name)

up-prod: ensure-networks
	@$(dc) $(files_prod) up -d $(service_name)

up-prod-build: ensure-networks
	@$(dc) $(files_prod) up -d --build $(service_name)
