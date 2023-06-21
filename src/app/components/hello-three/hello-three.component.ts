import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import * as THREE from 'three'

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

let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, cube: any

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

    //3D Object
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    // const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const texture = new THREE.TextureLoader().load('textures/asdf.gif')
    const material = new THREE.MeshBasicMaterial({ map: texture })
    cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    camera.position.z = 3
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

function animate() {
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
