import * as THREE from 'three';
import { lerp } from 'three/src/math/MathUtils';

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0xffffff );

// Camera/viewport setup
const zoom = 50;
const getWidth = () => window.innerWidth/zoom;
const getHeight = () => window.innerHeight/zoom;
const camera = new THREE.OrthographicCamera(-getWidth()/2, getWidth()/2,getHeight()/2,-getHeight()/2,9.999999,10.1111111);
camera.position.set(0,0,10);
camera.lookAt(0,0,0);

//Create blank renderer, this will be assigned by the *createScene* 
let renderer : THREE.WebGLRenderer;
interface Point {
    x : number;
    y : number;
}
interface Triangle {
    a : Point;
    b : Point;
    c : Point;
}
export interface Color {
    r : number;
    g : number;
    b : number;
}



const createRandomPoint = () => {
    return {x:(Math.random() * getWidth() - getWidth()/2), y:(Math.random() * getHeight() - getHeight()/2)};
}

const createRandomTrajectory = () => {
    return {x:(Math.random() * 0.05 - 0.025), y:(Math.random() * 0.05 - 0.025)};
}
function createRandomPoints(n : number) {
    const points : Point[] = Array(n).fill(0).map(() => createRandomPoint());
    return points;
}

function createRandomTrajectories(n : number) {
    const trajectories : Point[] = Array(n).fill(0).map(() => createRandomTrajectory());
    return trajectories;
}


// helper function to sort the verticies of a triangle in counterclockwise order
function sortVerticies(triangle : Triangle) {
    let verticies = [triangle.a,triangle.b,triangle.c];
    let cx = (triangle.a.x + triangle.b.x + triangle.c.x)/3;
    let cy = (triangle.a.y + triangle.b.y + triangle.c.y)/3;
    verticies.sort((a,b) => {
        let a1 = Math.atan2(a.x-cx,a.y-cy);
        let b1 = Math.atan2(b.x-cx,b.y-cy);
        return b1 - a1;
    });
    
    triangle.a = verticies[0];
    triangle.b = verticies[1];
    triangle.c = verticies[2];
    return triangle;
}

    

// helper function to calculate the determinant, checking if dx,dy is in the circle
function inCircle (ax: number, ay: number, bx :number, by: number, cx : number, cy: number, dx : number, dy: number) {
    let ax_ = ax-dx;
    let ay_ = ay-dy;
    let bx_ = bx-dx;
    let by_ = by-dy;
    let cx_ = cx-dx;
    let cy_ = cy-dy;
    return (
        (ax_*ax_ + ay_*ay_) * (bx_*cy_-cx_*by_) -
        (bx_*bx_ + by_*by_) * (ax_*cy_-cx_*ay_) +
        (cx_*cx_ + cy_*cy_) * (ax_*by_-bx_*ay_)
    ) > 0;
    
}



