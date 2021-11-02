function copyToClipboard(element) {
    var $temp = $("<textarea>");
    var brRegex = /<br\s*[\/]?>/gi;
    $("body").append($temp);
    $temp.val($(element).html().replace(brRegex, "\r\n")).select();
    document.execCommand("copy");
    $temp.remove();
}

function imageToBlob(imageURL) {
    const img = new Image;
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    img.crossOrigin = "";
    img.src = imageURL;
    return new Promise(resolve => {
        img.onload = function () {
            c.width = this.naturalWidth;
            c.height = this.naturalHeight;
            ctx.drawImage(this, 0, 0);
            c.toBlob((blob) => {
                // here the image is a blob
                resolve(blob)
            }, "image/png", 0.75);
        };
    })
}

async function copyImage(imageURL){
    const blob = await imageToBlob(imageURL)
    const item = new ClipboardItem({ "image/png": blob });
    navigator.clipboard.write([item]);
}

function darkMode() {
    const element = document.body;
    element.classList.toggle("dark-mode");
}

$(function () {
    $('[data-toggle="popover"]').popover()
})

$(document).ready(function () {

    $('[data-toggle="popover"]').popover({
        placement: 'bottom',
        delay : {
            hide : 5000 // doesn't do anything
        }
    }).on('shown.bs.popover', function () {
        setTimeout(function (a) {
            a.popover('hide');
        }, 1000, $(this));
    });
});

function dodajAlga() {
    var id = document.getElementById('id').value;
    var name = document.getElementById('name').value;
    var alg = document.getElementById('alg').value;
    var gen = document.getElementById('gen').value;
    if (id === '' && name === '' && alg === '' && gen === '') alert('Uzupełnij wszystkie pola');
    else {
        var item = {};
        item.id = document.getElementById('id').value;
        item.name = document.getElementById('name').value;
        item.alg = document.getElementById('alg').value;
        item.gen = document.getElementById('gen').value;
        var lista = JSON.parse(localStorage.getItem('lista'));
        if (lista === null) lista = [];
        lista.push(item);
        localStorage.setItem('lista', JSON.stringify(lista));
    }
}

function wczytajAlga() {
    var lista = JSON.parse(localStorage.getItem('lista'));
    for (i = 0; i < lista.length; i++) {
        document.getElementById(lista[i].id).innerHTML = "**Permutacja " + lista[i].name + ": **" + lista[i].alg + "<br>Generacja: " + lista[i].gen;
    }
}

function wczytajAlgaOLL() {
    var lista = JSON.parse(localStorage.getItem('lista'));
    for (i = 0; i < lista.length; i++) {
        var text = "**" + lista[i].name + ": **" + lista[i].alg + "<br>Generacja: " + lista[i].gen;
        document.getElementById(lista[i].id).innerHTML = text;
    }
}

function usunAlgi() {
    if (confirm("Usunąć własne algi?")) {
        localStorage.removeItem('lista');
        window.location.reload(true);
    }
}

function zmiany(e)
{
    const select = e.target;
    document.getElementById("name").value = select.options[select.selectedIndex].text;
}