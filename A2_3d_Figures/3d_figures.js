mat4 = glMatrix.mat4;

var projectionMatrix;

var shaderProgram, shaderVertexPositionAttribute, shaderVertexColorAttribute, 
    shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

var duration = 5000; // ms

// Attributes: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These do not change values from vertex to vertex.
// Varyings: Used for passing data from the vertex shader to the fragment shader. Represent information for which the shader can output different value for each vertex.
var vertexShaderSource =    
    "    attribute vec3 vertexPos;\n" +
    "    attribute vec4 vertexColor;\n" +
    "    uniform mat4 modelViewMatrix;\n" +
    "    uniform mat4 projectionMatrix;\n" +
    "    varying vec4 vColor;\n" +
    "    void main(void) {\n" +
    "		// Return the transformed and projected vertex value\n" +
    "        gl_Position = projectionMatrix * modelViewMatrix * \n" +
    "            vec4(vertexPos, 1.0);\n" +
    "        // Output the vertexColor in vColor\n" +
    "        vColor = vertexColor;\n" +
    "    }\n";

// precision lowp float
// This determines how much precision the GPU uses when calculating floats. The use of highp depends on the system.
// - highp for vertex positions,
// - mediump for texture coordinates,
// - lowp for colors.
var fragmentShaderSource = 
    "    precision lowp float;\n" +
    "    varying vec4 vColor;\n" +
    "    void main(void) {\n" +
    "    gl_FragColor = vColor;\n" +
    "}\n";

function initWebGL(canvas)
{
    var gl = null;
    var msg = "Your browser does not support WebGL, " +
        "or it is not enabled by default.";
    try 
    {
        gl = canvas.getContext("experimental-webgl");
    } 
    catch (e)
    {
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl)
    {
        alert(msg);
        throw new Error(msg);
    }

    return gl;        
 }

function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(canvas)
{
    // Create a project matrix with 45 degree field of view
    projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 10000);
}

// TO DO: Create the functions for each of the figures.

