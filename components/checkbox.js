app.component("config-checkbox", {
    props: {
        "name": String,
        "modelValue": Boolean
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
    <div class="config-checkbox">
        <span class="config-element-header">{{ name }}</span>
        <input class="config-checkbox-input" v-model="value" type="checkbox" />
    </div>
    `
});