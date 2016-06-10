
var noble = require('noble');
var Devices = require('./devices');

var serviceUuidWeight = Devices.serviceUuidWeight;
var serviceUuidBP = Devices.serviceUuidBP;
var measurementCharacteristicUuidWeight = Devices.measurementCharacteristicUuidWeight;
var measurementCharacteristicUuidBP = Devices.measurementCharacteristicUuidBP;
var measurementCharacteristicWeight = null;

noble.on('stateChange', function(state) {
  console.log('stateChange = ' + state);

  if (state === 'poweredOn') {
    startScanning();
  }
  else {
    // stopScanning();
  }
})

noble.on('discover', function(peripheral) {
  if (peripheral.advertisement.localName == Devices.localNameWeight) {
      // stopScanning();

      console.log('found our target WEIGHT peripheral');
      // console.log(peripheral.advertisement);

      peripheral.connect(function(err) {
        peripheral.discoverServices([serviceUuidWeight], function(err, services) {
          services.forEach(function(service) {
            console.log('found our target Weight service:', service.uuid);
            service.discoverCharacteristics([], function(err, characteristics) {

              characteristics.forEach(function(characteristic) {
                if (measurementCharacteristicUuidWeight == characteristic.uuid) {
                  console.log('found our target Weight characteristic:', characteristic.uuid);
                  measurementCharacteristicWeight = characteristic;
                }
              })

              readPeripheralDataWeight();
            })
          })
        })
      })
  }
  else if (peripheral.advertisement.localName == Devices.localNameBP) {
    // stopScanning();

    console.log('found our target BP peripheral');

    peripheral.connect(function(err) {
      peripheral.discoverServices([serviceUuidBP], function(err, services) {
        services.forEach(function(service) {
          console.log('found our target BP service:', service.uuid);
          service.discoverCharacteristics([], function(err, characteristics) {

            characteristics.forEach(function(characteristic) {
              if (measurementCharacteristicUuidBP == characteristic.uuid) {
                console.log('found our target BP characteristic:', characteristic.uuid);
                measurementCharacteristicBP = characteristic;
              }
            })
             //readPeripheralDataBP();
          })
        })
      })
    })
  }
})

function readPeripheralDataWeight() {
  measurementCharacteristicWeight.notify(true, function(error) {
    if (error) {
      console.log('readPeripheralDataWeight - notify error! ', error);
    }
  });

  measurementCharacteristicWeight.on('data', function(data, isNotification) {
    console.log('Success! Weight reading received = ');

    var rawData = data; // e.g. <Buffer 02 f0 0a e0 07 06 01 10 1d 3
    var targetReading = data.readUInt16LE(1); // skip 1 byte and extract UInitLE after that which is what we want
    var adjustedReading = targetReading * 0.005; // if it's KG then 0.005 resolution

    console.log(adjustedReading);

    startScanning();
  });
}

function readPeripheralDataBP() {
  measurementCharacteristicBP.notify(true, function(error) {
    if (error) {
      console.log('readPeripheralDataBP - notify error! ', error);
    }
  });

  measurementCharacteristicBP.on('data', function(data, isNotification) {
    console.log('Success! BP reading received = ');

    var rawData = data; // e.g. <Buffer 02 f0 0a e0 07 06 01 10 1d 3

    console.log(rawData);

    console.log('Systolic 1 - float?')
    console.log(buf.readFloatLE(1));
    console.log(buf.readFloatBE(1));

    console.log('Diastolic 1 - float?')
    console.log(buf.readFloatLE(3));
    console.log(buf.readFloatBE(3));

    console.log('Mean Arterial Pressure 1 - float?')
    console.log(buf.readFloatLE(5));
    console.log(buf.readFloatBE(5));

    console.log('Systolic 2 - float?')
    console.log(buf.readFloatLE(7));
    console.log(buf.readFloatBE(7));

    console.log('Diastolic 2 - float?')
    console.log(buf.readFloatLE(9));
    console.log(buf.readFloatBE(9));

    console.log('Mean Arterial Pressure 2 - float?')
    console.log(buf.readFloatLE(11));
    console.log(buf.readFloatBE(11));

    console.log('___________________________________');

    console.log('Systolic 1 - int?')
    console.log(buf.readUInt16LE(1));
    console.log(buf.readFlreadUInt16LEoatBE(1));

    console.log('Diastolic 1 - int?')
    console.log(buf.readUInt16LE(3));
    console.log(buf.readUInt16LE(3));

    console.log('Mean Arterial Pressure 1 - int?')
    console.log(buf.readUInt16LE(5));
    console.log(buf.readUInt16LE(5));

    console.log('Systolic 2 - int?')
    console.log(buf.readUInt16LE(7));
    console.log(buf.readUInt16LE(7));

    console.log('Diastolic 2 - int?')
    console.log(buf.readUInt16LE(9));
    console.log(buf.readUInt16LE(9));

    console.log('Mean Arterial Pressure 2 - int?')
    console.log(buf.readUInt16LE(11));
    console.log(buf.readUInt16LE(11));

    console.log('___________________________________');

    // var targetReading = data.readUInt16LE(1); // skip 1 byte and extract UInitLE after that which is what we want
    // var adjustedReading = targetReading * 0.005; // if it's KG then 0.005 resolution
    //
    // console.log(adjustedReading);

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
