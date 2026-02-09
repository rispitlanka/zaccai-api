/**
 * One-time migration: Drop the unique index on variationCombinations.sku
 * that causes E11000 duplicate key error when multiple combinations have null SKU.
 *
 * Run once: node migrations/dropVariationCombinationsSkuIndex.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const INDEX_NAME = 'variationCombinations.sku_1';

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/pos-system');
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('products');

    const indexes = await collection.indexes();
    const hasIndex = indexes.some((idx) => idx.name === INDEX_NAME);

    if (hasIndex) {
      await collection.dropIndex(INDEX_NAME);
      console.log(`Dropped index: ${INDEX_NAME}`);
    } else {
      console.log(`Index ${INDEX_NAME} does not exist (already dropped or never created).`);
    }

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (err) {
    if (err.code === 27 || err.codeName === 'IndexNotFound') {
      console.log('Index already dropped or not found. Nothing to do.');
      process.exit(0);
      return;
    }
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

run();
