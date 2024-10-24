<script>
	import { onMount } from 'svelte';
	import { PathLayer } from '@deck.gl/layers';
	import { TripsLayer } from '@deck.gl/geo-layers';
	import { hoverId, layerOption } from '$lib/store';
	import { pathProcessor } from '$lib/pathProcessor';
	import { getMap } from '$lib/components/providers/mapbox';
	import { getDeckGL, getLayers } from '$lib/components/providers/deckgl';

	/**
	 * @type {any[]|undefined} data
	 */
	export let data = undefined;

	/**
	 * @type {string} layer ID
	 */
	export let layerId = 'routes';

	let map = getMap();
	let deckgl = getDeckGL();
	let layers = getLayers();

	/**
	 * @type {[number, number, number][]}
	 */
	const routeColors = [
		[1, 199, 239],
		[1, 151, 239],
		[1, 108, 239],
		[1, 36, 239],
		[1, 32, 239]
	];

	/**
	 * @type {TripsLayer|undefined} data
	 */
	let tripsLayer = undefined;
	$: tripsLayerId = `${layerId}-trips`;
	/**
	 * @type {PathLayer|undefined} data
	 */
	let pathLayer = undefined;
	$: pathLayerId = `${layerId}-path`;

	/**
	 * @type {NodeJS.Timeout}
	 */
	let interval;

	/**
	 * @type {number}
	 */
	let timestamp = 0;

	/**
	 * @type {number}
	 */
	let maxTs = 600;

	const incr = () => {
		timestamp += 25;
		if (timestamp >= maxTs) {
			clearInterval(interval);
		}
	};

	/**
	 * @param {Object[] | undefined} newData
	 */
	function getLayerData(newData) {
		if (newData) {
			timestamp = 0;
			interval = setInterval(incr, 50);
			return pathProcessor(newData, true, 0.9, 200, false, 600, 50);
		}
		return [];
	}
	$: pathFlow = getLayerData(data);

	/**
	 * @param {boolean} visible
	 * @param {Object[] | undefined} pathFlow
	 * @param {number} timestamp
	 */
	function renderTripsLayer(visible, pathFlow, timestamp) {
		if (data && $map && $layers && $deckgl) {
			// @ts-ignore
			const firstLabelLayerId = $map.getStyle().layers.find((layer) => layer.type === 'symbol').id;

			tripsLayer = new TripsLayer({
				id: tripsLayerId,
				data: pathFlow,
				pickable: false,
				widthUnits: 'pixels',
				capRounded: true,
				opacity: 1,
				visible,
				currentTime: timestamp,
				trailLength: 600,
				getTimestamps: (d) => d.timestamps,
				getPath: (d) => d.path,
				getWidth: (d) => (d.level + 1) * 1.5,
				getColor: (d) => [...routeColors[Math.floor(d.level)], (d.level + 1) * 30],
				onHover: (info, event) => hoverId.set(info?.object?.name),
				updateTriggers: {
					visible: visible
				}
			});

			let layerIdx = $layers.findIndex((l) => l.id === tripsLayerId);
			// update layers
			if (layerIdx > -1) {
				$layers = [...$layers];
				$layers[layerIdx] = tripsLayer;
			} else {
				$layers = [...$layers, tripsLayer];
			}
		}
	}

	/**
	 * @param {boolean} visible
	 * @param {string | undefined} hId
	 * @param {Object[] | undefined} pathFlow
	 */
	function renderPathLayer(visible, hId, pathFlow) {
		if (data && $map && $layers && $deckgl) {
			// @ts-ignore
			const firstLabelLayerId = $map.getStyle().layers.find((layer) => layer.type === 'symbol').id;

			pathLayer = new PathLayer({
				id: pathLayerId,
				data: pathFlow,
				pickable: true,
				widthUnits: 'pixels',
				capRounded: true,
				opacity: 1,
				visible,
				getPath: (d) => d.path,
				getWidth: (d) => (d.level + 1) * 1.5 + (d.name === hId ? 1 : 0),
				getColor: (d) => [
					...routeColors[Math.floor(d.level)],
					d.name === hId ? 255 : (d.level + 1) * 30
				],
				onHover: (info, event) => hoverId.set(info?.object?.name),
				updateTriggers: {
					getColor: hId,
					getWidth: hId,
					visible: visible
				}
			});

			let layerIdx = $layers.findIndex((l) => l.id === pathLayerId);
			// update layers
			if (layerIdx > -1) {
				$layers = [...$layers];
				$layers[layerIdx] = pathLayer;
			} else {
				$layers = [...$layers, pathLayer];
			}
		}
	}

	onMount(() => {
		return () => {
			$layers = $layers?.filter((l) => ![pathLayerId, tripsLayerId].includes(l.id));
			clearInterval(interval);
		};
	});
	$: renderPathLayer($layerOption.routes.visible, $hoverId, pathFlow);
	$: renderTripsLayer($layerOption.routes.visible, pathFlow, timestamp);
</script>
