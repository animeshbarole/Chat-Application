const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server); //Passing sever object into the contructor 
const connect  = require('./config/db-config');

const Group  = require('./models/group')

//MiddleWare
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//app.use('/',express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    console.log('a user connected',socket.id);
    socket.on('disconnect', () => {
        console.log('user disconnected',socket.id);
      });

       
     
    socket.on('join_room',(data)=>{
        console.log("Joining a room ",data.roomid);

        socket.join(data.roomid);
    })
 
   
     socket.on("new_msg",(data)=>{
        
   
      console.log(data);
      io.to(data.roomid).emit("msg_recived",data);
   
     });

    


  });


  app.get('/chat/:roomid/:user',async(req,res)=>{
       
     const group  = await Group.findById(req.params.roomid);
  
     res.render('index',{
      roomid:req.params.roomid,
      user : req.params.user,
     groupName : group.name,
    });
     
  });

  app.get('/group',async(req,res)=>{
        
    res.render('group')
  });

  app.post('/group',async(req,res)=>{
      
     console.log(req.body);  //By simply doing this we cant get our Response hence we need to add middleWares  
      

     //Inbuilt function to create mongoose schema 
     await Group.create({
       name : req.body.name,
     })

     res.redirect('/group')

    });

server.listen(3000, async () => {
  console.log('listening on *:3000');
  await connect();
  console.log("DB Connected");
});