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

const topic = '/morsemate/router'
var router_topic = '/morsemate/router'

client.on('connect', () => {
  console.log('Connected')
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${router_topic}'`)
  })
  // client.publish(topic, 'nodejs mqtt test', { qos: 0, retain: false }, (error) => {
  //   if (error) {
  //     console.error(error)
  //   }
  // })
})

//router
client.on('message', (topic, payload) => {
    //parse inbound message
    var msg_rec = payload.toString()
    console.log('Received Message:', topic, msg_rec)
    var msg_array = msg_rec.split("!@#$%")
    if(msg_array.length != 4){
      console.log("inoperable string");
      return;
    }
    if(msg_array[0].localeCompare("request%$#@!") == 0){
      console.log("device is requesting text lines!")
      sendTextLines(msg_array[1], msg_array[2], msg_array[3]) //username, peer, password
      return;
    }
    if(!get_pass_correct(msg_array[0], msg_array[3])){
      console.log(`Mobile device tried to log in as ${msg_array[0]} with incorrect password`);
      return;
    }

    //route the message to the database
    var txt_file_name = get_txt_name(msg_array[0], msg_array[1])
    console.log(`saving to file named ${txt_file_name}`)
    var content = msg_array[0] + "!@#$%" + msg_array[2] + "!@#$%" 
                  + (new Date()).toLocaleDateString() + "!@#$%" + (new Date()).toLocaleTimeString() + "\n"
    fs.writeFile(`${txt_file_name}`, content, { flag: 'a+' }, err => {
      if (err) {
        console.error(err);
      }
      console.log("file written successfully");
    });

    //route the message to MQTT
    console.log(`sending message to ${msg_array[1]} with password ${get_pass(msg_array[1])}`)
    var peer_topic = `/morsemate/${msg_array[1]}!@!@!${get_pass(msg_array[1])}`;
    console.log(`sending message ${msg_array[2]} to peer ${msg_array[1]}`)
    console.log(`peer topic is ${peer_topic}`)
    client.publish(peer_topic, msg_array[2], { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
    })

    io.emit('refresh', "");
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
    return(data)
  } catch (err) {
    console.error(err);
    return(-1)
  }
}

var get_pass_correct = function(name, pass){
  try {
    const data = fs.readFileSync("./passwords.txt", 'utf8');
    var rows = data.split("\r\n")
    //console.log(name)
    var rows_len = rows.length
    for(var i = 0; i < rows_len; i++){
      thisrow = rows[i].split("!@#$%")
      //console.log(thisrow)
      //console.log(thisrow[0].localeCompare(name))
      if(thisrow[0].localeCompare(name) == 0){
        console.log(`${name}'s password is correct`)
        return (thisrow[1].localeCompare(pass) == 0)
      }
    }
    return -2;
  } catch (err) {
    console.error(err);
    return(-1)
  }
}

var get_pass = function(name){
  try {
    const data = fs.readFileSync("./passwords.txt", 'utf8');
    var rows = data.split("\r\n")
    console.log(name)
    var rows_len = rows.length
    for(var i = 0; i < rows_len; i++){
      thisrow = rows[i].split("!@#$%")
      //console.log(thisrow)
      //console.log(thisrow[0].localeCompare(name))
      if(thisrow[0].localeCompare(name) == 0){
        console.log(`${name}'s password is ${thisrow[1]}`)
        return (thisrow[1])
      }
    }
    return -2;
  } catch (err) {
    console.error(err);
    return(-1)
  }
}

// Maia Code //
var username_exists = function(name){
  try {
    const data = fs.readFileSync("./passwords.txt", 'utf8');
    var rows = data.split("\r\n")
    console.log(`checking if ${name} exists`)
    
    for(var i = 0; i < rows.length; i++){
      thisrow = rows[i].split("!@#$%")
      console.log(thisrow)
      console.log(thisrow[0].localeCompare(name))
      if(thisrow[0].localeCompare(name) == 0){
        console.log(`${name} exists`)
        return true //Username exists 
      }
    }
    return false;
  } catch (err) {
    console.error(err);
    return(-1)
  }
}

