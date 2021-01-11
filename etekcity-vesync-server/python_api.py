from flask import Flask
from flask_restful import Resource, Api, reqparse
import json
from pyvesync import VeSync
import configparser

app = Flask(__name__)
api = Api(app)

config = configparser.ConfigParser()
config.read("./vesync_credentials.ini")
email = config["credentials"]["email"]
password = config["credentials"]["password"]

manager = VeSync(email, password)
manager.login()
manager.update()

def get_devices():
    devices = []

    bulbs = get_bulbs()
    outlets = get_outlets()

    for bulb in bulbs:
        devices.append(bulb)

    for outlet in outlets:
        devices.append(outlet)

    return devices

def get_bulbs():
    return manager.bulbs

def get_outlets():
    return manager.outlets

def get_devices_as_json_list():
    devices = get_devices()

    devicess_json_list = []

    for device in devices:
        device_json = device.displayJSON()
        devicess_json_list.append(device_json)

    return devicess_json_list

def find_device(device_name):
    devices = get_devices()

    for device in devices:
        device_json = device.displayJSON()

        if device_json["Device Name"] == device_name:
            return device

def turn_off_device(device_name):
    print(f"turning off {device_name}")
    device = find_device(device_name)
    device.turn_off()

def turn_on_device(device_name):
    print(f"turning on {device_name}")
    device = find_device(device_name)
    device.turn_on()

def set_device_brightness(device_name, brightness):
    print(f"setting {device_name} to brightness {brightness}%")
    device = find_device(device_name)
    device.set_brightness(brightness)

def set_device_temperature(device_name, temperature):
    print(f"setting {device_name} to temperature {temperature}")
    device = find_device(device_name)
    device.set_color_temp(temperature)

def initialize_post_args_parser():
    parser = reqparse.RequestParser()

    parser.add_argument("device_name", required = True)
    parser.add_argument("action", required = True)
    parser.add_argument("brightness", required=False)
    parser.add_argument("temperature", required=False)

    return parser

# Flask needs to know that this class is an endpoint for our API, and so
# we pass "Resource" in with the class definition
# Inside the class, we include our HTTP methods (GET, POST, DELETE, etc.)
class PythonVeSync(Resource):
    # methods go here
    def get(self):
        devices_json_list = get_devices_as_json_list()
        return devices_json_list, 200

    def post(self):
        parser = initialize_post_args_parser()
        args = parser.parse_args()

        if args["action"] == "turn off":
            turn_off_device(args["device_name"])
        elif args["action"] == "turn on":
            turn_on_device(args["device_name"])
        elif args["action"] == "set brightness":
            set_device_brightness(args["device_name"], int(args["brightness"]))
        elif args["action"] == "set temperature":
            set_device_temperature(args["device_name"], int(args["temperature"]))
        else:
            return {"response": f"Action ({args['action']}) does not exist"}, 400

        devices_json_list = get_devices_as_json_list()

        return devices_json_list, 200


# we link our Users class with the /users endpoint using api.add_resource().
api.add_resource(PythonVeSync, "/pythonvesync") # '/users' is our entry point for Users.

if __name__ == "__main__":
    app.run() # run our Flask app
