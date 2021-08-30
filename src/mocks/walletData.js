import { sample, sortBy, uniqueId } from 'lodash';
import moment from 'moment';

function randomDate() {
  return moment(
    new Date(+new Date() - Math.floor(Math.random() * 10000000000))
  ).format('MM/DD/YYYY');
}

const dummyData = [
  {
    description: 'Carga con MP',
    amount: 420.68,
    id: uniqueId(),
  },
  {
    description: 'Las Ligas Menores',
    amount: -533.68,
    id: uniqueId(),
  },
  {
    description: 'Carga con MP',
    amount: 420.68,
    id: uniqueId(),
  },
  {
    description: 'Gauchito Gil',
    amount: 420.68,
    id: uniqueId(),
  },
];

const walletData = [];
for (let i = 0; i < 20; i += 1) {
  walletData.push({ ...sample(dummyData), date: randomDate() });
}

export default sortBy(walletData, ['date']).reverse();
