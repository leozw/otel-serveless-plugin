class OtelLayerPlugin {
  constructor(serverless) {
    this.serverless = serverless;
    this.hooks = {
      "before:package:initialize": this.applyOtelLayer.bind(this),
    };
  }

  applyOtelLayer() {
    const functions = this.serverless.service.functions;

    const pluginConfig = this.serverless.service.custom?.otelLayerPlugin || {};
    const tenant = pluginConfig.tenant || "default-tenant";
    const token = pluginConfig.token || "";
    const endpoint = pluginConfig.endpoint || "http://otel-endpoint:4318/";
    const environment = pluginConfig.env || "dev";

    const region = pluginConfig.region || "us-east-1";
    const otelLayers = pluginConfig.layers || [
      `arn:aws:lambda:${region}:184161586896:layer:opentelemetry-nodejs-0_11_0:1`,
      `arn:aws:lambda:${region}:204595508824:layer:collector-logs-js:14`,
    ];

    Object.keys(functions).forEach((func) => {
      const functionName = func;

      const environmentVariables = {
        AWS_LAMBDA_EXEC_WRAPPER: "/opt/otel-handler",
        OTEL_SERVICE_NAME: functionName,
        OTEL_TRACES_SAMPLER: "always_on",
        OTEL_TRACES_EXPORTER: "otlp",
        OTEL_METRICS_EXPORTER: "otlp",
        OTEL_LOG_LEVEL: "DEBUG",
        OTEL_LAMBDA_TRACE_MODE: "capture",
        OTEL_PROPAGATORS: "tracecontext,baggage,xray",
        OTEL_RESOURCE_ATTRIBUTES: `service.name=${functionName},environment=${environment}`,
        OTEL_EXPORTER_OTLP_ENDPOINT: endpoint,
        TENANT_ID: tenant,
        SERVICE_NAME: functionName,
        RESOURCES_ATTRIBUTES: `service=${functionName},environment=${environment}`,
        NODE_OPTIONS: "--require /opt/nodejs/index.js",
        API_TOKEN: token,
      };

      if (!functions[func].layers) {
        functions[func].layers = [];
      }
      functions[func].layers.push(...otelLayers);

      if (!functions[func].environment) {
        functions[func].environment = {};
      }
      Object.assign(functions[func].environment, environmentVariables);
    });
  }
}

module.exports = OtelLayerPlugin;
