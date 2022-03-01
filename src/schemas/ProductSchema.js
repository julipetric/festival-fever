import { t } from 'i18n-js';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const ProductSchema = minStock =>
  yupResolver(
    yup
      .object({
        name: yup.string().required().label(t('name')),
        description: yup.string().label(t('description')),
        price: yup
          .number()
          .typeError(`${t('price')} ${t('mustBeANumber')}`)
          .nullable()
          .min(0)
          .required()
          .transform((value, originalValue) =>
            originalValue.trim() === '' ? null : value
          )
          .label(t('price')),
        stock: yup
          .number()
          .integer()
          .typeError(`${t('stock')} ${t('mustBeAnInteger')}`)
          .nullable()
          .min(minStock || 0)
          .transform((value, originalValue) =>
            originalValue.trim() === '' ? null : value
          )
          .label(t('stock')),
      })
      .required()
  );

export default ProductSchema;
