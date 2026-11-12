/* eslint-disable import/prefer-default-export */
/* eslint-env detox/detox, mocha */
const fs = require('fs');
const path = require('path');

// Carga `.env` (en la raíz del repo, ignorado por git) sin pisar las variables
// que ya estén definidas en el entorno. Formato: una línea CLAVE=valor por variable.
function loadDotEnv() {
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) return;
  fs.readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .forEach(line => {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      if (!match) return;
      const [, key, value] = match;
      if (process.env[key] === undefined) process.env[key] = value;
    });
}

loadDotEnv();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Falta la variable de entorno ${name}. Definila en .env (ver .env.example).`
    );
  }
  return value;
}

// Cuentas con las que corren los tests e2e. La cuenta organizadora debe tener
// los roles de organizador y de vendedor para poder elegirlos en el selector.
export const credentials = {
  attendee: {
    email: requireEnv('E2E_ATTENDEE_EMAIL'),
    password: requireEnv('E2E_ATTENDEE_PASSWORD'),
  },
  organizer: {
    email: requireEnv('E2E_ORGANIZER_EMAIL'),
    password: requireEnv('E2E_ORGANIZER_PASSWORD'),
  },
};

export const initializeWithBlacklist = {
  launchArgs: {
    detoxURLBlacklistRegex: '.*firestore.googleapis.com*.*',
  },
};

export async function blacklistFirestore() {
  await device.setURLBlacklist([
    '.*127.0.0.1.*',
    '.*firestore.googleapis.com*.*',
  ]);
}
