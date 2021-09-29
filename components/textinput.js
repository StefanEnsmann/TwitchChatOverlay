app.component("config-text", {
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
    <div class="config-element config-text">
        <div class="config-element-header">{{ name }}</div>
        <input class="config-text-input config-editable-input" v-model="value" type="text" />
    </div>
    `
});