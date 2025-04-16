# A2A UI
UI for Google A2A made using Next.js, Typescript and Shadcn

<img width="1624" alt="image" src="https://github.com/user-attachments/assets/fa45f943-a781-4188-aff8-d9842b844515" />


# Make sure you've configured CORS policies correctly (for local use) 

```python

from starlette.middleware.cors import CORSMiddleware  # Import CORSMiddleware

# your agent definition goes here 

server = A2AServer(
    agent_card=agent_card,
    task_manager=AgentTaskManager(agent=QAAgent()),
    host=host,
    port=port,
)
# Add CORSMiddleware to allow requests from any origin (disables CORS restrictions)
server.app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)
server.start()
```
