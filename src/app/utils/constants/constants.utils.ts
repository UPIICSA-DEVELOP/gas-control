/*
 * Copyright (C) MapLander S de R.L de C.V - All Rights Reserved
 *  Unauthorized copying of this file, via any medium is strictly prohibited
 *  Proprietary and confidential
 */
export class Constants {
  public static GoogleApiKey = 'AIzaSyA_wjUVArtBTuxYIMQb-qJnUvAuJrX1OkQ';
  public static IdSession = '_IdSession';
  public static UserInSession = 'UserInSession';
  public static SessionToken = 'SessionToken';
  public static UpdatePassword = 'UpdatePassword';
  public static NotSignature = 'NotSign';
  public static StationInDashboard = 'Station';
  public static ConsultancyInSession = 'Consultancy';
  public static ErrorMessageHandler = 'Ha ocurrido un error, intente más tarde';
  public static REGEX_WEBSITE = '[a-z0-9]+([\\-\\.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$';
  public static StationAdmin = 'Station-Admin';

  public static Filters = [
    'Todas',
    '',
    'Atrasadas',
    'Vencidas',
    'Terminadas'
  ];

  public static Level = [
    'Básico',
    'Intermedio',
    'Crítico'
  ];

  public static Zones = [
    'Dispensarios',
    'Islas',
    'Patio',
    'Tanques',
    'Cuarto de máquinas',
    'Cuarto eléctrico',
    'Cisternas tinacos y bombas de agua',
    'Cuarto de RP',
    'Planta de emergencia',
    'Sanitarios',
    'Otros'
  ];

  public static Frequency = [
    'Diario',
    'Cada 3 días',
    'Semanal',
    'Quincenal',
    'Mensual',
    'Bimestral',
    'Trimestral',
    'Cuatrimestral',
    'Semestral',
    'Anual'
  ];

  public static protocols = [
    {name: 'http://', value: 'http://'},
    {name: 'https://', value: 'https://'}
  ];

  public static rolesConsutancy = [
    {name: 'Gerente', value: 2},
    {name: 'Asistente', value: 3}
  ];

  public static roles2 = [
    {name: 'Director', value: 1},
    {name: 'Gerente', value: 2},
    {name: 'Asistente', value: 3},
    {name: 'Representante Legal', value: 4},
    {name: 'Encargado de Estación', value: 5},
    {name: 'Coordinador de Estación', value: 6}
  ];

  public static roles = [
    'Director',
    'Gerente',
    'Asistente',
    'Representante Legal',
    'Encargado de Estación',
    'Coordinador de Estación',
    'Coordinador de Estación',
  ];

  public static bloodGroup = [
    'O-',
    'O+',
    'A-',
    'A+',
    'B-',
    'B+',
    'AB-',
    'AB+'
  ];

