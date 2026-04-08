const apiUrl = '/api/productos';

// Cargar y mostrar los productos al iniciar la página
document.addEventListener('DOMContentLoaded', getProducts);

async function getProducts() {
    try {
        const response = await fetch(apiUrl);
        const products = await response.json();
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = '';

        products.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${product.nombre}</td>
                <td>${product.descripcion}</td>
                <td>$${product.precio}</td>
                <td>${product.stock}</td>
                <td>${product.categoria}</td>
                <td>
                    <button class="btn-edit" onclick="editProduct('${product._id}')">Editar</button>
                    <button class="btn-delete" onclick="deleteProduct('${product._id}')">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }
}

// Manejar el envío del formulario (Crear o Actualizar)
document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('productId').value;
    const productData = {
        nombre: document.getElementById('nombre').value,
        descripcion: document.getElementById('descripcion').value,
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value),
        categoria: document.getElementById('categoria').value
    };

    try {
        let response;
        if (id) {
            // Actualizar (PUT)
            response = await fetch(`${apiUrl}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        } else {
            // Crear (POST)
            response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
        }

        if (response.ok) {
            resetForm();
            getProducts();
        } else {
            const err = await response.json();
            alert(`Error: ${err.mensaje}`);
        }
    } catch (error) {
        console.error('Error al guardar el producto:', error);
    }
});

// Cargar los datos en el formulario para editar
async function editProduct(id) {
    try {
        const response = await fetch(`${apiUrl}/${id}`);
        const product = await response.json();

        document.getElementById('productId').value = product._id;
        document.getElementById('nombre').value = product.nombre;
        document.getElementById('descripcion').value = product.descripcion;
        document.getElementById('precio').value = product.precio;
        document.getElementById('stock').value = product.stock;
        document.getElementById('categoria').value = product.categoria;

        document.getElementById('submitBtn').innerText = 'Actualizar Producto';
        document.getElementById('cancelBtn').style.display = 'inline-block';
    } catch (error) {
        console.error('Error al obtener el producto para editar:', error);
    }
}

// Eliminar Producto
async function deleteProduct(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        try {
            await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
            getProducts();
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
        }
    }
}

// Limpiar el formulario
function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    document.getElementById('submitBtn').innerText = 'Guardar Producto';
    document.getElementById('cancelBtn').style.display = 'none';
}