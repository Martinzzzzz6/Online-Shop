const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');
const authenticateToken = require('./middleware/authenticationToken');
const swaggerSetup = require('./swagger/swaggerConfig');
const cartRoutes = require('./routes/orderRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(cors());
app.use(bodyParser.json());

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/auth', authRoutes); 
app.use('/cart', cartRoutes);


app.get('/protected', authenticateToken, (req, res) => {
  res.send({ message: 'This is a protected route', user: req.user });
});


app.use(errorHandler);

swaggerSetup(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Swagger running on http://localhost:${PORT}/api-docs`));
