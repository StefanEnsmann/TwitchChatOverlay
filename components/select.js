app.component("config-select", {
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
    <div class="config-select">
        <div class="config-element-header">{{ name }}</div>
        <select class="config-select" v-model="value">
            <slot></slot>
        </select>
    </div>
    `
});