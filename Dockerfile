FROM node:20-slim

ENV VITE_ADAPTER="node"

ARG PORT="3000"
ENV PORT=${PORT}

ARG VITE_MAPBOX_TOKEN
ENV VITE_MAPBOX_TOKEN=${VITE_MAPBOX_TOKEN}

ARG VITE_MAPBOX_MAPSTYLE
ENV VITE_MAPBOX_MAPSTYLE=${VITE_MAPBOX_MAPSTYLE}

WORKDIR /code
COPY .npmrc /code/.npmrc
COPY package.json /code/package.json
COPY package-lock.json /code/package-lock.json
RUN npm ci
COPY . /code

RUN npm run build
CMD ["node", "build"]