var sendTextLines = function(user, peer, pass){
  var login = get_pass_correct(user, pass)
    if(login == -1) io.emit('fetch response', `${peer}!@#$%File read error, consult staff.`, user, peer);
    else if(login == -2) io.emit('fetch response', `${peer}!@#$%Error, username not found!`, user, peer);
    else if(!login) {
      console.log(`User ${user} inputted the wrong password`)
      io.emit('fetch response', `${peer}!@#$%Incorrect password!`, user, peer);
    }
    else{
      console.log('Fetching file:', user, " ", peer)
      var text_file = get_txt_file(user, peer);
      // console.log(text_file)
      //emit text file (or failure) to listening webpages
      if(text_file == -1) io.emit("fetch failure", text_file)
      else io.emit('fetch response', text_file, user, peer);
      var split_file = text_file.split("\n")
      console.log("split file")
      console.log(split_file)
      var last_seven = []
      while(last_seven.length < 7 && split_file.length > 0){
        console.log(split_file.length)
        last_element = split_file.slice(-1)[0]
        console.log("last element")
        console.log(last_element)
        if(last_element && last_element.split("!@#$%")[0].localeCompare(user) != 0){
          last_seven.push(last_element.split("!@#$%")[1])
        }
        split_file = split_file.slice(0,-1)
      }
      console.log("last seven:")
      console.log(last_seven)
      last_seven.reverse().forEach(line => {
        //route the message to MQTT
        var peer_topic = `/morsemate/${user}`;
        console.log(`sending message ${line} to device belonging to ${user}`)
        client.publish(peer_topic, "~" + line, { qos: 0, retain: false }, (error) => {
          if (error) {
            console.error(error)
          }
        })
      })
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
  
  //Publish client's typed message on MQTT
  socket.on('chat message', (user, pass, peer, msg) => {
    var login = get_pass_correct(user, pass)
    if(!login){
      io.emit('fetch response', `${peer}!@#$%Cannot send message, incorrect password!`, user, peer);
      return;
    }
    client.publish(router_topic, `${user}!@#$%${peer}!@#$%${msg}!@#$%${pass}`, { qos: 0, retain: false }, (error) => {
      if (error) {
        console.error(error)
      }
    })
  });

  //Retrieve text file for client
  socket.on('fetch', (user, peer, pass) => {
    var login = get_pass_correct(user, pass)
    if(login == -1) io.emit('fetch response', `${peer}!@#$%File read error, consult staff.`, user, peer);
    else if(login == -2) io.emit('fetch response', `${peer}!@#$%Error, username not found!`, user, peer);
    else if(!login) {
      console.log(`User ${user} inputted the wrong password`)
      io.emit('fetch response', `${peer}!@#$%Incorrect password!`, user, peer);
    }
    else{
      console.log('Fetching file:', user, " ", peer)
      var text_file = get_txt_file(user, peer);
      // console.log(text_file)
      //emit text file (or failure) to listening webpages
      if(text_file == -1) io.emit("fetch failure", text_file)
      else io.emit('fetch response', text_file, user, peer);
    }
  });

  // Maia Code // 

  // Add a socket event listener for the signup request
  socket.on('signup', (username, password, peer) => {
    // Check if username is taken 
    console.log(`${username} has requested to sign up`)
    var username_exist = username_exists(username)
 
     // Create a new user account (store the username and encrypted passwords.txt)
    if(!username_exist) {
       console.log(`Creating a new user with password ${password}!`)
       const newRow = `${username}!@#$%${password}`;
       fs.appendFileSync('./passwords.txt', `${newRow}\r\n`);
       io.emit('fetch response', `${peer}!@#$%signup success!`, username, peer);
     } else {
      console.log(`${username} is already taken!`)
      io.emit('fetch response', `${peer}!@#$%signup failure: username already taken!`, username,peer);}
   });
});



http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});