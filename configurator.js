vm = null;
const app = Vue.createApp({
    data() {
        return {
            general: {
                channels: "",
                maxMessages: 20, //[1;50]
                backgroundColor: "#1D3554",
                useBackground: false
            },
            hidden: {
                channels: "",
                commands: false,
                URLs: true
            },
            font: {
                style: "Montserrat",
                size: 20, // [6;50]
                color: "#CCCCCC",
                action: "Color", // None, Color, Italic
                emoteFactor: 1.0, // [0.1;4.0]
            },
            spacing: {
                alignment: "Left", // Left, Right, Justify
                between: 4, // [0;20]
                around: 4, // [0;20]
                wrap: true,
                senderRight: 4, // [0;20]
                senderBottom: 0, // [0;20]
                senderReserved: 200 // [60;200]
            },
            sender: {
                badges: true,
                badgeSpace: 3, //[0;10]
                customStyle: false,
                font: "Montserrat",
                size: 20, //[6;50]
                alignment: "Left" // Left, Right
            },
            target: {
                useImage: false,
                useName: true,
                customStyle: true,
                font: "Montserrat",
                size: 20, //[6;50]
                color: "#777777",
                alignment: "Left" // Left, Right
            },
            special: {
                highlighted: {
                    highlightMessages: false,
                    channels: "",
                    fontColor: "#FFFFFF",
                    backgroundColor: "#755EBC",
                    alpha: 20 // [0;100]
                },
                subscriptions: {

                }
            },
            animation: {
                fadetime: 0.3, //[0.0;2.0]
                showtime: 4 // [0.0;20.0]
            },
            messages: dummyData()
        };
    },
    computed: {
        getStyle() {
            s = { box: {}, sndrbox: {}, sndr: {}, trgt: {}, msg: {}, misc: {}};
            s.box["padding"] = this.spacing.around + "px";
            s.box["color"] = this.font.color;
            s.box["fontSize"] = this.font.size + "px";
            s.box["fontFamily"] = this.font.style;
            s.msg["textAlign"] = this.spacing.alignment.toLowerCase();
            
            if (this.sender.customStyle) {
                s.sndr["fontFamily"] = this.sender.font;
                s.sndr["fontSize"] = this.sender.size + "px";
                s.sndr["textAlign"] = this.sender.alignment.toLowerCase();
            }
            

            if (this.target.customStyle && this.target.useName) {
                s.trgt["fontFamily"] = this.target.font;
                s.trgt["fontSize"] = this.target.size + "px";
                s.trgt["color"] = this.target.color;
                s.trgt["textAlign"] = this.target.alignment.toLowerCase();
            }

            s.sndrbox["marginRight"] = this.spacing.senderRight + "px";
            if (this.spacing.wrap) {
                s.sndrbox["float"] = "left";
                s.sndrbox["marginBottom"] = this.spacing.senderBottom + "px";
            }
            else {
                s.box["display"] = "flex";
                s.sndrbox["flex"] = "0 0 " + this.spacing.senderReserved + "px";
                s.sndrbox["overflowX"] = "hidden";
                s.sndrbox["whiteSpace"] = "nowrap";

                s.msg["flex"] = "1 0 10px";
                s.msg["overflowWrap"] = "break-word";
            }


            s.misc["targetImage"] = this.target.useImage;
            s.misc["targetName"] = this.target.useName;
            s.misc["hideURL"] = this.hidden.URLs;
            s.misc["emoteFactor"] = this.font.emoteFactor;
            s.misc["action"] = this.font.action;
            return s;
        }
    }
});

app.config.globalProperties.fonts = fonts;

function mountApp() {
    vm = app.mount("body");
}

window.onload = mountApp;

