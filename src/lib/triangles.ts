import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x724e2c );
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );

// set the camera position
camera.position.set(0,0,100);
camera.lookAt(0,0,0);

//fit the rendered scene inside the viewport element

let renderer : THREE.WebGLRenderer;

function createRandomPoints(n : number) {
    const points : THREE.Vector3[] = [];
    for (let i = 0; i < n; i++) {
        points.push(createRandomPoint());
    }
    return points;
}
function createRandomPoint(){
    return new THREE.Vector3(Math.random() * 50 - 25, Math.random() * 50 - 25, 0);
}

function createRandomTrajectories(n : number) {
    const trajectories : THREE.Vector3[] = [];
    for (let i = 0; i < n; i++) {
        // trajectories between -1 and 1
        trajectories.push(new THREE.Vector3(Math.random() * 0.25 - 0.125, Math.random() * 0.25 - 0.125, 0));
    }
    return trajectories;
}


// helper function to sort the verticies of a triangle in counterclockwise order
function sortVerticies(triangle : THREE.Triangle) {
    let verticies = [triangle.a,triangle.b,triangle.c];
    let centroid = new THREE.Vector3((verticies[0].x + verticies[1].x + verticies[2].x)/3,(verticies[0].y + verticies[1].y + verticies[2].y)/3,0);
    verticies.sort((a,b) => {
        let a1 = Math.atan2(a.x-centroid.x,a.y-centroid.y);
        let b1 = Math.atan2(b.x-centroid.x,b.y-centroid.y);
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



function createDelaunayTriangles(points : THREE.Vector3[]) : Map<THREE.Triangle,boolean> {
    
    // create a map of triangles
    let triangles : Map<THREE.Triangle,boolean> = new Map();
    // create supertriangle
    let st1 = new THREE.Vector3(0,1000,0);
    let st2 = new THREE.Vector3(-1000,-1000,0);
    let st3 = new THREE.Vector3(1000,-1000,0);
    let stVertices = [st1,st2,st3];
    let supertriangle = new THREE.Triangle(st1,st2,st3);
    triangles.set(supertriangle,true);

    const resolveEdges = (p1 : THREE.Vector3,p2 : THREE.Vector3, edgebuffer : Map<THREE.Vector3,Map<THREE.Vector3,boolean>>) => {
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
            edgebuffer.get(p1).set(p2,true);
        }else if(edgebuffer.has(p2)){ // p2 exists in edgebuffer, but p1 does not
            edgebuffer.set(p1,new Map().set(p2,true));
            edgebuffer.get(p2).set(p1,true);
        }else{
            edgebuffer.set(p1,new Map().set(p2,true));
            edgebuffer.set(p2,new Map().set(p1,true));
        }
    }
    points.forEach(point => {
        // add points one at a time
        let edgebuffer : Map<THREE.Vector3,Map<THREE.Vector3,boolean>> = new Map();
        triangles.forEach((_,triangle) => { //why javascript... why is it value, key instead of key, value
            if (inCircle(triangle.a.x,triangle.a.y,
                triangle.b.x,triangle.b.y,
                triangle.c.x,triangle.c.y,
                point.x,point.y)) { 
                // add edges to edgebuffer
                resolveEdges(triangle.a,triangle.b,edgebuffer);
                resolveEdges(triangle.b,triangle.c,edgebuffer);
                resolveEdges(triangle.c,triangle.a,edgebuffer);
                triangles.delete(triangle);
            }
        });

        
        // add new triangles to triangulation
        edgebuffer.forEach((pts,p1) => {
            pts.forEach((_,p2) => {
                if(edgebuffer.get(p1)!.get(p2)){
                    triangles.set(sortVerticies(new THREE.Triangle(p1,p2,point)),true);
                    // should prevent drawing every edge twice
                    edgebuffer.get(p1)!.set(p2,false);
                    edgebuffer.get(p2)!.set(p1,false);
                }
            });
        });
    });

    
    triangles.forEach((_,triangle) => {
        // remove triangles with supertriangle vertices
        // remove supertriangle
        if(triangle === supertriangle){
            triangles.delete(triangle);
        }
    });
    return triangles;
}


function clearScene() {
    while (scene.children.length > 0) { 
        scene.remove(scene.children[0]); 
    }
}








// CONSTANTS FOR RUNTIME

const numPoints = 100;

// instantiate the point and trajectory arrays, add the line to the scene
const points = createRandomPoints(numPoints);
const pointTrajectories = createRandomTrajectories(numPoints);

let delaunayTriangles : Map<THREE.Triangle,boolean> = createDelaunayTriangles(points);

const lineMaterial = new THREE.LineBasicMaterial( { color: 0xffffff} );
const pointMaterialOutOfCircle = new THREE.PointsMaterial( { color: 0xff0000, size: 1 } );
const pointMaterialInCircle = new THREE.PointsMaterial( { color: 0x00ff00, size: 1 } );
const line = new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),lineMaterial);
scene.add(line);
// render the scene once