function createShader(gl, str, type)
{
    var shader;
    if (type == "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShader(gl)
{
    // load and compile the fragment and vertex shader
    var fragmentShader = createShader(gl, fragmentShaderSource, "fragment");
    var vertexShader = createShader(gl, vertexShaderSource, "vertex");

    // link them together into a new program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // get pointers to the shader params
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(shaderVertexColorAttribute);
    
    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
}

function draw(gl, objs) 
{
    // TO DO: Fill in the draw function to draw all the objects
  gl.clearColor(0.1, 0.1, 0.1, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // set the shader to use
  gl.useProgram(shaderProgram);

  for (i = 0; i < objs.length; i++) {
    obj = objs[i];
    // connect up the shader parameters: vertex position, color and projection/model matrices
    // set up the buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
    gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
    gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

    gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);

    // Draw the object's primitives using indexed buffer information.
    // void gl.drawElements(mode, count, type, offset);
    // mode: A GLenum specifying the type primitive to render.
    // count: A GLsizei specifying the number of elements to be rendered.
    // type: A GLenum specifying the type of the values in the element array buffer.
    // offset: A GLintptr specifying an offset in the element array buffer.
    gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
  }
}

function run(gl, objs) 
{
    // The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.
    requestAnimationFrame(function() { run(gl, objs); });
    draw(gl, objs);

    for(i = 0; i<objs.length; i++)
        objs[i].update();
}


function drawPiramid(gl, translation, rotationAxis) {
    //Vertex data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  
    var verts = [
        // Bottom A
        0.0, 0.0, 0.0,
        1, 0.0, 0.3,
        0.0, 0.0, 1.0,
    
        // Bottom B
        0.0, 0.0, 0.0,
        0.0, 0.0, 1.0,
        -1, 0.0, 0.3,
    
        // Bottom C
        0.0, 0.0, 0.0,
        -1, 0.0, 0.3,
        -0.5, 0.0, -0.8,
    
        // Bottom D
        0.0, 0.0, 0.0,
        -0.5, 0.0, -0.8,
        0.5, 0.0, -0.8,
    
        // Bottom E
        0.0, 0.0, 0.0,
        0.5, 0.0, -0.8,
        1, 0.0, 0.3,
    
        // Top A
        1, 0.0, 0.3,
        0.0, 1.5, 0.0,
        0.0, 0.0, 1.0,
    
        // Top B
        0.0, 0.0, 1.0,
        0.0, 1.5, 0.0,
        -1, 0.0, 0.3,
    
        // Top C
        -1, 0.0, 0.3,
        0.0, 1.5, 0.0,
        -0.5, 0.0, -0.8,
    
        // Top D
        -0.5, 0.0, -0.8,
        0.0, 1.5, 0.0,
        0.5, 0.0, -0.8,
    
        // Top E
        0.5, 0.0, -0.8,
        0.0, 1.5, 0.0,
        1, 0.0, 0.3,
      ];
    
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

      // Color data
      var colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      var faceColors = [
        [1.0, 0.0, 0.0, 1], // Bottom A
        [1.0, 0.0, 0.0, 1], // Bottom B
        [1.0, 0.0, 0.0, 1], // Bottom C
        [1.0, 0.0, 0.0, 1], // Bottom D
        [1.0, 0.0, 0.0, 1], // Bottom E
        [0.0, 1.0, 0.0, 1], // Top A
        [0.0, 0.0, 1.0, 1], // Top B
        [1.0, 0.0, 1.0, 1], // Top C
        [1.0, 1.0, 0.0, 1], // Top D
        [0.0, 1.0, 1.0, 1], // Top E
      ];
    
      // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
      var vertexColors = [];
      // for (var i in faceColors)
      // {
      //     var color = faceColors[i];
      //     for (var j=0; j < 4; j++)
      //         vertexColors = vertexColors.concat(color);
      // }
      for (const color of faceColors) {
        for (var j = 0; j < 3; j++)
          vertexColors = vertexColors.concat(color);
      }
    
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);
    
      // Index data (defines the triangles to be drawn).
      var piramidIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, piramidIndexBuffer);
      var piramidIndices = [
        0, 1, 2, // Bottom A
        3, 4, 5, // Bottom B
        6, 7, 8, // Bottom C
        9, 10, 11, // Bottom D
        12, 13, 14, // Bottom E
    
        15, 16, 17, // Top A
        18, 19, 20, // Top B
        21, 22, 23, // Top C
        24, 25, 26, // Top D
        27, 28, 29, // Top E
      ];
    
      // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
      // Uint16Array: Array of 16-bit unsigned integers.
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(piramidIndices), gl.STATIC_DRAW);
    
      var piramid = {buffer: vertexBuffer,colorBuffer: colorBuffer,indices: piramidIndexBuffer,vertSize: 3,nVerts: 30,colorSize: 4,nColors: 30,nIndices: 30,primtype: gl.TRIANGLES,modelViewMatrix: mat4.create(),currentTime: Date.now()};
    
      mat4.translate(piramid.modelViewMatrix, piramid.modelViewMatrix, translation);
    
      piramid.update = function() {
        var now = Date.now();
        var deltat = now - this.currentTime;
        this.currentTime = now;
        var fract = deltat / duration;
        var angle = Math.PI * 2 * fract;
    
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
      };
    
      return piramid;
}
  
