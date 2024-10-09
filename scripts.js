// Manejo del inicio de sesión
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el comportamiento por defecto de enviar el formulario
    const usuario = document.getElementById('usuario').value;
    const contraseña = document.getElementById('contraseña').value;

    // Comparar valores de usuario y contraseña
    if (usuario === 'admin' && contraseña === 'password') {
        document.getElementById('login-container').style.display = 'none'; // Oculta el contenedor de inicio de sesión
        document.getElementById('recetario-container').style.display = 'block'; // Muestra el contenedor del recetario
        cargarRecetas(); // Cargar recetas al iniciar sesión
    } else {
        document.getElementById('error').style.display = 'block'; // Muestra el mensaje de error
    }
});

// Mostrar el formulario de agregar receta
document.getElementById('agregar-receta-btn').addEventListener('click', function() {
    document.getElementById('formulario-agregar-receta').style.display = 'block'; // Muestra el formulario
    document.getElementById('lista-recetas').style.display = 'none'; // Oculta la lista de recetas
});

// Mostrar la lista de recetas
document.getElementById('lista-recetas-btn').addEventListener('click', function() {
    document.getElementById('lista-recetas').style.display = 'block'; // Muestra la lista de recetas
    document.getElementById('formulario-agregar-receta').style.display = 'none'; // Oculta el formulario
});

// Función para volver a la página anterior
document.getElementById('atras-agregar-btn').addEventListener('click', function() {
    document.getElementById('formulario-agregar-receta').style.display = 'none'; // Oculta el formulario
    document.getElementById('lista-recetas').style.display = 'none'; // Asegúrate de ocultar también la lista de recetas
});

document.getElementById('atras-lista-btn').addEventListener('click', function() {
    document.getElementById('lista-recetas').style.display = 'none'; // Oculta la lista de recetas
    document.getElementById('formulario-agregar-receta').style.display = 'none'; // Asegúrate de ocultar también el formulario
});

// Cargar recetas desde el Local Storage
function cargarRecetas() {
    const recetasGuardadas = JSON.parse(localStorage.getItem('recetas')) || [];
    const recetaLista = document.getElementById('receta-lista');
    recetaLista.innerHTML = ''; // Limpiar la lista de recetas

    recetasGuardadas.forEach(receta => {
        const nuevaReceta = document.createElement('div');
        nuevaReceta.innerHTML = `
            <h3>${receta.nombre}</h3>
            <img src="${receta.imagen}" alt="${receta.nombre}" style="max-width: 200px; display: block; margin: 10px 0;">
            <p>${receta.procedimiento}</p>
            <p>Porciones: <input type="number" min="1" value="${receta.porciones}" class="porciones-input" data-nombre="${receta.nombre}"></p>
            <p class="ingredientes" data-ingredientes='${JSON.stringify(receta.ingredientes)}'>Ingredientes: ${receta.ingredientes.map(ingrediente => `${ingrediente.cantidad} de ${ingrediente.nombre}`).join(', ')}</p>
        `;
        recetaLista.appendChild(nuevaReceta);

        // Escuchar cambios en el input de porciones
        nuevaReceta.querySelector('.porciones-input').addEventListener('input', function() {
            const newPorciones = parseInt(this.value);
            const ingredientesText = nuevaReceta.querySelector('.ingredientes');
            const originalIngredientes = JSON.parse(ingredientesText.getAttribute('data-ingredientes'));
            const adjustedIngredientes = originalIngredientes.map(ingrediente => {
                const [cantidad, ...rest] = ingrediente.split(' ');
                const cantidadPorcion = (newPorciones / receta.porciones) * parseFloat(cantidad); // Ajuste de cantidad
                return `${cantidadPorcion.toFixed(2)} ${rest.join(' ')}`; // Devuelve la nueva cantidad
            });
            ingredientesText.innerHTML = `Ingredientes: ${adjustedIngredientes.join(', ')}`;
        });
    });
}

// Guardar la receta
document.getElementById('form-receta').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el comportamiento por defecto de enviar el formulario
    const nombreReceta = document.getElementById('nombre').value;
    const procedimiento = document.getElementById('procedimiento').value;
    const porciones = parseInt(document.getElementById('porciones').value);
    const imagen = document.getElementById('imagen').files[0]; // Obtener la imagen subida
    const ingredientes = [];

    // Captura los ingredientes
    for (let i = 1; i <= 10; i++) {
        const ingrediente = document.getElementById(`ingrediente${i}`).value;
        const cantidadPorcion = parseFloat(document.getElementById(`cantidad${i}`).value);
        if (ingrediente) {
            ingredientes.push({ nombre: ingrediente, cantidad: cantidadPorcion, cantidadPorcion: cantidadPorcion }); // Guardar la cantidad por porción
        }
    }

    // Crear un objeto URL para la imagen
    const imagenUrl = URL.createObjectURL(imagen);

    // Agregar la receta al Local Storage
    const recetasGuardadas = JSON.parse(localStorage.getItem('recetas')) || [];
    const nuevaReceta = { nombre: nombreReceta, procedimiento, porciones, ingredientes, imagen: imagenUrl };
    recetasGuardadas.push(nuevaReceta);
    localStorage.setItem('recetas', JSON.stringify(recetasGuardadas));

    // Limpiar el formulario
    document.getElementById('form-receta').reset();
    document.getElementById('formulario-agregar-receta').style.display = 'none'; // Oculta el formulario
    cargarRecetas(); // Recargar recetas
});
