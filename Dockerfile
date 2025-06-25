FROM oven/bun

WORKDIR /app

# Copy package.json + package-lock.json
COPY package*.json ./

# Install dependencies
RUN bun install

# Copy the rest of the application
COPY . .

# Start the dev server
CMD ["bun", "--bun", "run", "dev"]
