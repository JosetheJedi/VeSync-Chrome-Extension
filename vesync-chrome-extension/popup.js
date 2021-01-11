var xhr = new XMLHttpRequest();
let outletsDiv = document.getElementById("outletsDiv");
let device_json_array = []

function get_devices_to_display() {
    xhr.withCredentials = true;
    xhr.onreadystatechange = request_handler;

    xhr.open("GET", "http://127.0.0.1:5000/pythonvesync", false);
    xhr.send();
}

function request_handler(response) {
    if (xhr.readyState === 4) {
        device_json_array = JSON.parse(response.target.response);
    }
}

function add_devices_to_popup() {
    for (device in device_json_array) {
        create_settings_for_device(device_json_array[device]);
    }
}

function create_settings_for_device(device) {
    let childDiv = document.createElement("div");
    let button = create_outlet_button(device);
    let button_label = create_label_for(button, device["Device Name"]);

    childDiv.appendChild(button_label);
    childDiv.appendChild(button);

    if (device["Type"] == "Wifi-light") {
        let sliders = create_settings_for_sliders(device);
        childDiv.appendChild(sliders);
    }

    outletsDiv.appendChild(childDiv);
}

function create_outlet_button(device) {
    let button = document.createElement("button");

    button.textContent = device["Status"];
    button.id = device["Device Name"];

    button.addEventListener("click", function () {
        if (button.textContent == "off") {
            button.textContent = "on";
            turn_on_device(device["Device Name"]);
        }
        else if (button.textContent == "on") {
            button.textContent = "off";
            turn_off_device(device["Device Name"]);
        }
    });

    return button;
}

function create_settings_for_sliders(device) {
    var childDiv = document.createElement("div");
    var brightness_slider = create_brightness_slider(device);
    var brightness_label = create_label_for(brightness_slider, "Brightness");

    childDiv.appendChild(brightness_label);
    childDiv.appendChild(brightness_slider);

    if (device["Kelvin"] != undefined) {
        let temperature_slider = create_temperature_slider(device);
        let temperature_label = create_label_for(temperature_slider, "Temperature");
        childDiv.appendChild(temperature_label);
        childDiv.appendChild(temperature_slider);
    }

    return childDiv;
}

function create_brightness_slider(device) {
    var brightness_slider = document.createElement("input");
    brightness_slider.setAttribute("type", "range");
    brightness_slider.setAttribute("min", "1");
    brightness_slider.setAttribute("max", "100");
    brightness_slider.setAttribute("value", device["Brightness"]);
    brightness_slider.id = device["Device Name"] + device["Type"];

    brightness_slider.addEventListener("change", function () {
        var new_brightness = document.getElementById(brightness_slider.id).value;
        set_brightness(device["Device Name"], new_brightness);
    });

    return brightness_slider;
}

function create_temperature_slider(device) {
    let temp_percentage = convert_kelvin_to_percentage(device["Kelvin"]);
    var temperature_slider = document.createElement("input");
    temperature_slider.setAttribute("type", "range");
    temperature_slider.setAttribute("min", "1");
    temperature_slider.setAttribute("max", "100");
    temperature_slider.setAttribute("value", temp_percentage); // change this with the calculated value

    temperature_slider.id = device["Type"] + device["Device Name"];

    temperature_slider.addEventListener("change", function () {
        var new_temperature = document.getElementById(temperature_slider.id).value;
        set_temperature(device["Device Name"], new_temperature);
    });

    return temperature_slider;
}

function convert_kelvin_to_percentage(kelvin) {
    let percentage = 0;

    let highest_kelvin_value = 6500;
    let absolute_temp = highest_kelvin_value - 2700;
    let absolute_input_temp = kelvin - 2700;

    percentage = (absolute_input_temp * 100) / absolute_temp;

    return percentage;
}

function create_label_for(element, label_text) {
    let label = document.createElement("label");
    label.setAttribute("for", element.id);
    label.textContent = label_text;
    return label;
}

function turn_off_device(device_name) {
    xhr.open("POST", `http://127.0.0.1:5000/pythonvesync?device_name=${device_name}&action=turn%20off`);
    xhr.send();
}

function turn_on_device(device_name) {
    xhr.open("POST", `http://127.0.0.1:5000/pythonvesync?device_name=${device_name}&action=turn%20on`);
    xhr.send();
}

function set_brightness(device_name, brightness) {
    xhr.open("POST", `http://127.0.0.1:5000/pythonvesync?device_name=${device_name}&action=set%20brightness&brightness=${brightness}`);
    xhr.send();
}

function set_temperature(device_name, temperature) {
    xhr.open("POST", `http://127.0.0.1:5000/pythonvesync?device_name=${device_name}&action=set%20temperature&temperature=${temperature}`);
    xhr.send();
}

get_devices_to_display();
add_devices_to_popup();