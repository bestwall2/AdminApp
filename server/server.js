import express from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.json());

const dataFilePath = path.resolve('server/data.json');

// Helper function to read data from JSON file
const readData = () => {
  const data = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(data);
};

// Helper function to write data to JSON file
const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Routes
app.get('/api/data', (req, res) => {
  res.json(readData());
});

app.post('/api/add', (req, res) => {
  const data = readData();
  data.push(req.body);
  writeData(data);
  res.status(201).json({ message: 'Data added successfully' });
});

app.put('/api/edit', (req, res) => {
  const { index, ...updatedItem } = req.body;
  const data = readData();
  data[index] = updatedItem;
  writeData(data);
  res.json({ message: 'Data updated successfully' });
});

app.delete('/api/delete', (req, res) => {
  const { index } = req.body;
  const data = readData();
  data.splice(index, 1);
  writeData(data);
  res.json({ message: 'Data deleted successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
