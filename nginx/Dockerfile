# Stage-2
FROM nginx:1.25.2-alpine-slim

# Copy the static file to my Nginx folder to serve static contain
COPY --from=myapp-client /usr/src/app/build /usr/share/nginx/html

# Open the port to react
EXPOSE 80 443

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]