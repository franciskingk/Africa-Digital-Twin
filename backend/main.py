import asyncio
import json
import random
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

app = FastAPI(title="Africa Digital Twin Intelligence API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception as e:
                print(f"Error broadcasting to client: {e}")
                self.disconnect(connection)

manager = ConnectionManager()

@app.websocket("/ws/telemetry")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial connection success
        await websocket.send_json({
            "type": "system",
            "status": "connected",
            "message": "Connected to Intelligence Mainframe."
        })
        
        while True:
            data = await websocket.receive_text()
            cmd = json.loads(data)
            
            if cmd.get("action") == "run_simulation":
                await websocket.send_json({"type": "sim_ack", "msg": f"Initiating simulation: {cmd.get('scenario')}..."})
                asyncio.create_task(run_simulation(cmd.get("params", {}), websocket))
            elif cmd.get("action") == "ping":
                await websocket.send_json({"type": "pong", "time": datetime.utcnow().isoformat()})
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)

async def run_simulation(params: dict, websocket: WebSocket):
    """Scenario simulation engine (Phase 2 Prototype)"""
    await asyncio.sleep(2)
    # Stage 1: Climate Impact
    await websocket.send_json({
        "type": "sim_event",
        "category": "climate",
        "effect": "Drought severity increasing by 30% in Horn of Africa.",
        "lat": 9.145, "lng": 40.489, 
        "severity": "HIGH"
    })
    
    await asyncio.sleep(2.5)
    # Stage 2: Economic Impact
    await websocket.send_json({
        "type": "sim_event",
        "category": "economic",
        "effect": "Agricultural yield down 40%. Local food prices spiking (+150%).",
        "lat": 9.145, "lng": 40.489,
        "severity": "CRITICAL"
    })

    await asyncio.sleep(2)
    # Stage 3: Stability Impact
    await websocket.send_json({
        "type": "sim_event",
        "category": "conflict",
        "effect": "Resource-based skirmishes detected. Conflict risk elevated.",
        "lat": 9.145, "lng": 40.489,
        "severity": "CRITICAL"
    })

async def system_telemetry_loop():
    """Background task simulating high-frequency ingestion and system health"""
    while True:
        try:
            await manager.broadcast({
                "type": "telemetry",
                "metrics": {
                    "events_per_sec": random.randint(1200, 3500),
                    "active_nodes": random.randint(42, 50),
                    "cpu_load": round(random.uniform(30.0, 70.0), 1)
                }
            })
        except Exception:
            pass
        await asyncio.sleep(2)

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(system_telemetry_loop())

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
