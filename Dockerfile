FROM mhart/alpine-node:16 as base
ARG ENV
WORKDIR /app
COPY package*.json ./
RUN if [ "$ENV" = "dev" ] || [ "$ENV" = "DEV" ]; \
	then npm i;  \
	else npm ci --prod; \
	fi
FROM mhart/alpine-node:16
WORKDIR /app
COPY --from=base /app /app
COPY . .
RUN chmod +x /app/start.sh
