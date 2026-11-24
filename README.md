# Deep Research TypeScript

A multi-agent research system that orchestrates AI agents to conduct comprehensive research on complex topics. Built with LangGraph and TypeScript, this system uses a hierarchical supervisor pattern to coordinate multiple specialized research agents.

Based on [langchain-ai/deep_research_from_scratch](https://github.com/langchain-ai/deep_research_from_scratch).

## Features

- **Multi-Agent Coordination**: Supervisor agent delegates research tasks to specialized sub-agents
- **Parallel Research**: Multiple research agents work on different aspects simultaneously  
- **Interactive Clarification**: System asks clarifying questions before starting research
- **Comprehensive Reports**: Synthesizes findings from multiple sources into structured reports
- **Visual Debugging**: LangGraph Studio provides real-time workflow visualization

## Architecture

The system consists of four main components:

1. **Scoping Agent**: Clarifies user requirements and generates research briefs
2. **Research Agents**: Conduct web searches and synthesize information on specific topics
3. **Supervisor Agent**: Coordinates multiple research agents and aggregates findings
4. **Report Generator**: Creates comprehensive final reports from all research findings

## Prerequisites

- Node.js 20+
- Azure OpenAI API access
- Tavily Search API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/iamtokarev/deep-research-ts.git
cd deep-research-ts
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Fill in your API keys in `.env`:
```
TAVILY_API_KEY=your_tavily_key
AZURE_OPENAI_API_KEY=your_azure_key
AZURE_OPENAI_API_DEPLOYMENT_NAME_4_1=your_gpt4_deployment
AZURE_OPENAI_API_VERSION_4_1=your_api_version
AZURE_OPENAI_API_DEPLOYMENT_NAME_4_1_MINI=your_gpt4_mini_deployment
AZURE_OPENAI_API_VERSION_4_1_MINI=your_mini_api_version
AZURE_OPENAI_API_INSTANCE_NAME=your_instance_name
```

### Optional Settings

| Variable | Default | Description |
| --- | --- | --- |
| `MAX_CONCURRENT_RESEARCH_UNITS` | `3` | Max researcher sub-agents run in parallel per supervisor step. Extra `ConductResearch` calls are rejected with a message so the supervisor can re-issue them. |
| `MAX_RESEARCHER_ITERATIONS` | `6` | Max supervisor iterations before research is forced to end. |
| `TAVILY_MAX_RESULTS` | `3` | Search results fetched per Tavily query. |
| `SCOPING_MODEL_TEMPERATURE` | – | Reserved for the scoping model. |

Invalid (non-numeric or non-positive) values fall back to the defaults with a warning, and a warning listing any missing required variables is printed at startup.

## Usage

### Development with LangGraph Studio

Start the development server:
```bash
npx @langchain/langgraph-cli dev
```

This opens LangGraph Studio in your browser where you can:
- Test the research workflow interactively
- Visualize agent interactions and state transitions
- Debug research processes step-by-step
- Monitor performance and iterations

### Available Graphs

- **`deep_research`**: Complete end-to-end research workflow (recommended)
- **`scope_research`**: User clarification and research brief generation
- **`research_agent`**: Individual research agent for testing specific topics
- **`supervisor_agent`**: Multi-agent coordination system

### Example Research Query

In LangGraph Studio, try queries like:
- "What are the latest developments in quantum computing for drug discovery?"
- "Compare the environmental impact of different renewable energy sources"
- "Analyze the current state of autonomous vehicle regulation across different countries"

## How It Works

1. **Clarification**: The system first assesses if your research question needs clarification
2. **Brief Generation**: Creates a structured research brief from the conversation
3. **Task Delegation**: Supervisor breaks down the research into specific sub-topics
4. **Parallel Research**: Multiple agents conduct web searches on different aspects
5. **Synthesis**: Findings are compressed and aggregated across all research threads
6. **Report Generation**: Creates a comprehensive final report with all discoveries

## Reliability Notes

- A failing researcher sub-agent no longer aborts the whole batch; its error is reported back to the supervisor as that topic's result.
- Webpage summaries for search results are generated concurrently.
- Search-result handling tolerates empty or failed query responses.
- Iteration and concurrency limits come from configuration rather than hard-coded values.

## Project Structure

```
src/
  config.ts                 # env parsing, Tavily client, model secrets
  llm/factory.ts            # AzureChatOpenAI factory
  research-scoping.ts       # clarification + research brief
  research-agent.ts         # single researcher loop (search/think/compress)
  multi-agent-supervisor.ts # parallel delegation to researchers
  full-research.ts          # end-to-end graph incl. final report
  shared/                   # prompts and zod/state types
  utils.ts                  # search, summarization and tool definitions
```

## Development

Build or type-check the project:
```bash
npm run build
npm run typecheck
```

For more detailed development information, see [CLAUDE.md](./CLAUDE.md).

## License

MIT License