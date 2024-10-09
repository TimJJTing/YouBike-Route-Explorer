import Bundler from "./mingle";
import { lineString } from "@turf/helpers";
import bezierSpline from "@turf/bezier-spline";
import length from "@turf/length";
import distance from "@turf/distance";

const processData = (paths, tsMax) => {
  // Convert paths to a graph representation
  const _paths = [];

  paths.forEach((p, i) => {
    _paths.push({
      id: i,
      name: `${p.on_name}-${p.off_name}`,
      data: {
        coords: [
          p.on_lon,
          p.on_lat,
          p.off_lon,
          p.off_lat,
        ],
      },
      path: [
        [p.on_lon, p.on_lat],
        [p.off_lon, p.off_lat],
      ],
      timestamps: [0, tsMax],
      ...p,
    });
  });

  return _paths;
};

/**
 * prepare path flow data
 * @param {Object[]} paths paths to be processed
 * @param {boolean} edgeBundling enable edge bundling?
 * @param {number} delta grouping delta
 * @param {number} pathDuration animation duration of every path
 * @param {boolean} randomStartOffset if true, animations will not start and end simultaneously
 * @param {number} globalDuration the global animation duration
 * @param {number} fadeoutDuration duration for animation to fadeout before global animation dues
 * @returns processed path data, ready to be animated by deck.gl
 */
export const pathProcessor = (
  paths,
  edgeBundling = true,
  delta = 0.5,
  pathDuration = 200,
  randomStartOffset = false,
  globalDuration = 600,
  fadeoutDuration = 100,
) => {
  if (paths.length < 1) return;

  const processedData = processData(paths, pathDuration);

  if (!edgeBundling) {
    return processedData;
  }

  // TODO: make this adjustable to user
  let bundle = new Bundler({angleStrength: 0.5}); // avoid large turning angles
  bundle.setNodes(processedData);
  bundle.buildNearestNeighborGraph();
  bundle.MINGLE();

  bundle.graph.each(function (node) {
    let groupedEdges = node.unbundleEdges(delta); // grouped paths
    groupedEdges.forEach((edge) => {
      let name = edge[0].node.name;
      let path = [];
      edge.forEach((node) => {
        let pos = node.unbundledPos;
        path.push([pos[0], pos[1]]);
      });
      // transform line to bezier curves for better presentation
      let curvedPath = bezierSpline(lineString(path), { sharpness: 0.7 });
      let pth = processedData.find((p) => p.name === name);
      pth.path = curvedPath.geometry.coordinates;

      // compute total length of the curvedPath
      let totalLength = length(curvedPath);
      // compute unit length ul of the curvedPath
      let unitLength = totalLength / pth.path.length;

      // also use random duration?
      let unitTimestamp = pathDuration / pth.path.length;

      let timestamps = [];
      let ts = 0,
        tsMax = pathDuration;
      if (randomStartOffset) {
        let startOffset = Math.round(
          Math.random() * (globalDuration - pathDuration - fadeoutDuration)
        );
        /** applying random offsets:
         *   **: path animation
         *   --: fadeout
         *   __: possible blank
         *   ***__--
         *   __***--
         *   _***_--
         */
        ts = ts + startOffset;
        tsMax = tsMax + startOffset;
      }
      timestamps.push(ts);
      // for every two points distance d, timestamp = tu * (d / ul)
      for (let i = 1; i < pth.path.length - 1; i++) {
        let from = pth.path[i - 1];
        let to = pth.path[i];
        let dis = distance(from, to);
        ts = ts + unitTimestamp * (dis / unitLength); // ts = ts + tsOffset
        timestamps.push(ts);
      }
      timestamps.push(tsMax);
      pth.timestamps = timestamps;
    });
  });

  // console.log(processedData);
  return processedData;
};
