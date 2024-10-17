FROM node:20-alpine

ENV VITE_ADAPTER="node"
# obviously not the best practice, I keep it here only for demo purposes
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