function drawOctahedron(gl, translation, rotationAxis) {
    //Vertex data
    var vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  
    var verts = [
      // Top A
      1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 0.0, 1.0,
  
      // Top B
      1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 0.0, -1.0,
  
      // Top C
      -1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 0.0, -1.0,
  
      // Top D
      -1.0, 0.0, 0.0,
      0.0, 1.0, 0.0,
      0.0, 0.0, 1.0,
  
  
      // Bottom A
      1.0, 0.0, 0.0,
      0.0, -1.0, 0.0,
      0.0, 0.0, 1.0,
  
      // Bottom B
      1.0, 0.0, 0.0,
      0.0, -1.0, 0.0,
      0.0, 0.0, -1.0,
  
      // Bottom C
      -1.0, 0.0, 0.0,
      0.0, -1.0, 0.0,
      0.0, 0.0, -1.0,
  
      // Bottom D
      -1.0, 0.0, 0.0,
      0.0, -1.0, 0.0,
      0.0, 0.0, 1.0,
    ];
  
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
  
    // Color data
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    var faceColors = [
      [1.0, 0.0, 0.0, 1], // Bottom A
      [0.0, 1.0, 0.0, 1], // Bottom B
      [0.0, 0.0, 1.0, 1], // Bottom C
      [0.0, 1.0, 1.0, 1], // Bottom D
      [0.0, 1.0, 0.0, 1], // Top A
      [0.0, 0.0, 1.0, 1], // Top B
      [1.0, 0.0, 1.0, 1], // Top C
      [1.0, 1.0, 0.0, 1], // Top D
    ];
  
    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    var vertexColors = [];
    for (const color of faceColors) {
      for (var j = 0; j < 3; j++)
        vertexColors = vertexColors.concat(color);
    }
  
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);
  
    // Index data (defines the triangles to be drawn).
    var octahedronIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, octahedronIndexBuffer);
    var octahedronIndices = [
      0, 1, 2, // Bottom A
      3, 4, 5, // Bottom B
      6, 7, 8, // Bottom C
      9, 10, 11, // Bottom D
  
      12, 13, 14, // Top A
      15, 16, 17, // Top B
      18, 19, 20, // Top C
      21, 22, 23 // Top D
    ];
  
    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(octahedronIndices), gl.STATIC_DRAW);
  
    var octahedron = {buffer: vertexBuffer,colorBuffer: colorBuffer,indices: octahedronIndexBuffer,vertSize: 3,nVerts: 24,colorSize: 4,nColors: 24,nIndices: 24,primtype: gl.TRIANGLES,modelViewMatrix: mat4.create(),currentTime: Date.now()};
  
    mat4.translate(octahedron.modelViewMatrix, octahedron.modelViewMatrix, translation);
    var i = 0;
    octahedron.update = function() {
      var now = Date.now();
      var deltat = now - this.currentTime;
      this.currentTime = now;
      var fract = deltat / duration;
      var angle = Math.PI * 2 * fract;
  
      //spec ratio
  
      // Rotates a mat4 by the given angle
      // mat4 out the receiving matrix
      // mat4 a the matrix to rotate
      // Number rad the angle to rotate the matrix by
      // vec3 axis the axis to rotate around
      mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
      if(i < 60){
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0,-0.025,0]);
      } else if(i < 120) {
        mat4.translate(this.modelViewMatrix, this.modelViewMatrix, [0,0.025,0]);
      } else{
        i = -1;
      }
      i++;
    };
  
    return octahedron;
  }
  

