import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

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
