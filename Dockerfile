# ----------------------------------------------------------------------
# STAGE 1: Build the Next.js application (using a robust Node image)
# ----------------------------------------------------------------------
FROM node:20 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker caching for dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all application files
COPY . .

# Run the Next.js production build
RUN npm run build

# ----------------------------------------------------------------------
# STAGE 2: Production Runtime Image (using a smaller, leaner image)
# ----------------------------------------------------------------------
FROM node:20-alpine

# Set the working directory for the final application
WORKDIR /app

# The Next.js server runs on port 3000 by default
EXPOSE 3000

# Copy necessary files from the builder stage
# We only need the node modules, the build output (.next), and the public assets
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

# Define the command to start the Next.js server
CMD ["npm", "start"]
