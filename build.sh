set -e  # Exit immediately if a command exits with a non-zero status

# Set environment variables if not already set
export NODE_ENV=${NODE_ENV:-production}

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the Angular app
echo "Building Angular application..."
cd client
npm install
npm run build
cd ..

# Start the server
echo "Starting server..."
node server.js