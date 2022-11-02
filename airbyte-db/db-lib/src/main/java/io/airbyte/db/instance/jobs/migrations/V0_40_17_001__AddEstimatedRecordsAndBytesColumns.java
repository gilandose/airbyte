/*
 * Copyright (c) 2022 Airbyte, Inc., all rights reserved.
 */

package io.airbyte.db.instance.jobs.migrations;

import org.flywaydb.core.api.migration.BaseJavaMigration;
import org.flywaydb.core.api.migration.Context;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.jooq.impl.SQLDataType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class V0_40_17_001__AddEstimatedRecordsAndBytesColumns extends BaseJavaMigration {

  private static final Logger LOGGER = LoggerFactory.getLogger(V0_40_17_001__AddEstimatedRecordsAndBytesColumns.class);

  @Override
  public void migrate(final Context context) throws Exception {
    LOGGER.info("Running migration: {}", this.getClass().getSimpleName());

    // Warning: please do not use any jOOQ generated code to write a migration.
    // As database schema changes, the generated jOOQ code can be deprecated. So
    // old migration may not compile if there is any generated code.
    final DSLContext ctx = DSL.using(context.getConnection());
    ctx.alterTable("sync_stats")
        .add(
            DSL.field("estimated_records", SQLDataType.BIGINT.nullable(true)),
            DSL.field("estimated_bytes", SQLDataType.BIGINT.nullable(true)))
        .execute();
  }

}