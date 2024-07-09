<template>
    <a-row id="map-container">
        <a-row id="map-custom-controls" style="flex-direction:column;align-items:end;row-gap:5px;">
            <a-row>
                <a-col :span="24" class="map-custom-controls-group">
                    <a-card :bordered="false" class="map-controls">
                        <ul>
                            <a-checkbox-group v-model:value="filterState.groups" @change="onFilterChange">
                                <li v-for="group in availableGroups">
                                    <a-checkbox :value="group.value">{{ group.label }}</a-checkbox>
                                </li>
                            </a-checkbox-group>
                        </ul>
                    </a-card>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="24" class="map-custom-controls-group" style="max-width: max-content;min-width: auto;">
                    <a-card :bordered="false" class="map-controls">
                        <ul>
                            <a-checkbox-group v-model:value="filterState.typesOfWork" @change="onFilterChange">
                                <li v-for="typeOfWork in availableTypesOfWork">
                                    <a-checkbox :value="typeOfWork.value">{{ typeOfWork.label }}</a-checkbox>
                                </li>
                            </a-checkbox-group>
                        </ul>
                    </a-card>
                </a-col>
            </a-row>
        </a-row>

        <div ref="mapDivEl" class="map"></div>
    </a-row>
</template>

<script setup>
import {inject, onMounted, onUnmounted, ref, reactive, watch, onBeforeMount} from "vue";
import { Loader } from "@googlemaps/js-api-loader";

const iconsBase = inject('gcr_assets_url') + "icons/";
const gmapsApiKey = inject('gcr_gmaps_api_key');

const props = defineProps({
    plants: String
});

const mapDivEl = ref(null);

const infoWindow = null;

// const mapZoomLevel = ref(12);

// TODO styling map
const mapOptions = {
    // center: mapCenter,
    // zoom: mapZoomLevel.value,
    zoomControl: true,
    maxZoom: 10,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: true,
    fullscreenControl: true,
    styles: [
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#f5f5f5"
                }
            ]
        },
        {
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#f5f5f5"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#bdbdbd"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#eeeeee"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e5e5e5"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#dadada"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#e5e5e5"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#eeeeee"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#c9c9c9"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        }
    ]
};

const parsedProps = parsePlantsProp(props.plants);

const availableGroups = parsedProps.groups;

const availableTypesOfWork = parsedProps.typeOfWorks;

const allPlants = parsedProps.plants;

const loader = new Loader({
    apiKey: gmapsApiKey,
    version: 3.52,
    libraries: []
});

let map = null;

// let mapBounds = null;

// const mapCenter = reactive({lat: 44.8040, lng: 19.2621});


let allMarkers = null;

let selectedMarkers = null;

const filterState = reactive({
    groups: [],
    typesOfWork: []
});

function parsePlantsProp (stringPlants) {
  let plants = JSON.parse(stringPlants);
  let parsed = [];
  let companygroups = [];
  let typeOfWorks = [];

  for (let i = 0, pl = plants.length; i < pl; i++ ) {
      parsed.push({
          position: {
              lat: plants[i].geo.latitude,
              lng: plants[i].geo.longitude
          },
          plantName: plants[i].name,
          plantUniqueName: plants[i].uniqueName,
          cementCapacity: plants[i].cementCapacity,
          typeOfWorks: plants[i].typeOfWorks,
          typeOfWorksId: plants[i].typeOfWorksId,
          cementType: plants[i].cementType,
          companyName: plants[i].company.name,
          groupName: plants[i].company.parent.name,
          groupUniqueName: plants[i].company.parent.uniqueName,
          city: plants[i].geo.city,
          iconUrl: iconsBase + "factory-black.png",
          status: "operational TODO"
      });

      if (companygroups.findIndex(g => g.value === plants[i].company.parent.uniqueName) === -1) {
          companygroups.push({
              label: plants[i].company.parent.name,
              value: plants[i].company.parent.uniqueName
          });
      }

      if (typeOfWorks.findIndex(t => t.value === plants[i].typeOfWorksId) === -1) {
          typeOfWorks.push({
             label: plants[i].typeOfWorks,
             value: plants[i].typeOfWorksId
          });
      }
  }

  return {
      plants: parsed,
      groups: companygroups,
      typeOfWorks: typeOfWorks
  };
}

// TODO add control 'suggest an edit' to map


