Meteor.publish("userStatus", function() {
    return Meteor.users.find({ "status.online": true });
});

Meteor.publish("messages" , function() {
        return Messages.find({});
    }
);

Meteor.publish("chats" , function () {
    return Chats.find({});
});

Meteor.publish('allUsers', function(){
    return Meteor.users.find({});
});


Meteor.publish('files', function(){
    return Files.find({});
});

Meteor.publish("userData", function () {
    return Meteor.users.find(
        {_id: this.userId},
        {fields: {'activeChats': 1}}
    );
});

Meteor.users.allow({
    update: function (userId, user, fields, modifier) {

        /*
        * Permite el cambio del estado de activeChats a otros usuarios sobre un chat en común.
        */
        if(fields[0] == "activeChats" && typeof modifier.$addToSet !== "undefined"){
            return Chats.findOne( {$and:[
                { users: { $in: [Meteor.userId()] } },
                { _id: { $in: [modifier.$addToSet.activeChats] } }
            ]});
        }

        /*
         * Permite el cambio del estado de activeChats a otros usuarios sobre un chat en común.
         */
        if(user._id === userId)
        {
            Meteor.users.update({_id: userId}, modifier);
            return true;
        }
        else return false;
    }
});

Accounts.onCreateUser(function(options, user) {
    user.activeChats = [];
    if (options.profile)
        user.profile = options.profile;
    return user;
});