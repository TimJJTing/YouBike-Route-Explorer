# YouBike Route Explorer: Exploring the Future of Urban Mobility in Taipei

[![Netlify Status](https://api.netlify.com/api/v1/badges/439bdf0d-73ba-4581-b49d-b5acb122dd4a/deploy-status)](https://app.netlify.com/sites/youbike-route-explorer/deploys)

YouBike, Taiwan's leading public bicycle system, offers 24/7 point-to-point rental and return services, transforming the way residents and visitors navigate urban spaces. With the introduction of YouBike 2.0, featuring a new design for both bikes and stations, the system no longer relies on external electricity, making it more flexible and easier to deploy across the city. This project, YouBike Route Explorer, delves into the deployment strategy of YouBike 2.0 in Taipei City, empowers you to explore usage patterns, popular routes, and how these trends reflect the evolving needs of urban commuters. By "seeing" the data with this exploratory data visualization tool, we can uncover insights that could drive more efficient, accessible, and sustainable transportation solutions.

> see also: [YouBikeEDA](https://github.com/TimJJTing/YouBikeEDA) for dataset preparation

## Live Demo

Try [the live demo](https://youbike-route-explorer.netlify.app/)!

## Developing

1. Under the project root, make sure you're running node 20 or run `nvm use` if you have nvm installed.
2. This project utilizes Mapbox's service and needs a token in `.env` to work:

    ```bash
    echo VITE_MAPBOX_TOKEN={your_mapbox_token} > .env
    ```

3. Optionally, if you want to use another map style:

    ```bash
    # default: mapbox://styles/mapbox/dark-v9
    echo VITE_MAPBOX_MAPSTYLE={style_url} >> .env
    ```

4. Install dependencies with `npm install` (or `pnpm install` or `yarn`)
5. Start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

## Build & Run with Docker

1. Build image

    ```bash
    docker build --build-arg VITE_MAPBOX_TOKEN={your_mapbox_token} -t="youbike_routes" .
    ```

    **Available build args**

    - `VITE_MAPBOX_TOKEN`: Mapbox token (required)
    - `VITE_MAPBOX_MAPSTYLE`: Mapbox map style (default: `mapbox://styles/mapbox/dark-v9`)

2. Run the built image

    ```bash
    # run container and redirect host port 3000 to container port 3000
    docker run --name youbike -d -p 3000:3000 youbike_routes
    ```

3. Visit to play the demo [localhost:3000](localhost:3000)
4. Stop & remove the image

    ```bash
    docker stop youbike
    docker rm youbike
    docker rmi youbike_routes
    ```

## To-do List

- [x] prepare dataset and parquet files
- [x] setup project structure
- [x] import dataset
- [x] add map
- [x] add stations
- [x] add routes
- [x] add h3 cells
- [x] add interactivity
- [x] improve reactivity
- [x] add UI panels
- [x] add insight charts
- [x] deploy demo site
- [x] add more insights, e.g. route distance
- [x] test adapter-node
- [ ] add filters for insights, e.g. route distance
- [ ] add supplementary datasets

## Credits

- [Multilevel Agglomerative Edge Bundling in JavaScript](https://github.com/philogb/mingle)
- [k-d Tree JavaScript Library](https://github.com/ubilabs/kd-tree-javascript)
- [shadcn-svelte](https://www.shadcn-svelte.com/)

### Data sources

- [臺北市YouBike見車率統計](https://data.taipei/dataset/detail?id=ba0dafae-043c-4730-b97e-2defd7af766c)
- [臺北市YouBike起訖站點統計](https://data.taipei/dataset/detail?id=c7dbdb7c-6bbd-495a-bd23-49b22defd83e)
- [臺北市YouBike區域互補站點](https://data.taipei/dataset/detail?id=fe8a0ddd-6f70-4e63-92a1-a3463c790a1b)
