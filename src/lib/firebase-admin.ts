import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin if it hasn't been initialized
const apps = getApps();

if (!apps.length) {
  initializeApp({
    credential: cert({
      projectId: "dashboard-e7793",
      clientEmail: "firebase-adminsdk-fbsvc@dashboard-e7793.iam.gserviceaccount.com",
      privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC2+zLVkulcT4n3\nLtZmLrp7jZnuZV/ZltMkEzNOL6rVifVE7rUngJaejv2ntUi52h49Qfukgyrwv/KB\nNNEtZG9oG9HWzNWGATgGomOMGXVVpkG0jrMirTwIxDYNO6KGG87d/DRIEReJdDBl\nJ18UikpJdofaSc9Vdm1AXh7vY9vK9jEMaHxZgkB9I+/RNkdjcqhHpoLqxGZrspCk\nUkc/jH3dtkqvn/0htwvSASi3rOt9nrlfEntnabeUIe+BrakA3qts5jPJmKrYdnVm\nE6QNsOw5GTEikX2Imn6K/ji9VnW12Ptx1Gu6aB8IfNeYD4XAPusktZ9h6VtsEseg\nEyYJdMSnAgMBAAECggEAV+LYPC+XaTCE1hYHgUXBaPWOsSu8uWBRYlrcghmwBmeA\nSA8VMHd5IIgSeho+55FFg+usx4v+tGqlOfzZ2WELh2gRRgfVKMtuEvWtNY3GxxAX\nL/d4P9gP5TAEvB9gBOTXW9S2ccTP1sPZOMSLzOxNGPLW9ngMHwLGH6v1VMrUNytv\nAg0fYW1WusFkZipCq7xwGajFd6bCL9Q3noc78j7C26uHv2XXOlbnfHUUlkTku1Ml\nAIChue2DozK7ocMw9VhFQo13jzaSZogAVxkgKQpUpWpCf7QlhGcreSdOJKnkxxfy\nFY2hST0nxUJHFjOdr5efVopRltVhXx9H7G0r90GCBQKBgQDl87EpmJtmYYrlx2S2\nQ8vEBV62MGCeKOaPHEUGHwAtXCvbBQboJ3yLGagK8VJBLQYvIayjytYHKUM7CsbN\nlNrr6MZP4SJQKf3LojKbfn/hmxWDa6+O50B5aQY007pi35r8c1WLCT6jLcEWyHMR\nPs80YvcfQQknu6hrawI8ymfcgwKBgQDLtWrutzfHtvhCwYh2aVip45l6+2CI1zeT\nJamVSh4AHB8mKKKd2t8Yf96QGUWvzodzSbOfVhaJgBTRX1zj/2dEq/UHj42170hJ\nSPbfOBClpH4u/EU2IBEyKlfj70UQvBK2Pw1PAZ299FOw9uMHQIWg1m26hlMSZs3n\nu1d+EJaGDQKBgQDln0IC+nv7cV4E8+ZSx0JbvM0F+ysP5GHO+HjIkv5XTVoRvGRY\nQM3yDS2rt6zenno1aFf/u1WcEw0qkSlSMtmlh204aOUdzcC8rnwAoAJNI9MIx+io\nN64/Tqu+5sqRXx5iBz2duB6PTeopuQKGbwT0F/sTf5sHzTFyCopSb//kxwKBgQCI\nfEbnJm8DKr5vy8eovrCfM1V0JtTpGnmr54IV+pDbNfxQzs0Vwr3TZmkyVxxvzIrI\nXcsxqLZ07hIErkZIpKkGQ8hqhm5GRcpC/9YYfTH6KZo51OBygU3ENMaqe3fk3H4V\nCW3bT5Pm37rrSJ+YDkz6FHF0lec23xZ6evUGDAsuSQKBgQDeH7uga7v7GLZ7GGSj\nsqJtQiw/OXppqWMMlzZiTG8tc/phCCoF/MtvcyuvaW8KE7hVZtnGF4sT+K2IE54w\nNv9x69yYWpisgHWx/L2WTcOqS9ZvDm0lQy/YXvRi14mYIkOmRdCUiSENW9HMdpZQ\nkirmhkXokoYZCx0vbatq3uozVg==\n-----END PRIVATE KEY-----\n",
    }),
    databaseURL: "https://dashboard-e7793-default-rtdb.asia-southeast1.firebasedatabase.app"
  });
}

const adminAuth = getAuth();

export { adminAuth };