// TODO stevo
function setInfoWindowContent (plantDetails) {
  return `
    <p>${plantDetails.companyName}</p>
    <p>${plantDetails.plantName}</p>
    <p>${plantDetails.city}</p>
    <p>Status TODO</p>
    <p>${plantDetails.typeOfWorks}</p>
    <p>${plantDetails.cementType}</p>
    <p>${plantDetails.cementCapacity}</p>
  `;
}

function onFilterChange () {
    console.log(filterState);
}

// async?
watch(filterState, async (newValue) => {
    console.log("filter state changed");
    console.log('newValue.groups', newValue.groups);

    updateMarkers(filterState);
});

onBeforeMount(() => {

});

onMounted(async () => {
    await loader.load();
    console.log(google);
    map = new google.maps.Map(mapDivEl.value, mapOptions)

    // Set GMap infowindow
    const infoWindow = new google.maps.InfoWindow({
        content: "",
        disableAutoPan: true,
    });

    allMarkers = initMarkers(google);
});

// onUnmounted( async () => {
//     console.log("TODO");
//
// });

function initMarkers(google) {
    let bounds = new google.maps.LatLngBounds();

    const allMarkers = allPlants.map((location, i) => {
        const position = location.position;
        const icon = {
            url: location.iconUrl,
            scaledSize: new google.maps.Size(24, 24),
        }

        const marker = new google.maps.Marker({
            position: position,
            icon: icon,
            optimized: true,
            map: map
        });

        marker.addListener("click", () => {
            infoWindow.setContent(setInfoWindowContent(location));
            infoWindow.open(map, marker);
            map.setCenter(marker.getPosition());
        });

        bounds.extend(marker.getPosition());

        return {
            marker: marker,
            typeOfWorksId: location.typeOfWorksId,
            groupUniqueName: location.groupUniqueName
        };
    });

    map.fitBounds(bounds);

    return allMarkers;
}

// TODO add 'all' option
function updateMarkers(filter) {
    let bounds = new window.google.maps.LatLngBounds();
    const selectedTypeOfWorks = filter.typesOfWork;
    const selectedGroups = filter.groups;
    selectedMarkers = [];

    setMarkers(allMarkers, null);

    if (selectedTypeOfWorks.length === 0 && selectedGroups.length === 0) {
        setMarkers(allMarkers, map);

        for (let i = 0; i < allMarkers.length; i++) {
            bounds.extend(allMarkers[i].marker.getPosition());
        }

        map.fitBounds(bounds);

        return;
    }

    for (let i = 0; i < allMarkers.length; i++) {
        if (
            selectedTypeOfWorks.indexOf(allMarkers[i].typeOfWorksId) !== -1 ||
            selectedGroups.indexOf(allMarkers[i].groupUniqueName) !== -1
        ) {
            selectedMarkers.push({
                marker: allMarkers[i].marker,
                typeOfWorksId: allMarkers[i].typeOfWorksId,
                groupUniqueName: allMarkers[i].groupUniqueName
            });

            bounds.extend(allMarkers[i].marker.getPosition());
        }
    }

    if (selectedMarkers.length !== 0) {
        console.log('set selected')
        console.log(selectedMarkers)
        setMarkers(selectedMarkers, map);
        map.fitBounds(bounds);
    }
}

function setMarkers(markersToSet, map) {
    console.log(markersToSet)
    for (let i = 0; i < markersToSet.length; i++) {
        markersToSet[i].marker.setMap(map);
        console.log('markers[i]', markersToSet[i])
    }
}

</script>

<style scoped>
#map-container {
    position: relative;
    padding-left: 10px;
}
.map {
    width: calc(100% - 1px);
    height: 565px;
    box-shadow: 0 1px 3px #0000009c;
    border-radius: 5px;
}
#map-custom-controls {
  position: absolute;
  top: 5px;
  right: 5px;
  z-index: 1;
}
.map-custom-controls-group {
  background: white;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.61);
  border-radius: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
  max-height: 65%;
  max-width: 200px;
  min-width: 110px;
  overflow: auto;
}
#map-custom-controls ul {
    margin: 0;
    padding: 0;
}
.ant-checkbox-group {
    display: flex;
    flex-direction: column;
}
@media screen and (max-width: 768px) {
    #map-container {
        max-width: 100%;
        width: 93vw;
        padding: 0 0 10px 0;
    }
}
</style>