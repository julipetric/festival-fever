import { t } from 'i18n-js';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

const LoginSchema = () =>
  yupResolver(
    yup
      .object({
        username: yup.string().email().required().label(t('email')),
        password: yup.string().required().label(t('password')),
      })
      .required()
  );

export default LoginSchema;
