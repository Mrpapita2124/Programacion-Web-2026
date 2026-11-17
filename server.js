const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Josecarlos123',
  database: 'cafeteria_40_20',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get('/api/productos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, nombre, categoria, precio, unidad_medida, descripcion, imagen FROM productos WHERE activo = 1');
    res.json(rows);
  } catch (error) {
    console.error('Error al consultar productos:', error);
    res.status(500).json({ error: 'Error al obtener productos de la base de datos' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de 40-20 Café corriendo en http://localhost:${PORT}`);
});
