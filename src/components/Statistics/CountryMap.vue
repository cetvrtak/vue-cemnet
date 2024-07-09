<script setup>
import {inject, onMounted, onUnmounted, ref, reactive, watch, onBeforeMount} from "vue";
import { Loader } from "@googlemaps/js-api-loader";

const helperFn = inject('helperFn');
const gmapsApiKey = inject('gcr_gmaps_api_key');

const props = defineProps({
  country: String
});


const mapDivEl = ref(null);

const loader = new Loader({
    apiKey: gmapsApiKey,
    version: 3.52,
    libraries: []
});

let map = null;

let geocoder = null;

const mapOptions = {
    // center: mapCenter,
    // zoom: mapZoomLevel.value,
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: true,
    fullscreenControl: true,
};


let geocodingRequest = {
    address: props.country
  // address: 'New Zeland'
}

onMounted(async () => {
    await loader.load();

    map = new google.maps.Map(mapDivEl.value, mapOptions)

    geocoder = new google.maps.Geocoder();

    geocoder.geocode({address: helperFn.escapeHtmlString(geocodingRequest.address)}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);

            map.fitBounds(results[0].geometry.viewport);
        }
    });
});


</script>

<template>
    <a-row id="map-container">
        <div ref="mapDivEl" class="map"></div>
    </a-row>
</template>

<style scoped>
#map-container {
    position: relative;
    padding-left: 10px;
}
.map {
    width: calc(100% - 1px);
    height: 322px;
    box-shadow: 0 1px 3px #0000009c;
    border-radius: 5px;
}
@media screen and (max-width: 768px) {
    #map-container {
        max-width: 100%;
        width: 93vw;
        padding: 0 0 10px 0;
    }
}
</style>