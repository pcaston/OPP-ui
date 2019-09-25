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
    fName = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\access_token.txt'
    opp = chkpathw + '\\AppData\\Roaming\\.openpeerpower\\opp.txt'
else:
    fName = chkpath + '\\AppData\\Roaming\\.openpeerpower\\access_token.txt'
    opp = chkpath + '\\AppData\\Roaming\\.openpeerpower\\opp.txt'

USERS = set()

with open(fName, 'r') as f:
    ACCESS_TOKEN = f.read()
with open(opp, 'r') as f:
    OPP_TEXT = f.read()

async def notify_state():
    if USERS:       # asyncio.wait doesn't accept an empty list
        await asyncio.wait([user.send(OPP_TEXT) for user in USERS])

async def register(websocket):
    USERS.add(websocket)

async def process(websocket, message):
    msg = json.loads(message)
    if msg['type'] == 'login' or msg['type'] == 'auth':
        await websocket.send(json.dumps(
            {'type': 'auth_ok',
                'version': '0.1.0',
                'access_token': ACCESS_TOKEN
            }
            ))
    elif msg['type'] == 'get_states':
        await notify_state()
    else:
        print("unsupported event: {}", msg)


async def unregister(websocket):
    USERS.remove(websocket)

async def counter(websocket, path):
    # register(websocket) sends user_event() to websocket
    await register(websocket)
    await websocket.send(json.dumps(
        {'type': 'auth_required'}
    ))
    try:
        async for message in websocket:
            await process(websocket, message)
            
    except websockets.ConnectionClosed:
        print(f"Websocket Terminated")
    finally:
        await unregister(websocket)

asyncio.get_event_loop().run_until_complete(
    websockets.serve(counter, 'localhost', 8123))
asyncio.get_event_loop().run_forever()