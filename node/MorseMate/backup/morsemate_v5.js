//======================================================
//MQTT File Saver
//======================================================

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
  get_txt_file("felipe", "mari")
})

client.on('message', (topic, payload) => {
    var msg_rec = payload.toString()
    console.log('Received Message:', topic, msg_rec)
    var msg_array = msg_rec.split("!@#$%")
    if(msg_array.length != 3){
        console.log("inoperable string");
        return;
    }
    var txt_file_name = get_txt_name(msg_array[0], msg_array[1])
    console.log(`saving to file named ${txt_file_name}`)
    var content = msg_array[0] + "!@#$%" + msg_array[2] + "\n"
    fs.writeFile(`${txt_file_name}`, content, { flag: 'a+' }, err => {
      if (err) {
        console.error(err);
      }
      console.log("file written successfully");
    });
})

var get_txt_name = function(name1, name2){
    if(name1.localeCompare(name2) < 0){
        return `./logs/${name1}_${name2}.txt`
    }
    return `./logs/${name2}_${name1}.txt`
}

var get_txt_file = function(name1, name2){
  try {
    const data = fs.readFileSync(get_txt_name(name1, name2), 'utf8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}

//======================================================
//HTTP Web Server V2: express webserver with Socket.io
//======================================================

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('chat message', msg => {
    //Publish message on MQTT
    var router_topic = '/morsemate/nodemqtt'
    client.publish(topic, msg, { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
    })

    //emit message to listening webpages
    io.emit('chat message', msg);
    console.log(msg)
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});