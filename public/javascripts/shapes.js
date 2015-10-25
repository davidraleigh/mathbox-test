/**
 * Created by davidraleigh on 10/24/15.
 */
var mathbox = mathBox({
    plugins: ['core', 'controls', 'cursor', 'mathbox'],
    controls: {
        // Orbit controls, i.e. Euler angles, with gimbal lock
        klass: THREE.OrbitControls

        // Trackball controls, i.e. Free quaternion rotation
        //klass: THREE.TrackballControls,
    }
});
if (mathbox.fallback) throw "WebGL not supported";

var three = mathbox.three;
three.renderer.setClearColor(new THREE.Color(0xFFFFFF), 1.0);

colors = {
    x: new THREE.Color(0xFF4136),
    y: new THREE.Color(0x2ECC40),
    z: new THREE.Color(0x0074D9)
};


// Do stuff with mathbox,
// for example: (see docs/intro.md)

// Place camera
var camera = mathbox.camera({
    // allows interactive camera controls
    proxy: true,
    position: [2, 5, 5]
});


// 2D cartesian
var xRange = 1;
var yRange = 1;
var zRange = 1;
var view =mathbox.cartesian({
    range: [[-xRange,xRange], [-yRange, yRange], [-zRange, zRange]],
    scale: [2, 2, 2]
});


var time = 0;
var fade = 0;

three.on('update', function () {
    var clock = three.Time.clock;
    time = clock;
//
    var t = Math.max(clock, 0) / 2;
    t = t < 0.5 ? t * t : t - 0.25;
//
    var o = 0.5 - 0.5 * Math.cos(Math.min(1, t) * π);
    fade = o;
//
//    f = t / 8;
//    c = Math.cos(f);
//    s = Math.sin(f);
//    view.set('quaternion', [0, -s, 0, c]);
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

//Add some data
var data =
   view
   .interval({
     expr: function (emit, x) {
       emit(x, xRange * Math.sin(x));
     },
     length: 64,
     channels: 2
   });

//Draw a curve
   view
   .line({
     width: 5,
     color: '#3090FF'
   });

// Draw some points
   view
   .point({
     size: 8,
     color: '#3090FF'
   });

// Draw vectors
var vector =
   view.interval({
     expr: function (emit, x, i, t) {
       emit(x, 0);
       emit(x, xRange * -Math.sin(x + t));
     },
     length: 64,
     channels: 2,
     items: 2
   })
   .vector({
     end: true,
     width: 5,
     color: '#50A000'
   });

view.voxel({
    data: [
        -1, -1, -.5, -.75, -.75, -1.2, -.4, -.6, -1.5, 0, 0, 0,
        // -1,  1, -.5, -.75,  .75, -1.2, -.4,  .6, -1.5, 0, 0, 0,
        //  1,  1, -.5,  .75,  .75, -1.2,  .4,  .6, -1.5, 0, 0, 0,
        //  1, -1, -.5,  .75, -.75, -1.2,  .4, -.6, -1.5, 0, 0, 0,

        -1, -1,  .5, -.75, -.75,  1.2, -.4, -.6,  1.5, 0, 0, 0,
        -1,  1,  .5, -.75,  .75,  1.2, -.4,  .6,  1.5, 0, 0, 0,
          1,  1,  .5,  .75,  .75,  1.2,  .4,  .6,  1.5, 0, 0, 0,
          1, -1,  .5,  .75, -.75,  1.2,  .4, -.6,  1.5, 0, 0, 0,
    ],
    width: 4,
    height: 2,
    depth: 1,
    items: 4,
    channels: 3
});

view.face({
    color: 0x3090FF,
    color: 0xA0B7FF,
    shaded: true
});
//-130, 10));
//pg.lineTo(-131, 15);
//pg.lineTo(-140, 20);


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




