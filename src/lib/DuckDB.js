import * as duckdb from '@duckdb/duckdb-wasm';
import duckdb_wasm from '/node_modules/@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import duckdb_worker from '/node_modules/@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?worker';

export class DuckDB {
	/**
	 * @param {{name: string, url: string}[]} connections
	 * @param {duckdb.DuckDBDataProtocol} proto
	 * @param {boolean} directIO
	 */
	constructor(connections, proto = 4, directIO = false) {
		/**
		 * @type {import('@duckdb/duckdb-wasm').AsyncDuckDB | null}
		 */
		this._db = null;

		/**
		 * @type {{name: string, url: string}[]}
		 */
		this._connections = connections;

		/**
		 * @type {duckdb.DuckDBDataProtocol}
		 */
		this._proto = proto;

		/**
		 * @type {boolean}
		 */
		this._directIO = directIO;

		/**
		 * @type {Promise<any> | null}
		 */
		// this.result = null;
	}

	get connections() {
		return this._connections;
	}

	/**
	 * Initialize a DuckDB instance
	 */
	async _initDB() {
		if (this._db) {
			return this._db; // Return existing database, if any
		}

		// Instantiate worker
		const logger = new duckdb.ConsoleLogger();
		const worker = new duckdb_worker();

		// and asynchronous database
		this._db = new duckdb.AsyncDuckDB(logger, worker);
		await this._db.instantiate(duckdb_wasm);
		return this._db;
	}

	/**
	 * connect to DB
	 */
	async connect() {
		try {
			const db = await this._initDB();
			if (db) {
				this.connections.forEach(async (c) => {
					await db.registerFileURL(c.name, c.url, this._proto, this._directIO);
				})
				this._conn = await db.connect();
			}

			// console.log("PREPARING INSERT")
			// await conn.query(`CREATE TABLE p1 AS SELECT * FROM parquet_scan('SOTU.parquet')`);
			// await conn.query(`CREATE VIEW wordcounts_raw AS SELECT * FROM (SELECT "@id" id,
			//     UNNEST("nc:unigrams").word0 as word,
			//     UNNEST("nc:unigrams").count as count FROM
			//     p1) t1
			// `);
			// await conn.query(`
			//   CREATE TABLE wordcounts AS SELECT * FROM
			//   wordcounts_raw
			//   NATURAL JOIN (SELECT word, SUM(count) as tot, COUNT(*) AS df FROM wordcounts_raw GROUP BY word) t2
			// `);
			// return this.connection;
		} catch (error) {
			console.log('Cannot establish DB connection', error);
		}
	}

	/**
	 * Query from DB
	 * @param {string} queryString
	 */
	async query(queryString) {
		if (this._conn) {
			if (queryString) {
				const results = await this._conn.query(queryString);
				return results?.toArray().map((/** @type {{ toJSON: () => any; }} */ row) => row.toJSON());
			} else {
				console.log('Empty queryString');
			}
		} else {
			throw Error('Connection not established');
		}
	}

	async disconnect() {
		if (this._conn) await this._conn.close();
		else {
			console.log('Connection not established');
		}
	}
}
