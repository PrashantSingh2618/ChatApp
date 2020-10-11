const users =[] ;

//addUser
const addUser = ({id,username,room})=>{
    username = username.trim().toLowerCase() ;
    room = room.trim().toLowerCase() ;

    if(!username || !room )
    {
        return {
            error:"Username and room are required"
        }
    }
    //check for existing user 
    const existingUser = users.find((user) => {
        return  user.room===room && user.username === username ;
    })
    if(existingUser)
    return {
        error: 'Username is already in use!'
    }

    const user ={id,username,room} ;
    users.push(user);

    return {user} ;

}



//remove user

const removeUser =(id)=>{
    const index  = users.findIndex((user)=>{
        return user.id ===id ;
    })
    if(index!==-1)
    return users.splice(index,1)[0] ;
}


//getuser 
const getUser=(id)=>{
    return users.find((user)=>user.id===id)
}

//get user in a room
const getUserInRoom =(room)=>{
    return users.filter((user)=> user.room === room) ;
}



module.exports ={
    addUser,
    removeUser,
    getUser,
    getUserInRoom

}