import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

export function Exists(
  entityClass: any,
  field = 'id',
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'Exists',
      constraints: [entityClass, field],
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: ExistsRule,
    });
  };
}

@Injectable()
@ValidatorConstraint({ name: 'Exists', async: true })
export class ExistsRule implements ValidatorConstraintInterface {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async validate(value: string, args: ValidationArguments) {

    if (!value) return false;

    try {
      const [entityClass, field] = args.constraints;
      const repository = this.dataSource.getRepository(entityClass);

      const result = await repository.findOne({
        where: { [field]: value },
      });

      return !!result;
    } catch (e) {
      console.error('💥 Erro no validator Exists:', e);
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} not found`;
  }
}
