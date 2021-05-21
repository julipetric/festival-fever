import { t } from 'i18n-js';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const UserRegisterSchema = yupResolver(
  yup.object().shape({
    email: yup.string().email().required().label(t('email')),
    name: yup.string().required().label(t('name')),
    lastName: yup.string().required().label(t('lastName')),
    password: yup.string().required().label(t('password')),
    repeatPassword: yup
      .string()
      .required()
      .oneOf([yup.ref('password'), null], t('passwordsDontMatch'))
      .label(t('repeatPassword')),
  })
);

export default UserRegisterSchema;
