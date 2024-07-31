import { ConfigurableModuleBuilder } from '@nestjs/common';
import { ConfigModuleOptions } from './config-module-options';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<ConfigModuleOptions>().build();
