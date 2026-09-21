import { Type } from 'class-transformer';
import {
  IsInt,
  IsISO8601,
  IsMongoId,
  IsOptional,
  IsPositive,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'nonInsiemeConDate', async: false })
class NonInsiemeConDateConstraint implements ValidatorConstraintInterface {
  validate(categoriaId: unknown, args: ValidationArguments) {
    const o = args.object as RicercaMovimentiQueryDto;
    if (categoriaId === undefined) return true;
    return o.dataDa === undefined && o.dataA === undefined;
  }

  defaultMessage() {
    return 'categoriaId non può essere usato insieme a dataDa/dataA';
  }
}

@ValidatorConstraint({ name: 'coppiaDataCompleta', async: false })
class CoppiaDataCompletaConstraint implements ValidatorConstraintInterface {
  validate(dataDa: unknown, args: ValidationArguments) {
    const o = args.object as RicercaMovimentiQueryDto;
    const haDataDa = o.dataDa !== undefined;
    const haDataA = o.dataA !== undefined;
    return haDataDa === haDataA; // entrambe presenti o entrambe assenti
  }

  defaultMessage() {
    return 'dataDa e dataA devono essere specificate entrambe o nessuna delle due';
  }
}

export class RicercaMovimentiQueryDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  n!: number;

  @IsOptional()
  @IsMongoId()
  @Validate(NonInsiemeConDateConstraint)
  categoriaId?: string;

  @IsOptional()
  @IsISO8601()
  @Validate(CoppiaDataCompletaConstraint)
  dataDa?: string;

  @IsOptional()
  @IsISO8601()
  @Validate(CoppiaDataCompletaConstraint)
  dataA?: string;
}