function createDelaunayTriangles(points : Point[]) {
    let triangles : Map<Triangle,boolean> = new Map();
    // create supertriangle
    let st1 : Point = {x:1000,y:1000};
    let st2 : Point = {x:-1000,y:1000};
    let st3 : Point = {x:0,y:-1000};
    let stVertices = [st1,st2,st3];
    let supertriangle : Triangle = {a:st1,b:st2,c:st3};
    triangles.set(supertriangle,true);


    let edgebuffer : Map<Point,Map<Point,boolean>> = new Map();
    const resolveEdges = (p1 : Point,p2 : Point) => {
        if(edgebuffer.has(p1) && edgebuffer.has(p2)){
            if(edgebuffer.get(p1)!.has(p2) || edgebuffer.get(p2)!.has(p1)){ // is doubled edge, set usable flag to false
                edgebuffer.get(p1)!.set(p2,false);
                edgebuffer.get(p2)!.set(p1,false);
            }else{ // is new edge, but both points exist in edgebuffer. Create edge and set flag to false
                edgebuffer.get(p1)!.set(p2,true);
                edgebuffer.get(p2)!.set(p1,true);
            }
        }else if(edgebuffer.has(p1)){ // p1 exists in edgebuffer, but p2 does not
            edgebuffer.set(p2,new Map().set(p1,true));
            edgebuffer.get(p1)!.set(p2,true);
        }else if(edgebuffer.has(p2)){ // p2 exists in edgebuffer, but p1 does not
            edgebuffer.set(p1,new Map().set(p2,true));
            edgebuffer.get(p2)!.set(p1,true);
        }else{
            edgebuffer.set(p1,new Map().set(p2,true));
            edgebuffer.set(p2,new Map().set(p1,true));
        }
    }
    for(let i = 0; i < points.length; i++){
        // add points one at a time

        // O(n) check all triangles to see if they contain the point, takes the longest computation time
        triangles.forEach((_,triangle) => { //why javascript... why is it value, key instead of key, value
            if (inCircle(triangle.a.x,triangle.a.y,
                triangle.b.x,triangle.b.y,
                triangle.c.x,triangle.c.y,
                points[i].x,points[i].y)) { 
                // add edges to edgebuffer, if edge is already in edgebuffer, set flag to false so they get removed later
                resolveEdges(triangle.a,triangle.b);
                resolveEdges(triangle.b,triangle.c);
                resolveEdges(triangle.c,triangle.a);
                triangles.delete(triangle);
            }
        });

        // add new triangles to triangulation
        // O(n)
        edgebuffer.forEach((pts,p1) => {
            pts.forEach((_,p2) => {
                if(edgebuffer.get(p1)!.get(p2)){
                    triangles.set(sortVerticies({a: p1,b: p2, c:points[i]}),true);
                    // should prevent drawing every edge twice
                    edgebuffer.get(p1)!.set(p2,false);
                    edgebuffer.get(p2)!.set(p1,false);
                }
            });
        });
        edgebuffer.clear();
    };
    
    triangles.forEach((_,triangle) => {
        // remove triangles with supertriangle vertices
        // remove supertriangle
        if(stVertices.includes(triangle.a) || stVertices.includes(triangle.b) || stVertices.includes(triangle.c)){
            triangles.delete(triangle);
        }
    });
    // try to free memory

    return triangles;
}


// I have come to realize that this was a silly idea: creating a mesh and making it wireframe is soooooooo much easier
// nevertheless, this is still kinda cool so I'll keep it here
function createLineUsingDFSTriangles(triangles : Map<Triangle,boolean>) {
    let lineGeometry = new THREE.BufferGeometry();
    let lineVertices : Point[] = [];
    let edges : Map<Point,Point[]> = new Map();
    let visited : Map<Point,boolean> = new Map();

    const makeEdge = (p1 : Point, p2 : Point) => {
        if(edges.has(p1) && edges.has(p2)){
            edges.get(p1)!.push(p2);
            edges.get(p2)!.push(p1);
        }else if(edges.has(p1)){
            edges.set(p2,[p1]);
            visited.set(p2,false);
            edges.get(p1)!.push(p2);
        }else if(edges.has(p2)){
            edges.set(p1, [p2]);
            visited.set(p1,false);
            edges.get(p2)!.push(p1);
        }else{
            edges.set(p1, [p2]);
            edges.set(p2, [p1]);
            visited.set(p1,false);
            visited.set(p2,false);
        }
    }
    // creates a map of each point to each edge, and a boolean flag for whether the edge has been traversed
    triangles.forEach((_,triangle) => {
        makeEdge(triangle.a,triangle.b);
        makeEdge(triangle.b,triangle.c);
        makeEdge(triangle.c,triangle.a);
    });

    // DFS to traverse edges
    let stack : Point[] = [];
    let start : Point = triangles.keys().next().value.a;
    stack.push(start);
    while(stack.length > 0){
        let current : Point = stack.pop()!;
        lineVertices.push(current);
        visited.set(current,true);
        edges.get(current)!.forEach((point) => {
            if(!visited.get(point)){
                stack.push(current);
                stack.push(point);
            }
        });
    }
    let f32lineVerticies : Float32Array = new Float32Array(lineVertices.length*3); 
    let count = 0;
    lineVertices.forEach((point) => {
        f32lineVerticies[count++] = point.x;
        f32lineVerticies[count++] = point.y;
        f32lineVerticies[count++] = 0;
    });
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(f32lineVerticies,3));
    edges.clear();
    visited.clear();
    return lineGeometry;
}

