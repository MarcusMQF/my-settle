import asyncio
from typing import Dict, List
import logging

class EventService:
    def __init__(self):
        # Maps session_id to list of queues (one queue per connected client)
        self.subscribers: Dict[str, List[asyncio.Queue]] = {}

    async def subscribe(self, session_id: str):
        queue = asyncio.Queue()
        if session_id not in self.subscribers:
            self.subscribers[session_id] = []
        self.subscribers[session_id].append(queue)
        
        try:
            while True:
                data = await queue.get()
                yield data
        except asyncio.CancelledError:
            self.subscribers[session_id].remove(queue)
            if not self.subscribers[session_id]:
                del self.subscribers[session_id]

    async def publish(self, session_id: str, event_type: str, data: dict):
        if session_id in self.subscribers:
            message = {"event": event_type, "data": data}
            for queue in list(self.subscribers[session_id]):
                await queue.put(message)
            logging.info(f"Published {event_type} to {len(self.subscribers[session_id])} clients in session {session_id}")

event_manager = EventService()
