import * as duckdb from '@duckdb/duckdb-wasm';
import duckdb_wasm from '@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url';
import mvp_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url';
import duckdb_wasm_eh from '@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url';
import eh_worker from '@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url';

/**
 * @type {import('@duckdb/duckdb-wasm').DuckDBBundles}
 */
const MANUAL_BUNDLES = {
	mvp: {
		mainModule: duckdb_wasm,
		mainWorker: mvp_worker
	},
	eh: {
		mainModule: duckdb_wasm_eh,
		mainWorker: eh_worker
	}
};

export class DuckDB {
	/**
	 * @param {{name: string, url: string}[]} connections
	 * @param {duckdb.DuckDBDataProtocol} proto
	 * @param {boolean} directIO
	 * @param {duckdb.LogLevel} logLevel
	 */
	constructor(connections, proto, directIO, logLevel) {
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
		 * @type {duckdb.LogLevel}
		 */
		this._logLevel = logLevel;
	}

	get connections() {
		return this._connections;
	}

	get proto() {
		return this._proto;
	}

	get directIO() {
		return this._directIO;
	}

	get logLevel() {
		return this._logLevel;
	}

	/**
	 * Initialize a DuckDB instance
	 */
	async _initDB() {
		if (this._db) {
			return this._db; // Return existing database, if any
		}

		// Select a bundle based on browser checks
		const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
		if (bundle.mainWorker) {
			// Instantiate the asynchronus version of DuckDB-wasm
			const worker = new Worker(bundle.mainWorker);
			const logger = new duckdb.ConsoleLogger(this._logLevel);

			// and asynchronous database
			this._db = new duckdb.AsyncDuckDB(logger, worker);
			await this._db.instantiate(bundle.mainModule, bundle.pthreadWorker);
			return this._db;
		}
		return null;
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
				});
				this._conn = await db.connect();
			}
			return this._conn;
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
