/**
 * Created by davidraleigh on 10/24/15.
 */

//var mathJS = require('mathjs');
//var mathBox = require('mathbox-0.0.4/build/mathbox-bundle.js');
var mathbox = mathBox({
    plugins: ['core', 'controls', 'cursor', 'mathbox'],
    controls: {
        // Orbit controls, i.e. Euler angles, with gimbal lock
        klass: THREE.OrbitControls
    }
});

if (mathbox.fallback)
    throw "WebGL not supported";

var three = mathbox.three;
three.renderer.setClearColor(new THREE.Color(0xFFFFFF), 1.0);

colors = {
    x: new THREE.Color(0xFF4136),
    y: new THREE.Color(0x2ECC40),
    z: new THREE.Color(0x0074D9)
};

// Place camera
var camera = mathbox.camera({
    // allows interactive camera controls
    proxy: true,
    position: [2, 5, 5]
});


// 3D cartesian
var radius = 1;
var xRange = radius;
var yRange = xRange;
var zRange = xRange;
var view =mathbox.cartesian({
    range: [[-xRange,xRange], [-yRange, yRange], [-zRange, zRange]],
    scale: [2, 2, 2]
});

// Axes + grid
view
    .axis({
        axis: 1,
        width: 3,
        color: colors.x
    })
    .axis({
        axis: 2,
        width: 3,
        color: colors.y
    })
    .axis({
        axis: 3,
        width: 5,
        color: colors.z
    })
    .grid({
        width: 2,
        axes: [1, 2]
        // divideX: 20
    });

// Calibrate focus distance for units
mathbox.set('focus', 3);

// tau is the golden rectangle length
var tau= (1.0 + Math.sqrt(5)) / 2.0;
// determine golden latitude of rings for icosahedron
var goldenLat = (Math.PI/2) - Math.atan2(1, tau) * 2;

var lonInterval = Math.PI * 2 / 5;

var upperRingLon = [0, lonInterval, lonInterval * 2, lonInterval * 3, lonInterval * 4];
var lowerRingLon = [];
upperRingLon.forEach(function(element) { lowerRingLon.push(element + lonInterval / 2);})
upperRingLon.push(upperRingLon[0]);
lowerRingLon.push(lowerRingLon[0]);

var xyzFromSpherical = function(lat, lon, r) {
    var x = Math.cos(lat) * Math.cos(lon) * r;
    var y = Math.cos(lat) * Math.sin(lon) * r;
    var z = Math.sin(lat) * r;
    // sway y and z for graphics y-up property
    return [x, z, y];
};

var vertices = [];

// y-up position of top point in z-up reference frame
var topPoint = [0, radius, 0]; //var topPoint = [0, 0, radius];
var bottomPoint = [0, -radius, 0]; //var topPoint = [0, 0, radius];

for (var i = 0; i < upperRingLon.length - 1; i++) {
    Array.prototype.push.apply(vertices, topPoint);
    Array.prototype.push.apply(vertices, xyzFromSpherical(goldenLat, upperRingLon[i + 1], radius));
    Array.prototype.push.apply(vertices, xyzFromSpherical(goldenLat, upperRingLon[i], radius));
}

for (var i = 0; i < upperRingLon.length - 1; i++) {
    Array.prototype.push.apply(vertices, xyzFromSpherical(goldenLat, upperRingLon[i], radius));
    Array.prototype.push.apply(vertices, xyzFromSpherical(goldenLat, upperRingLon[i + 1], radius));
    Array.prototype.push.apply(vertices, xyzFromSpherical(-goldenLat, lowerRingLon[i], radius));

    Array.prototype.push.apply(vertices, xyzFromSpherical(-goldenLat, lowerRingLon[i], radius));
    Array.prototype.push.apply(vertices, xyzFromSpherical(goldenLat, upperRingLon[i + 1], radius));
    Array.prototype.push.apply(vertices, xyzFromSpherical(-goldenLat, lowerRingLon[i + 1], radius));
}

for (var i = 0; i < upperRingLon.length - 1; i++) {
    Array.prototype.push.apply(vertices, bottomPoint);
    Array.prototype.push.apply(vertices, xyzFromSpherical(-goldenLat, lowerRingLon[i], radius));
    Array.prototype.push.apply(vertices, xyzFromSpherical(-goldenLat, lowerRingLon[i + 1], radius));
}

view.voxel({
    data: vertices,
    width: 60,
    height: 60,
    depth: 60,
    items: 3,
    channels: 3
});

view.face({
    color: 0xA0B7FF,
    shaded: true
})
    .face({
        color: 0x3090FF,
        width: 3,
        fill: false,
        line: false
    })
;


view.array({
    id: "colors",
    live: false,
    data: [colors.x, colors.y, colors.z].map(function (color){
        return [color.r, color.g, color.b, 1];
    })
});

view.array({
    data: [[1.1 * xRange,0.1 * xRange,-.11 * xRange], [0,1.21 * yRange,0], [0,0,1 * zRange]],
    channels: 3, // necessary
    live: false
}).text({
    data: ["y", "z", "x"]
}).label({
    color: 0xFFFFFF,
    colors: "#colors"
});




