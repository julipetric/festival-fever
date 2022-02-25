import { t } from 'i18n-js';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const EventInfoSchema = () =>
  yupResolver(
    yup
      .object({
        name: yup.string().required().label(t('name')),
        category: yup.object().required().label(t('category')),
        location: yup
          .object({
            address: yup.string().required().label(t('address')),
            description: yup.string().required().label(t('description')),
            coordinates: yup.mixed().required().label(t('location')),
          })
          .required(),
        contactPhone: yup.string().required().label(t('contactPhone')),
        contactEmail: yup.string().email().required().label(t('email')),
      })
      .required()
  );

export default EventInfoSchema;
