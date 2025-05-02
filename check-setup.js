const fs = require('fs');
const path = require('path');

// Check Angular build
const angularBuildPath = path.join(__dirname, 'client/dist/sports-website');
console.log(`Angular build exists: ${fs.existsSync(angularBuildPath)}`);

// Check server directories
const serverDirs = [
  'server/config',
  'server/controllers',
  'server/middleware',
  'server/models',
  'server/routes',
  'server/utils'
];

serverDirs.forEach(dir => {
  console.log(`Directory ${dir} exists: ${fs.existsSync(path.join(__dirname, dir))}`);
});

// Check essential files
const criticalFiles = [
  'server.js',
  'server/app.js',
  'server/config/db.js',
  'server/routes/index.js'
];

criticalFiles.forEach(file => {
  console.log(`File ${file} exists: ${fs.existsSync(path.join(__dirname, file))}`);
});

// Check node_modules
const requiredModules = [
  'express',
  'mongoose',
  'jsonwebtoken',
  'bcryptjs'
];

requiredModules.forEach(module => {
  try {
    require.resolve(module);
    console.log(`Module ${module} is installed`);
  } catch (e) {
    console.log(`Module ${module} is NOT installed`);
  }
});

console.log('Setup check complete');