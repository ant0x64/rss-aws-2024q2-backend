#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

// import AppStack from "../src/stack.default";
import ImportStack from "../src/stack.import";

const app = new cdk.App();

// new AppStack(app, 'RSS-Back-Task4', {
//   stackName: 'RSS-Backend-Task4'
// });

new ImportStack(app, "RSS-Backend-Import", {
  stackName: "RSS-Backend-Import-Task5",
});
