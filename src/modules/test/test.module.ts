import { Module } from '@nestjs/common';
import { TestController } from './test.controller';

/**
 * Test Module
 * Contains test endpoints for API response standardization
 */
@Module({
  controllers: [TestController],
})
export class TestModule {}
