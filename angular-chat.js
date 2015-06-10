/***
 * File: angular-chat.js
 * Author: Jade Krafsig
 * Source: design1online.com, LLC
 * License: GNU Public License
 ***/

/***
 * Purpose: load bootstrap ui angular modules
 * Precondition: none
 * Postcondition: modules loaded
 ***/
angular.module('angular_chat', ['ui.bootstrap']);

/***
 * Purpose: load the existing chat logs
 * Precondition: none
 * Postcondition: chat logs have been loaded
 ***/
function chatCtrl($rootScope, $http) { 

  /***
   * Configurable global variables
   ***/
  $rootScope.chatChannel = "angular_chat";
  $rootScope.messageLimit = 50;
  $rootScope.usernameLimit = 8;
  $rootScope.defaultUsername = "";

  /***
   * Static global variables
   ***/
  $rootScope.loggedIn = false;
  $rootScope.errorMsg;
  $rootScope.realtimeStatus = 0;


  
  /***
   * Purpose: clear the message object
   * Precondition: none
   * Postcondition: message object has been reset
   ***/
  $rootScope.clearMsg = function() {
    $rootScope.message = {
      username: $rootScope.defaultUsername,
      email: 'n/a',
      text: ''
    };
  }

  $rootScope.clearMsg();

  /***
   * Purpose: load the existing chat logs
   * Precondition: none
   * Postcondition: chat logs have been loaded
   ***/
  $rootScope.chatLogs = function() {
    PUBNUB.history( {
      channel : $rootScope.chatChannel,
      limit   : $rootScope.messageLimitmess
    }, function(messages) {
      // Shows All Messages
      $rootScope.$apply(function(){
        $rootScope.chatMessages = messages;          
      }); 
    });
   }

  /***
   * Purpose: load the existing chat logs
   * Precondition: none
   * Postcondition: chat logs have been loaded
   ***/
   $rootScope.attemptLogin = function() {
    $rootScope.errorMsg = "";

    if (!$rootScope.message.username) {
      $rootScope.errorMsg = "You must enter a username.";
      return;
    }
    if ($rootScope.message.username.length > $rootScope.usernameLimit) {
      $rootScope.errorMsg = "Username is too long";
      return;
    }
    if (!$rootScope.realtimeStatus) {
      $rootScope.errorMsg = "You're not connect to PubNub.";
      return;
    }

    $rootScope.loggedIn = true;
   }

  /***
   * Purpose: remove error message formatting when the message input changes
   * Precondition: none
   * Postcondition: error message class removed from message input
   ***/
  $rootScope.$watch('message.text', function(newValue, oldValue) {
    if (newValue)
      $("#inputMessage").removeClass("error");
      $rootScope.errorMsg = "";
  }, true);

  /***
   * Purpose: trying to post a message to the chat
   * Precondition: loggedIn
   * Postcondition: message added to chatMessages and sent to chatLog
   ***/
  $rootScope.postMessage = function() {

    //make sure they are logged in
    if (!$rootScope.loggedIn) {
      $rootScope.errorMsg = "You must login first.";
      return;
    }

    //make sure they enter a chat message
    if (!$rootScope.message.text) {
      $rootScope.errorMsg = "You must enter a message.";
      $("#inputMessage").addClass("error");
      return;
    }


        /*
    Handle the emoji replacements
    */
    $rootScope.message.text = $rootScope.message.text.replaceAll(">:(", "😡");
    $rootScope.message.text = $rootScope.message.text.replaceAll(">:)", "😈");
    $rootScope.message.text = $rootScope.message.text.replaceAll(":)", "😊");
    $rootScope.message.text = $rootScope.message.text.replaceAll(":D", "😀");
    $rootScope.message.text = $rootScope.message.text.replaceAll(":o", "😨");
    $rootScope.message.text = $rootScope.message.text.replaceAll(":O", "😱");
    $rootScope.message.text = $rootScope.message.text.replaceAll(":p", "😛");
    $rootScope.message.text = $rootScope.message.text.replaceAll(":P", "😜");
    $rootScope.message.text = $rootScope.message.text.replaceAll(":')", "😅");
    $rootScope.message.text = $rootScope.message.text.replaceAll(":'(", "😓");
    $rootScope.message.text = $rootScope.message.text.replaceAll(":'D", "😂");
    $rootScope.message.text = $rootScope.message.text.replaceAll(":|", "😁");
    $rootScope.message.text = $rootScope.message.text.replaceAll(":*", "😘");
    $rootScope.message.text = $rootScope.message.text.replaceAll("<3", "💜");
    $rootScope.message.text = $rootScope.message.text.replaceAll("</3", "💔");
    $rootScope.message.text = $rootScope.message.text.replaceAll("~@~", "💩");

    $rootScope.message.text = $rootScope.message.text.replaceAll("watermelon()", "🍉");
    $rootScope.message.text = $rootScope.message.text.replaceAll("knife()", "🔪");
    $rootScope.message.text = $rootScope.message.text.replaceAll("money()", "💵");
    $rootScope.message.text = $rootScope.message.text.replaceAll("peace()", "✌");
    $rootScope.message.text = $rootScope.message.text.replaceAll("dog()", "🐶");
    $rootScope.message.text = $rootScope.message.text.replaceAll("banana()", "🍌");
    $rootScope.message.text = $rootScope.message.text.replaceAll("sun()", "🌞");
    $rootScope.message.text = $rootScope.message.text.replaceAll("fire()", "🔥");
    $rootScope.message.text = $rootScope.message.text.replaceAll("poop()", "💩");
    $rootScope.message.text = $rootScope.message.text.replaceAll("poo()", "💩");
    $rootScope.message.text = $rootScope.message.text.replaceAll("grandpa()", "👴");
    $rootScope.message.text = $rootScope.message.text.replaceAll("grandma()", "👵");
    $rootScope.message.text = $rootScope.message.text.replaceAll("angel()", "👼");
    $rootScope.message.text = $rootScope.message.text.replaceAll("alien()", "👽");
    $rootScope.message.text = $rootScope.message.text.replaceAll("sweat()", "💦");
    $rootScope.message.text = $rootScope.message.text.replaceAll("droplet()", "💧");
    
    $rootScope.message.text = $rootScope.message.text.replaceAll("okay()", "👌");
    $rootScope.message.text = $rootScope.message.text.replaceAll("ok()", "👌");

    $rootScope.message.text = $rootScope.message.text.replaceAll("boom()", "💥");
    $rootScope.message.text = $rootScope.message.text.replaceAll("BOOM()", "💥");
    $rootScope.message.text = $rootScope.message.text.replaceAll("pow()", "💥");
    $rootScope.message.text = $rootScope.message.text.replaceAll("POW()", "💥");

    $rootScope.message.text = $rootScope.message.text.replaceAll("crown()", "👑");
    $rootScope.message.text = $rootScope.message.text.replaceAll("arm()", "💪");
    $rootScope.message.text = $rootScope.message.text.replaceAll("bicep()", "💪");
    $rootScope.message.text = $rootScope.message.text.replaceAll("biceps()", "💪");
    $rootScope.message.text = $rootScope.message.text.replaceAll("bikini()", "👙");
    $rootScope.message.text = $rootScope.message.text.replaceAll("skull()", "💀");
    $rootScope.message.text = $rootScope.message.text.replaceAll("tree()", "🌲");
    $rootScope.message.text = $rootScope.message.text.replaceAll("cactus()", "🌵");
    
    $rootScope.message.text = $rootScope.message.text.replaceAll("full_moon()", "🌝");
    $rootScope.message.text = $rootScope.message.text.replaceAll("new_moon()", "🌚");
    $rootScope.message.text = $rootScope.message.text.replaceAll("moon()", "🌝");

    $rootScope.message.text = $rootScope.message.text.replaceAll("santa_claus()", "🎅");
    $rootScope.message.text = $rootScope.message.text.replaceAll("santa()", "🎅");
    $rootScope.message.text = $rootScope.message.text.replaceAll("key()", "🔑");

    $rootScope.message.text = $rootScope.message.text.replaceAll("tennis_ball()", "🎾");
    $rootScope.message.text = $rootScope.message.text.replaceAll("tennis()", "🎾");

    //set the message date
    d = new Date();
    $rootScope.message.date = d.getDay() + "/" + d.getMonth() + "/" + d.getFullYear();
    $rootScope.message.time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

   PUBNUB.publish({
      channel : $rootScope.chatChannel,
      message : $rootScope.message
    });

    $rootScope.message.text = "";
   
  };

  /***
   * Purpose: connect and access pubnub channel
   * Preconditions: pubnub js file init
   * Postconditions: pubnub is waiting and ready
   ***/
  PUBNUB.subscribe({
    channel    : $rootScope.chatChannel,
    restore    : false, 
    callback   : function(message) { 
      //update messages with the new message
      $rootScope.$apply(function(){
        $rootScope.chatMessages.unshift(message);          
      }); 
    },

    error      : function(data) {
      $rootScope.errorMsg = data;
    },

    disconnect : function() {   
      $rootScope.$apply(function(){
        $rootScope.realtimeStatus = 0;
      });
    },

    reconnect  : function() {   
      $rootScope.$apply(function(){
        $rootScope.realtimeStatus = 1;
      });
    },

    connect    : function() {
      $rootScope.$apply(function(){
        $rootScope.realtimeStatus = 2;
        //load the chat logs
        $rootScope.chatLogs();
      });
    }
  });

  /***
   * Purpose: trying to post a message to the chat
   * Precondition: loggedIn
   * Postcondition: message added to chatMessages and sent to chatLog
   ***/
  $rootScope.attemptLogout = function() {
    $("#inputMessage").removeClass("error");
    $rootScope.clearMsg();
    $rootScope.loggedIn = false;
  }
  String.prototype.replaceAll = function(search, replace) {
      if (replace === undefined) {
          return this.toString();
      }
      return this.split(search).join(replace);
  }
}
