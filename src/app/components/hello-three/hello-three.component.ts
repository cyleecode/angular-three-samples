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

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

camera.position.z = 5

function animate() {
    requestAnimationFrame(animate)

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    renderer.render(scene, camera)
}
