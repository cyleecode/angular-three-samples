import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import * as THREE from 'three'
import * as CANNON from 'cannon-es'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'

@Component({
    selector: 'app-hello-three',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './hello-three.component.html',
    styleUrls: ['./hello-three.component.scss']
})
export class HelloThreeComponent implements AfterViewInit {
    @ViewChild('helloThree') square_scene!: ElementRef<HTMLElement>

    constructor() {
        init()
        animate()
        window.addEventListener('resize', onWindowResize)
    }

    ngAfterViewInit(): void {
        this.square_scene.nativeElement.appendChild(renderer.domElement)
    }
}

let ground_mesh: THREE.Mesh
let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, cube: any

//Setup Cannon
//world phys
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.81, 0)
})
const timeStep = 1 / 60

//cannon material
const groundMat = new CANNON.Material('ground')
const boxMat = new CANNON.Material('box')
const contactMaterial = new CANNON.ContactMaterial(groundMat, boxMat, {
    restitution: 0.4
})
//ground phys body
const groundBody = new CANNON.Body({
    // shape: new CANNON.Plane(),
    shape: new CANNON.Box(new CANNON.Vec3(5, 5, 0)),
    type: CANNON.Body.STATIC,
    material: groundMat
})
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
//box phys body
const boxBody = new CANNON.Body({
    mass: 2,
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    position: new CANNON.Vec3(0, 15, 0),
    material: boxMat
})
//some phys behavior
boxBody.linearDamping = 0.02
boxBody.angularVelocity.set(3, 0, 0)

world.addBody(boxBody)
world.addBody(groundBody)
world.addContactMaterial(contactMaterial)

function init() {
    scene = new THREE.Scene()
    // Perspective projection (P)
    // view from camera
    // ->
    // Far clip plane -> normal ratio
    // Near clip plane -> smaller ratio

    // Orthographic projection (O)
    // view from camera
    // ->
    // Far clip plane &
    // Near clip plane -> same ratio
    camera = new THREE.PerspectiveCamera(
        75, //75 degree
        window.innerWidth / window.innerHeight, //display ratio
        0.1, //near plane
        1000 //far plane
    )

    /* ! Renderer */
    renderer = new THREE.WebGLRenderer({ antialias: true })
    //set size to whole window
    renderer.setSize(window.innerWidth, window.innerHeight)

    //Orbital control
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.update()
    //Geo helper
    const axes_helper = new THREE.AxesHelper(2)
    scene.add(axes_helper)
    //3D Object
    //box
    const geometry = new THREE.BoxGeometry(2, 2, 2)
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const texture = new THREE.TextureLoader().load('textures/asdf.gif')
    const material = new THREE.MeshBasicMaterial({ map: texture })
    cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    //wall
    const groundGeo = new THREE.PlaneGeometry(10, 10)
    const groundMat = new THREE.MeshBasicMaterial({
        color: '#ffffff',
        side: THREE.DoubleSide,
        wireframe: true
    })
    ground_mesh = new THREE.Mesh(groundGeo, groundMat)
    scene.add(ground_mesh)

    //set camera range
    camera.position.z = 15
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
    //Add world phys
    world.step(timeStep)
    if (ground_mesh) {
        //Animate only when mesh loaded
        ground_mesh.position.copy(groundBody.position as any)
        ground_mesh.quaternion.copy(groundBody.quaternion as any)
        cube.position.copy(boxBody.position as any)
        cube.quaternion.copy(boxBody.quaternion as any)
    }

    requestAnimationFrame(animate)
    cube.rotation.x += 0.01

    renderer.render(scene, camera)
}

function exportGLTF() {
    const exporter = new GLTFExporter()

    // Parse the input and generate the glTF output
    exporter.parse(
        scene,
        // called when the gltf has been generated
        function (gltf) {
            let dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(gltf))
            let dlAnchorElem = document.getElementById('downloadAnchorElem')
            if (dlAnchorElem) {
                dlAnchorElem.setAttribute('href', dataStr)
                dlAnchorElem.setAttribute('download', 'mygltf.json')
                dlAnchorElem.click()
            }
        },
        // called when there is an error in the generation
        function (error) {
            console.log(error)
            console.log('An error happened')
        }
    )
}
