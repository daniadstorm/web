/* import './three';
import './trackballcontrols';
import './colladaloader'; */

var collada, control, camara, escena, render, width, height, sofa, plane, box, luz, select;
width = 900;
height = 500;

collada = new THREE.ColladaLoader();
var controlPanel;
collada.load("../model.dae", function (object) {
    sofa = object.scene;
    sofa.scale.set(1, 1, 1);
    sofa.castShadow = true;
    sofa.receiveShadow = true;
    sofa.name = "ObjetoCollada";
    //sofa.children[0].children[2].visible=false;
    crearHijos(sofa.children[0].children);
    box = new THREE.Box3().setFromObject(sofa);
    sofa.position.set(-(box.getCenter().x), -(box.getCenter().y), -(box.getCenter().z)); //-(box.getCenter().z)

    start();
    animate();
});

function crearHijos(arrHijos) {
    var divButtons = document.getElementById('hijos');
    arrHijos.forEach(function (element) {
        if (element.type == "Group" || element.type == "Mesh") {
            divButtons.innerHTML += '<button class="btn-control w-100" onclick="seleccionado(\'' + element.name + '\');">' + element.name + '( ' + element.id + ' )' + '</button>';
        }
    });
}

function cambiarColor() {
    xcolor = parseInt(document.getElementById('picker').value.replace("#", "0x"), 16);
    var threecolor = new THREE.Color(xcolor);
    escena.children[2].children[0].children.forEach(function (element) {
        console.log("Nombreeeee:" + element.name + " | Seleccionado:" + select);
        if (element.name == select) {
            if (element.type == "Mesh") {
                element.material = new THREE.MeshBasicMaterial({ color: threecolor, wireframe: false });
            } else if (element.type == "Group") {
                /* console.log("group");
                element.material = new THREE.MeshPhongMaterial({
                    color: threecolor,
                    map: new THREE.TextureLoader().load('../img/suelo.jpg'),
                    normalMap: new THREE.TextureLoader().load('../img/suelo.jpg'),
                }); */
            }
            //sofa.children[0].children[4].material = new THREE.MeshBasicMaterial( { color: xcolor, wireframe: false } );
            //element.visible=!element.visible;
            actualizarRotacion();
        }
    });
}

function seleccionado(xselect) {
    select = xselect;
    console.log("Seleccionado:" + select);
    /* escena.children[2].children[0].children.forEach(function(element){
        if(element.name===seleccionado){
            console.log(element.name);
            element.visible=!element.visible;
            //element.visible=!element.visible;
            //actualizarRotacion();
        }
    }); */
}

function start() {
    var element = document.getElementById('render');
    camara = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
    camara.position.set(0, 0, 100);
    control = new THREE.TrackballControls(camara, element); 
    control.addEventListener("change", renderizar);
    escena = new THREE.Scene();
    escena.name = "EscenaPadre";

    var newCamera = new THREE.OrthographicCamera(-200, 200, 200, -200, 0.1, 100);
    var cameraHelper = new THREE.CameraHelper(newCamera);
    escena.add(cameraHelper);

    /* luz = new THREE.SpotLight( 0xffffff,1 );
    luz.position.set(300,500,0);
    escena.add(luz); */

    escena.add(sofa);
    luz = new THREE.AmbientLight(0xffffff, 1);
    escena.add(luz);
    render = new THREE.WebGLRenderer();
    render.setClearColor(0xffffff);
    //render.setClearColor(0x000000);
    render.shadowMap.enabled = true;
    //render.shadowMap.type = THREE.PCFSoftShadowMap;
    render.shadowMap.type = THREE.BasicShadowMap;
    render.setSize(width, height);


    var suelo = new THREE.Mesh(
        new THREE.PlaneGeometry(100,100,100,100),
        new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
    );
    suelo.position.set(0,-box.getCenter().y,0);
    suelo.rotation.x -= Math.PI /2;
    escena.add(suelo);



    //render.setClearColor(0x000000);
    document.getElementById('render').appendChild(render.domElement);
    renderizar();
    //render.render(escena, camara);
}

function suelo() {
    const imgPath = '../img/suelo.jpg';

    let texture = THREE.ImageUtils.loadTexture(imgPath);

    let planeMaterial = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide });
    plane = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), planeMaterial);
    const convertRadiansToDegrees = (Math.PI / 180);

    plane.rotation.x = -45 * convertRadiansToDegrees;
    plane.rotation.y = 0;
    plane.normalize = "plane";
    escena.add(plane);
}


window.onload = () => {
    document.getElementById('arriba').addEventListener('click', () => {
        sofa.rotation.x -= 0.15;
        actualizarRotacion();
    });
    document.getElementById('abajo').addEventListener('click', () => {
        sofa.rotation.x += 0.15;
        actualizarRotacion();
    });
    document.getElementById('izquierda').addEventListener('click', () => {
        sofa.rotation.z += 0.15;
        actualizarRotacion();
    });
    document.getElementById('derecha').addEventListener('click', () => {
        sofa.rotation.z -= 0.15;
        actualizarRotacion();
    });
    document.getElementById('visible').addEventListener('click', (e) => {
        sofa.visible = !sofa.visible;
        if (sofa.visible) {
            document.getElementById('visible').innerText = "Ocultar";
        } else {
            document.getElementById('visible').innerText = "Ver";
        }
        renderizar();
    });
    document.getElementById('eliminar').addEventListener('click', (e) => {
        escena.remove(sofa)
        renderizar();
    });
    document.getElementById('btnJson').addEventListener('click', (e) => {
        actualizarRotacion();
    });
    document.getElementById('btnZoom').addEventListener('click', (e) => {
        control.noZoom = !control.noZoom;
        if (control.noZoom) {
            document.getElementById('btnZoom').innerHTML = "Activar Zoom";
        } else {
            document.getElementById('btnZoom').innerHTML = "Desactivar Zoom";
        }
    });
    document.getElementById('btnPan').addEventListener('click', (e) => {
        control.noPan = !control.noPan;
        if (control.noPan) {
            document.getElementById('btnPan').innerHTML = "Activar Pan";
        } else {
            document.getElementById('btnPan').innerHTML = "Desactivar Pan";
        }
    });
    document.getElementById('btnResetControl').addEventListener('click', (e) => {
        control.reset();
        sofa.rotation.x = -1.5707963267948963;
        sofa.rotation.y = 0;
        sofa.rotation.z = 0;
    });
    document.getElementById('btnMaxDistance').addEventListener('click', (e) => {
        let valor = document.getElementById('txtMaxDistance').value;
        control.maxDistance = valor;
        document.getElementById('btnMaxDistance').innerHTML = "Distancia maxima:" + control.maxDistance;
    });
    document.getElementById('btnLoadSofa').addEventListener('click', (e) => {
        escena.remove(sofa);
        collada.load("../sofa.dae", function (object) {
            sofa = object.scene;
            sofa.scale.set(1, 1, 1);
            sofa.position.set(0, -30, 0);
            escena.add(sofa);
            //start();
            animate();
        });
    });
}

function animate() {
    requestAnimationFrame(animate);
    control.update();
}

function renderizar() {
    //console.log(sofa.rotation);
    render.render(escena, camara);
}

function actualizarRotacion() {
    //document.getElementById('resultJSON').innerText=JSON.stringify(sofa.rotation);
    document.getElementById('resultJSON').innerText = JSON.stringify(escena.objects);
    renderizar();
}