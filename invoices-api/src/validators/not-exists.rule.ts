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

export function NotExists(
  entityClass: any,
  field = 'id',
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'NotExists',
      constraints: [entityClass, field],
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: NotExistsRule,
    });
  };
}

@Injectable()
@ValidatorConstraint({ name: 'NotExists', async: true })
export class NotExistsRule implements ValidatorConstraintInterface {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async validate(value: any, args: ValidationArguments) {
    if (!value) return true;

    try {
      const [entityClass, field] = args.constraints;
      const repository = this.dataSource.getRepository(entityClass);

      const result = await repository.findOne({
        where: { [field]: value },
      });

      return !result;
    } catch (e) {
      console.error('💥 Erro no validator NotExists:', e);
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} já existe`;
  }
}