  public static countries = [
    {
      name: 'Afghanistán',
      code: '93',
      iso: 'AF'
    },
    {
      name: 'Albania',
      code: '355',
      iso: 'AL'
    },
    {
      name: 'Argelia',
      code: '213',
      iso: 'DZ'
    },
    {
      name: 'Samoa Americana',
      code: '1684',
      iso: 'AS'
    },
    {
      name: 'Andorra',
      code: '376',
      iso: 'AD'
    },
    {
      name: 'Angola',
      code: '244',
      iso: 'AO'
    },
    {
      name: 'Anguila',
      code: '1264',
      iso: 'AI'
    },
    {
      name: 'Antártida',
      code: '672',
      iso: 'AQ'
    },
    {
      name: 'Antigua y Barbuda',
      code: '1268',
      iso: 'AG'
    },
    {
      name: 'Argentina',
      code: '54',
      iso: 'AR'
    },
    {
      name: 'Armenia',
      code: '374',
      iso: 'AM'
    },
    {
      name: 'Aruba',
      code: '297',
      iso: 'AW'
    },
    {
      name: 'Australia',
      code: '61',
      iso: 'AU'
    },
    {
      name: 'Austria',
      code: '43',
      iso: 'AT'
    },
    {
      name: 'Azerbaiyán',
      code: '994',
      iso: 'AZ'
    },
    {
      name: 'Bahamas',
      code: '1242',
      iso: 'BS'
    },
    {
      name: 'Baréin',
      code: '973',
      iso: 'BH'
    },
    {
      name: 'Bangladés',
      code: '880',
      iso: 'BD'
    },
    {
      name: 'Barbados',
      code: '1246',
      iso: 'BB'
    },
    {
      name: 'Belarús',
      code: '375',
      iso: 'BY'
    },
    {
      name: 'Bélgica',
      code: '32',
      iso: 'BE'
    },
    {
      name: 'Belice',
      code: '501',
      iso: 'BZ'
    },
    {
      name: 'Benín',
      code: '229',
      iso: 'BJ'
    },
    {
      name: 'Islas Bermudas',
      code: '1441',
      iso: 'BM'
    },
    {
      name: 'Bután',
      code: '975',
      iso: 'BT'
    },
    {
      name: 'Bolivia',
      code: '591',
      iso: 'BO'
    },
    {
      name: 'Bosnia y Herzegovina',
      code: '387',
      iso: 'BA'
    },
    {
      name: 'Botsuana',
      code: '267',
      iso: 'BW'
    },
    {
      name: 'Brasil',
      code: '55',
      iso: 'BR'
    },
    {
      name: 'Territotio Británico del Océano Índico',
      code: '246',
      iso: 'IO'
    },
    {
      name: 'Brunéi',
      code: '673',
      iso: 'BN'
    },
    {
      name: 'Bulgaria',
      code: '359',
      iso: 'BG'
    },
    {
      name: 'Burkina Faso',
      code: '226',
      iso: 'BF'
    },
    {
      name: 'Burundi',
      code: '257',
      iso: 'BI'
    },
    {
      name: 'Camboya',
      code: '855',
      iso: 'KH'
    },
    {
      name: 'Camerún',
      code: '237',
      iso: 'CM'
    },
    {
      name: 'Canadá',
      code: '1',
      iso: 'CA'
    },
    {
      name: 'Cabo Verde',
      code: '238',
      iso: 'CV'
    },
    {
      name: 'Islas Caimán',
      code: ' 345',
      iso: 'KY'
    },
    {
      name: 'República Centroafricana',
      code: '236',
      iso: 'CF'
    },
    {
      name: 'Chad',
      code: '235',
      iso: 'TD'
    },
    {
      name: 'Chile',
      code: '56',
      iso: 'CL'
    },
    {
      name: 'China',
      code: '86',
      iso: 'CN'
    },
    {
      name: 'Isla de Navidad',
      code: '61',
      iso: 'CX'
    },
    {
      name: 'Islas Cocos',
      code: '61',
      iso: 'CC'
    },
    {
      name: 'Colombia',
      code: '57',
      iso: 'CO'
    },
    {
      name: 'Comoras',
      code: '269',
      iso: 'KM'
    },
    {
      name: 'Islas Cook',
      code: '682',
      iso: 'CK'
    },
    {
      name: 'Costa Rica',
      code: '506',
      iso: 'CR'
    },
    {
      name: 'Croacia',
      code: '385',
      iso: 'HR'
    },
    {
      name: 'Cuba',
      code: '53',
      iso: 'CU'
    },
    {
      name: 'Curazao',
      code: '599',
      iso: 'CW'
    },
    {
      name: 'Chipre',
      code: '357',
      iso: 'CY'
    },
    {
      name: 'República Checa',
      code: '420',
      iso: 'CZ'
    },
    {
      name: 'República Democratica del Congo',
      code: '243',
      iso: 'CD'
    },
    {
      name: 'Dinamarca',
      code: '45',
      iso: 'DK'
    },
    {
      name: 'Yibuti',
      code: '253',
      iso: 'DJ'
    },
    {
      name: 'Dominica',
      code: '1767',
      iso: 'DM'
    },
    {
      name: 'República Dominicana',
      code: '1849',
      iso: 'DO'
    },
    {
      name: 'Timor Oriental',
      code: '670',
      iso: 'TL'
    },
    {
      name: 'Ecuador',
      code: '593',
      iso: 'EC'
    },
    {
      name: 'Egipto',
      code: '20',
      iso: 'EG'
    },
    {
      name: 'El Salvador',
      code: '503',
      iso: 'SV'
    },
    {
      name: 'Guinea Ecuatorial',
      code: '240',
      iso: 'GQ'
    },
    {
      name: 'Eritrea',
      code: '291',
      iso: 'ER'
    },
    {
      name: 'Estonia',
      code: '372',
      iso: 'EE'
    },
    {
      name: 'Etiopía',
      code: '251',
      iso: 'ET'
    },
    {
      name: 'Islas Malvinas',
      code: '500',
      iso: 'FK'
    },
    {
      name: 'Islas Feroe',
      code: '298',
      iso: 'FO'
    },
    {
      name: 'Fiyi',
      code: '679',
      iso: 'FJ'
    },
    {
      name: 'Finlandia',
      code: '358',
      iso: 'FI'
    },
    {
      name: 'Francia',
      code: '33',
      iso: 'FR'
    },
    {
      name: 'Polinesia Francesa',
      code: '689',
      iso: 'PF'
    },
    {
      name: 'Gabón',
      code: '241',
      iso: 'GA'
    },
    {
      name: 'Gambia',
      code: '220',
      iso: 'GM'
    },
    {
      name: 'Georgia',
      code: '995',
      iso: 'GE'
    },
    {
      name: 'Alemania',
      code: '49',
      iso: 'DE'
    },
    {
      name: 'Ghana',
      code: '233',
      iso: 'GH'
    },
    {
      name: 'Gibraltar',
      code: '350',
      iso: 'GI'
    },
    {
      name: 'Grecia',
      code: '30',
      iso: 'GR'
    },
    {
      name: 'Tierra Verde',
      code: '299',
      iso: 'GL'
    },
    {
      name: 'Granada',
      code: '1473',
      iso: 'GD'
    },
    {
      name: 'Guam',
      code: '1671',
      iso: 'GU'
    },
    {
      name: 'Guatemala',
      code: '502',
      iso: 'GT'
    },
    {
      name: 'Guernsey',
      code: '44',
      iso: 'GG'
    },
    {
      name: 'Guinea',
      code: '224',
      iso: 'GN'
    },
    {
      name: 'Guinea-Bisáu',
      code: '245',
      iso: 'GW'
    },
    {
      name: 'Guayana',
      code: '595',
      iso: 'GY'
    },
    {
      name: 'Haití',
      code: '509',
      iso: 'HT'
    },
    {
      name: 'Honduras',
      code: '504',
      iso: 'HN'
    },
    {
      name: 'Hong Kong',
      code: '852',
      iso: 'HK'
    },
    {
      name: 'Hungría',
      code: '36',
      iso: 'HU'
    },
    {
      name: 'Islandia',
      code: '354',
      iso: 'IS'
    },
    {
      name: 'India',
      code: '91',
      iso: 'IN'
    },
    {
      name: 'Indonesia',
      code: '62',
      iso: 'ID'
    },
    {
      name: 'Irán',
      code: '98',
      iso: 'IR'
    },
    {
      name: 'Irak',
      code: '964',
      iso: 'IQ'
    },
    {
      name: 'Irlanda',
      code: '353',
      iso: 'IE'
    },
    {
      name: 'Isla del Hombre',
      code: '441624',
      iso: 'IM'
    },
    {
      name: 'Israel',
      code: '972',
      iso: 'IL'
    },
    {
      name: 'Italia',
      code: '39',
      iso: 'IT'
    },
    {
      name: 'Costa de Marfíl',
      code: '225',
      iso: 'CI'
    },
    {
      name: 'Jamaica',
      code: '1876',
      iso: 'JM'
    },
    {
      name: 'Japón',
      code: '81',
      iso: 'JP'
    },
    {
      name: 'Jersey',
      code: '44',
      iso: 'JE'
    },
    {
      name: 'Jordán',
      code: '962',
      iso: 'JO'
    },
    {
      name: 'Kazajistán',
      code: '77',
      iso: 'KZ'
    },
    {
      name: 'Kenia',
      code: '254',
      iso: 'KE'
    },
    {
      name: 'Kiribati',
      code: '686',
      iso: 'KI'
    },
    {
      name: 'Kuwait',
      code: '965',
      iso: 'KW'
    },
    {
      name: 'Kirguistán',
      code: '996',
      iso: 'KG'
    },
    {
      name: 'Laos',
      code: '856',
      iso: 'LA'
    },
    {
      name: 'Letonia',
      code: '371',
      iso: 'LV'
    },
    {
      name: 'Líbano',
      code: '961',
      iso: 'LB'
    },
    {
      name: 'Lesoto',
      code: '266',
      iso: 'LS'
    },
    {
      name: 'Liberia',
      code: '231',
      iso: 'LR'
    },
    {
      name: 'Libia',
      code: '218',
      iso: 'LY'
    },
    {
      name: 'Liechtenstein',
      code: '423',
      iso: 'LI'
    },
    {
      name: 'Lituania',
      code: '370',
      iso: 'LT'
    },
    {
      name: 'Luxemburgo',
      code: '352',
      iso: 'LU'
    },
    {
      name: 'Macao',
      code: '853',
      iso: 'MO'
    },
    {
      name: 'República de Macedonia',
      code: '389',
      iso: 'MK'
    },
    {
      name: 'Madagascar',
      code: '261',
      iso: 'MG'
    },
    {
      name: 'Malawi',
      code: '265',
      iso: 'MW'
    },
    {
      name: 'Malasia',
      code: '60',
      iso: 'MY'
    },
    {
      name: 'Maldivas',
      code: '960',
      iso: 'MV'
    },
    {
      name: 'Mali',
      code: '223',
      iso: 'ML'
    },
    {
      name: 'Malta',
      code: '356',
      iso: 'MT'
    },
    {
      name: 'Islas Marshall',
      code: '692',
      iso: 'MH'
    },
    {
      name: 'Mauritania',
      code: '222',
      iso: 'MR'
    },
    {
      name: 'Mauricio',
      code: '230',
      iso: 'MU'
    },
    {
      name: 'Mayotte',
      code: '262',
      iso: 'YT'
    },
    {
      name: 'México',
      code: '52',
      iso: 'MX'
    },
    {
      name: 'Micronesia',
      code: '691',
      iso: 'FM'
    },
    {
      name: 'Moldavia',
      code: '373',
      iso: 'MD'
    },
    {
      name: 'Mónaco',
      code: '377',
      iso: 'MC'
    },
    {
      name: 'Mongolia',
      code: '976',
      iso: 'MN'
    },
    {
      name: 'Montenegro',
      code: '382',
      iso: 'ME'
    },
    {
      name: 'Montserrat',
      code: '1664',
      iso: 'MS'
    },
    {
      name: 'Marruecos',
      code: '212',
      iso: 'MA'
    },
    {
      name: 'Mozambique',
      code: '258',
      iso: 'MZ'
    },
    {
      name: 'Republica de la Unión de Myanmar',
      code: '95',
      iso: 'MM'
    },
    {
      name: 'Namibia',
      code: '264',
      iso: 'NA'
    },
    {
      name: 'Nauru',
      code: '674',
      iso: 'NR'
    },
    {
      name: 'Nepal',
      code: '977',
      iso: 'NP'
    },
    {
      name: 'Paises Bajos',
      code: '31',
      iso: 'NL'
    },
    {
      name: 'Antillas Neerlandesas',
      code: '599',
      iso: 'AN'
    },
    {
      name: 'Nueva Caledonia',
      code: '687',
      iso: 'NC'
    },
    {
      name: 'Nueva Zelanda',
      code: '64',
      iso: 'NZ'
    },
    {
      name: 'Nicaragua',
      code: '505',
      iso: 'NI'
    },
    {
      name: 'Níger',
      code: '227',
      iso: 'NE'
    },
    {
      name: 'Nigeria',
      code: '234',
      iso: 'NG'
    },
    {
      name: 'Niue',
      code: '683',
      iso: 'NU'
    },
    {
      name: 'Corea del Norte',
      code: '850',
      iso: 'KP'
    },
    {
      name: 'Islas Marianas del Norte',
      code: '1670',
      iso: 'MP'
    },
    {
      name: 'Noruega',
      code: '47',
      iso: 'NO'
    },
    {
      name: 'Omán',
      code: '968',
      iso: 'OM'
    },
    {
      name: 'Pakistán',
      code: '92',
      iso: 'PK'
    },
    {
      name: 'Palaos',
      code: '680',
      iso: 'PW'
    },
    {
      name: 'Palestina',
      code: '970',
      iso: 'PS'
    },
    {
      name: 'Panamá',
      code: '507',
      iso: 'PA'
    },
    {
      name: 'Papúa Nueva Guinea',
      code: '675',
      iso: 'PG'
    },
    {
      name: 'Paraguay',
      code: '595',
      iso: 'PY'
    },
    {
      name: 'Perú',
      code: '51',
      iso: 'PE'
    },
    {
      name: 'Filipinas',
      code: '63',
      iso: 'PH'
    },
    {
      name: 'Islas Pitcairn',
      code: '872',
      iso: 'PN'
    },
    {
      name: 'Polonia',
      code: '48',
      iso: 'PL'
    },
    {
      name: 'Portugal',
      code: '351',
      iso: 'PT'
    },
    {
      name: 'Puerto Rico',
      code: '1939',
      iso: 'PR'
    },
    {
      name: 'Qatar',
      code: '974',
      iso: 'QA'
    },
    {
      name: 'República del Congo',
      code: '242',
      iso: 'CG'
    },
    {
      name: 'Reunion',
      code: '262',
      iso: 'RE'
    },
    {
      name: 'Rumania',
      code: '40',
      iso: 'RO'
    },
    {
      name: 'Rusia',
      code: '7',
      iso: 'RU'
    },
    {
      name: 'Ruanda',
      code: '250',
      iso: 'RW'
    },
    {
      name: 'San Bartolomé',
      code: '590',
      iso: 'BL'
    },
    {
      name: 'Santa Helena',
      code: '290',
      iso: 'SH'
    },
    {
      name: 'San Cristóbal y Nieves',
      code: '1869',
      iso: 'KN'
    },
    {
      name: 'Santa Lucía',
      code: '1758',
      iso: 'LC'
    },
    {
      name: 'San Martín',
      code: '590',
      iso: 'MF'
    },
    {
      name: 'San Pedro y Miquelón',
      code: '508',
      iso: 'PM'
    },
    {
      name: 'San Vincente y las Granadinas',
      code: '1784',
      iso: 'VC'
    },
    {
      name: 'Samoa',
      code: '685',
      iso: 'WS'
    },
    {
      name: 'San Marino',
      code: '378',
      iso: 'SM'
    },
    {
      name: 'Santo Tomé y Príncipe',
      code: '239',
      iso: 'ST'
    },
    {
      name: 'Arabia Saudita',
      code: '966',
      iso: 'SA'
    },
    {
      name: 'Senegal',
      code: '221',
      iso: 'SN'
    },
    {
      name: 'Serbia',
      code: '381',
      iso: 'RS'
    },
    {
      name: 'Seychelles',
      code: '248',
      iso: 'SC'
    },
    {
      name: 'Sierra Leona',
      code: '232',
      iso: 'SL'
    },
    {
      name: 'Singapur',
      code: '65',
      iso: 'SG'
    },
    {
      name: 'Eslovaquia',
      code: '421',
      iso: 'SK'
    },
    {
      name: 'Eslovenia',
      code: '386',
      iso: 'SI'
    },
    {
      name: 'Islas Salomón',
      code: '677',
      iso: 'SB'
    },
    {
      name: 'Somalia',
      code: '252',
      iso: 'SO'
    },
    {
      name: 'Sudáfrica',
      code: '27',
      iso: 'ZA'
    },
    {
      name: 'Corea del Sur',
      code: '82',
      iso: 'KR'
    },
    {
      name: 'Sudán del Sur',
      code: '211',
      iso: 'SS'
    },
    {
      name: 'España',
      code: '34',
      iso: 'ES'
    },
    {
      name: 'Sri Lanka',
      code: '94',
      iso: 'LK'
    },
    {
      name: 'Sudán',
      code: '249',
      iso: 'SD'
    },
    {
      name: 'Suriname',
      code: '597',
      iso: 'SR'
    },
    {
      name: 'Svalbard y Jan Mayen',
      code: '47',
      iso: 'SJ'
    },
    {
      name: 'Suazilandia',
      code: '268',
      iso: 'SZ'
    },
    {
      name: 'Suecia',
      code: '46',
      iso: 'SE'
    },
    {
      name: 'Suiza',
      code: '41',
      iso: 'CH'
    },
    {
      name: 'Siria',
      code: '963',
      iso: 'SY'
    },
    {
      name: 'Taiwan',
      code: '886',
      iso: 'TW'
    },
    {
      name: 'Tayikistán',
      code: '992',
      iso: 'TJ'
    },
    {
      name: 'Tanzania',
      code: '255',
      iso: 'TZ'
    },
    {
      name: 'Tailandia',
      code: '66',
      iso: 'TH'
    },
    {
      name: 'Togo',
      code: '228',
      iso: 'TG'
    },
    {
      name: 'Tokelau',
      code: '690',
      iso: 'TK'
    },
    {
      name: 'Tonga',
      code: '676',
      iso: 'TO'
    },
    {
      name: 'Trinidad y Tobago',
      code: '1868',
      iso: 'TT'
    },
    {
      name: 'Túnez',
      code: '216',
      iso: 'TN'
    },
    {
      name: 'Turquía',
      code: '90',
      iso: 'TR'
    },
    {
      name: 'Turkmenistán',
      code: '993',
      iso: 'TM'
    },
    {
      name: 'Islas Turcas y Caicos',
      code: '1649',
      iso: 'TC'
    },
    {
      name: 'Tuvalu',
      code: '688',
      iso: 'TV'
    },
    {
      name: 'Uganda',
      code: '256',
      iso: 'UG'
    },
    {
      name: 'Ucrania',
      code: '380',
      iso: 'UA'
    },
    {
      name: 'Emiratos Árabes Unidos',
      code: '971',
      iso: 'AE'
    },
    {
      name: 'Reino Unido',
      code: '44',
      iso: 'GB'
    },
    {
      name: 'Estados Unidos',
      code: '1',
      iso: 'US'
    },
    {
      name: 'Uruguay',
      code: '598',
      iso: 'UY'
    },
    {
      name: 'Uzbekistán',
      code: '998',
      iso: 'UZ'
    },
    {
      name: 'Vanuatu',
      code: '678',
      iso: 'VU'
    },
    {
      name: 'Venezuela',
      code: '58',
      iso: 'VE'
    },
    {
      name: 'Vietnam',
      code: '84',
      iso: 'VN'
    },
    {
      name: 'Wallis y Futuna',
      code: '681',
      iso: 'WF'
    },
    {
      name: 'Sahara Occidental',
      code: '212',
      iso: 'EH'
    },
    {
      name: 'Yemen',
      code: '967',
      iso: 'YE'
    },
    {
      name: 'Zambia',
      code: '260',
      iso: 'ZM'
    },
    {
      name: 'Zimbabue',
      code: '263',
      iso: 'ZW'
    }
  ];
}
