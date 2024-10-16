import { writable } from 'svelte/store';
import * as duckdb from '@duckdb/duckdb-wasm';
import { getContext, setContext } from 'svelte';
import { DuckDB } from './DuckDB';
import { dev } from '$app/environment';

/**
 * @param {{ name: string; url: string; }[]} connections
 * @param { duckdb.DuckDBDataProtocol | undefined } proto
 * @param { boolean | undefined } directIO
 * @param { duckdb.LogLevel | undefined } logLevel
 * @returns {import('svelte/store').Writable<import('$lib/components/providers/duckdb/DuckDB').DuckDB|undefined>}
 */
export const setDuckDB = (
	connections,
	proto = duckdb.DuckDBDataProtocol.HTTP,
	directIO = false,
	logLevel = undefined
) => {
	// set default DB log level if not specified
	if (logLevel === undefined && dev) {
		logLevel = duckdb.LogLevel.DEBUG;
	} else if (logLevel === undefined) {
		logLevel = duckdb.LogLevel.ERROR;
	}
	/**
	 * @type {import('svelte/store').Writable<import('$lib/components/providers/duckdb/DuckDB').DuckDB|undefined>}
	 */
	let db = writable(new DuckDB(connections, proto, directIO, logLevel));
	setContext('duckdb', db);
	return db;
};

/**
 * @returns {import('svelte/store').Writable<import('$lib/components/providers/duckdb/DuckDB').DuckDB|undefined>}
 */
export function getDuckDB() {
	return getContext('duckdb');
}
