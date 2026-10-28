const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withBuildConfig(config) {
  return withAppBuildGradle(config, (config) => {
    const buildGradle = config.modResults.contents;
    if (!buildGradle.includes('buildFeatures')) {
      config.modResults.contents = buildGradle.replace(
        /android\s*\{/,
        'android {\n    buildFeatures {\n        buildConfig = true\n    }'
      );
    }
    return config;
  });
};
