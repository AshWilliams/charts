import { getBarHeightAndYAttr } from './draw-utils';

const UNIT_ANIM_DUR = 350;
const PATH_ANIM_DUR = 650;
const MARKER_LINE_ANIM_DUR = UNIT_ANIM_DUR;
export const REPLACE_ALL_NEW_DUR = 250;

const STD_EASING = 'easein';

export var Animator = (function() {
	var Animator = function(totalHeight, totalWidth, zeroLine, avgUnitWidth) {
		// constants
		this.totalHeight = totalHeight;
		this.totalWidth = totalWidth;

		// changeables
		this.avgUnitWidth = avgUnitWidth;
		this.zeroLine = zeroLine;
	};

	Animator.prototype = {
		bar: function(barObj, x, yTop, index, noOfDatasets) {
			let start = x - this.avgUnitWidth/4;
			let width = (this.avgUnitWidth/2)/noOfDatasets;
			let [height, y] = getBarHeightAndYAttr(yTop, this.zeroLine, this.totalHeight);

			x = start + (width * index);

			return [barObj, {width: width, height: height, x: x, y: y}, UNIT_ANIM_DUR, STD_EASING];
			// bar.animate({height: args.newHeight, y: yTop}, UNIT_ANIM_DUR, mina.easein);
		},

		dot: function(dotObj, x, yTop) {
			return [dotObj, {cx: x, cy: yTop}, UNIT_ANIM_DUR, STD_EASING];
			// dot.animate({cy: yTop}, UNIT_ANIM_DUR, mina.easein);
		},

		path: function(d, pathStr) {
			let pathComponents = [];
			const animPath = [{unit: d.path, object: d, key: 'path'}, {d:"M"+pathStr}, PATH_ANIM_DUR, STD_EASING];
			pathComponents.push(animPath);

			if(d.regionPath) {
				let regStartPt = `0,${this.zeroLine}L`;
				let regEndPt = `L${this.totalWidth}, ${this.zeroLine}`;

				const animRegion = [
					{unit: d.regionPath, object: d, key: 'regionPath'},
					{d:"M" + regStartPt + pathStr + regEndPt},
					PATH_ANIM_DUR,
					STD_EASING
				];
				pathComponents.push(animRegion);
			}

			return pathComponents;
		},

		verticalLine: function(xLine, newX, oldX) {
			return [
				{unit: xLine, array: [0], index: 0},
				{transform: `${ newX }, 0`},
				MARKER_LINE_ANIM_DUR,
				STD_EASING,
				"translate",
				{transform: `${ oldX }, 0`}
			];
		},

		horizontalLine: function(yLine, newY, oldY) {
			return [
				{unit: yLine, array: [0], index: 0},
				{transform: `0, ${ newY }`},
				MARKER_LINE_ANIM_DUR,
				STD_EASING,
				"translate",
				{transform: `0, ${ oldY }`}
			];
		}
	};

	return Animator;
})();
