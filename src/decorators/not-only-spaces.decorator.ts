import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function NotOnlySpacesDecorator(validationOptions?: ValidationOptions) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'NotOnlySpacesDecorator',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!/\S/.test(value)) {
            return false;
          }
          return true;
        },
      },
    });
  };
}
