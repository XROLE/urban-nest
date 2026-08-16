export interface BankOption {
  code: string;
  name: string;
  bankCode: string;
}

export const NIGERIAN_BANKS: BankOption[] = [
  { code: 'access', name: 'Access Bank', bankCode: '044' },
  { code: 'gtb', name: 'Guaranty Trust Bank (GTB)', bankCode: '058' },
  { code: 'zenith', name: 'Zenith Bank', bankCode: '057' },
  { code: 'fbn', name: 'First Bank of Nigeria', bankCode: '011' },
  { code: 'uba', name: 'United Bank for Africa (UBA)', bankCode: '033' },
  { code: 'fidelity', name: 'Fidelity Bank', bankCode: '070' },
  { code: 'stanbic', name: 'Stanbic IBTC Bank', bankCode: '221' },
  { code: 'union', name: 'Union Bank of Nigeria', bankCode: '032' },
  { code: 'sterling', name: 'Sterling Bank', bankCode: '232' },
  { code: 'wema', name: 'Wema Bank (ALAT)', bankCode: '035' },
  { code: 'fcmb', name: 'FCMB', bankCode: '214' },
  { code: 'polaris', name: 'Polaris Bank', bankCode: '076' },
  { code: 'keystone', name: 'Keystone Bank', bankCode: '082' },
  { code: 'providus', name: 'Providus Bank', bankCode: '101' },
  { code: 'unity', name: 'Unity Bank', bankCode: '215' },
  { code: 'jaiz', name: 'Jaiz Bank', bankCode: '301' },
  { code: 'globus', name: 'Globus Bank', bankCode: '001' },
  { code: 'suntrust', name: 'SunTrust Bank', bankCode: '232' },
  { code: 'heritage', name: 'Heritage Bank', bankCode: '030' },
  { code: 'kuda', name: 'Kuda Microfinance Bank', bankCode: '50211' },
  { code: 'opay', name: 'OPay', bankCode: '999992' },
  { code: 'palmpay', name: 'PalmPay', bankCode: '999991' },
  { code: 'moniepoint', name: 'Moniepoint', bankCode: '50515' },
  { code: 'carbon', name: 'Carbon', bankCode: '56515' },
  { code: 'sparkle', name: 'Sparkle', bankCode: '51310' },
  { code: 'tangerine', name: 'Tangerine', bankCode: '50255' },
  { code: 'rubies', name: 'Rubies MFB', bankCode: '50245' },
  { code: 'piggyvest', name: 'PiggyVest', bankCode: '50411' },
  { code: 'cowrywise', name: 'Cowrywise', bankCode: '50412' },
  { code: 'access-diamond', name: 'Access Diamond Bank', bankCode: '063' },
];