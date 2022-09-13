
export default function getLatLng(postcodes,callBack) {
    fetch('https://api.postcodes.io/postcodes?filter=longitude,latitude', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postcodes })
    }).then(res => res.json()).then(data => {
        callBack(data.result.map(r=>{
            const data = r.result;
            if(data){
            return {
                name: data.longitude+''+data.latitude,
                coordinates:[data.longitude,data.latitude]
            }}
            return false;
        }).filter(d=>d));
    })
}