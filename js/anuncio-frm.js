(function () {

    if (!sessionStorage.getItem("userInSession")) {
        document.location.href = "Registro-login.html";
        return;
    }
    document.querySelector("body").style = "display:block";
    const urlParams = new URLSearchParams(window.location.search);
    const anuncioId = urlParams.get('id');

    if (anuncioId && !isNaN(anuncioId)) {
        document.querySelector("#titulo-pg").innerHTML = "Editar Anuncio"

        fetch(`api/anuncio/${anuncioId}`)
            .then(response => {
                return response.json();
            })
            .then(data => {
                console.log(data)
                const nombre = document.querySelector("#inputSerie");
                const descripcion = document.querySelector("#inputDesc");
                const precio = document.querySelector("#inputPrecio");
                const categoria = document.querySelector("#inputCategoria");
                const celular = document.querySelector("#inputCel");
                const estado = document.querySelector("#inputEstado");
                const anuncioIdControl = document.querySelector("#anuncioId");
                const imageFileIdControl = document.querySelector("#imageFileId");
                const imageElement = document.querySelector("#image");

                nombre.value = data.titulo;
                descripcion.value = data.descripcion;
                precio.value = data.precio;
                categoria.value = data.categoria;
                celular.value = data.telefono_contacto;
                estado.value = data.estado;
                anuncioIdControl.value = data.anuncio_id;
                imageFileIdControl.value = data.img_file_id;
                const imageSrc = data.img_file_id == 0 ? "images/producto_default.png" : "api/anuncio/image/" + data.img_file_id;
                imageElement.src = imageSrc;
            })

    } else {
        document.querySelector("#titulo-pg").innerHTML = "Nuevo Anuncio"
    }

    document.querySelector("#btn-save").addEventListener('click', () => {

        const anuncioId = document.querySelector("#anuncioId").value
        const titulo = document.querySelector("#inputName").value.trim();
        const descripcion = document.querySelector("#inputDesc").value.trim();
        const precio = document.querySelector("#inputPrecio").value.trim();
        const categoria = document.querySelector("#inputCategoria").value.trim();
        const celular = document.querySelector("#inputCel").value;
        const estado = document.querySelector("#inputEstado").value;
        const imageFileId = document.querySelector("#imageFileId").value;


        const validacionNombre = document.querySelector("#validation-name");
        const validacionDescripcion = document.querySelector("#validation-desc");
        const validacionPrecio = document.querySelector("#validation-price");
        const validacionCelular = document.querySelector("#validation-cel");

        const msgError = document.querySelector("#msg-error-regis");

        validacionNombre.style.display = "none"
        validacionDescripcion.style.display = "none"
        validacionPrecio.style.display = "none"
        validacionCelular.style.display = "none"
        msgError.style.display = "none"

        let hasError = false;
        if (titulo == "") {
            hasError = true;
            validacionNombre.style.display = "block";
        }
        if (descripcion == "") {
            hasError = true;
            validacionDescripcion.style.display = "block";
        }
        if (precio == "") {
            hasError = true;
            validacionPrecio.style.display = "block";
        }
        if (celular == "") {
            hasError = true;
            validacionCelular.style.display = "block";
        }
        if (hasError)
            return;

        const usuario = JSON.parse(sessionStorage.getItem("userInSession"));
        const anuncio = {
            usuario_id_anuncio: usuario.usuarioId,
            titulo: titulo,
            descripcion: descripcion,
            precio: precio,
            categoria: categoria,
            telefono_contacto: celular,
            estado: estado,
            anuncio_id: anuncioId,
            img_file_id: imageFileId
        }
        const method = anuncioId == "0" ? "POST" : "PUT";
        fetch('api/anuncio', {
            method: method,
            headers: {
                'Accept': 'application/json', //MimeType
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(anuncio)
        }).then((response) => {
            return response.json();
        }).then((data) => {
            debugger;
            if (!data) {
                msgError.innerHTML = data.message;
                msgError.style.display = "block"
                return;
            }
            document.location.href = "dashboard.html?msg=ok_anuncio_saved";

        });
    })

    document.querySelector("#image-file").addEventListener("change", uploadFile);

})();

function uploadFile(){
    let photo = document.getElementById("image-file").files[0];
    let formData = new FormData();
        
    formData.append("image", photo);
    fetch('api/anuncio/upload', {
        method: "POST", 
        body: formData
    }).then((response) =>{
        return response.json();
    }).then((data) => {
        
       if(!data.isOK){
            alert("No se pudo subir el archivo");
            return;
       }

       //data.message contiene el FileId que se subió
       const fileId = data.message;
       document.querySelector("#imageFileId").value = fileId;
       const image = document.querySelector("#image");
       image.src = "api/anuncio/image/" + fileId;

    });
}
