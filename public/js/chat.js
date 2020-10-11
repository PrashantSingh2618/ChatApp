const socket = io() ; 

const messageForm = document.querySelector('#take-input')
const messageFormInput = messageForm.querySelector('input')
const messageFormButton = messageForm.querySelector('button') 
const messages = document.querySelector('#messages') ;

const sidebarTemplate= document.querySelector('#sidebar-template').innerHTML ;
const messageTemplate = document.querySelector('#message-template').innerHTML ;

// to parse the query string and get the root code 
const {username,room} = Qs.parse(location.search,{ ignoreQueryPrefix : true}) 
const autoscroll = ()=>{
    
    // last message as message is added when this functo is called 
    const newMessage = messages.lastElementChild ;

    //height of new message
    const newMessageStyles = getComputedStyle(newMessage) ;
    const newMessageMargin = parseInt(newMessageStyles.marginBottom) ;
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin ;

    //visible height 
 
    const visibleHeight = messages.offsetHeight ;
    

    // height of message conatiner
    const containerHeight = messages.scrollHeight ;

    const scrollOffset = messages.scrollTop + visibleHeight ;
    if(containerHeight - newMessageHeight<=scrollOffset){
        messages.scrollTop = messages.scrollHeight ;

    }


}


messageForm.addEventListener('submit',(e)=>{
    e.preventDefault() ;

    messageFormButton.setAttribute('disabled','disbled') ;

    const inp = e.target.elements.message.value ;
    //3rd argument is a acknowledgenment 
    //it is processed when this method is called
    //jo emit karta hai he sends an callback in acknowledgement
    socket.emit('sendMessage',inp,(message)=>{
        messageFormButton.removeAttribute('disabled') ;
        messageFormInput.value='';
        messageFormInput.focus() ;
        console.log("the message is delivered",message);

    }) ;
})

socket.on('message',(message)=>{

    const html = Mustache.render(messageTemplate,{
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm A')
    })
    messages.insertAdjacentHTML('beforeend',html);
     autoscroll() ;
})

socket.on('roomData',({room,users})=>{
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html ;
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error);
        location.href='/'
    }

     
});