app.component("config-color", {
    props: {
        "name": String,
        "modelValue": String
    },
    emits : ["update:modelValue"],
    computed: {
        value: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit("update:modelValue", value);
            }
        }
    },
    /*html*/
    template: `
    <div class="config-color">
        <div class="config-element-header">{{ name }}</div>
        <input class="config-color-input" v-model="value" type="color" /><span>({{ value }})</span>
    </div>
    `
});