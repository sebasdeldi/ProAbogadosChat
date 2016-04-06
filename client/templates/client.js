Meteor.subscribe("messages");
Meteor.subscribe('userStatus');
Meteor.subscribe('chats');
Meteor.subscribe('allUsers');
Meteor.subscribe('files');
Meteor.subscribe('userData');


Template.input.events = {
    //Al hundir enter, busco el id del chat al que pertenece este input, capturo el mensaje y el username e inserto en la coleccion mensajes. Luego se elimina el mensaje del campo
        'keydown input' : function (event) {
            if (event.which == 13) { // 13 is the enter key event
                var idChat= event.target.getAttribute("data-id");
                console.log("Este es el target: " + event.target.parentNode);
                //console.log(id);
                var username = Meteor.user().username;
                //console.log(event.target);
                var message = event.target.value;
                //console.log(message);
                if (message !== '') {
                    Messages.insert({
                        name: username,
                        message: message,
                        time: Date.now(),
                        chatId: idChat,
                    });

                    event.target.value = '';

                }



                for(idUser of Chats.findOne({_id:idChat}).users){
                    console.warn(idUser);
                    if(idUser != Meteor.userId()){
                        
                        console.log("Este es el id del usuario al que le hablo " + idUser);
                        Meteor.users.update(
                           { _id: idUser},
                           { $addToSet: { activeChats: idChat } }
                        ); 
                    }
                }  

                $(event.target).prev().animate({ scrollTop: 
                $(event.target).prev()[0].scrollHeight});
            }


            
        },
        'change .custom-file-input': function(event, template) {

            console.log("Enviando archivo a: "+event.target.getAttribute("data-id") );
            var files = event.target.files;
            for (var i = 0, ln = files.length; i < ln; i++) {
                var idFile = Files.insert(files[i], function (err, fileObj) {});
                var id = event.target.getAttribute("data-id");
                console.log(idFile);
                var username = Meteor.user().username;
                Messages.insert({
                    name: username,
                    file: idFile._id,
                    time: Date.now(),
                    chatId: id,
                });
            }

            $(event.target).parent().prev().prev().animate({ scrollTop: 
            $(event.target).parent().prev().prev()[0].scrollHeight});
        }
};


Template.usersOnline.helpers({
    //Retorna los usuarios que estan conectados en el momento

    usersOnline: function() {
        return Meteor.users.find({"status.online": true});
    }
});



Template.usersOnline.events = {



    //Cuando se le da click a algun usuario conectado, si no es la misma persona, o no existe un chat en cualquier direccion (from: x para:otro||from:otro to:x) se crea un nuevo chat.
    'click .user' : function (event) {
        var id = event.target.getAttribute("data-id");
        console.log("Click en user: "+id);

        if (Meteor.userId() != id) {
            var chat = Chats.findOne( {$and:[
                { users: { $in: [Meteor.userId()] } },
                { users: { $in: [id] } }
            ]});
            
            
            if(!chat){
                console.log("Creando chat");
                chat = Chats.insert({
                    users: [ Meteor.userId(),id ],
                    time: Date.now(),
                });
                console.log(chat);

            }else{
                console.log("Ya existe y es el chat " + chat._id);
                chat = chat._id;
            }



            console.log(chat);

            Meteor.users.update(
               { _id: Meteor.userId() },
               { $addToSet: { activeChats: chat } }
            );    

        }
    }

};



Template.chats.helpers({
    //Solo retorna los chats que he creado o que tengan uno o mas mensajes
    chats: function () {
        var activeChats = Meteor.users.findOne({_id:Meteor.userId()}).activeChats;
        console.log("Chats Activos: " + activeChats);

       if(!activeChats) return false;

        var chats = Chats.find( {$and:[
            { users: { $in: [Meteor.userId()] } },
            { _id: { $in: activeChats } }
        ]});

        console.log("Cargando chats:");
        console.log(chats);


        setTimeout(function(){
            var count_chats = jQuery(".msg_box" ).length;
            var sum_width = 20;
            jQuery.each(jQuery(".msg_box" ), function() {
                sum_width += 260;
                jQuery(this).css( "right", sum_width);
            });
        }, 100);
        return chats;
    }

});

Template.chat.events({
    'click .close': function (event){
        var id = event.target.getAttribute("data-id");
        console.log(id);
        var chat = Chats.findOne( {$and:[
                { users: { $in: [Meteor.userId()] } },
                { _id: id }
        ]});
        console.log(chat);

        Meteor.users.update(
           { _id: Meteor.userId() },
           { $pull: { activeChats: chat._id } }
        );

        console.log("Chat Eliminado");    
    }
})


Template.chat.helpers({
    //Retorna el usuario con el cual se esta chateando
    username: function (id) {

        //console.log(id);

        var chat = Chats.findOne({_id: id});
        //console.log(chat);
        var user;

        for(getID of chat.users){
            console.warn(getID);
            if(getID != Meteor.userId()){
                console.info("ENTRE");
                user = Meteor.users.findOne({_id: getID});
                return user.username;
            }
        }

        return "Incognito";

    },

    isFile: function(id){
        var message = Messages.findOne({_id:id});
        console.log(id);
        if(typeof message.file != "undefined"){
            console.log("Es File");
            return true;
        }else{

            console.log("No Es File");
            return false;
        }
    },

    getFile: function (file) {
        console.log(file);
        return Files.find({_id:file});
    },

    //Recibe el id del chat que quiero imprimir, busco los mensajes que tengan ese id en la coleccion mensajes.
    messages: function(id) {
        //console.log(id);
        return Messages.find({chatId:id}, { sort: { time:1}});
        // return Messages.find({}, { sort: { time:1}});
    }

});



Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});

