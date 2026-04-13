function copyToClipboard(element) {
    var $temp = $("<textarea>");
    var brRegex = /<br\s*[\/]?>/gi;
    $("body").append($temp);
    $temp.val($(element).html().replace(brRegex, "\r\n")).select();
    document.execCommand("copy");
    $temp.remove();
}

function imageToBlob(imageURL, rotation = 0) {
    const img = new Image();
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    img.crossOrigin = "Anonymous";
    img.src = imageURL;
    return new Promise(resolve => {
        img.onload = function () {
            if (rotation === 90 || rotation === 270) {
                c.width = this.naturalHeight;
                c.height = this.naturalWidth;
            } else {
                c.width = this.naturalWidth;
                c.height = this.naturalHeight;
            }
            if (rotation > 0) {
                ctx.translate(c.width / 2, c.height / 2);
                ctx.rotate(rotation * Math.PI / 180);
                // drawImage offset by half its own original sizing:
                ctx.drawImage(this, -this.naturalWidth / 2, -this.naturalHeight / 2);
            } else {
                ctx.drawImage(this, 0, 0);
            }
            c.toBlob((blob) => {
                resolve(blob);
            }, "image/png", 1.0); // using 1.0 quality instead of 0.75 for crispness
        };
    });
}

function rotateImage(btn) {
    const photocard = $(btn).closest('.photocard');
    const img = photocard.find('img').first();
    if (!img.length) return;
    
    let currentRotation = parseInt(img.attr('data-rotation') || '0');
    currentRotation = (currentRotation + 90) % 360;
    img.attr('data-rotation', currentRotation);
    img.css({
        'transform': `rotate(${currentRotation}deg)`,
        'transition': 'transform 0.3s ease'
    });
}

async function copyImage(imageURL) {
    // Attempt to locate the rotation applied locally on the element if we can derive it
    const imgEl = document.querySelector(`img[src$="${imageURL}"]`);
    let rotation = 0;
    if (imgEl && window.lastClickedCopyBtn) {
        // Find the absolute Photocard that was interacted with to grab proper rotation
        const photocard = $(window.lastClickedCopyBtn).closest('.photocard');
        const exactImg = photocard.find('img').first();
        if (exactImg.length) {
            rotation = parseInt(exactImg.attr('data-rotation') || '0');
        }
    } else if (imgEl) {
        rotation = parseInt(imgEl.getAttribute('data-rotation') || '0');
    }

    const blob = await imageToBlob(imageURL, rotation);
    const item = new ClipboardItem({ "image/png": blob });
    navigator.clipboard.write([item]).catch(e => console.error("Clipboard err:", e));
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

    // Auto-inject Obróć buttons
    $('.photocard').each(function() {
        const copyImgBtn = $(this).find("button[onclick^='copyImage']");
        if (copyImgBtn.length > 0) {
            // Keep track of which btn was clicked so copyImage can extract its specific photocard rotation
            copyImgBtn.on('mousedown', function() {
                window.lastClickedCopyBtn = this;
            });

            // Insert rotate button immediately before it
            const rotateBtn = $('<button class="btn-info rounded mr-1" onclick="rotateImage(this)">Obróć ⟳</button>');
            copyImgBtn.before(rotateBtn);
            // Adds small trailing spacing
            copyImgBtn.before(' ');
        }
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
    if (lista === null) alert("Nie podano algów");
    else {
        for (i = 0; i < lista.length; i++) {
            document.getElementById(lista[i].id).innerHTML = "**Permutacja " + lista[i].name + ": **" + lista[i].alg + "<br>Generacja: " + lista[i].gen;
        }
    }
}

function wczytajAlgaOLL() {
    var lista = JSON.parse(localStorage.getItem('lista'));
    if (lista === null) alert("Nie podano algów");
    else {
        for (i = 0; i < lista.length; i++) {
            var text = "**" + lista[i].name + ": **" + lista[i].alg + "<br>Generacja: " + lista[i].gen;
            document.getElementById(lista[i].id).innerHTML = text;
        }
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