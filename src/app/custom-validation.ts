import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function Check2DArray(widthProperty: string, heightProperty: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'Check2DArray',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [widthProperty, heightProperty],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {

          const widthName = args.constraints[0];
          const heightName = args.constraints[1];

          const widthValue = (args.object as any)[widthName];
          const heightValue = (args.object as any)[heightName];

          if (value.length === heightValue) {
            for (const row of value) {
              if (row.length !== widthValue) {
                return false;
              }
            }
            return true;
          } else {
            return false;
          }
        }
      }
    });
  };
}
