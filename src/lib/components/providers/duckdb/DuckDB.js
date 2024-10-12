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

		// Select a bundle based on browser checks
		const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
		if (bundle.mainWorker) {
			// Instantiate the asynchronus version of DuckDB-wasm
			const worker = new Worker(bundle.mainWorker);
			const logger = new duckdb.ConsoleLogger();

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
