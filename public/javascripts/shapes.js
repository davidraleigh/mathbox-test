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
var xRange = 10;
var yRange = 10;
var zRange = 10;
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



// Make axes black
//mathbox.select('axis').set('color', 'black');


// Calibrate focus distance for units
mathbox.set('focus', 3);

//Add some data
var data =
   view
   .interval({
     expr: function (emit, x, i, t) {
       emit(x, xRange * Math.sin(x + t));
     },
     length: 256,
     channels: 2
   });

//Draw a curve
var curve =
   view
   .line({
     width: 5,
     color: '#3090FF'
   });

// Draw some points
var points =
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
       emit(x, -Math.sin(x + t));
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

// Draw ticks and labels
// var scale =
//   view.scale({
//     divide: 10,
//   });

// var ticks =
//   view.ticks({
//     width: 5,
//     size: 15,
//     color: 'black',
//   });

// var format =
//   view.format({
//     digits: 2,
//     weight: 'bold',
//   });

var labels =
    view.label({
        color: 'red',
        zIndex: 1
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

//*/
// Animate
// var play = mathbox.play({
//   target: 'cartesian',
//   pace: 5,
//   to: 2,
//   loop: true,
//   script: [
//     {props: {range: [[-2, 2], [-1, 1]]}},
//     {props: {range: [[-4, 4], [-2, 2]]}},
//     {props: {range: [[-2, 2], [-1, 1]]}},
//   ]
// });