function createDelaunayMesh(triangles : Map<Triangle,boolean>) : THREE.Mesh {
    let delaunayMesh = new THREE.Mesh();
    let delaunayGeometry = new THREE.BufferGeometry();
    let positions : number[] = new Array(triangles.size*3);
    let count = 0;
    triangles.forEach((_,triangle) => {
        positions[count] = triangle.a.x;
        positions[count+1] = triangle.a.y;
        positions[count+2] = 0;
        positions[count+3] = triangle.b.x;
        positions[count+4] = triangle.b.y;
        positions[count+5] = 0;
        positions[count+6] = triangle.c.x;
        positions[count+7] = triangle.c.y;
        positions[count+8] = 0;
        count+=9;
    });
    delaunayGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    delaunayMesh.geometry = delaunayGeometry;
    delaunayMesh.material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, wireframe: false});
    return delaunayMesh;
}

function createGradientDelaunayMesh(triangles : Map<Triangle,boolean>, c1 : Color, c2 : Color) : THREE.Mesh {
    let delaunayMesh = new THREE.Mesh();
    let delaunayGeometry = new THREE.BufferGeometry();
    let positions : number[] = new Array(triangles.size*3);
    let colors : number[] = new Array(triangles.size);
    let count = 0;
    let colorCount = 0;
    let meshColors : THREE.MeshBasicMaterial[] = [];
    triangles.forEach((_,triangle) => {
        positions[count] = triangle.a.x;
        positions[count+1] = triangle.a.y;
        positions[count+2] = 0;
        positions[count+3] = triangle.b.x;
        positions[count+4] = triangle.b.y;
        positions[count+5] = 0;
        positions[count+6] = triangle.c.x;
        positions[count+7] = triangle.c.y;
        positions[count+8] = 0;
        let lerpPercent = (triangle.a.y + triangle.b.y + triangle.c.y)/3/2/getHeight() + 0.5;
        let r = lerp(c1.r,c2.r, lerpPercent) / 255;
        let g = lerp(c1.g,c2.g, lerpPercent) / 255;
        let b = lerp(c1.b,c2.b, lerpPercent) / 255;
        count+=9;
        colorCount+=3;
        let material = new THREE.MeshBasicMaterial({side: THREE.DoubleSide, wireframe: false, color: new THREE.Color(r,g,b)});
        meshColors.push(material);
    });
    delaunayGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    for(let i = 0; i < triangles.size; i++){
        delaunayGeometry.addGroup(i*3,3,i);
    }
    delaunayMesh.geometry = delaunayGeometry;
    delaunayMesh.material = meshColors;
    return delaunayMesh;
}

function clearScene() {
    scene.clear();
}








// CONSTANTS FOR RUNTIME

const numPoints = 100;

// instantiate the point and trajectory arrays, add the line to the scene
const points = createRandomPoints(numPoints);
const pointTrajectories = createRandomTrajectories(numPoints);

// Keeps the triangles filling the whole screen, no matter what
points.push({x: -getWidth(), y: -getHeight()});
points.push({x: -getWidth(), y: getHeight()});
points.push({x: getWidth(), y: -getHeight()});
points.push({x: getWidth(), y: getHeight()});

const WARM_GREEN = {r: 5, g: 163, b: 164};
const COOL_PURPLE = {r: 0x3A, g: 0x07, b: 0x51};
const COOL_GREEN = {r: 0x00, g: 0x9E, b: 0x9E};
const DARK_BLUE = {r: 0, g: 99, b: 115};
const DARK_PURPLE = {r: 0x3A, g: 0x07, b: 0x51};
const WARM_RED = {r: 0xEE, g: 0x3E, b: 0x38};
const WARM_ORANGE = {r: 0xF9, g: 0x8B, b: 0x2D};
const WARM_YELLOW = {r: 0xF9, g: 0xC2, b: 0x2D};
const WARM_PINK = {r: 0xF9, g: 0x2D, b: 0x8B};

let COLOR1 = COOL_GREEN;
let COLOR2 = WARM_RED;

export const setColor1 = (color : Color) => {
    COLOR1 = color;
}
export const setColor2 = (color : Color) => {
    COLOR2 = color;
}

const lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff} );

