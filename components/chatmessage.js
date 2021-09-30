app.component("chatmessage", {
    props: {
        message: Object,
        styleconfig: Object
    },
    computed: {
        actionStyle() {
            if (this.message.type === "action") {
                if (this.styleconfig.misc.action === "None") {
                    return {};
                }
                else if (this.styleconfig.misc.action === "Color") {
                    return { color: this.message.color };
                }
                else if (this.styleconfig.misc.action === "Italic") {
                    return { fontStyle: "italic" };
                }
            }
            else {
                return {};
            }
        },
        finalMessage() {
            let srcBase = "https://static-cdn.jtvnw.net/emoticons/v1/";
            let m = this.message.msg;
            let replacementList = [];
            for (let emote in this.message.emotes) {
                console.log("EMOTE: " + emote);
                for (let emotePos of this.message.emotes[emote]) {
                    let startEnd = emotePos.split("-");
                    console.log("pos:" + emotePos + "->" + startEnd);
                    replacementList.push([emote, parseInt(startEnd[0]), parseInt(startEnd[1])])
                }
            }
            replacementList.sort((a, b) => b[1] - a[1]);
            for (let repl of replacementList) {
                console.log("REPL: " + repl);
                let src = srcBase + repl[0] + "/1.0";
                m = m.substring(0, repl[1]) + "<img src='" + src + "' height='" + this.styleconfig.box.fontSize + "px' style='vertical-align:text-bottom' />" + m.substring(repl[2] + 1);
            }
            return m;
        }
    },
    /*html*/
    template: `
    <div class="chat-message" :style="styleconfig.box">
        <div class="chat-message-sndr-box" :style="styleconfig.sndrbox">
            <div class="chat-message-sndr" :style="[styleconfig.sndr, {color: message.color}]">{{ message.sender }}</div>
            <div class="chat-message-trgt" v-if="styleconfig.misc.targetImage || styleconfig.misc.targetName" :style="styleconfig.trgt">
                &#8594;
                <img class="chat-message-image" v-if="styleconfig.misc.targetImage" :src="message.targetImage" />
                <span v-if="styleconfig.misc.targetName">
                    {{ message.target }}
                </span>
            </div>
        </div>
        <div class="chat-message-msg" :style="[styleconfig.msg, actionStyle]" v-html="finalMessage"></div>
    </div>
    `
});