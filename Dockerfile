# --- Stage 1: Build the Application ---
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# The 'COPY' commands are adjusted to pull files from the 'Azure_app' directory.
# Copy package files first to leverage Docker caching for dependencies
COPY ./Azure_app/package.json ./
COPY ./Azure_app/package-lock.json ./

# Install dependencies (Node.js/Next.js)
RUN npm install

# Copy the rest of the application code from the subdirectory
COPY ./Azure_app/ .

# Build the Next.js application (creates the .next folder)
# This command requires your package.json to have a "build" script (e.g., "next build")
RUN npm run build

# --- Stage 2: Create the Final Runtime Image ---
FROM node:20-alpine AS runner

# Set environment variables for the runtime
ENV NODE_ENV production
# Next.js will use this port, matching your Azure App Service setting (WEBSITES_PORT=8080)
ENV PORT 8080

# Set the working directory for the runtime
WORKDIR /app

# Copy the built application and the necessary production dependencies from Stage 1
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next

# Copy necessary runtime files from the subdirectory
COPY ./Azure_app/public ./public
COPY ./Azure_app/package.json ./package.json

# Expose the port (for documentation/clarity)
EXPOSE 8080

# Start the Next.js server in production mode
# This command requires your package.json to have a "start" script (e.g., "next start")
CMD ["npm", "start"]
