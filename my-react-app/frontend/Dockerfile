# Use an official Nginx image based on Alpine as the base image
FROM nginx:alpine

# Copy the build folder to the Nginx default directory
COPY build/ /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Use the default Nginx configuration
CMD ["nginx", "-g", "daemon off;"]