const pointMaterialOutOfCircle = new THREE.PointsMaterial( { color: 0xff0000, size: 1 } );
const pointMaterialInCircle = new THREE.PointsMaterial( { color: 0x00ff00, size: 1 } );
// render the scene once

// TEST CODE
function test_inCircleVisual(){
    clearScene();
    let test_triangle = new THREE.Triangle(new THREE.Vector3(10,0,0),new THREE.Vector3(-20,0,0),new THREE.Vector3(0,13,0));
    sortVerticies(test_triangle);
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([test_triangle.a,test_triangle.b,test_triangle.c,test_triangle.a]),lineMaterial));
    const innerPoints : number[] = [];
    const outerPoints : number[] = [];
    points.forEach(point => {
        if (inCircle(test_triangle.a.x,test_triangle.a.y,
            test_triangle.b.x,test_triangle.b.y,
            test_triangle.c.x,test_triangle.c.y,
            point.x,point.y)) { 
            innerPoints.push(point.x);
            innerPoints.push(point.y);
            innerPoints.push(0);
        }else{
            outerPoints.push(point.x);
            outerPoints.push(point.y);
            outerPoints.push(0);
        }
    });
   // scene.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(innerPoints),pointMaterialInCircle));
   // scene.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(outerPoints),pointMaterialOutOfCircle));

    renderer.render( scene, camera );
}
function test_inCircle(){
    let test_triangle = new THREE.Triangle(new THREE.Vector3(10,0,0),new THREE.Vector3(-20,0,0),new THREE.Vector3(0,13,0));
    sortVerticies(test_triangle);
    const test_points_outside = [
        new THREE.Vector3(100,100,0),
        new THREE.Vector3(100,-100,0),
        new THREE.Vector3(-100,100,0),
        new THREE.Vector3(-100,-100,0)]
    const test_points_inside = [
            new THREE.Vector3(0,0,0),
            new THREE.Vector3(0,1,0),
            new THREE.Vector3(1,0,0),
            new THREE.Vector3(1,1,0)]
    console.log("Outside Points:")
    test_points_outside.forEach(point => {
        inCircle(test_triangle.a.x,test_triangle.a.y,
            test_triangle.b.x,test_triangle.b.y,
            test_triangle.c.x,test_triangle.c.y,
            point.x,point.y) ? console.log("Failed") : console.log("Passed");
    });
    console.log("Inside Points:")
    test_points_inside.forEach(point => {
        inCircle(test_triangle.a.x,test_triangle.a.y,
            test_triangle.b.x,test_triangle.b.y,
            test_triangle.c.x,test_triangle.c.y,
            point.x,point.y) ? console.log("Passed") : console.log("Failed");
    });
}


// dynamic animation loop if needed
function draw(){
    // put any animation code here

    for(let i = 0; i < numPoints; i++) {
        // add each trajectory to it's point
        points[i].x += pointTrajectories[i].x;
        points[i].y += pointTrajectories[i].y;
        // if the point is out of bounds, reverse the trajectory
        if (points[i].x > getWidth()*0.7 || points[i].x < -getWidth() * 0.7) {
            pointTrajectories[i].x *= -1;
        }
        if (points[i].y > getHeight()*0.7 || points[i].y < -getHeight()*0.7) {
            pointTrajectories[i].y *= -1;
        }
    }
    clearScene();
    let delaunayTriangles : Map<Triangle,boolean> = createDelaunayTriangles(points);
    let delaunayMesh = createGradientDelaunayMesh(delaunayTriangles,COLOR1,COLOR2);
    scene.add(delaunayMesh);
    renderer.render(scene, camera);
    delaunayMesh.geometry.dispose();
}


function animate() {
    requestAnimationFrame( animate );
    draw();
}


const testSuite = () => {
    test_inCircle();
    test_inCircleVisual();
}

const resize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.updateProjectionMatrix();
}

export const createScene = (el : HTMLCanvasElement) => {
    renderer = new THREE.WebGLRenderer({ canvas: el, precision: "lowp", powerPreference: "low-power"});
    testSuite();
    clearScene();
    animate();
    resize();
}

export const updateScene = () => {
    points.push(createRandomPoint());
    pointTrajectories.push(createRandomTrajectory());
}

window.addEventListener('resize', resize);

