const mqtt = require('mqtt')
const fs = require('fs'); 

const host_mqtt = 'broker.emqx.io'
const port_mqtt = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host_mqtt}:${port_mqtt}`
const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: 'emqx',
  password: 'public',
  reconnectPeriod: 1000,
})

const topic = '/morsemate/nodemqtt'

client.on('connect', () => {
  console.log('Connected')
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`)
  })
  client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  })
})

client.on('message', (topic, payload) => {
    var msg_rec = payload.toString()
    console.log('Received Message:', topic, msg_rec)
    var msg_array = msg_rec.split("!@#$%")
    if(msg_array.length != 3){
        console.log("inoperable string")
        return;
    }
    var txt_file_name = get_txt_name(msg_array[0], msg_array[1])
    console.log(`saving to file named ${txt_file_name}`)
    var content = msg_array[0] + "!@#$%" + msg_array[2] + "\n"
    fs.writeFile(`./logs/${txt_file_name}`, content, { flag: 'a+' }, err => {
      if (err) {
        console.error(err);
      }
      console.log("file written successfully");
    });
})

var get_txt_name = function(name1, name2){
    if(name1.localeCompare(name2) < 0){
        return `${name1}_${name2}`
    }
    return `${name2}_${name1}`
}
