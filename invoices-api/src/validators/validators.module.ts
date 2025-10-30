import { Module } from '@nestjs/common';
import { ExistsRule } from './exists.rule';
import { NotExistsRule } from './not-exists.rule';

@Module({
  providers: [ExistsRule, NotExistsRule],
  exports: [ExistsRule, NotExistsRule],
})
export class ValidatorsModule {}