function drawScutoid(gl, translation, rotationAxis) {
  //Vertex data
  let vertexBuffer;
  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  var verts = [
      // Bottom A
      0.0, 0.0, 0.0,
      1, 0.0, 0.3,
      0.0, 0.0, 1.0,
  
      // Bottom B
      0.0, 0.0, 0.0,
      0.0, 0.0, 1.0,
      -1, 0.0, 0.3,
  
      // Bottom C
      0.0, 0.0, 0.0,
      -1, 0.0, 0.3,
      -0.5, 0.0, -0.8,
  
      // Bottom D
      0.0, 0.0, 0.0,
      -0.5, 0.0, -0.8,
      0.5, 0.0, -0.8,
  
      // Bottom E
      0.0, 0.0, 0.0,
      0.5, 0.0, -0.8,
      1, 0.0, 0.3,
  
      // Side A1
      -1, 0.0, 0.3,
      0.0, 2.5, 1.0,
      0.0, 0.0, 1.0,

      // Side A2
      0.0, 0.0, 1.0,
      1, 2.5, 0.3,
      0.0, 2.5, 1.0,
  
      // Side B1
      -0.5, 0.0, -0.8,
      -1, 2.5, 0.3,
      -1, 0.0, 0.3,

      // Side B2
      -1, 0.0, 0.3,
      -1, 2.5, 0.3,
      0, 2.5, 1,
  
      // Side C1
      0.5, 0.0, -0.8,
      -0.5, 2.5, -0.8,
      -0.5, 0.0, -0.8,

      // Side C2
      -0.5, 0.0, -0.8,
      -0.5, 2.5, -0.8,
      -1, 2.5, 0.3,
   
  
      // Side D1
      1, 0.0, 0.3,
      0.5, 2.5, -0.8,
      0.5, 0.0, -0.8,

      // Side D2
      0.5, 0.0, -0.8,
      0.5, 2.5, -0.8,
      -0.5, 2.5, -0.8,
  
      // Side E1
      0.0, 0.0, 1.0,
      1, 2.5, 0.3,
      1, 0.0, 0.3,

      // Side E2
      1, 0.0, 0.3,
      1, 2.5, 0.3,
      0.5, 2.5, -0.8,

      // Top A
      0.0, 2.5, 0.0,
      1, 2.5, 0.3,
      0.0, 2.5, 1.0,
  
      // Top B
      0.0, 2.5, 0.0,
      0.0, 2.5, 1.0,
      -1, 2.5, 0.3,
  
      // Top C
      0.0, 2.5, 0.0,
      -1, 2.5, 0.3,
      -0.5, 2.5, -0.8,
  
      // top D
      0.0, 2.5, 0.0,
      -0.5, 2.5, -0.8,
      0.5, 2.5, -0.8,
  
      // Top E
      0.0, 2.5, 0.0,
      0.5, 2.5, -0.8,
      1, 2.5, 0.3,

        
      // Top E
      0.0, 2.5, 0.0,
      1, 2.5, 0.3,
      0, 2.5, 0.8,
    ];
  
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    var faceColors = [
      [1.0, 0.0, 0.0, 1], // Bottom A
      [1.0, 0.0, 0.0, 1], // Bottom B
      [1.0, 0.0, 0.0, 1], // Bottom C
      [1.0, 0.0, 0.0, 1], // Bottom D
      [1.0, 0.0, 0.0, 1], // Bottom E

      [0.0, 1.0, 0.0, 1], // Side A 1
      [0.0, 1.0, 0.0, 1], // Side A 2
      [0.0, 0.0, 1.0, 1], // Side B 1
      [0.0, 0.0, 1.0, 1], // Side B 2
      [1.0, 0.0, 1.0, 1], // Side C 1
      [1.0, 0.0, 1.0, 1], // Side C 2
      [1.0, 1.0, 0.0, 1], // Side D 1
      [1.0, 1.0, 0.0, 1], // Side D 2
      [0.0, 1.0, 1.0, 1], // Side E 1 
      [0.0, 1.0, 1.0, 1], // Side E 2

      [0.0, 1.0, 0.0, 1], // Top A
      [0.0, 1.0, 0.0, 1], // Top B
      [0.0, 1.0, 0.0, 1], // Top C
      [0.0, 1.0, 0.0, 1], // Top D
      [0.0, 1.0, 0.0, 1], // Top E
      [0.0, 1.0, 0.0, 1], // Top E
    ];
  
    // Each vertex must have the color information, that is why the same color is concatenated 4 times, one for each vertex of the cube's face.
    var vertexColors = [];
    // for (var i in faceColors)
    // {
    //     var color = faceColors[i];
    //     for (var j=0; j < 4; j++)
    //         vertexColors = vertexColors.concat(color);
    // }
    for (const color of faceColors) {
      for (var j = 0; j < 3; j++)
        vertexColors = vertexColors.concat(color);
    }
  
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);
  
    // Index data (defines the triangles to be drawn).
    var piramidIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, piramidIndexBuffer);
    var piramidIndices = [
      0, 1, 2, // Bottom A
      3, 4, 5, // Bottom B
      6, 7, 8, // Bottom C
      9, 10, 11, // Bottom D
      12, 13, 14, // Bottom E
  
      15, 16, 17, // Side A1
      18, 19, 20, // Side A2
      21, 22, 23, // Side B1 
      24, 25, 26, // Side B2
      27, 28, 29, // Side C1
      30, 31, 32, // Side C2
      33, 34, 35, // Side D1
      36, 37, 38, // Side D2
      39, 40, 41, // Side E1
      42, 43, 44, // Side E2

      45, 46, 47,  //Top
      48, 49 ,50, //Top
      51, 52, 53, //Top
      54, 55, 56, //Top
      57, 58, 59, //Top
      60,61,62
    ];
  
    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(piramidIndices), gl.STATIC_DRAW);
  
    var piramid = {buffer: vertexBuffer,colorBuffer: colorBuffer,indices: piramidIndexBuffer,vertSize: 3,nVerts: 63,colorSize: 4,nColors: 63,nIndices: 63,primtype: gl.TRIANGLES,modelViewMatrix: mat4.create(),currentTime: Date.now()};
  
    mat4.translate(piramid.modelViewMatrix, piramid.modelViewMatrix, translation);
  
    piramid.update = function() {
      var now = Date.now();
      var deltat = now - this.currentTime;
      this.currentTime = now;
      var fract = deltat / duration;
      var angle = Math.PI * 2 * fract;
  
      // Rotates a mat4 by the given angle
      // mat4 out the receiving matrix
      // mat4 a the matrix to rotate
      // Number rad the angle to rotate the matrix by
      // vec3 axis the axis to rotate around
      mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };
  
    return piramid;
}