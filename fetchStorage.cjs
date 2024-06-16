const { Level } = require('level')
const path = require('path');

// Path to the Chrome extension's local storage directory
const extensionId = 'mpogdhahgpkebmacegpeppoboolapmpg';
const dbPath = path.join('C:', 'Users', 'DALL', 'AppData', 'Local', 'Google', 'Chrome', 'User Data', 'Default', 'Local Storage', 'leveldb');

async function fetchFromLevelDB() {
  let db, iterator;

  try {
    // Create a database instance
    db = new Level(dbPath, { valueEncoding: 'binary' });

    console.log('LevelDB opened successfully');

    // Open an iterator
    iterator = db.iterator();

    // Function to iterate and process entries
    async function processEntries(iterator) {
      let entry;
      while (entry = await iterator.next()) {
        if (entry.done) break; // Exit loop if iterator is done
        
        const { key, value } = entry.value;
        
        if (key.includes(extensionId)) {
          const parsedKey = key.toString('utf8');
          const parsedValue = value.toString('utf8');
          console.log(`Key: ${parsedKey}, Value: ${parsedValue}`);
        }
      }
    }

    // Process entries
    await processEntries(iterator);

    console.log('Finished reading LevelDB');

  } catch (err) {
    console.error('Error accessing LevelDB:', err);
  } finally {
      // Close the iterator (wait for ongoing operations to finish)
      if (iterator && !iterator.ended) {
        try {
          await iterator.close();
          console.log('Iterator closed successfully');
        } catch (err) {
          console.error('Error closing iterator:', err);
        }
      }

    try {
      // Close the database instance
      if (db) await db.close();
      console.log('LevelDB closed successfully');
    } catch (err) {
      console.error('Error closing LevelDB:', err);
    }
  }
}

fetchFromLevelDB();