// --- 1. Szene, Kamera und Standard-Renderer ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 40;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- 2. CSS3DRenderer (Richtig eingestellt für Vollbild-Maussteuerung) ---
const labelRenderer = new THREE.CSS3DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
// WICHTIG: Kein pointer-events: none mehr! Der Layer fängt jetzt alle Mausbewegungen ab.
document.body.appendChild(labelRenderer.domElement);

// --- 3. OrbitControls an den HTML-Layer binden ---
const controls = new THREE.OrbitControls(camera, labelRenderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enablePan = false;

// --- 4. Partikel-Geometrie (Das Herz) ---
const particleCount = 12000;
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const color = new THREE.Color(0xff3860);

for (let i = 0; i < particleCount; i++) {
    const t = Math.random() * Math.PI * 2;
    let x = 16 * Math.pow(Math.sin(t), 3);
    let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

    y += 2;

    const fuzz = 2.5;
    const dx = (Math.random() - 0.5) * fuzz;
    const dy = (Math.random() - 0.5) * fuzz;
    const dz = (Math.random() - 0.5) * 10;

    positions[i * 3] = x + dx;
    positions[i * 3 + 1] = y + dy;
    positions[i * 3 + 2] = dz;

    const mixedColor = color.clone();
    mixedColor.offsetHSL(0, 0, (Math.random() - 0.5) * 0.15);
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

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


// --- 5. ECHTES 3D-OBJEKT FÜR DIE BOX ---

// --- 5. ECHTES 3D-OBJEKT FÜR DIE BOX ---

const frageDiv = document.createElement('div');
frageDiv.className = 'frage-box';
// Verhindert, dass das Ziehen AN der Box die Kamera dreht
frageDiv.style.pointerEvents = 'auto';
frageDiv.addEventListener('pointerdown', (e) => e.stopPropagation());

// 1. Nur das reine HTML einfügen (ohne <script> Tag!)
frageDiv.innerHTML = `
    <h3>Alles gute zum Geburtstag!</h3>
    <div class="button-container">
        <audio id="meinSound1" src="Geschenk.mp3"></audio>
        
        <button id="audioKnopf" class="antwort-btn">Ton ab</button>
    </div>
`;

// 2. Jetzt greifen wir uns den Button und das Audio-Element AUS diesem frageDiv
const audioBtn = frageDiv.querySelector('#audioKnopf');
const audioEl = frageDiv.querySelector('#meinSound1');

// 3. Wir fügen die Klick-Logik direkt per EventListener hinzu
audioBtn.addEventListener('click', () => {
    if (audioEl.paused) {
        audioEl.play();
        audioBtn.innerText = "Ton ab";
    } else {
        audioEl.pause();
        audioBtn.innerText = "Ton ab";
    }
});

// WICHTIG: CSS3DObject statt CSS3DSprite! 
const frageObjekt = new THREE.CSS3DObject(frageDiv);
frageObjekt.scale.set(0.06, 0.06, 0.06);
frageObjekt.position.set(0, 2, 0);

// Box an das Herz heften
particleSystem.add(frageObjekt);


// --- Fenstergröße anpassen ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

// --- 6. Animations-Schleife ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Pulsiert beides synchron
    const scale = 1 + Math.sin(elapsedTime * 2.5) * 0.04;
    particleSystem.scale.set(scale, scale, scale);

    // Herz (und die Box im Inneren!) drehen sich langsam
    particleSystem.rotation.y = elapsedTime * 0.15;

    controls.update();

    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
}

animate();