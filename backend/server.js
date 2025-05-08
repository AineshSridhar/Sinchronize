const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

require(dotenv).config();

const app = express();
app.use(cors());
app.use(express.json());

const roomRoutes = require('./routes/roomRoutes')
app.use('/api/rooms', roomRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
});
