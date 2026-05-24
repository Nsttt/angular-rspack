import type { RsbuildConfig, RsbuildPlugin } from '@rsbuild/core';
import type { Configuration } from '@rspack/core';
import { createConfig } from './config/create-config';
import type { AngularRspackPluginOptions } from './models';

export interface AngularRsbuildPluginConfig {
  options: AngularRspackPluginOptions;
  rspackConfigOverrides?: Partial<Configuration>;
}

export type AngularRsbuildConfigurations = Record<
  string,
  {
    options: Partial<AngularRspackPluginOptions>;
    rspackConfigOverrides?: Partial<Configuration>;
  }
>;

export function pluginAngular(
  defaultOptions: AngularRsbuildPluginConfig,
  configurations: AngularRsbuildConfigurations = {},
  configEnvVar = 'NGRS_CONFIG'
): RsbuildPlugin {
  return {
    name: 'angular-rspack',
    setup(api) {
      api.modifyRsbuildConfig((config) =>
        applyAngularRsbuildDefaults(config, defaultOptions.options)
      );

      api.modifyRspackConfig(async () => {
        const [angularConfig] = await createConfigForRsbuild(
          defaultOptions,
          configurations,
          configEnvVar
        );

        return sanitizeRsbuildRspackConfig(angularConfig);
      });
    },
  };
}

export const pluginAngularRsbuild = pluginAngular;

function applyAngularRsbuildDefaults(
  config: RsbuildConfig,
  options: AngularRspackPluginOptions
): RsbuildConfig {
  return {
    ...config,
    source: {
      ...config.source,
      entry: config.source?.entry ?? {},
    },
    server: {
      host: options.devServer?.host ?? config.server?.host,
      port: options.devServer?.port ?? config.server?.port,
      ...config.server,
    },
    output: {
      ...config.output,
      distPath: normalizeRsbuildDistPath(options),
      filenameHash: false,
    },
    dev: {
      hmr: options.devServer?.hmr ?? config.dev?.hmr,
      liveReload: options.devServer?.liveReload ?? config.dev?.liveReload,
      ...config.dev,
    },
  };
}

function normalizeRsbuildDistPath(
  options: AngularRspackPluginOptions
): NonNullable<RsbuildConfig['output']>['distPath'] {
  const outputPath = options.outputPath;
  const root =
    typeof outputPath === 'string' ? outputPath : (outputPath?.base ?? 'dist');

  return {
    root,
    js: '',
    css: '',
    jsAsync: '',
    cssAsync: '',
    html: '',
    svg: '',
    font: '',
    image: '',
    media: '',
    wasm: '',
  };
}

async function createConfigForRsbuild(
  defaultOptions: AngularRsbuildPluginConfig,
  configurations: AngularRsbuildConfigurations,
  configEnvVar: string
) {
  const previousMode = process.env[configEnvVar];
  if (!previousMode && process.env['NODE_ENV'] === 'development') {
    process.env[configEnvVar] = 'development';
  }

  try {
    return await createConfig(defaultOptions, configurations, configEnvVar);
  } finally {
    if (previousMode === undefined) {
      delete process.env[configEnvVar];
    } else {
      process.env[configEnvVar] = previousMode;
    }
  }
}

function sanitizeRsbuildRspackConfig(config: Configuration): Configuration {
  const { devServer: _devServer, ...rspackConfig } = config;
  return rspackConfig;
}
