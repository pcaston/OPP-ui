#!/usr/bin/python3
#
# Test harness for the Opp front end
#
import asyncio
import json
import asyncws
import os


fName = 'C:\\Users\\s69171\\AppData\\Roaming\\.openpeerpower\\access_token.txt'
opp = 'C:\\Users\\s69171\\AppData\\Roaming\\.openpeerpower\\opp.txt'
#fName = 'C:\\Users\\Paul\\AppData\\Roaming\\.openpeerpower\\access_token.txt'

async def main(websocket):
     while True:
        frame = await websocket.recv()
        if frame is None:
            break
        await websocket.send(frame)

server = asyncws.start_server(main, '127.0.0.1', 8123)
asyncio.get_event_loop().run_until_complete(server)
asyncio.get_event_loop().run_forever()