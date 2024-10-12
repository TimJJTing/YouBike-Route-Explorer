import { writable } from 'svelte/store';
import { getContext, setContext } from 'svelte';
import { DuckDB } from './DuckDB';

/**
 * @param {{ name: string; url: string; }[]} connections
 * @returns {import('svelte/store').Writable<import('$lib/components/providers/duckdb/DuckDB').DuckDB|undefined>}
 */
export const setDuckDB = (connections) => {
	/**
	 * @type {import('svelte/store').Writable<import('$lib/components/providers/duckdb/DuckDB').DuckDB|undefined>}
	 */
	let duckdb = writable(new DuckDB(connections));
	setContext('duckdb', duckdb);
	return duckdb;
};

/**
 * @returns {import('svelte/store').Writable<import('$lib/components/providers/duckdb/DuckDB').DuckDB|undefined>}
 */
export function getDuckDB() {
	return getContext('duckdb');
}
