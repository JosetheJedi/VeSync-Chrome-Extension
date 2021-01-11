# VeSync Chrome Extension



## Introduction

The purpose of this chrome extension is to be able to control my Etekcity Voltson Smart WiFi Outlet (7A model ESW01-USA). 

The project has two parts:

1. **etekcity-vesync-server** - a REST API server that runs locally on the client machine and uses the [pyvesync 1.2.1 module](https://pypi.org/project/pyvesync/) to communicate with the Smart Outlets registered to my account.

2. **vesync-chrome-extension** - a popup chrome extension that shows the smart outlets on my account when it is clicked. The pop up creates a label and button combination for each device. The popup will send a GET request to the python API to receive the device list. The status of the device (on, off) is displayed on the button. When the user presses the button from off to on, the chrome extension sends a POST request to the python API. 

