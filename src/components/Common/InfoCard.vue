<template>
    <a-card class="card-welcome">
        <slot></slot>
        <a-button v-if="purchase" type="primary" class="btn-subscribe" :icon="h(FormOutlined)">
            Purchase
        </a-button>
    </a-card>
</template>

<script setup>
import {h} from "vue";
import {FormOutlined} from "@ant-design/icons-vue";

const props = defineProps({
    purchase: Boolean,
})
</script>

<style scoped>
.card-welcome {
    margin-bottom: 10px;
    background-color: #dff0d8;
    border: 1px solid #d6e9c6;
    border-radius: 4px;
    color: #3c763d;
}
</style>