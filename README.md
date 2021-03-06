SignalK AWS IoT
===============

Plugin that sends a vessel's Signal K data stream to [AWS Iot Core](https://aws.amazon.com/iot-core/). The use case for this plugin is to back up Signal K data on a cloud service, and potentially to enable remote monitoring of the vessel.

## Setup

1. Install and enable this plugin in your Signal K
2. Log into AWS Console and create a "Thing" in IoT Core
3. Create a certificate for the Thing, and copy-paste it and your endpoint details to the plugin settings
4. Ensure the device has an AWS policy allowing it to `iot:Connect` and `iot:Publish`
5. Process or store the data stream from the device in the AWS solution of your choice

If you're only interested in data from particular vessel states (for examples, when vessel is sailing), you can [install a plugin](https://www.npmjs.com/package/@meri-imperiumi/signalk-autostate) that automatically updates vessel state based on telemetry. Then you can choose the states in the configuration of this plugin.

## Changes

* 1.1.3 (2020-11-30)
  - Compatibility with the new `setPluginStatus`/`setPluginError` APIs in Signal K
* 1.1.2 (2020-11-25)
  - Compatibility with the upcoming "meta deltas" feature in Signal K
* 1.1.1 (2020-11-24)
  - Fixed an issue with `navigation.state` filtering when sending messages
* 1.1.0 (2020-10-13)
  - Option for sending all values to a single `signalk` AWS IoT topic instead of topic per Signal K path
  - Ability to control in which vessel navigation states we send data to AWS IoT
