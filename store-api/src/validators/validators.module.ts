import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExistsRule } from './exists.rule';

@Module({
  imports: [TypeOrmModule.forFeature([])], 
  providers: [ExistsRule],
  exports: [ExistsRule],
})
export class ValidatorsModule {}