import { TMIClient } from "./TMIClient.js"

var content = document.getElementById("content");
var urlParams = parseURLParams(window.location.href);
var client_id = "w84w6a3tz8736rz0r6n4os272z14v2";
var redirect_uri = "https://tools.ensmann.de/joined-chat/";

var chatParams = new ChatParameters();

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------

var fadingMessagesQueue = new Queue();
var finishedMessagesQueue = new Queue();
var incomingMessagesQueue = new Queue();

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------

var displayNameRequest = null;
var channelBadgesRequests = null;

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------

function getTimeInSeconds() {
    return Date.now() / 1000.;
}

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------

function msgCallback(channel, userstate, message, self) {
    console.log("msgCallback");
    incomingMessagesQueue.enqueue([channel, userstate, message, self]);
}

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------

function processMessages() {
    while (chatParams.fadetime !== null && !fadingMessagesQueue.isEmpty() &&
    getTimeInSeconds() - fadingMessagesQueue.peek()[1] > (2 * (chatParams.fadetime != null ? chatParams.fadetime : 0) + chatParams.showtime)) {
        var oldMessage = fadingMessagesQueue.dequeue()[0];
        content.removeChild(oldMessage);
    }
    while (chatParams.showtime !== null && chatParams.showtime != 0 && !finishedMessagesQueue.isEmpty() &&
    getTimeInSeconds() - finishedMessagesQueue.peek()[1] > ((chatParams.fadetime != null ? chatParams.fadetime : 0) + chatParams.showtime)) {
        var fadingMessage = finishedMessagesQueue.dequeue()[0];
        if (chatParams.fadetime != null) {
            fadingMessage.style.opacity = "0.0";
            fadingMessagesQueue.enqueue([fadingMessage, getTimeInSeconds()])
        }
        else {
            content.removeChild(fadingMessage);
        }
    }
    while (!incomingMessagesQueue.isEmpty()) {
        var msg = incomingMessagesQueue.dequeue();
        if (!(typeof msg === "undefined")) {
            var container = chatParams.createMessageContainer(msg[0], msg[1], msg[2]);
            if (container !== null) {
                finishedMessagesQueue.enqueue([container, getTimeInSeconds()]);
                content.appendChild(container);
                if (finishedMessagesQueue.getLength() + fadingMessagesQueue.getLength() > chatParams.maxmessages) {
                    var queueToUse = fadingMessagesQueue.getLength() > 0 ? fadingMessagesQueue : finishedMessagesQueue;
                    var oldMessage = queueToUse.dequeue();
                    content.removeChild(oldMessage[0]);
                }
                if (chatParams.fadetime !== null && chatParams.fadetime != 0) {
                    setTimeout(() => {container.style.opacity = "1.0";}, 10);
                }
            }
        }
    }
    setTimeout(processMessages, 10);
}

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------

function DisplayNameCallback() {
    if (displayNameRequest.readyState == 4) {
        if (displayNameRequest.status == 200) {
            var response = JSON.parse(displayNameRequest.responseText);
            chatParams.channelInfo = {};
            chatParams.passedChannelNames = [];
            if (response["data"].length == 0) {
                alert("None of your provided channels exist! Please check your channel list.");
            }
            else {
                for (var i = 0; i < response["data"].length; ++i) {
                    chatParams.channelInfo[response["data"][i]["login"]] = {
                        "display": response["data"][i]["display_name"],
                        "id": response["data"][i]["id"],
                        "image": response["data"][i]["profile_image_url"],
                        "badges": null
                    };
                    chatParams.passedChannelNames.push(response["data"][i]["login"]);
                }
                document.title = "Joined chats: " + chatParams.passedChannelNames.join(", ");
            }
        }
        else {
            alert("Name fetch request failed: " + displayNameRequest.status);
        }
    }
}

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------

