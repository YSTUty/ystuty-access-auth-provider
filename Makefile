project_name = ystuty-access-auth-provider
service_name = app_srv

up-build:
	docker-compose -p "$(project_name)" up -d --build $(service_name)

up:
	docker-compose -p "$(project_name)" up -d $(service_name)

down:
	docker-compose -p "$(project_name)" down
