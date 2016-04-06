Messages = new Meteor.Collection('messages');
Chats = new Meteor.Collection('chats');
Files = new FS.Collection("files", {
    //especifico que los files se guarden en ~/uploads
    stores: [new FS.Store.FileSystem("files", {path: "~/uploads"})]
});