function fetchChannelInfo() {
    var passedChannelNames = chatParams.passedChannelNames;
    var url = "https://api.twitch.tv/helix/users?login=" + passedChannelNames[0].trim().toLowerCase();
    for (var i = 1; i < passedChannelNames.length; ++i) {
        passedChannelNames[i] = passedChannelNames[i].trim().toLowerCase();
        url += "&login=" + passedChannelNames[i];
    }
    displayNameRequest = new XMLHttpRequest();
    displayNameRequest.onreadystatechange = DisplayNameCallback;
    displayNameRequest.open("GET", url, false);
    displayNameRequest.setRequestHeader("Client-ID", client_id);
    displayNameRequest.setRequestHeader("Authorization", "Bearer " + urlParams.get("fragment").get("access_token"));
    displayNameRequest.send();
}

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------

class BadgeHTTPRequest extends XMLHttpRequest {
    constructor(channel) {
        super();
        this.channel = channel;
        this.finished = false;
    }

    Init() {
        var url = "https://badges.twitch.tv/v1/badges/channels/" + chatParams.channelInfo[this.channel]["id"] + "/display?language=en";
        this.onreadystatechange = this.BadgeCallback;
        this.open("GET", url, false);
        this.setRequestHeader("Client-ID", client_id);
        this.setRequestHeader("Authorization", "Bearer " + urlParams.get("fragment").get("access_token"));
    }

    BadgeCallback() {
        if (channelBadgesRequests[this.channel].readyState == 4) {
            if (channelBadgesRequests[this.channel].status == 200) {
                var response = JSON.parse(channelBadgesRequests[this.channel].responseText);
                chatParams.channelInfo[this.channel]["badges"] = response;
                this.finished = true;
            }
            else {
                alert("Badge fetch authorization error");
            }
        }
    }
}

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------

function fetchChannelBadges() {
    var url = "https://badges.twitch.tv/v1/badges/global/display?language=en";
    var globaltwitchRequest = new XMLHttpRequest();
    globaltwitchRequest.onreadystatechange = function() {
        if (globaltwitchRequest.readyState == 4) {
            if (globaltwitchRequest.status == 200) {
                chatParams.globalBadges = JSON.parse(globaltwitchRequest.responseText);
            }
        }
    };
    globaltwitchRequest.open("GET", url, false);
    globaltwitchRequest.setRequestHeader("Client-ID", client_id);
    globaltwitchRequest.setRequestHeader("Authorization", "Bearer " + urlParams.get("fragment").get("access_token"));
    globaltwitchRequest.send();

    channelBadgesRequests = {};
    for (var channel of chatParams.passedChannelNames) {
        channelBadgesRequests[channel] = new BadgeHTTPRequest(channel);
        channelBadgesRequests[channel].Init();
        channelBadgesRequests[channel].send();
    }
}

// -----------------------------------------------------------------------------------
// -----------------------------------------------------------------------------------

if (!urlParams.get("fragment").has("access_token")) {
    var authURL = "https://id.twitch.tv/oauth2/authorize?client_id=" + client_id + "&redirect_uri=" + redirect_uri + "&response_type=token&scope=";
    if (urlParams.get("query").has("state"))
        authURL += "&state=" + urlParams.get("query").get("state")[0];
    console.log(authURL);
    window.location.replace(authURL);
}
else if (urlParams.get("fragment").has("state")) {
    chatParams.parseStyle(urlParams.get("fragment").get("state")[0]);
    if (chatParams.passedChannelNames.length > 0) {
        fetchChannelInfo();
        if (chatParams.showbadges) {
            fetchChannelBadges();
        }
        chatParams.formatBackground(content);
        //console.log(chatParams.channelInfo);
        
        var head = document.head;
        var link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://fonts.googleapis.com/css2?family=" + chatParams.RequestedFonts.join("&family=") + "&display=swap";
        head.appendChild(link);
    
        var tmiClient = new TMIClient(chatParams.passedChannelNames, client_id, urlParams.get("query").has("debug"));
        tmiClient.actionCallback = msgCallback;
        tmiClient.chatCallback = msgCallback;
        setTimeout(processMessages, 10);
    }
    else {
        alert("You have passed no channel list. Please go back to the configurator and reconfigure your chat overlay.");
        window.location = redirect_uri + "configurator";
    }
}
else {
    alert("You have passed no state parameter. Please go back to the configurator and reconfigure your chat overlay.");
    window.location = redirect_uri + "configurator";
}