const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const FileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalname: { type: String, required: true },
  size: { type: Number, required: true },
  mimetype: { type: String, required: true },
  url: { type: String, required: true },
  shareableId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

const File = mongoose.model('File', FileSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

const generateShareableId = () => {
  return crypto.randomBytes(5).toString('hex');
};

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/upload', upload.single('media'), async (req, res) => {
  try {
    const { filename, originalname, size, mimetype } = req.file;
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
    const shareableId = generateShareableId();

    const newFile = new File({
      filename,
      originalname,
      size,
      mimetype,
      url: fileUrl,
      shareableId,
    });

    await newFile.save();

    res.status(201).json({
      url: `https://celvyn.site/${shareableId}`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

app.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const file = await File.findOne({ shareableId: id });

    if (!file) {
      return res.status(404).send('File not found');
    }

    res.redirect(file.url);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
