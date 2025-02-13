module.exports = {
    apps: [
      {
        name: 'Web', // The name of your app
        script: 'serve', // Using PM2's built-in serve module
        env: {
          PM2_SERVE_PATH: './dist', // The folder where Vite outputs the build
          PM2_SERVE_PORT: 9090, // Specify the port where the app should be served
          PM2_SERVE_SPA: 'true', // Serve the app as a Single Page Application (SPA)
          PM2_SERVE_HOMEPAGE: '/index.html', // The homepage file
        },
      },
    ],
  };
  