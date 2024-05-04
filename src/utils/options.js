export let options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
        height: "45mm",
        contents: '<div style="text-align: center;">Author: Raghad Suwan</div>'
    },
    footer: {
        height: "28mm",
        contents: {
            default: '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        }
    }
};