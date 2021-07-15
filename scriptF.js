
var firebaseConfig = {
    apiKey: "AIzaSyBJj3BxhM73iIM8i_Y9Jto1ZXo6az-r068",
    authDomain: "sdmegallery.firebaseapp.com",
    projectId: "sdmegallery",
    storageBucket: "sdmegallery.appspot.com",
    messagingSenderId: "176913152626",
    appId: "1:176913152626:web:1e2c57a99d743f59d0a0eb",
    measurementId: "G-BD8FJM2FDB"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// webcam code
let canvas = document.getElementById('canvas');
let snap = document.getElementById("snap");
let video = document.getElementById("video");
let output = document.getElementById("output");
let myToast = document.getElementById("myToast");
let uploadImage = document.getElementById("uploadImage");
const constraints = {
    audio: false,
    video: {
        width: 400, height: 400
    }
}
async function init() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        handlestream(stream);
    } catch (error) {
        console.log(error);
    }
}
function handlestream(stream) {
    window.stream = stream;
    video.srcObject = stream;
}
var context = canvas.getContext('2d');
var button = document.createElement('button');
snap.addEventListener('click', function () {
    context.drawImage(video, 0, 0, 640, 480);
    var image = new Image();
    image.id = 'pic';
    image.src = canvas.toDataURL('image/png');
    console.log(image.src);
    //var button = document.createElement('button');
    /*button.textContent = 'Upload Image';
    button.className = "btn btn-primary";
    document.body.appendChild(button);*/
    uploadImage.addEventListener('click', function () {
        const ref = firebase.storage().ref('images/');
        ref.child(new Date() + '-' + 'base64').putString(image.src, 'data_url')
            .then(function (snapshot) {
                $("#myToast").toast({ delay: 4000 });
                $("#myToast").toast('show');
            })
            .then(
                ref.child().listAll().then(function (result) {
                    result.items.forEach(function (imageRef) {
                        console.log("Image reference: " + imageRef.toString());
                    });
                })
            )
    })
});
var pics = [];
document.getElementById('getPics').onclick = function () {
    var storage = firebase.storage();
    var storageRef = storage.ref();
    var i = 0;
    storageRef.child('images/').listAll().then(function (result) {
        result.items.forEach(function (imageRef) {
            //console.log("Image reference: " + imageRef.toString());
            i++;
            displayImage(i, imageRef);
        });
    });
    console.log("pics", pics);
}
function displayImage(row, images) {
    output.innerHTML = "";
    images.getDownloadURL().then(function (url) {
        output.innerHTML += `
            <div class="col-3">
                <div class="card">
                    <img src="${url}" class="card-img-top">
                </div>
            </div>
        `
        console.log(url);
    });
}
init();