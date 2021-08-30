/* eslint-disable import/prefer-default-export */
import moment from 'moment';
import Patagonia from './mockImages/patagonia.png';
import MiAmigo from './mockImages/miAmigo.png';
import Bresh from './mockImages/bresh.png';

export const patagoniaEvent = {
  dates: [{ start: moment(), end: moment().add(5, 'hours') }],
  name: 'Patagonia Bar',
  location: {
    address: 'Bv. Pellegrini 2421, Santa Fe',
    description: 'Patagonia Bar Refugio Santa Fe',
  },
  image: Patagonia,
};

export const miAmigoEvent = {
  dates: [
    {
      start: moment().day(6).hour(20).minute(30),
      end: moment().day(6).hour(23).minute(45),
    },
  ],
  name: 'Mi Amigo Invencible',
  location: {
    address: 'República de Siria 3572, Santa Fe',
    description: 'Tribus Club de Arte',
  },
  image: MiAmigo,
};

export const breshEvent = {
  dates: [
    {
      start: moment().day(5).hour(20).minute(0).add(1, 'week'),
      end: moment().day(6).hour(5).minute(30).add(1, 'week'),
    },
  ],
  name: 'Fiesta Bresh',
  location: {
    address: 'RN168 80, Santa Fe',
    description: 'Complejo Island VIP',
  },
  image: Bresh,
};

export const demoEvents = [patagoniaEvent, miAmigoEvent, breshEvent];
