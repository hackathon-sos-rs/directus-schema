const express = require('express');
const bodyParser = require('body-parser');
const { createDirectus, rest, createItem } = require('@directus/sdk');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Directus client
const client = createDirectus('https://sos-rs-stock-qa.star-ai.app/server/specs/graphql/?access_token=90qNWdiyn2O6L6c4XRFZn7Pd-5eZUeP1').with(rest());

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <style>
          form {
            width: 300px;
            margin: 0 auto;
          }
          input, select, button {
            display: block;
            width: 100%;
            margin-bottom: 10px;
            padding: 8px;
            box-sizing: border-box;
          }
          .hidden {
            display: none;
          }
        </style>
        <script>
          function enableSKU() {
            const locationField = document.getElementById('location');
            const skuField = document.getElementById('sku');
            const locationValue = locationField.value.trim();
            if (locationValue !== '') {
              skuField.disabled = false;
              locationField.disabled = true;
            }
          }

          function handleSKUInput() {
            const skuField = document.getElementById('sku');
            const skuValue = skuField.value.trim();
            if (skuValue !== '') {
              // Simulate debounce by delaying the execution
              setTimeout(checkSKU, 3000, skuValue);
            }
          }

          async function checkSKU(sku) {
            const response = await fetch('/check-sku?sku=' + sku);
            const result = await response.json();

            if (result.exists) {
              // Pre-fill form with data from the SKU
              document.getElementById('item-name').value = result.data.item_name;
              document.getElementById('category').value = result.data.category;
              document.getElementById('unit').value = result.data.unit;
              document.getElementById('active-principle').value = result.data.active_principle;
              document.getElementById('concentration').value = result.data.concentration;
              document.getElementById('form').value = result.data.form;
              document.getElementById('volume').value = result.data.volume;
              document.getElementById('therapeutic-class').value = result.data.therapeutic_class;
            } else {
              // Enable form fields for new data input
              document.querySelectorAll('.medication-field').forEach(field => {
                field.classList.remove('hidden');
              });
            }
          }

          function handleItemTypeChange() {
            const itemType = document.querySelector('input[name="item-type"]:checked').value;
            const medicationFields = document.querySelectorAll('.medication-field');
            const generalFields = document.querySelectorAll('.general-field');

            if (itemType === 'general') {
              generalFields.forEach(field => field.classList.remove('hidden'));
              medicationFields.forEach(field => field.classList.add('hidden'));
            } else {
              medicationFields.forEach(field => field.classList.remove('hidden'));
              generalFields.forEach(field => field.classList.add('hidden'));
            }
          }

          window.onload = function() {
            const skuField = document.getElementById('sku');
            skuField.disabled = true;
            document.querySelectorAll('.medication-field, .general-field').forEach(field => {
              field.classList.add('hidden');
            });

            document.getElementById('location').addEventListener('blur', enableSKU);
            skuField.addEventListener('input', handleSKUInput);
            document.querySelectorAll('input[name="item-type"]').forEach(radio => {
              radio.addEventListener('change', handleItemTypeChange);
            });
          };
        </script>
      </head>
      <body>
        <form action="/submit" method="POST">
          <label for="location">Location:</label>
          <input type="text" id="location" name="location" required>

          <label for="sku">SKU:</label>
          <input type="text" id="sku" name="sku">

          <label for="item-type">Item Type:</label>
          <input type="radio" id="item-general" name="item-type" value="general" checked> General
          <input type="radio" id="item-medication" name="item-type" value="medication"> Medication

          <div class="general-field">
            <label for="item-name">Item Name:</label>
            <input type="text" id="item-name" name="item-name">

            <label for="category">Category:</label>
            <select id="category" name="category">
              <option value="category1">Category 1</option>
              <option value="category2">Category 2</option>
            </select>

            <label for="unit">Unit:</label>
            <input type="text" id="unit" name="unit">
          </div>

          <div class="medication-field">
            <label for="active-principle">Active Principle:</label>
            <input type="text" id="active-principle" name="active-principle">

            <label for="concentration">Concentration:</label>
            <input type="text" id="concentration" name="concentration">

            <label for="form">Form:</label>
            <select id="form" name="form">
              <option value="form1">Form 1</option>
              <option value="form2">Form 2</option>
            </select>

            <label for="volume">Volume:</label>
            <input type="text" id="volume" name="volume">

            <label for="therapeutic-class">Therapeutic Class:</label>
            <select id="therapeutic-class" name="therapeutic-class">
              <option value="class1">Class 1</option>
              <option value="class2">Class 2</option>
            </select>
          </div>

          <label for="quantity">Quantity:</label>
          <input type="number" id="quantity" name="quantity">

          <label for="validity">Validity:</label>
          <input type="date" id="validity" name="validity">

          <label for="manufacture">Manufacture:</label>
          <input type="text" id="manufacture" name="manufacture">

          <button type="submit">Save</button>
        </form>
      </body>
    </html>
  `);
});

app.get('/check-sku', async (req, res) => {
  const { sku } = req.query;
  try {
    const response = await client.request(
      createItem('articles', {
        sku: sku
      })
    );
    if (response.data.length > 0) {
      res.json({ exists: true, data: response.data[0] });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    console.error('Error checking SKU:', error);
    res.status(500).json({ exists: false });
  }
});

app.post('/submit', async (req, res) => {
  const data = req.body;
  try {
    const item = await client.request(
      createItem('articles', {
        manufactorer_id: data.manufacture,
        name: data.item_name,
        // Add other fields as needed
      })
    );
    res.send('Form submitted successfully!');
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).send('Error submitting form');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
