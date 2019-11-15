#!/usr/bin/python3
#
# Copyright (c) 2017-2018, Fabian Affolter <fabian@affolter-engineering.ch>
# Released under the ASL 2.0 license. See LICENSE.md file for details.
#
import asyncio
import json
import asyncws
import os
import time

chkpath = 'C:\\Users\\Paul'
chkpathw = 'C:\\Users\\s69171'

ACCESS_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJkZmNlNDZmMjhlMDM0Njg1YWI3OTkxMWRjNTVhNzNkNCIsImlhdCI6MTU2NjAzNjcyNywiZXhwIjoxNTk3NTcyNzI3fQ.29NB-zX8nawoaWE03qpIfEoGHxFlz0m95AN8XYqV-kk'
if os.path.exists(chkpathw):
    aName = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\access_token.txt'
    cName = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\config.txt'
    sName = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\states.txt'
else:
    aName = chkpath + '\\AppData\\Roaming\\.openpeerpower\\access_token.txt'
    cName = chkpath + '\\AppData\\Roaming\\.openpeerpower\\config.txt'
    sName = chkpath + '\\AppData\\Roaming\\.openpeerpower\\states.txt'

async def main():
    """Simple WebSocket client """
    websocket = await asyncws.connect('ws://localhost:8123/api/websocket')
    while True:
        #time.sleep(10)
        message = await websocket.recv()
        msg = json.loads(message)
        
        if msg['type'] == 'auth_required':
            if os.path.exists(aName):
                with open(aName, 'r') as f:
                    ACCESS_TOKEN = f.read()
                await websocket.send(json.dumps(
                {'type': 'auth',
                'access_token': ACCESS_TOKEN}
                ))
            else:
                await websocket.send(json.dumps(
                { 'type': 'register', 'client_id': 'http://127.0.0.1:8081', 'name': 'Paul', 'username': 'paul','password': 'Boswald0'}
                ))
        
        if msg['type'] == 'auth_ok':
            if os.path.exists(aName):
                await websocket.send(json.dumps(
                {'id': 2, 'type': 'get_states'}
                ))
            else:
                await websocket.send(json.dumps(
                {"id": 1, "type": "auth/long_lived_access_token", "client_name": "paul", "client_icon": '', "lifespan": 365}
            #{'id': 2, 'type': 'subscribe_events', 'event_type': 'state_changed'}
            ))

        if msg['type'] == 'result' and msg['id'] == 1:
            ACCESS_TOKEN = msg['result']
            if os.path.exists(aName):
                pass
            else:
                with open(aName, 'w') as f:
                    f.write(ACCESS_TOKEN)
            await websocket.send(json.dumps(
            {'id': 2, 'type': 'get_states'}
            ))

        if msg['type'] == 'result' and msg['id'] == 2:
            States = json.dumps(msg)
            if os.path.exists(sName):
                pass
            else:
                with open(sName, 'w') as g:
                    g.write(States)
            await websocket.send(json.dumps(
            {'id': 3, 'type': 'get_config'}
            ))

        if msg['type'] == 'result' and msg['id'] == 3:
            Config = json.dumps(msg)
            if os.path.exists(cName):
                pass
            else:
                with open(cName, 'w') as h:
                    h.write(Config)
            break

        print(message)
        if message is None:
            break

loop = asyncio.get_event_loop()
loop.run_until_complete(main())
loop.close()
