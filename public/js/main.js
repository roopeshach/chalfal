
const socket = io();

const chatMessages = document.querySelector('.chat-messages');
const chatForm = document.getElementById('chat-form');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


const {username , room} = Qs.parse(location.search ,{
    ignoreQueryPrefix : true,
})

socket.emit('joinroom' , {username , room})


chatForm.addEventListener('submit' , (e)=>{
    e.preventDefault();
    const msg = e.target.elements.msg.value;

    socket.emit('chatMessage' , msg);
    
    e.target.elements.msg.value = ""
    e.target.elements.msg.focus()

})

function makeMessage(message){
    const div = document.createElement('div');

    div.classList.add('message');
    div.innerHTML = `
        <div style="border : 1px solid black; margin : 5px; padding: 5px;">
        <p> ${message.username} <span> ${message.time} </span></p>
        <p>
        ${message.text}
        </p>
        </div>
    `
    document.querySelector('.chat-messages').appendChild(div)


}


socket.on('message' , message =>{

    makeMessage(message)
})


socket.on('roomUsers', ({room , users}) => {
    outputRoomName(room);
    outputUsers(users);
})


function outputRoomName(room){
    roomName.innerText = room;
}

function outputUsers(users){
  userList.innerHTML = `
    ${users.map(user => `<li> ${user.username}</li>`).join('')}
  `
}