SignalK AWS IoT
===============

Plugin that sends a vessel's Signal K data stream to [AWS Iot Core](https://aws.amazon.com/iot-core/). The use case for this plugin is to back up Signal K data on a cloud service, and potentially to enable remote monitoring of the vessel.

## Setup

1. Install and enable this plugin in your Signal K
2. Log into AWS Console and create a "Thing" in IoT Core
3. Create a certificate for the Thing, and copy-paste it and your endpoint details to the plugin settings
4. Ensure the device has an AWS policy allowing it to `iot:Connect` and `iot:Publish`
5. Process or store the data stream from the device in the AWS solution of your choice
