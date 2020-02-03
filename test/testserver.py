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
    token = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\access_token.txt'
    config = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\config.txt'
    states = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\states.txt'
    services = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\services.txt'
else:
    token = chkpath + '\\AppData\\Roaming\\.openpeerpower\\access_token.txt'
    config = chkpath + '\\AppData\\Roaming\\.openpeerpower\\config.txt'
    states = chkpath + '\\AppData\\Roaming\\.openpeerpower\\states.txt'
    services = chkpath + '\\AppData\\Roaming\\.openpeerpower\\services.txt'

USERS = set()

with open(token, 'r') as f:
    ACCESS_TOKEN = f.read()
with open(states, 'r') as f:
    STATES_TEXT = f.read()
with open(config, 'r') as f:
    CONFIG_TEXT = f.read()
with open(services, 'r') as f:
    SERVICES_TEXT = f.read()

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