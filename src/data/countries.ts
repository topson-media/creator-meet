export interface Country {
  name: string;
  code: string; // ISO 3166-1 alpha-2
  dialCode: string; // E.164 calling code with '+'
  flag: string;
  placeholder: string;
  pattern?: string;
  minDigits: number;
  maxDigits: number;
}

// Rwanda is the default country (+250)
export const DEFAULT_COUNTRY_CODE = 'RW';

export const COUNTRIES: Country[] = [
  // 1. Rwanda - Default First
  {
    name: 'Rwanda',
    code: 'RW',
    dialCode: '+250',
    flag: '🇷🇼',
    placeholder: '788 123 456',
    minDigits: 9,
    maxDigits: 9,
  },
  // East & Central Africa
  {
    name: 'Kenya',
    code: 'KE',
    dialCode: '+254',
    flag: '🇰🇪',
    placeholder: '712 345 678',
    minDigits: 9,
    maxDigits: 9,
  },
  {
    name: 'Uganda',
    code: 'UG',
    dialCode: '+256',
    flag: '🇺🇬',
    placeholder: '772 123 456',
    minDigits: 9,
    maxDigits: 9,
  },
  {
    name: 'Tanzania',
    code: 'TZ',
    dialCode: '+255',
    flag: '🇹🇿',
    placeholder: '754 123 456',
    minDigits: 9,
    maxDigits: 9,
  },
  {
    name: 'Burundi',
    code: 'BI',
    dialCode: '+257',
    flag: '🇧🇮',
    placeholder: '79 123 456',
    minDigits: 8,
    maxDigits: 8,
  },
  {
    name: 'Democratic Republic of the Congo',
    code: 'CD',
    dialCode: '+243',
    flag: '🇨🇩',
    placeholder: '81 123 4567',
    minDigits: 9,
    maxDigits: 9,
  },
  {
    name: 'South Sudan',
    code: 'SS',
    dialCode: '+211',
    flag: '🇸🇸',
    placeholder: '912 345 678',
    minDigits: 9,
    maxDigits: 9,
  },
  {
    name: 'Ethiopia',
    code: 'ET',
    dialCode: '+251',
    flag: '🇪🇹',
    placeholder: '91 123 4567',
    minDigits: 9,
    maxDigits: 9,
  },
  // West & Southern Africa
  {
    name: 'Nigeria',
    code: 'NG',
    dialCode: '+234',
    flag: '🇳🇬',
    placeholder: '803 123 4567',
    minDigits: 10,
    maxDigits: 10,
  },
  {
    name: 'Ghana',
    code: 'GH',
    dialCode: '+233',
    flag: '🇬🇭',
    placeholder: '24 123 4567',
    minDigits: 9,
    maxDigits: 9,
  },
  {
    name: 'South Africa',
    code: 'ZA',
    dialCode: '+27',
    flag: '🇿🇦',
    placeholder: '82 123 4567',
    minDigits: 9,
    maxDigits: 9,
  },
  {
    name: 'Cameroon',
    code: 'CM',
    dialCode: '+237',
    flag: '🇨🇲',
    placeholder: '6 71 23 45 67',
    minDigits: 9,
    maxDigits: 9,
  },
  {
    name: 'Ivory Coast',
    code: 'CI',
    dialCode: '+225',
    flag: '🇨🇮',
    placeholder: '07 12 34 56 78',
    minDigits: 10,
    maxDigits: 10,
  },
  {
    name: 'Senegal',
    code: 'SN',
    dialCode: '+221',
    flag: '🇸🇳',
    placeholder: '77 123 45 67',
    minDigits: 9,
    maxDigits: 9,
  },
  {
    name: 'Zambia',
    code: 'ZM',
    dialCode: '+260',
    flag: '🇿🇲',
    placeholder: '97 123 4567',
    minDigits: 9,
    maxDigits: 9,
  },
  {
    name: 'Zimbabwe',
    code: 'ZW',
    dialCode: '+263',
    flag: '🇿🇼',
    placeholder: '77 123 4567',
    minDigits: 9,
    maxDigits: 9,
  },
  {
    name: 'Egypt',
    code: 'EG',
    dialCode: '+20',
    flag: '🇪🇬',
    placeholder: '10 1234 5678',
    minDigits: 10,
    maxDigits: 10,
  },
  {
    name: 'Morocco',
    code: 'MA',
    dialCode: '+212',
    flag: '🇲🇦',
    placeholder: '6 12 34 56 78',
    minDigits: 9,
    maxDigits: 9,
  },
  // North America
  {
    name: 'United States',
    code: 'US',
    dialCode: '+1',
    flag: '🇺🇸',
    placeholder: '202 555 0123',
    minDigits: 10,
    maxDigits: 10,
  },
  {
    name: 'Canada',
    code: 'CA',
    dialCode: '+1',
    flag: '🇨🇦',
    placeholder: '416 555 0123',
    minDigits: 10,
    maxDigits: 10,
  },
  {
    name: 'Mexico',
    code: 'MX',
    dialCode: '+52',
    flag: '🇲🇽',
    placeholder: '55 1234 5678',
    minDigits: 10,
    maxDigits: 10,
  },
  // Europe
  {
    name: 'United Kingdom',
    code: 'GB',
    dialCode: '+44',
    flag: '🇬🇧',
    placeholder: '7911 123456',
    minDigits: 10,
    maxDigits: 10,
  },
  {
    name: 'France',
    code: 'FR',
    dialCode: '+33',
    flag: '🇫🇷',
    placeholder: '6 12 34 56 78',
    minDigits: 9,
    maxDigits: 9,
  },
  {
    name: 'Germany',
    code: 'DE',
    dialCode: '+49',
    flag: '🇩🇪',
    placeholder: '151 12345678',
    minDigits: 10,
    maxDigits: 11,
  },
  {
    name: 'Belgium',
    code: 'BE',
    dialCode: '+32',
    flag: '🇧🇪',
    placeholder: '470 12 34 56',
    minDigits: 9,
    maxDigits: 9,
  },
  {
    name: 'Netherlands',
    code: 'NL',
    dialCode: '+31',
    flag: '🇳🇱',
    placeholder: '6 12345678',
    minDigits: 9,
    maxDigits: 9,
  },
  {
    name: 'Switzerland',
    code: 'CH',
    dialCode: '+41',
    flag: '🇨🇭',
    placeholder: '78 123 45 67',
    minDigits: 9,
    maxDigits: 9,
  },
  {
    name: 'Sweden',
    code: 'SE',
    dialCode: '+46',
    flag: '🇸🇪',
    placeholder: '70 123 45 67',
    minDigits: 9,
    maxDigits: 9,
  },
  {
    name: 'Spain',
    code: 'ES',
    dialCode: '+34',
    flag: '🇪🇸',
    placeholder: '612 34 56 78',
    minDigits: 9,
    maxDigits: 9,
  },
  {
    name: 'Italy',
    code: 'IT',
    dialCode: '+39',
    flag: '🇮🇹',
    placeholder: '312 345 6789',
    minDigits: 10,
    maxDigits: 10,
  },
  // Middle East & Asia
  {
    name: 'United Arab Emirates',
    code: 'AE',
    dialCode: '+971',
    flag: '🇦🇪',
    placeholder: '50 123 4567',
    minDigits: 9,
    maxDigits: 9,
  },
  {
    name: 'Saudi Arabia',
    code: 'SA',
    dialCode: '+966',
    flag: '🇸🇦',
    placeholder: '50 123 4567',
    minDigits: 9,
    maxDigits: 9,
  },
  {
    name: 'Qatar',
    code: 'QA',
    dialCode: '+974',
    flag: '🇶🇦',
    placeholder: '3312 3456',
    minDigits: 8,
    maxDigits: 8,
  },
  {
    name: 'India',
    code: 'IN',
    dialCode: '+91',
    flag: '🇮🇳',
    placeholder: '98765 43210',
    minDigits: 10,
    maxDigits: 10,
  },
  {
    name: 'Pakistan',
    code: 'PK',
    dialCode: '+92',
    flag: '🇵🇰',
    placeholder: '300 1234567',
    minDigits: 10,
    maxDigits: 10,
  },
  {
    name: 'China',
    code: 'CN',
    dialCode: '+86',
    flag: '🇨🇳',
    placeholder: '138 1234 5678',
    minDigits: 11,
    maxDigits: 11,
  },
  {
    name: 'Japan',
    code: 'JP',
    dialCode: '+81',
    flag: '🇯🇵',
    placeholder: '90 1234 5678',
    minDigits: 10,
    maxDigits: 10,
  },
  {
    name: 'South Korea',
    code: 'KR',
    dialCode: '+82',
    flag: '🇰🇷',
    placeholder: '10 1234 5678',
    minDigits: 10,
    maxDigits: 10,
  },
  {
    name: 'Singapore',
    code: 'SG',
    dialCode: '+65',
    flag: '🇸🇬',
    placeholder: '8123 4567',
    minDigits: 8,
    maxDigits: 8,
  },
  {
    name: 'Malaysia',
    code: 'MY',
    dialCode: '+60',
    flag: '🇲🇾',
    placeholder: '12 345 6789',
    minDigits: 9,
    maxDigits: 10,
  },
  {
    name: 'Indonesia',
    code: 'ID',
    dialCode: '+62',
    flag: '🇮🇩',
    placeholder: '812 3456 7890',
    minDigits: 10,
    maxDigits: 12,
  },
  {
    name: 'Philippines',
    code: 'PH',
    dialCode: '+63',
    flag: '🇵🇭',
    placeholder: '917 123 4567',
    minDigits: 10,
    maxDigits: 10,
  },
  // Latin America & Oceania
  {
    name: 'Brazil',
    code: 'BR',
    dialCode: '+55',
    flag: '🇧🇷',
    placeholder: '11 91234 5678',
    minDigits: 11,
    maxDigits: 11,
  },
  {
    name: 'Argentina',
    code: 'AR',
    dialCode: '+54',
    flag: '🇦🇷',
    placeholder: '9 11 1234 5678',
    minDigits: 10,
    maxDigits: 11,
  },
  {
    name: 'Colombia',
    code: 'CO',
    dialCode: '+57',
    flag: '🇨🇴',
    placeholder: '300 123 4567',
    minDigits: 10,
    maxDigits: 10,
  },
  {
    name: 'Australia',
    code: 'AU',
    dialCode: '+61',
    flag: '🇦🇺',
    placeholder: '412 345 678',
    minDigits: 9,
    maxDigits: 9,
  },
  {
    name: 'New Zealand',
    code: 'NZ',
    dialCode: '+64',
    flag: '🇳🇿',
    placeholder: '21 123 4567',
    minDigits: 9,
    maxDigits: 10,
  },
];

