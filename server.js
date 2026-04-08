require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Product = require('./models/Product');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Sirve los archivos estáticos de tu frontend

// Conexión a la Base de Datos
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));

// ==========================================
// ENDPOINTS CRUD (API REST)
// ==========================================

// 1. CREAR (POST /api/productos)
app.post('/api/productos', async (req, res) => {
    try {
        const nuevoProducto = new Product(req.body);
        const productoGuardado = await nuevoProducto.save();
        res.status(201).json(productoGuardado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al crear el producto', error: error.message });
    }
});

// 2. LEER TODOS (GET /api/productos)
app.get('/api/productos', async (req, res) => {
    try {
        const productos = await Product.find();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener los productos', error: error.message });
    }
});

// 3. LEER UNO SOLO (GET /api/productos/:id)
app.get('/api/productos/:id', async (req, res) => {
    try {
        const producto = await Product.findById(req.params.id);
        if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
        res.status(200).json(producto);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el producto', error: error.message });
    }
});

// 4. ACTUALIZAR (PUT /api/productos/:id)
app.put('/api/productos/:id', async (req, res) => {
    try {
        const productoActualizado = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } // new: devuelve el doc actualizado, runValidators: aplica las reglas del schema
        );
        if (!productoActualizado) return res.status(404).json({ mensaje: 'Producto no encontrado' });
        res.status(200).json(productoActualizado);
    } catch (error) {
        res.status(400).json({ mensaje: 'Error al actualizar el producto', error: error.message });
    }
});

// 5. ELIMINAR (DELETE /api/productos/:id)
app.delete('/api/productos/:id', async (req, res) => {
    try {
        const productoEliminado = await Product.findByIdAndDelete(req.params.id);
        if (!productoEliminado) return res.status(404).json({ mensaje: 'Producto no encontrado' });
        res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el producto', error: error.message });
    }
});

// Iniciar el Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});