import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import * as THREE from 'three'
@Component({
    selector: 'app-hello-three',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './hello-three.component.html',
    styleUrls: ['./hello-three.component.scss']
})
export class HelloThreeComponent implements AfterViewInit {
    @ViewChild('helloThree') square_scene!: ElementRef<HTMLElement>

    constructor() {}

    ngAfterViewInit(): void {
        this.square_scene.nativeElement.appendChild(renderer.domElement)
        animate()
    }
}

//setup scene camera and renderer
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

//setup 3D object
const geometry = new THREE.BoxGeometry(3, 3, 3)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
const cubeArray: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>[] = []
for (let i = 0; i < 10; i++) {
    cubeArray.push(cube.clone())
}

//add and configure object
scene.add(...cubeArray)
let start_index = -15
for (let c of cubeArray) {
    c.position.set(start_index, start_index, 0)
    start_index += 4
}

//setup view
camera.position.x = 10
camera.position.z = 20

//target animation
function animate() {
    requestAnimationFrame(animate)
    for (let c of cubeArray) {
        c.rotation.x += 0.02
        c.rotation.y += 0.02
    }
    renderer.render(scene, camera)
}
