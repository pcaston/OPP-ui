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
    access_token_file = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\access_token.txt'
    config_file = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\config.txt'
    states_file = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\states.txt'
    state_change_file = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\state_change.txt'
    services_file = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\services.txt'
    state_changed_file = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\state_changed.txt'
    events_file = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\events.txt'
    panels_file = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\panels.txt'
    user_file = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\user.txt'
    language_file = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\language.txt'
    translations_file = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\translations.txt'
    themes_updated_file = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\themes_updated.txt'
    themes_file = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\themes.txt'                
else:
    access_token_file = chkpath + '\\AppData\\Roaming\\.openpeerpower\\access_token.txt'
    config_file = chkpath + '\\AppData\\Roaming\\.openpeerpower\\config.txt'
    states_file = chkpath + '\\AppData\\Roaming\\.openpeerpower\\states.txt'
    state_change_file = chkpath + '\\AppData\\Roaming\\.openpeerpower\\state_change.txt'
    services_file = chkpath + '\\AppData\\Roaming\\.openpeerpower\\services.txt'
    state_changed_file = chkpath + '\\AppData\\Roaming\\.openpeerpower\\state_changed.txt'
    events_file = chkpath + '\\AppData\\Roaming\\.openpeerpower\\events.txt'
    panels_file = chkpath + '\\AppData\\Roaming\\.openpeerpower\\panels.txt'
    user_file = chkpath + '\\AppData\\Roaming\\.openpeerpower\\user.txt'
    language_file = chkpath + '\\AppData\\Roaming\\.openpeerpower\\language.txt'
    translations_file = chkpath + '\\AppData\\Roaming\\.openpeerpower\\translations.txt'
    themes_updated_file = chkpath + '\\AppData\\Roaming\\.openpeerpower\\themes_updated.txt'
    themes_file = chkpath + '\\AppData\\Roaming\\.openpeerpower\\themes.txt' 

async def main():
    """Simple WebSocket client """
    websocket = await asyncws.connect('ws://localhost:8123/api/websocket')
    while True:
        #time.sleep(10)
        message = await websocket.recv()
        msg = json.loads(message)
        
        if msg['type'] == 'auth_required':
            if os.path.exists(access_token_file):
                with open(access_token_file, 'r') as f:
                    ACCESS_TOKEN = f.read()
                await websocket.send(json.dumps(
                {'type': 'auth',
                'access_token': ACCESS_TOKEN}
                ))
            else:
                await websocket.send(json.dumps(
                { 'type': 'login', 'client_id': 'http://127.0.0.1:8081', 'name': 'Paul', 'username': 'paul','password': 'Boswald0'}
                ))
        
        if msg['type'] == 'auth_ok':
            if os.path.exists(access_token_file):
                pass
            else:
                ACCESS_TOKEN = msg['access_token']
                with open(access_token_file, 'w') as f:
                    f.write(ACCESS_TOKEN)
            await websocket.send(json.dumps(
                    {'id': 2, 'type': 'get_states'}
            ))
            #await websocket.send(json.dumps(
            #{"id": 1, "type": "auth/long_lived_access_token", "client_name": "paul", "client_icon": '', "lifespan": 365}
        if msg['type'] == 'result' and msg['id'] == 2:
            States = json.dumps(msg)
            if os.path.exists(states_file):
                pass
            else:
                with open(states_file, 'w') as g:
                    g.write(States)
            await websocket.send(json.dumps(
            {'id': 3, 'type': 'get_config'}
            ))

        if msg['type'] == 'result' and msg['id'] == 3:
            Config = json.dumps(msg)
            if os.path.exists(config_file):
                pass
            else:
                with open(config_file, 'w') as h:
                    h.write(Config)
            await websocket.send(json.dumps(
            {'id': 4, 'type': 'get_services'}
            ))

        if msg['type'] == 'result' and msg['id'] == 4:
            Services = json.dumps(msg)
            if os.path.exists(services_file):
                pass
            else:
                with open(services_file, 'w') as h:
                    h.write(Services)
            await websocket.send(json.dumps(
            {'id': 5, 'type': 'subscribe_events', 'event_type': 'state_changed'}
            ))

        if msg['type'] == 'result' and msg['id'] == 5:
            State_Changed = json.dumps(msg)
            if os.path.exists(state_changed_file):
                pass
            else:
                with open(state_changed_file, 'w') as h:
                    h.write(State_Changed)

        if msg['type'] == 'result' and msg['id'] == 11:
            print(message)

        print(message)
        if message is None:
            break

loop = asyncio.get_event_loop()
loop.run_until_complete(main())
loop.close()
