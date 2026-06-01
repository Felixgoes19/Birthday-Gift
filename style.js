// --- 1. Szene, Kamera, Renderer einrichten ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 40;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- NEU: OrbitControls aktivieren ---
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Sorgt für eine extrem weiche, gleitende Bewegung
controls.dampingFactor = 0.05; // Wie stark das Nachgleiten ist
controls.enablePan = false;    // Verhindert das seitliche Verschieben, hält das Herz im Zentrum

// --- 2. Partikel-Geometrie erstellen ---
const particleCount = 10000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const color = new THREE.Color(0xff3860);

for (let i = 0; i < particleCount; i++) {
    const t = Math.random() * Math.PI * 2;
    let x = 16 * Math.pow(Math.sin(t), 3);
    let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

    const fuzz = 2.0;
    const dx = (Math.random() - 0.5) * fuzz;
    const dy = (Math.random() - 0.5) * fuzz;
    const dz = (Math.random() - 0.5) * 8;

    positions[i * 3] = x + dx;
    positions[i * 3 + 1] = y + dy;
    positions[i * 3 + 2] = dz;

    const mixedColor = color.clone();
    mixedColor.offsetHSL(0, 0, (Math.random() - 0.5) * 0.2);
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

// --- 3. Material für die Partikel ---
const material = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const particleSystem = new THREE.Points(geometry, material);
scene.add(particleSystem);

// Responsive Design (Fenstergröße)
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 4. Animations-Schleife ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

// Pulsieren (Größe verändert sich leicht im Takt) - bleibt erhalten!
    const scale = 1 + Math.sin(elapsedTime * 3) * 0.05;
    particleSystem.scale.set(scale, scale, scale);

// WICHTIG: Berechnet die neue Kameraposition für das weiche Gleiten der Maus
    controls.update();

    renderer.render(scene, camera);
}

animate();