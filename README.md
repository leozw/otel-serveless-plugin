# **otel-serveless-plugin**

The **`otel-serveless-plugin`** is a plugin for the **Serverless Framework** that automates the configuration of layers and environment variables required to instrument AWS Lambda functions with OpenTelemetry. It is designed to be flexible and highly configurable, allowing different clients and environments to be easily managed.

---

## **Features**

- ✅ Automatically adds OpenTelemetry layers to Lambda functions.
- ✅ Configures environment variables specific to each Lambda function.
- ✅ Supports custom configurations such as `tenant`, `token`, `endpoint`, and `env`.
- ✅ Works seamlessly with any number of Lambda functions without manual adjustments.
- ✅ Easy to integrate into the Serverless Framework.

---

## **Installation**

1. **Add the plugin to your Serverless project**

   Install the plugin via npm:

   ```bash
   npm install --save-dev otel-serveless-plugin
   ```

2. **Configure your `serverless.yml`**

   Add the plugin to the plugins section in the `serverless.yml` file:

   ```yaml
   plugins:
     - otel-serveless-plugin
   ```

---

## **Configuration**

Add the `custom.otelLayerPlugin` section to your `serverless.yml` file to customize the configuration:

```yaml
custom:
  otelLayerPlugin:
    tenant: "production-tenant"
    token: "super-secret-token"
    endpoint: "https://otel-endpoint:4318/"
    env: prod
    region: us-east-1
```

These configurations will automatically be applied to all Lambda functions' environment variables.

---

## **Complete Configuration Example**

Here's a complete example of how to use the plugin in your `serverless.yml`:

```yaml
service: otel-service

plugins:
  - otel-serveless-plugin

custom:
  otelLayerPlugin:
    tenant: "production-tenant"
    token: "super-secret-token"
    endpoint: "https://otel-endpoint:4318/"
    env: prod
    region: us-east-1

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1
  environment:
    STAGE: ${opt:stage, 'dev'}

functions:
  myLambdaFunction:
    handler: handler.main
  anotherLambdaFunction:
    handler: another.handler
```

---

## **How It Works**

1. **Layer Addition:**
   - The plugin automatically adds the following layers to your Lambda functions:
     - OpenTelemetry layer: `opentelemetry-nodejs`
     - Logs collector layer: `collector-logs-js`
   - You can also specify custom layers in the configuration.

2. **Environment Variable Configuration:**
   - The plugin configures environment variables such as:
     ```json
     {
       "TENANT_ID": "production-tenant",
       "API_TOKEN": "super-secret-token",
       "OTEL_EXPORTER_OTLP_ENDPOINT": "https://otel-endpoint:4318/",
       "OTEL_SERVICE_NAME": "myLambdaFunction",
       "OTEL_RESOURCE_ATTRIBUTES": "service.name=myLambdaFunction,environment=prod"
     }
     ```

3. **Environment-Based Configuration:**
   - Values like `tenant`, `token`, `env`, `region`, and `layers` can be customized for each client or environment directly in the `serverless.yml`.

---

## **Available Parameters**

### **Section `custom.otelLayerPlugin`**

| Parameter  | Description                                            | Default Value                                                                                                                                     |
| ---------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tenant`   | Unique identifier for the client or environment.       | `"default-tenant"`                                                                                                                                |
| `token`    | Authentication token, if required.                     | `""` (empty)                                                                                                                                      |
| `endpoint` | OpenTelemetry Collector URL for telemetry data export. | `"http://default-endpoint:4318/"`                                                                                                                 |
| `env`      | Current environment, such as `prod`, `dev`, or `qa`.   | `"dev"`                                                                                                                                           |
| `region`   | AWS Lambda region.                                     | `"us-east-1"`                                                                                                                                    |
| `layers`   | Custom layers for OpenTelemetry and logs.              | Default layers for metrics and logs: <br> `arn:aws:lambda:${region}:184161586896:layer:opentelemetry-nodejs-0_11_0:1` <br> `arn:aws:lambda:${region}:204595508824:layer:collector-logs-js:14` |

---

## **Testing**

1. **Package the Service:**

   ```bash
   serverless package
   ```

2. **Verify the Result:**
   - Confirm that the layers and environment variables were added to the Lambdas in the generated `.serverless/cloudformation-template-update-stack.json` file.
3. **Deploy to AWS:**

   ```bash
   serverless deploy
   ```

4. **Validate in the AWS Console:**
   - Go to the AWS Lambda Console.
   - Verify that the layers and environment variables are correctly configured.

---

## **FAQs**

### 1. **What happens if I don't specify a parameter in `serverless.yml`?**

The plugin will use default values defined in the code:

- `tenant`: `"default-tenant"`
- `token`: `""`
- `endpoint`: `"http://default-endpoint:4318/"`
- `env`: `"dev"`
- `region`: `"us-east-1"`
- `layer`:
  - `arn:aws:lambda:${region}:184161586896:layer:opentelemetry-nodejs-0_11_0:1`
  - `arn:aws:lambda:${region}:204595508824:layer:collector-logs-js:14`

### 2. **Can I use this plugin with runtimes other than `nodejs`?**

Yes, as long as the layers are compatible with the runtime used.

### 3. **How do I update the plugin?**

If you're using npm, simply update the version:

```bash
npm install --save-dev otel-serveless-plugin@latest
```

---

## **Contributing**

Feel free to open issues or pull requests in the repository to suggest improvements or fix bugs.

---

## **License**

This project is licensed under the MIT License.
