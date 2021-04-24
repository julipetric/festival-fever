import { t } from 'i18n-js';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const UserRegisterSchema = yupResolver(
  yup.object().shape({
    email: yup.string().email().required().label(t('email')),
    name: yup.string().required().label(t('name')),
    lastName: yup.string().required().label(t('lastName')),
    password: yup.string().required(),
    repeatPassword: yup
      .string()
      .required()
      .test(
        'passwords-match',
        t('passwordsDontMatch'),
        value => value === yup.ref('password')
      ),
  })
);

export default UserRegisterSchema;
