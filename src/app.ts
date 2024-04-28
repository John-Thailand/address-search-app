import axios from 'axios';

const form = document.querySelector('form')!;
const addressInput = document.getElementById('address')! as HTMLInputElement;

const GOOGLE_API_KEY = 'API_KEY';

type GoogleGeocodingResponse = {
    results: { geometry: { location: { lat: number, lng: number } } }[]
    status: 'OK' | 'ZERO_RESULTS'
};

declare var google: any;

function searchAddressHandler(event: Event) {
    event.preventDefault();
    const enteredAddress = addressInput.value;

    axios.get<GoogleGeocodingResponse>(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(enteredAddress)}&key=${GOOGLE_API_KEY}`).then(response => {
        if (response.data.status !== 'OK') {
            throw new Error('座標を取得できませんでした。');
        }
        const coordinates = response.data.results[0].geometry.location;
        let map: google.maps.Map;
        //@ts-ignore
        const { Map } = await google.maps.importLibrary("maps");
        map = new Map(document.getElementById("map") as HTMLElement, {
            center: coordinates,
            zoom: 16,
        });

        // //@ts-ignore
        // const { AdvancedMarkerView } = await google.maps.importLibrary("marker");
        // // The marker, positioned at Uluru
        // new AdvancedMarkerView({
        //     map: map,
        //     position: coordinates,
        //     title: "Uluru",
        // });
    }).catch(err => {
        alert(err.message);
        console.log(err);
    });
}

form.addEventListener('submit', searchAddressHandler);
