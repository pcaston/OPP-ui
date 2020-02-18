#!/usr/bin/python3
#
# Test harness for the Opp front end
#
import asyncio
import json
import websockets
import os

chkpath = 'C:\\Users\\Paul'
chkpathw = 'C:\\Users\\s69171'
  
if os.path.exists(chkpathw):
    access_token_file = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\access_token.txt'
    config_file = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\config.txt'
    states_file = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\states.txt'
    state_change_file = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\state_change.txt'
    services_file = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\services.txt'
    state_changed_file = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\state_changed.txt'
    translations_file = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\translations.txt'            
else:
    access_token_file = chkpath + '\\AppData\\Roaming\\.openpeerpower\\access_token.txt'
    config_file = chkpath + '\\AppData\\Roaming\\.openpeerpower\\config.txt'
    states_file = chkpath + '\\AppData\\Roaming\\.openpeerpower\\states.txt'
    state_change_file = chkpath + '\\AppData\\Roaming\\.openpeerpower\\state_change.txt'
    services_file = chkpath + '\\AppData\\Roaming\\.openpeerpower\\services.txt'
    state_changed_file = chkpath + '\\AppData\\Roaming\\.openpeerpower\\state_changed.txt'
    translations_file = chkpath + '\\AppData\\Roaming\\.openpeerpower\\translations.txt'


USERS = set()

with open(access_token_file, 'r') as f:
    ACCESS_TOKEN = f.read()
with open(config_file, 'r') as f:
    CONFIG_TEXT = f.read()
with open(states_file, 'r') as f:
    STATES_TEXT = f.read()
with open(services_file, 'r') as f:
    SERVICES_TEXT = f.read()
    
with open(state_changed_file, 'r') as f:
    STATE_CHANGED_TEXT = f.read()
with open(translations_file, 'r') as f:
    TRANSLATIONS_TEXT = f.read()

async def notify_states():
    if USERS:       # asyncio.wait doesn't accept an empty list
        await asyncio.wait([user.send(STATES_TEXT) for user in USERS])

async def notify_config():
    if USERS:       # asyncio.wait doesn't accept an empty list
        await asyncio.wait([user.send(CONFIG_TEXT) for user in USERS])

async def notify_services():
    if USERS:       # asyncio.wait doesn't accept an empty list
        await asyncio.wait([user.send(SERVICES_TEXT) for user in USERS])

async def register(websocket):
    USERS.add(websocket)

async def unregister(websocket):
    USERS.remove(websocket)

async def counter(websocket, path):
    # register(websocket) sends user_event() to websocket
    await register(websocket)
    print(f"Websocket Registered")
    await websocket.send(json.dumps(
        {'type': 'auth_required'}
    ))
    while True:
        try:
            message = await websocket.recv()
            msg = json.loads(message)
            print(msg['type'] )
            if msg['type'] == 'login' or msg['type'] == 'auth':
                print("login event: {}", msg)
                await websocket.send(json.dumps(
                    {'type': 'auth_ok',
                        'version': '0.1.0',
                        'access_token': ACCESS_TOKEN
                    }
                ))
            elif msg['type'] == 'get_states':
                await notify_states()
            elif msg['type'] == 'get_config':
                await notify_config()
            elif msg['type'] == 'get_services':
                await notify_services()
            else:
                print("unsupported event: {}", msg)
        except websockets.ConnectionClosed:
            print(f"Websocket Terminated")
            break

asyncio.get_event_loop().run_until_complete(
    websockets.serve(counter, 'localhost', 8123, ping_interval=None))
asyncio.get_event_loop().run_forever()