// Lookup by code or dialCode
export function findCountryByCode(code: string): Country {
  const found = COUNTRIES.find((c) => c.code.toUpperCase() === code.toUpperCase());
  return found || COUNTRIES[0]; // defaults to Rwanda
}

export function findCountryByDialCode(dialCode: string): Country {
  const clean = dialCode.startsWith('+') ? dialCode : `+${dialCode}`;
  const found = COUNTRIES.find((c) => c.dialCode === clean);
  return found || COUNTRIES[0];
}

/**
 * Validate national phone number digits according to country rules
 */
export function validatePhoneNumber(
  nationalNumber: string,
  country: Country
): { isValid: boolean; message?: string } {
  const digitsOnly = nationalNumber.replace(/\D/g, '');

  if (!digitsOnly) {
    return { isValid: false, message: 'Phone number is required.' };
  }

  // Country specific validations
  if (country.code === 'RW') {
    // Rwanda numbers: 9 digits, typically starts with 7 (e.g., 788 123 456, 72X, 73X, 79X)
    if (digitsOnly.length !== 9) {
      return {
        isValid: false,
        message: 'Rwandan phone numbers must be 9 digits (e.g., 788 123 456).',
      };
    }
    if (!/^7[2389]/.test(digitsOnly)) {
      return {
        isValid: false,
        message: 'Rwandan mobile numbers must start with 78, 72, 73, or 79.',
      };
    }
    return { isValid: true };
  }

  if (country.code === 'US' || country.code === 'CA') {
    if (digitsOnly.length !== 10) {
      return {
        isValid: false,
        message: `${country.name} phone numbers must be 10 digits.`,
      };
    }
    if (/^[01]/.test(digitsOnly)) {
      return {
        isValid: false,
        message: 'Area code cannot start with 0 or 1.',
      };
    }
    return { isValid: true };
  }

  if (country.code === 'GB') {
    if (digitsOnly.length !== 10) {
      return {
        isValid: false,
        message: 'UK mobile numbers must be 10 digits (without leading 0).',
      };
    }
    return { isValid: true };
  }

  if (country.code === 'KE') {
    if (digitsOnly.length !== 9) {
      return {
        isValid: false,
        message: 'Kenyan numbers must be 9 digits (e.g. 712 345 678).',
      };
    }
    return { isValid: true };
  }

  // General check against min/max
  if (digitsOnly.length < country.minDigits || digitsOnly.length > country.maxDigits) {
    return {
      isValid: false,
      message: `Phone number for ${country.name} must be between ${country.minDigits} and ${country.maxDigits} digits.`,
    };
  }

  return { isValid: true };
}

