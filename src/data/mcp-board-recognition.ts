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
  memoryMarkings: string[];
  visibleFeatures: string[];
  buttonLabels: string[];
  usbConnectorCount?: number;
  usbConnectorTypes: string[];
}

export const boardRecognitionMetadata: BoardRecognitionMetadata[] = [
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
