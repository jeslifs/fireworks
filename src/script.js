import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import Vertex from './shaders/firework/vertex.glsl'
import Fragment from './shaders/firework/fragment.glsl'


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
}
sizes.resolution = new THREE.Vector2(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)


/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader()

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


/**
 * Firework
 */
const textures = [
    textureLoader.load('/textures/1.png'),
    textureLoader.load('/textures/2.png'),
    textureLoader.load('/textures/3.png'),
    textureLoader.load('/textures/4.png'),
    textureLoader.load('/textures/5.png'),
    textureLoader.load('/textures/6.png'),
    textureLoader.load('/textures/7.png'),
    textureLoader.load('/textures/8.png'),
    textureLoader.load('/textures/9.png'),
    textureLoader.load('/textures/10.png'),
    textureLoader.load('/textures/11.png'),
    textureLoader.load('/textures/12.png'),
    textureLoader.load('/textures/13.png'),
]

const createFirework = (count, position, size, texture, radius, color) => 
{
    // geometry
    const positionsArray = new Float32Array(count * 3)
    const sizesArray = new Float32Array(count)

    for(let i = 0; i < count; i++)
    {
        const i3 = i * 3

        const spherical = new THREE.Spherical(
            radius * (0.75 + Math.random() * 0.25),
            Math.random() * Math.PI,
            Math.random() * Math.PI * 2
        )

        const position = new THREE.Vector3()
        position.setFromSpherical(spherical)

        positionsArray[i3] = position.x
        positionsArray[i3 + 1] = position.y
        positionsArray[i3 + 2] = position.z

        sizesArray[i] = Math.random()
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positionsArray, 3))
    geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizesArray, 1))
    
    // material
    texture.flipY = false
    const material = new THREE.ShaderMaterial({
        vertexShader: Vertex,
        fragmentShader: Fragment,
        uniforms:
        {
            uSize: new THREE.Uniform(size),
            uResolution: new THREE.Uniform(sizes.resolution),
            uTexture: new THREE.Uniform(texture),
            uColor: new THREE.Uniform(color),
            uProgress: new THREE.Uniform(0)
        },
        depthWrite: false,
        transparent: true,
        blending: THREE.AdditiveBlending
    })

    // points
    const firework = new THREE.Points(geometry, material)
    firework.position.copy(position)
    scene.add(firework)
}

createFirework(
    100,
    new THREE.Vector3(),
    0.5,
    textures[10],
    1,
    new THREE.Color('#8affff')
)


window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    sizes.pixelRatio = Math.min(window.pixelRatio, 2)
    sizes.resolution.set(sizes.width * sizes.pixelRatio, sizes.height * sizes.pixelRatio)
    

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(sizes.pixelRatio)
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 5, 4)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
// controls.target.y = 3.5
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(sizes.pixelRatio)

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () =>
{
    // ElapsedTime
    const elapsedTime = clock.getElapsedTime()
    
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()