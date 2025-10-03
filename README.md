# 🎯 Resume Optimizer MCP Server

> **Model Context Protocol server for AI-powered resume optimization**  
> A working prototype demonstrating MCP architecture with Claude integration

[![MCP Protocol](https://img.shields.io/badge/MCP-Protocol-orange)](https://modelcontextprotocol.io)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🎥 What This Demonstrates

This is a **working prototype** that showcases:
- ✅ **MCP Server implementation** - Custom tools using Model Context Protocol
- ✅ **Claude integration** - Works as MCP client for orchestration
- ✅ **Tool composition** - Multiple tools working together
- ✅ **Real-world use case** - Resume optimization workflow

**Status**: Core architecture implemented, production features planned (see [Roadmap](#roadmap))

---

## 🏗️ Current Architecture

### What's Implemented ✅

```
┌─────────────────────────────────────┐
│         Claude (MCP Client)         │  ← Orchestration
└──────────────┬──────────────────────┘
               │ MCP Protocol
┌──────────────▼──────────────────────┐
│       MCP Server (Node.js)          │
│  ┌─────────────────────────────┐   │
│  │  Tools Layer:               │   │
│  │  • fetch-data.js            │   │  ← Implemented
│  │  • heap-filter.js           │   │
│  │  • heap.js                  │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Production Architecture (Designed) 📋

I've designed a full production system that extends this prototype:

```
User → MCP Server → Claude → Database Layer (Vector DB, Neo4j, Redis)
                              ↓
                        RAG Pipeline → Optimized Resume
```

**Full architecture documentation**: [docs/ARCHITECTURE_PLAN.md](docs/ARCHITECTURE_PLAN.md)

---

## 💡 The "Master Move": Why MCP?

I chose MCP Server over alternatives (LangChain, custom API) because:

**Evaluated Approaches:**

| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| **LangChain Agents** | Quick to start | Opaque, hard to debug | ❌ |
| **Custom REST API** | Full control | Reinventing wheel | ❌ |
| **MCP Server** | Protocol standard, testable | Learning curve | ✅ Chosen |

**Key advantages**:
- 🔧 **Standardized protocol** - Works with any MCP client
- 🧪 **Testability** - Tools can be unit tested independently
- 🎯 **Separation of concerns** - Business logic isolated from AI orchestration
- 📦 **Composability** - Easy to add new tools

**Trade-offs I accepted**:
- 2-week learning curve (MCP is new)
- Emerging ecosystem (fewer examples)
- Worth it for maintainability and standardization

**See full analysis**: [docs/TRADEOFFS.md](docs/TRADEOFFS.md)

---

## 🛠️ Tech Stack

### Currently Implemented ✅
- **Node.js 18+** - Server runtime
- **MCP Protocol** - Tool standardization
- **Claude API** - LLM orchestration via MCP client
- **JavaScript** - Core implementation

### Planned for Production 📋
- **Vector Database** (Pinecone/FAISS) - For semantic search
- **Neo4j** - Skill relationship mapping
- **Redis** - Caching layer
- **Docker** - Containerization
- **GCP Cloud Run** - Serverless deployment
- **GitHub Actions** - CI/CD pipeline

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- Anthropic API key (for Claude)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/resume-optimizer-mcp.git
cd resume-optimizer-mcp

# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Start the MCP server
node server.js
```

### Using with Claude Desktop

1. Update your Claude Desktop MCP config:
```json
{
  "mcpServers": {
    "resume-optimizer": {
      "command": "node",
      "args": ["/path/to/resume-optimizer-mcp/server.js"]
    }
  }
}
```

2. Restart Claude Desktop

3. The tools will be available in Claude!

---

## 🧪 Current Features

### Implemented Tools ✅

#### 1. `fetch-data` 
Fetches and processes resume/job description data

**Usage in Claude**:
```
"Can you fetch the job description data for this role?"
```

#### 2. `heap-filter`
Filters and prioritizes information using heap data structure

**Usage in Claude**:
```
"Filter the top skills from this data set"
```

#### 3. `heap`
Core heap implementation for priority-based processing

---

## 📖 Documentation

### Core Documents
- **[TRADEOFFS.md](docs/TRADEOFFS.md)** 💎 - Why I made each architectural decision
- **[ARCHITECTURE_PLAN.md](docs/ARCHITECTURE_PLAN.md)** - Full production system design
- **[MCP_TOOLS.md](docs/MCP_TOOLS.md)** - Tool specifications and examples

### Key Insights

**From my architecture analysis**:

1. **MCP vs LangChain**: Chose protocol standardization over framework convenience
2. **Node.js vs Python**: Chose Node.js for async I/O performance in tool layer
3. **Modular tools**: Each tool is independently testable and reusable

---

## 🗺️ Roadmap

### Phase 1: Prototype ✅ (Current)
- [x] MCP server implementation
- [x] Basic tool structure
- [x] Claude integration
- [x] Architecture documentation

### Phase 2: Core Features 🚧 (Next)
- [ ] Complete 6-segment workflow
  - [ ] Job description parser
  - [ ] Market intelligence analyzer
  - [ ] ATS scanner
  - [ ] Skill gap detector
  - [ ] Learning path generator
  - [ ] Resume optimizer
- [ ] Unit tests for all tools
- [ ] Integration tests

### Phase 3: Data Layer 📋 (Planned)
- [ ] Vector database integration (FAISS)
- [ ] Graph database for skills (Neo4j)
- [ ] Caching layer (Redis)
- [ ] RAG pipeline implementation

### Phase 4: Production 📋 (Planned)
- [ ] Docker containerization
- [ ] CI/CD with GitHub Actions
- [ ] GCP Cloud Run deployment
- [ ] Monitoring and observability
- [ ] Security hardening

---

## 🎓 What I Learned

### Technical Skills
- **MCP Protocol** - Deep understanding of standardized AI tool interfaces
- **Claude Integration** - Working with Claude as an MCP client
- **Tool Design** - Creating composable, testable tools
- **Architecture Thinking** - Designing systems that scale

### Design Principles
1. **Start with protocol, not framework** - Standards outlive frameworks
2. **Design for testability** - Separation of concerns enables unit testing
3. **Document trade-offs** - Every decision has pros/cons
4. **Plan for production** - Prototype with production architecture in mind

### Key Insights

**From TRADEOFFS.md**:
> "I chose MCP Server over LangChain because protocol standardization enables tool reusability across any MCP client. The 2-week learning curve was worth it for long-term maintainability. This is the difference between building a demo and architecting a system."

---

## 🧠 Architecture Highlights

### Why This Matters for Production

**This prototype demonstrates**:
- ✅ Understanding of tool abstraction
- ✅ Protocol-first thinking (not framework-dependent)
- ✅ Separation of concerns
- ✅ Foundation for scaling

**Next steps to production**:
1. Add data persistence layer
2. Implement RAG pipeline
3. Add authentication
4. Deploy to cloud
5. Set up CI/CD

**Estimated time to production**: 4-6 weeks  
**Detailed plan**: [docs/PRODUCTION_PLAN.md](docs/PRODUCTION_PLAN.md)

---

## 🤝 Contributing

This is currently a prototype/learning project. Feedback and suggestions welcome!

**Areas I'm exploring**:
- Best practices for MCP tool design
- RAG pipeline architecture
- Production deployment strategies
- Cost optimization techniques

---

## 📝 Project Status

**Current State**: Working prototype demonstrating MCP architecture  
**Lines of Code**: ~500  
**Tools Implemented**: 3  
**Test Coverage**: TBD (next phase)

**What's Working**:
- ✅ MCP server runs and registers tools
- ✅ Claude can discover and use tools
- ✅ Basic tool functionality implemented

**What's Next**:
- 🚧 Complete all 6 workflow segments
- 🚧 Add database integrations
- 🚧 Implement testing framework
- 🚧 Production deployment

---

## 📧 Contact

**Krithika Rajendran**
- 📧 Email: rkrithika1993@gmail.com
- 💼 LinkedIn: [linkedin.com/in/krithika-rajendran](https://linkedin.com/in/krithika-rajendran)
- 🐱 GitHub: [github.com/krithika93](https://github.com/krithika93)

---

## 🎯 For Hiring Managers

**What this project demonstrates**:

1. **Architectural thinking** - Designed full production system (see TRADEOFFS.md)
2. **Protocol understanding** - Chose MCP for standardization, not convenience
3. **Pragmatic approach** - Built working prototype, documented full vision
4. **Production mindset** - Thought through scaling, testing, deployment

**Questions I can discuss**:
- Why MCP over LangChain?
- How would you scale this to 100K users?
- What are the trade-offs of RAG vs fine-tuning?
- How would you test MCP tools?

**What I'm eager to learn**:
- Production GenAI patterns at scale
- Real-world RAG challenges
- Cost optimization techniques
- AI safety and governance

---

## 📊 Project Stats

- **Started**: October 2024
- **Status**: Active prototype
- **Primary Focus**: Learning MCP protocol and production AI architecture
- **Next Milestone**: Complete 6-tool workflow

---

<div align="center">

**Built as a learning project to understand MCP architecture and production GenAI systems**

[Architecture Docs](docs/TRADEOFFS.md) • [Production Plan](docs/PRODUCTION_PLAN.md) • [Report Issue](https://github.com/YOUR_USERNAME/resume-optimizer-mcp/issues)

</div>
