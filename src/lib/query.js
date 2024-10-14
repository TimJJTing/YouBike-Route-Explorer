export const getGridsQueryString = () =>
	`SELECT h3_cell_lv9 as id, h3_cell_lv9 as name, capacity FROM parquet_scan('yb_grids_tpc.parquet')`;
export const getStationsQueryString = () =>
	`SELECT stop_id as id, stop_name AS name, latitude, longitude, capacity FROM parquet_scan('yb_stations_tpc.parquet')`;
// TODO: also count looping routes
/**
 * @param {string|undefined|null} focusId
 * @param {'all'|'inbound'|'outbound'} routeType
 */
export const getRoutesQueryString = (focusId, routeType) => {
	let routeTypeClause = '';
	if (routeType === 'inbound') routeTypeClause = `AND off_id='${focusId}'`;
	else if (routeType === 'outbound') routeTypeClause = `AND on_id='${focusId}'`;
	else if (routeType === 'all')
		routeTypeClause = `AND ( on_id='${focusId}' OR off_id='${focusId}' )`;
	let queryString = `SELECT * FROM parquet_scan('yb_route_weekday_tpc.parquet') WHERE off_id != on_id ${routeTypeClause};`;
	return queryString;
};
// TODO: also count looping routes
/**
 * @param {string|undefined|null} focusId
 * @param {'all'|'inbound'|'outbound'} routeType
 */
export const getRoutesInsightQueryString = (focusId, routeType) => {
	let routeTypeClause = '';
	if (routeType === 'inbound') routeTypeClause = `AND off_id='${focusId}'`;
	else if (routeType === 'outbound') routeTypeClause = `AND on_id='${focusId}'`;
	else if (routeType === 'all')
		routeTypeClause = `AND ( on_id='${focusId}' OR off_id='${focusId}' )`;
	let queryString = `SELECT COUNT(*)::INTEGER AS routes, SUM(sum_of_txn_times)::INTEGER AS sum_of_txn_times FROM parquet_scan('yb_route_weekday_tpc.parquet') WHERE off_id != on_id ${routeTypeClause};`;
	return queryString;
};

/**
 * @param {import('$lib/components/providers/duckdb/DuckDB').DuckDB | undefined} database
 * @param {string} queryString
 */
export const getData = async (database, queryString) => {
	const results = await database?.query(queryString);
	return results;
};
