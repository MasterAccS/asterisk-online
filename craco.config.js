module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Suppress webpack-dev-server deprecation warnings
      // These warnings are caused by react-scripts using an older version of webpack-dev-server
      return webpackConfig;
    }
  },
  devServer: (devServerConfig) => {
    // Override webpack-dev-server config to suppress deprecation warnings
    if (devServerConfig.onAfterSetupMiddleware) {
      // Convert deprecated API to new format
      const originalOnAfterSetupMiddleware = devServerConfig.onAfterSetupMiddleware;
      devServerConfig.setupMiddlewares = (middlewares, devServer) => {
        originalOnAfterSetupMiddleware(devServer);
        return middlewares;
      };
      delete devServerConfig.onAfterSetupMiddleware;
    }
    
    if (devServerConfig.onBeforeSetupMiddleware) {
      // Convert deprecated API to new format
      const originalOnBeforeSetupMiddleware = devServerConfig.onBeforeSetupMiddleware;
      if (!devServerConfig.setupMiddlewares) {
        devServerConfig.setupMiddlewares = (middlewares, devServer) => {
          originalOnBeforeSetupMiddleware(devServer);
          return middlewares;
        };
      } else {
        const originalSetupMiddlewares = devServerConfig.setupMiddlewares;
        devServerConfig.setupMiddlewares = (middlewares, devServer) => {
          originalOnBeforeSetupMiddleware(devServer);
          return originalSetupMiddlewares(middlewares, devServer);
        };
      }
      delete devServerConfig.onBeforeSetupMiddleware;
    }
    
    return devServerConfig;
  }
};
