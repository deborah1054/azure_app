# Stage 1: Build the Next.js application
FROM node:20-alpine AS builder

# Install dependencies and build tools
WORKDIR /app
COPY package.json yarn.lock ./
# Optional: Install Rust for some Next.js dependencies (e.g., Turbopack)
# RUN apk add --no-cache python3 make g++ 

RUN yarn install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the Next.js app, which creates the .next/standalone folder
RUN yarn build

# Stage 2: Create the final, minimal runtime image
# Use a minimal node image that only copies the necessary files.
FROM node:20-alpine AS runner

# Set the environment variable for standalone mode
ENV NODE_ENV production
# Set the port the container will listen on
ENV PORT 3000

# Next.js sets the required files into the standalone folder
WORKDIR /app

# Copy the standalone application files and necessary node modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose the port
EXPOSE 3000

# Start the Next.js server using the generated entry point
CMD ["node", "server.js"]