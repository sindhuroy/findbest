# Use an official Node.js runtime as the base image with version 18.16.1
FROM node:18.16.1

# Install necessary dependencies for Puppeteer and Chrome
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libx11-xcb1 \
    libxcb-dri3-0 \
    libxtst6 \
    libxss1 \
    libgbm-dev \
    fonts-liberation \
    libasound2 \
    libu2f-udev \
    libvulkan1 \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Google Chrome browser
RUN curl -sSL https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -o chrome.deb \
    && dpkg -i chrome.deb \
    && apt-get install -f -y \
    && rm chrome.deb

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the project files to the working directory
COPY . .

# Expose the port on which the Node.js app runs
EXPOSE 4000

# Define the command to start the Node.js app
CMD ["node", "server.js"]