// TEST CODE
function test_inCircleVisual(){
    clearScene();
    let test_triangle = new THREE.Triangle(new THREE.Vector3(10,0,0),new THREE.Vector3(-20,0,0),new THREE.Vector3(0,13,0));
    sortVerticies(test_triangle);
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([test_triangle.a,test_triangle.b,test_triangle.c,test_triangle.a]),lineMaterial));
    const innerPoints : THREE.Vector3[] = [];
    const outerPoints : THREE.Vector3[] = [];
    points.forEach(point => {
        if (inCircle(test_triangle.a.x,test_triangle.a.y,
            test_triangle.b.x,test_triangle.b.y,
            test_triangle.c.x,test_triangle.c.y,
            point.x,point.y)) { 
            innerPoints.push(point);
        }else{
            outerPoints.push(point);
        }
    });
    scene.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(innerPoints),pointMaterialInCircle));
    scene.add(new THREE.Points(new THREE.BufferGeometry().setFromPoints(outerPoints),pointMaterialOutOfCircle));

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

function testRandomThings(){
    let set1 = new Set([1,2,3,4,5]);
    let set2 = new Set([1,2,4,3,5]);
    console.log("set equality", set1 == set2);
}


// dynamic animation loop if needed
function animate(){
    requestAnimationFrame(animate);
    // put any animation code here

    for(let i = 0; i < numPoints; i++) {
        // add each trajectory to it's point
        points[i].add(pointTrajectories[i]);

        // if the point is out of bounds, reverse the trajectory
        if (points[i].x > 100 || points[i].x < -100) {
            pointTrajectories[i].x *= -1;
        }
        if (points[i].y > 50 || points[i].y < -50) {
            pointTrajectories[i].y *= -1;
        }
    }
    clearScene();
    delaunayTriangles = createDelaunayTriangles(points);
    delaunayTriangles.forEach((_,triangle) => {
        const triangleGeometry : THREE.Vector3[] = [];

        if(triangle.a != null){
            triangleGeometry.push(triangle.a);
        }
        if(triangle.b != null){
            triangleGeometry.push(triangle.b);
        }
        if(triangle.c != null){
            triangleGeometry.push(triangle.c);
        }
        if(triangle.a != null && triangle.b != null && triangle.c != null){
            triangleGeometry.push(triangle.a);
        }
        scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(triangleGeometry),lineMaterial));
    });
    renderer.render(scene, camera);
}

//test_inCircleVisual();
test_inCircle();
const testSuite = () => {
    test_inCircle();
    test_inCircleVisual();
    testRandomThings();
}

const resize = () => {
    // Janky -15 term, works for now though
    renderer.setSize(window.innerWidth - 15, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

export const createScene = (el : HTMLCanvasElement) => {
    renderer = new THREE.WebGLRenderer({ antialias: true, canvas: el });
    resize();
    testSuite();
    animate();
}

export const updateScene = () => {
    points.push(createRandomPoint());
    animate();
}

window.addEventListener('resize', resize);

