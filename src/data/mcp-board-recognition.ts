/**
 * Small, source-reviewed identity data for the public board-recognition API.
 * Pin and warning summaries are generated from the board profiles themselves.
 */
export interface BoardRecognitionMetadata {
  apiId: string;
  profileId: string;
  boardName: string;
  aliases: string[];
  boardMarkings: string[];
  moduleMarkings?: string[];
  memoryMarkings: string[];
  visibleFeatures: string[];
  buttonLabels: string[];
  usbConnectorCount?: number;
  usbConnectorTypes: string[];
}

export const boardRecognitionMetadata: BoardRecognitionMetadata[] = [
  {
    apiId: 'esp32-pico-kit-1',
    profileId: 'esp32-pico-kit-1',
    boardName: 'ESP32-PICO-KIT-1',
    aliases: ['ESP32-PICO-KIT-1'],
    boardMarkings: ['ESP32-PICO-KIT-1'],
    memoryMarkings: [],
    visibleFeatures: ['Micro-USB connector', 'Boot button', 'EN button', 'CP2102N USB-to-UART bridge', 'two 18-pin headers'],
    buttonLabels: ['Boot', 'EN'],
    usbConnectorCount: 1,
    usbConnectorTypes: ['micro-usb'],
  },
  {
    apiId: 'esp32-ethernet-kit-v1-2',
    profileId: 'esp32-ethernet-kit-v1-2',
    boardName: 'ESP32-Ethernet-Kit v1.2',
    aliases: ['ESP32-Ethernet-Kit v1.2'],
    boardMarkings: ['ESP32-Ethernet-Kit'],
    memoryMarkings: [],
    visibleFeatures: ['RJ45 Ethernet port', 'IP101GRI Ethernet PHY', 'FT2232H USB bridge', 'Boot button', 'EN button', 'Function Switch'],
    buttonLabels: ['Boot', 'EN'],
    usbConnectorCount: 1,
    usbConnectorTypes: [],
  },
  {
    apiId: 'esp-wrover-kit-v4-1',
    profileId: 'esp-wrover-kit-v4-1',
    boardName: 'ESP-WROVER-KIT v4.1',
    aliases: ['ESP-WROVER-KIT v4.1'],
    boardMarkings: ['ESP-WROVER-KIT'],
    memoryMarkings: [],
    visibleFeatures: ['LCD screen', 'microSD card slot', 'OV7670 camera connector', 'RGB LED', 'FT2232HL USB bridge', 'Boot button', 'EN button', 'JP1 and JP2 jumpers'],
    buttonLabels: ['Boot', 'EN'],
    usbConnectorCount: 1,
    usbConnectorTypes: [],
  },
  {
    apiId: 'esp32-devkitm-1',
    profileId: 'esp32-devkitm-1',
    boardName: 'ESP32-DevKitM-1',
    aliases: ['ESP32-DevKitM-1'],
    boardMarkings: ['ESP32-DevKitM-1'],
    memoryMarkings: [],
    visibleFeatures: ['Micro-USB connector', 'Boot button', 'Reset button', 'USB-to-UART bridge'],
    buttonLabels: ['Boot', 'Reset'],
    usbConnectorCount: 1,
    usbConnectorTypes: ['micro-usb'],
  },
  {
    apiId: 'esp32-pico-devkitm-2',
    profileId: 'esp32-pico-devkitm-2',
    boardName: 'ESP32-PICO-DevKitM-2',
    aliases: ['ESP32-PICO-DevKitM-2'],
    boardMarkings: ['ESP32-PICO-DevKitM-2'],
    memoryMarkings: [],
    visibleFeatures: ['Micro-USB connector', 'Boot button', 'EN button', 'USB-to-UART bridge'],
    buttonLabels: ['Boot', 'EN'],
    usbConnectorCount: 1,
    usbConnectorTypes: ['micro-usb'],
  },
  {
    apiId: 'esp32-pico-kit-v4',
    profileId: 'esp32-pico-kit-v4',
    boardName: 'ESP32-PICO-KIT v4/v4.1',
    aliases: ['ESP32-PICO-KIT v4', 'ESP32-PICO-KIT v4.1'],
    boardMarkings: ['ESP32-PICO-KIT'],
    memoryMarkings: [],
    visibleFeatures: ['Micro-USB connector', 'Boot button', 'EN button', 'USB-to-UART bridge', 'two 20-pin headers'],
    buttonLabels: ['Boot', 'EN'],
    usbConnectorCount: 1,
    usbConnectorTypes: ['micro-usb'],
  },
  {
    apiId: 'esp32-devkitc-v4',
    profileId: 'esp32-devkitc-v4',
    boardName: 'ESP32-DevKitC V4',
    aliases: ['ESP32-DevKitC V4', 'ESP32 DevKitC V4'],
    boardMarkings: ['ESP32-DevKitC V4'],
    // ESP-WROOM-32 is an earlier module marking. It identifies a compatible
    // 38-pin DevKit-style layout but does not prove an official carrier board.
    moduleMarkings: ['ESP-WROOM-32'],
    memoryMarkings: [],
    visibleFeatures: ['Micro-USB connector', 'Boot button', 'EN button', 'USB-to-UART bridge', 'four mounting holes'],
    buttonLabels: ['Boot', 'EN'],
    usbConnectorCount: 1,
    usbConnectorTypes: ['micro-usb'],
  },
  {
    apiId: 'esp32-s3-devkitc-1',
    profileId: 'esp32s3-devkitc-1-v1-1',
    boardName: 'ESP32-S3-DevKitC-1',
    aliases: ['ESP32-S3-DevKitC-1', 'ESP32-S3-DevKitC-1 v1.1'],
    boardMarkings: ['ESP32-S3-DevKitC-1'],
    // The board profile supports several WROOM module variants; their markings
    // are emitted separately so they are not presented as carrier-board claims.
    memoryMarkings: [],
    visibleFeatures: ['Boot button', 'Reset button', 'addressable RGB LED', 'USB-to-UART bridge', 'native USB port'],
    buttonLabels: ['Boot', 'Reset'],
    usbConnectorCount: 2,
    usbConnectorTypes: [],
  },
  {
    apiId: 'esp32-s3-devkitm-1',
    profileId: 'esp32s3-devkitm-1',
    boardName: 'ESP32-S3-DevKitM-1',
    aliases: ['ESP32-S3-DevKitM-1'],
    boardMarkings: ['ESP32-S3-DevKitM-1'],
    memoryMarkings: [],
    visibleFeatures: ['Boot button', 'Reset button', 'addressable RGB LED', 'USB-to-UART bridge', 'native USB port'],
    buttonLabels: ['Boot', 'Reset'],
    usbConnectorCount: 2,
    usbConnectorTypes: [],
  },
  {
    apiId: 'esp32-c6-devkitc-1',
    profileId: 'esp32c6-devkitc-1',
    boardName: 'ESP32-C6-DevKitC-1',
    aliases: ['ESP32-C6-DevKitC-1', 'ESP32-C6-DevKitC-1 v1.2'],
    boardMarkings: ['ESP32-C6-DevKitC-1'],
    memoryMarkings: [],
    visibleFeatures: ['Boot button', 'Reset button', 'addressable RGB LED', 'USB-to-UART bridge', 'native USB port', 'J5 current measurement jumper'],
    buttonLabels: ['Boot', 'Reset'],
    usbConnectorCount: 2,
    usbConnectorTypes: ['usb-c'],
  },
  {
    apiId: 'esp32-c6-devkitm-1',
    profileId: 'esp32c6-devkitm-1',
    boardName: 'ESP32-C6-DevKitM-1',
    aliases: ['ESP32-C6-DevKitM-1'],
    boardMarkings: ['ESP32-C6-DevKitM-1'],
    memoryMarkings: [],
    visibleFeatures: ['Boot button', 'Reset button', 'addressable RGB LED', 'USB-to-UART bridge', 'native USB port', 'J5 current measurement jumper'],
    buttonLabels: ['Boot', 'Reset'],
    usbConnectorCount: 2,
    usbConnectorTypes: ['usb-c'],
  },
  {
    apiId: 'esp32-h2-devkitm-1',
    profileId: 'esp32h2-devkitm-1',
    boardName: 'ESP32-H2-DevKitM-1',
    aliases: ['ESP32-H2-DevKitM-1'],
    boardMarkings: ['ESP32-H2-DevKitM-1'],
    memoryMarkings: [],
    visibleFeatures: ['Boot button', 'Reset button', 'addressable RGB LED', 'USB-to-UART bridge', 'native USB port', 'J5 current measurement jumper'],
    buttonLabels: ['Boot', 'Reset'],
    usbConnectorCount: 2,
    usbConnectorTypes: ['usb-c'],
  },
];
