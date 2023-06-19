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
    cameraX = 0
    cameraY = 0
    cameraZ = 0
    constructor() {}

    ngAfterViewInit(): void {
        this.square_scene.nativeElement.appendChild(renderer.domElement)
        animate()

        // camera.position.set(0, 0, 100)
        // setInterval(() => {
        //     camera.lookAt(this.cameraX, this.cameraY, this.cameraZ)
        //     this.cameraX -= 0.1
        //     this.cameraY += 0.2
        // })
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
// Line 3D
const line_material = new THREE.LineBasicMaterial({ color: 0x0000ff })
const points = []
points.push(new THREE.Vector3(-10, 0, 0))
points.push(new THREE.Vector3(-9, 3, 0))
points.push(new THREE.Vector3(20, 10, 0))
points.push(new THREE.Vector3(10, 0, 0))
points.push(new THREE.Vector3(5, 13, 7))
points.push(new THREE.Vector3(10, 16, 2))
points.push(new THREE.Vector3(20, -10, -30))

const line_geometry = new THREE.BufferGeometry().setFromPoints(points)
const line = new THREE.Line(line_geometry, line_material)

//add and configure object
scene.add(...cubeArray, line)
let start_index = -15
for (let c of cubeArray) {
    c.position.set(start_index, start_index, 2)
    start_index += 4
}

//setup view
camera.position.x = 10
camera.position.z = 20

//target animation
function animate() {
    requestAnimationFrame(animate)
    // for (let c of cubeArray) {
    //     c.rotation.x += 0.02
    //     c.rotation.y += 0.02
    // }
    renderer.render(scene, camera)
}
