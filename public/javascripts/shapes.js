/**
 * Created by davidraleigh on 10/24/15.
 */
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
var xRange = 10000000;
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

view.voxel({
    data: [
        -1 * xRange, -1 * xRange, -.5 * xRange, -.75 * xRange, -.75 * xRange, -1.2 * xRange, -.4 * xRange, -.6 * xRange, -1.5 * xRange, 0 * xRange, 0 * xRange, 0 * xRange,
        -1 * xRange,  1 * xRange, -.5 * xRange, -.75 * xRange,  .75 * xRange, -1.2 * xRange, -.4 * xRange,  .6 * xRange, -1.5 * xRange, 0 * xRange, 0 * xRange, 0 * xRange,
          1 * xRange,  1 * xRange, -.5 * xRange,  .75 * xRange,  .75 * xRange, -1.2 * xRange,  .4 * xRange,  .6 * xRange, -1.5 * xRange, 0 * xRange, 0 * xRange, 0 * xRange,
          1 * xRange, -1 * xRange, -.5 * xRange,  .75 * xRange, -.75 * xRange, -1.2 * xRange,  .4 * xRange, -.6 * xRange, -1.5 * xRange, 0 * xRange, 0 * xRange, 0 * xRange,

        -1 * xRange, -1 * xRange,  .5 * xRange, -.75 * xRange, -.75 * xRange,  1.2 * xRange, -.4 * xRange, -.6 * xRange,  1.5 * xRange, 0 * xRange, 0 * xRange, 0 * xRange,
        -1 * xRange,  1 * xRange,  .5 * xRange, -.75 * xRange,  .75 * xRange,  1.2 * xRange, -.4 * xRange,  .6 * xRange,  1.5 * xRange, 0 * xRange, 0 * xRange, 0 * xRange,
          1 * xRange,  1 * xRange,  .5 * xRange,  .75 * xRange,  .75 * xRange,  1.2 * xRange,  .4 * xRange,  .6 * xRange,  1.5 * xRange, 0 * xRange, 0 * xRange, 0 * xRange,
          1 * xRange, -1 * xRange,  .5 * xRange,  .75 * xRange, -.75 * xRange,  1.2 * xRange,  .4 * xRange, -.6 * xRange,  1.5 * xRange, 0 * xRange, 0 * xRange, 0 * xRange,
    ],
    width: 4,
    height: 2,
    depth: 1,
    items: 4,
    channels: 3
});

view.face({
    color: 0xA0B7FF,
    shaded: true
});


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
    data: ["x", "y", "z"]
}).label({
    color: 0xFFFFFF,
    colors: "#colors"
});




