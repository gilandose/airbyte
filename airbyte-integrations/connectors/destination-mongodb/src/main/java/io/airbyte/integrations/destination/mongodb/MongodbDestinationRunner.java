/*
 * Copyright (c) 2022 Airbyte, Inc., all rights reserved.
 */

package io.airbyte.integrations.destination.mongodb;

import io.airbyte.integrations.base.adaptive.AdaptiveDestinationRunner;

public class MongodbDestinationRunner {

  public static void main(final String[] args) throws Exception {
    AdaptiveDestinationRunner.baseOnEnv()
        .withOssDestination(MongodbDestination::sshWrappedDestination)
        .withCloudDestination(MongodbDestinationStrictEncrypt::new)
        .run(args);
  }

}