/**
 * Format phone number to international E.164 format (+[countryCode][nationalNumber])
 */
export function toE164(nationalNumber: string, country: Country): string {
  let digits = nationalNumber.replace(/\D/g, '');
  // Remove leading zeros if user typed e.g. 0788...
  if (digits.startsWith('0')) {
    digits = digits.replace(/^0+/, '');
  }
  return `${country.dialCode}${digits}`;
}

/**
 * Cleanly mask a phone number for security display (e.g. +250 ••• ••• 456)
 */
export function maskPhoneNumber(e164: string): string {
  if (!e164) return '';
  const digits = e164.replace(/\D/g, '');
  if (digits.length <= 4) return e164;
  const lastFour = digits.slice(-4);

  // Extract dial code prefix if available
  const match = e164.match(/^(\+\d{1,4})/);
  const prefix = match ? match[1] : '';

  return `${prefix} ••• ••• ${lastFour}`;
}

/**
 * Pretty format as user types
 */
export function formatAsYouType(raw: string, country: Country): string {
  let digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    digits = digits.replace(/^0+/, '');
  }

  if (country.code === 'RW') {
    // Format: 7XX XXX XXX
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
  }

  if (country.code === 'US' || country.code === 'CA') {
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 10)}`;
  }

  // Fallback generic spacing every 3 digits
  return digits.replace(/(\d{3})(?=\d)/g, '$1 ').trim();
}
