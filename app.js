
var noble = require('noble');

var serviceUuid = '181D';
var measurementCharacteristicUuid = '2a9d';
var measurementCharacteristic = null;

noble.on('stateChange', function(state) {
  console.log('stateChange = ' + state);

  if (state === 'poweredOn') {
    startScanning();
  }
  else {
    stopScanning();
  }
})

noble.on('discover', function(peripheral) {
  if (peripheral.advertisement.localName == 'A&D_UC-352BLE_5F01AA') {
      stopScanning();

      console.log('found our target peripheral');
      // console.log(peripheral.advertisement);

      peripheral.connect(function(err) {
        peripheral.discoverServices([serviceUuid], function(err, services) {
          services.forEach(function(service) {
            console.log('found our target service:', service.uuid);
            service.discoverCharacteristics([], function(err, characteristics) {

              characteristics.forEach(function(characteristic) {
                if (measurementCharacteristicUuid == characteristic.uuid) {
                  console.log('found our target characteristic:', characteristic.uuid);
                  measurementCharacteristic = characteristic;
                }
              })

              readPeripheralData();
            })
          })
        })
      })
  }
})

function readPeripheralData() {
  measurementCharacteristic.notify(true, function(error) {
    if (error) {
      console.log('readPeripheralData - notify error! ', error);
    }
  });

  measurementCharacteristic.on('data', function(data, isNotification) {
    console.log('Success! reading received = ');

    var rawData = data; // e.g. <Buffer 02 f0 0a e0 07 06 01 10 1d 3
    var targetReading = data.readUInt16LE(1); // skip 1 byte and extract UInitLE after that which is what we want
    var adjustedReading = targetReading * 0.005; // if it's KG then 0.005 resolution

    console.log(adjustedReading);

    startScanning();
  });
}

function startScanning() {
  console.log('scanning...');
  noble.startScanning([], false);
}

function stopScanning() {
  console.log('stop scanning...');
  noble.stopScanning();
}