function dummyData() {
    msg = [
        {
            msg: "This is a test message by myself in my own chat",
            sender: "Zensmann",
            target: "zensmann",
            targetImage: "https://static-cdn.jtvnw.net/jtv_user_pictures/5f7dde42-9f88-4906-baa2-94221aec17bc-profile_image-300x300.png",
            emotes: {},
            color: "#DAA520",
            type: "chat",
            badges: {"broadcaster": "1"}
        },
        {
            msg: "This is a long text message with an Kappa emote included. Furthermore I included another one LUL just for the lols. It comes from another chatter in my own chatroom. For demonstration purposes I assigned him both badges, so you can see how multiple badges are behaving.",
            sender: "OtherChatter",
            target: "zensmann",
            targetImage: "https://static-cdn.jtvnw.net/jtv_user_pictures/5f7dde42-9f88-4906-baa2-94221aec17bc-profile_image-300x300.png",
            emotes: {"25": ["36-40"], "425618": ["93-95"]},
            color: "#DAA520",
            type: "chat",
            badges: {"moderator": "1"}
        },
        {
            msg: "This is a very very very long test message that does not contain any emotes. Line wrapping will occur normally and the lines will not spread any further, since there are no emotes included in this text. However this message does come from myself in a channel chat, where I do not have mod rights.",
            sender: "Zensmann",
            target: "otherchannel",
            targetImage: "https://static-cdn.jtvnw.net/user-default-pictures-uv/de130ab0-def7-11e9-b668-784f43822e80-profile_image-300x300.png",
            emotes: {},
            color: "#DAA520",
            type: "highlighted-message",
            badges: {}
        },
        {
            msg: "This is a test message by another chatter in another channel chat, where he or she is a mod.",
            sender: "AnotherChatter",
            target: "otherchannel",
            targetImage: "https://static-cdn.jtvnw.net/user-default-pictures-uv/de130ab0-def7-11e9-b668-784f43822e80-profile_image-300x300.png",
            emotes: {},
            color: "#DAA520",
            type: "chat",
            badges: {"moderator": "1", "premium": "1"}
        },
        {
            msg: "This is a highlighted test message.",
            sender: "Zensmann",
            target: "anotherchannel",
            targetImage: "https://static-cdn.jtvnw.net/user-default-pictures-uv/41780b5a-def8-11e9-94d9-784f43822e80-profile_image-300x300.png",
            emotes: {},
            color: "#DAA520",
            type: "highlighted-message",
            badges: {"moderator": "1"}
        },
        {
            msg: "shows a test action starting with /me",
            sender: "Zensmann",
            target: "zensmann",
            targetImage: "https://static-cdn.jtvnw.net/jtv_user_pictures/5f7dde42-9f88-4906-baa2-94221aec17bc-profile_image-300x300.png",
            emotes: {},
            color: "#DAA520",
            type: "action",
            badges: {"broadcaster": "1"}
        },
        {
            msg: "This is a test message with a URL: https://twitch.tv/zensmann",
            sender: "Zensmann",
            target: "zensmann",
            targetImage: "https://static-cdn.jtvnw.net/jtv_user_pictures/5f7dde42-9f88-4906-baa2-94221aec17bc-profile_image-300x300.png",
            emotes: {},
            color: "#DAA520",
            type: "chat",
            badges: {"broadcaster": "1"}
        },
        {
            msg: "!botcommand",
            sender: "Zensmann",
            target: "zensmann",
            targetImage: "https://static-cdn.jtvnw.net/jtv_user_pictures/5f7dde42-9f88-4906-baa2-94221aec17bc-profile_image-300x300.png",
            emotes: {},
            color: "#DAA520",
            type: "chat",
            badges: {"broadcaster": "1"}
        },
        {
            msg: "This is a response from the bot",
            sender: "Zens_bot",
            target: "zensmann",
            targetImage: "https://static-cdn.jtvnw.net/jtv_user_pictures/5f7dde42-9f88-4906-baa2-94221aec17bc-profile_image-300x300.png",
            emotes: {},
            color: "#1E90FF",
            type: "action",
            badges: {}
        }
    ];
    for (let i = 10; i < 51; ++i) {
        msg.push({
            msg: "This is text message #" + i,
            sender: "Zensmann",
            target: "zensmann",
            targetImage: "https://static-cdn.jtvnw.net/jtv_user_pictures/5f7dde42-9f88-4906-baa2-94221aec17bc-profile_image-300x300.png",
            emotes: {},
            color: "#DAA520",
            type: "chat",
            badges: {"broadcaster": "1"}
        });
    }
    return msg;
}