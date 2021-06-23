Shorty - SMPP Client / Server
================================
Version 0.5.4 Created by Evan Coury and Ben Youngblood


Introduction
------------
Shorty is a lightweight, high performance SMPP client and server built on Node.js 
(v0.6.x). Shorty is sponsored and maintained by 
[SMS Cloud](http://www.smscloud.com/), a subsidiary of Roave.

Usage
-----
New documentation coming Soon(tm).

License
-------
Shorty is released under the terms of the [GNU General Public License (GPL) Version 3](http://en.wikipedia.org/wiki/GNU_General_Public_License). See **`COPYING`** file for details.

Testing
================================
Server Start Up:
-------
To test amend the config.json file to update server bind parameters. Sample config.json format is below:
```json
{
"smpp": {
"mode":         "server",
"host":         "127.0.0.1",
"port":         2775,
"system_id":    "nodeunit",
"password":     "nodeunit",
"system_type":  "SHORTY",
"version":      "3.4",
"addr_ton":     0,
"addr_npi":     1,
"addr_range":   "",
"timeout":      30,
"strict":       1
},
"debug":    true
}
```
If you would like to point the server to a different configuration file then amend line 28 of server-example.js and redirect shorty to a different json file.

The start up command for shorty SMPP server is:
```console
foo@bar:~$ cd to_directory_with_project
foo@bar:~$ node server-example.js
foo
```
You need to run the server-example.js file from within the project folder so that there is access to the json file.
Once this is done you application is ready to receive messages from client applications.

Test Sending a message to client application
-------
To test sending messages to client applications navigate to the terminal screen where your application is running and paste the message you would like to send to a client application.
There are points to consider at this juncture:
1. is the message you wish to send a delivery report (dlr) or an incoming/ondemand message
2. ensure that you have the sender name and msisdn (originating sender) to be included in the message 
   
If you are using kannel as the service binding to the shorty SMPP server then this is the format for the delivery report:
    “**SenderName MSISDN id:IIIIIIIIII sub:SSS dlvrd:DDD submit date:YYMMDDhhmm done date:YYMMDDhhmm stat:DDDDDDD err:E Text: . . . . . . . . .**”
   
If the message is an ondemand service (incoming SMS from customer handset) then the format will be:
    “**SenderName MSISDN Text Message**”

You will notice in server-example.js line 88 the message is split using the spaces and parts[0] is the SenderName and parts[1] is the MSISDN.

Other Config Files for Tests:
-------
Kannel & Nginx config file are included in the root project folder for review or reuse as required.