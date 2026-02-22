import { SkillTheme } from '../types';

export const INITIAL_THEMES: SkillTheme[] = [
  {
    id: 'foundations',
    name: 'Low-Level Foundations & Core CS',
    description: 'The mechanical "physics" of software before frameworks.',
    subCategories: [
      {
        id: 'arch',
        name: 'Computer Architecture',
        skills: [
          { id: 'cpu-cache', name: 'CPU Caching (L1/L2/L3)', level: 0, maxLevel: 5 },
          { id: 'instruction-sets', name: 'Instruction Sets (x86 vs ARM)', level: 0, maxLevel: 5 },
          { id: 'memory-alignment', name: 'Memory Alignment', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'os',
        name: 'Operating Systems',
        skills: [
          { id: 'process-thread', name: 'Process vs Thread Mgmt', level: 0, maxLevel: 5 },
          { id: 'kernel-syscalls', name: 'Kernel Syscalls', level: 0, maxLevel: 5 },
          { id: 'file-systems', name: 'File Systems (NTFS/Ext4)', level: 0, maxLevel: 5 },
          { id: 'io-multiplexing', name: 'I/O Multiplexing (epoll/kqueue)', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'networking',
        name: 'Networking (L4–L7)',
        skills: [
          { id: 'transport', name: 'Transport (TCP/UDP/QUIC)', level: 0, maxLevel: 5 },
          { id: 'app-proto', name: 'App Protocols (HTTP/3, gRPC)', level: 0, maxLevel: 5 },
          { id: 'mtls', name: 'mTLS & WebSockets', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'data-structures',
        name: 'Data Structures',
        skills: [
          { id: 'b-trees', name: 'B-Trees (Databases)', level: 0, maxLevel: 5 },
          { id: 'bloom-filters', name: 'Bloom Filters (Caching)', level: 0, maxLevel: 5 },
          { id: 'crdts', name: 'CRDTs (Collab Editing)', level: 0, maxLevel: 5 },
        ]
      }
    ]
  },
  {
    id: 'language',
    name: 'Language & Runtime Mastery',
    description: 'How code behaves under pressure, beyond syntax.',
    subCategories: [
      {
        id: 'memory-mgmt',
        name: 'Memory Management',
        skills: [
          { id: 'stack-heap', name: 'Stack vs Heap Allocation', level: 0, maxLevel: 5 },
          { id: 'raii', name: 'RAII / Borrow Checking', level: 0, maxLevel: 5 },
          { id: 'gc-tuning', name: 'GC Tuning (JVM/V8)', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'type-systems',
        name: 'Type Systems',
        skills: [
          { id: 'static-dynamic', name: 'Static vs Dynamic', level: 0, maxLevel: 5 },
          { id: 'nominal-structural', name: 'Nominal vs Structural', level: 0, maxLevel: 5 },
          { id: 'generics', name: 'Generics & Metaprogramming', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'functional',
        name: 'Functional Programming',
        skills: [
          { id: 'immutability', name: 'Immutability', level: 0, maxLevel: 5 },
          { id: 'monads', name: 'Monads & Higher-Order Fn', level: 0, maxLevel: 5 },
          { id: 'lazy-eval', name: 'Lazy Evaluation', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'compiler',
        name: 'Compiler Basics',
        skills: [
          { id: 'ast', name: 'Abstract Syntax Trees (AST)', level: 0, maxLevel: 5 },
          { id: 'jit', name: 'JIT Compilation', level: 0, maxLevel: 5 },
        ]
      }
    ]
  },
  {
    id: 'backend',
    name: 'Backend & Distributed Systems',
    description: 'How services talk to each other and stay alive at scale.',
    subCategories: [
      {
        id: 'arch-patterns',
        name: 'Architectural Patterns',
        skills: [
          { id: 'microservices', name: 'Microservices', level: 0, maxLevel: 5 },
          { id: 'event-sourcing', name: 'Event Sourcing & CQRS', level: 0, maxLevel: 5 },
          { id: 'hexagonal', name: 'Hexagonal Architecture', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'concurrency',
        name: 'Concurrency Models',
        skills: [
          { id: 'actor-model', name: 'Actor Model (Erlang/Akka)', level: 0, maxLevel: 5 },
          { id: 'csp', name: 'CSP (Go Channels)', level: 0, maxLevel: 5 },
          { id: 'event-loops', name: 'Event Loops (Node.js)', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'consensus',
        name: 'Distributed Consensus',
        skills: [
          { id: 'paxos-raft', name: 'Paxos / Raft', level: 0, maxLevel: 5 },
          { id: 'gossip', name: 'Gossip Protocols', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'messaging',
        name: 'Messaging & Streams',
        skills: [
          { id: 'message-queues', name: 'Message Queuing (RabbitMQ)', level: 0, maxLevel: 5 },
          { id: 'event-streaming', name: 'Event Streaming (Kafka)', level: 0, maxLevel: 5 },
          { id: 'cdc', name: 'Change Data Capture (CDC)', level: 0, maxLevel: 5 },
        ]
      }
    ]
  },
  {
    id: 'data',
    name: 'Data Engineering & Persistence',
    description: 'Managing the most expensive part of any system.',
    subCategories: [
      {
        id: 'rdbms',
        name: 'Relational DBs',
        skills: [
          { id: 'sql-opt', name: 'Deep SQL Optimization', level: 0, maxLevel: 5 },
          { id: 'acid', name: 'ACID & Isolation Levels', level: 0, maxLevel: 5 },
          { id: 'sharding', name: 'Partitioning & Sharding', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'nosql',
        name: 'NoSQL Ecosystem',
        skills: [
          { id: 'document-db', name: 'Document (Mongo/Couch)', level: 0, maxLevel: 5 },
          { id: 'kv-store', name: 'Key-Value (Redis/Bitmaps)', level: 0, maxLevel: 5 },
          { id: 'wide-column', name: 'Wide-Column (Cassandra)', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'vector-search',
        name: 'Vector & Search',
        skills: [
          { id: 'vector-db', name: 'Vector DBs (HNSW/IVF)', level: 0, maxLevel: 5 },
          { id: 'search-engines', name: 'Inverted Indexes (Elastic)', level: 0, maxLevel: 5 },
        ]
      }
    ]
  },
  {
    id: 'frontend',
    name: 'Frontend & Client-Side',
    description: 'Distributed systems running in a browser.',
    subCategories: [
      {
        id: 'rendering',
        name: 'Rendering Patterns',
        skills: [
          { id: 'ssr-ssg', name: 'SSR / SSG / ISR', level: 0, maxLevel: 5 },
          { id: 'hydration', name: 'Partial Hydration', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'browser',
        name: 'Browser Internals',
        skills: [
          { id: 'crp', name: 'Critical Rendering Path', level: 0, maxLevel: 5 },
          { id: 'v8-opt', name: 'V8 Engine Optimization', level: 0, maxLevel: 5 },
          { id: 'web-workers', name: 'Web Workers', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'wasm',
        name: 'WebAssembly',
        skills: [
          { id: 'wasm-rust', name: 'Wasm (Rust/C++)', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'state',
        name: 'State Management',
        skills: [
          { id: 'atomic-state', name: 'Atomic (Recoil/Jotai)', level: 0, maxLevel: 5 },
          { id: 'flux', name: 'Flux (Redux)', level: 0, maxLevel: 5 },
          { id: 'server-state', name: 'Server State (React Query)', level: 0, maxLevel: 5 },
        ]
      }
    ]
  },
  {
    id: 'cloud',
    name: 'Cloud & Infrastructure',
    description: 'Owning the environment.',
    subCategories: [
      {
        id: 'containers',
        name: 'Containerization',
        skills: [
          { id: 'oci', name: 'OCI Images & Multi-stage', level: 0, maxLevel: 5 },
          { id: 'runtimes', name: 'Runtimes (containerd)', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'orchestration',
        name: 'Orchestration',
        skills: [
          { id: 'k8s', name: 'Kubernetes (CRDs/Operators)', level: 0, maxLevel: 5 },
          { id: 'service-mesh', name: 'Service Mesh (Istio)', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'serverless',
        name: 'Serverless',
        skills: [
          { id: 'faas', name: 'FaaS (Lambda)', level: 0, maxLevel: 5 },
          { id: 'edge', name: 'Edge Computing (Workers)', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'iac',
        name: 'Infrastructure as Code',
        skills: [
          { id: 'terraform', name: 'Declarative (Terraform)', level: 0, maxLevel: 5 },
          { id: 'pulumi', name: 'Imperative (Pulumi/CDK)', level: 0, maxLevel: 5 },
        ]
      }
    ]
  },
  {
    id: 'security',
    name: 'Security (Shift-Left)',
    description: 'Security as a technical requirement.',
    subCategories: [
      {
        id: 'iam',
        name: 'Identity & Access',
        skills: [
          { id: 'oauth-oidc', name: 'OAuth2 / OIDC / SAML', level: 0, maxLevel: 5 },
          { id: 'rbac-abac', name: 'RBAC / ABAC', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'app-sec',
        name: 'Application Security',
        skills: [
          { id: 'owasp', name: 'Injection/XSS/CSRF/SSRF', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'crypto',
        name: 'Cryptography',
        skills: [
          { id: 'hashing', name: 'Hashing (Argon2)', level: 0, maxLevel: 5 },
          { id: 'encryption', name: 'Sym/Asymmetric Encryption', level: 0, maxLevel: 5 },
          { id: 'zkp', name: 'Zero-Knowledge Proofs', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'supply-chain',
        name: 'Supply Chain',
        skills: [
          { id: 'sbom', name: 'SBOM & Vuln Scanning', level: 0, maxLevel: 5 },
        ]
      }
    ]
  },
  {
    id: 'quality',
    name: 'Quality & Observability',
    description: 'Keeping the system green.',
    subCategories: [
      {
        id: 'testing',
        name: 'Testing Strategy',
        skills: [
          { id: 'prop-testing', name: 'Property-based Testing', level: 0, maxLevel: 5 },
          { id: 'chaos', name: 'Chaos Engineering', level: 0, maxLevel: 5 },
          { id: 'load-test', name: 'Load/Stress (k6)', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'observability',
        name: 'Observability Pillars',
        skills: [
          { id: 'logs', name: 'Logs (ELK/Loki)', level: 0, maxLevel: 5 },
          { id: 'metrics', name: 'Metrics (Prometheus)', level: 0, maxLevel: 5 },
          { id: 'traces', name: 'Tracing (Jaeger)', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'sre',
        name: 'SRE Principles',
        skills: [
          { id: 'slis-slos', name: 'Error Budgets & SLOs', level: 0, maxLevel: 5 },
        ]
      }
    ]
  },
  {
    id: 'ai',
    name: 'AI Engineering',
    description: 'Integrating machine intelligence.',
    subCategories: [
      {
        id: 'llm-ops',
        name: 'LLM Orchestration',
        skills: [
          { id: 'langchain', name: 'LangChain/LlamaIndex', level: 0, maxLevel: 5 },
          { id: 'prompt-eng', name: 'Technical Prompt Eng', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'rag',
        name: 'RAG Pipelines',
        skills: [
          { id: 'chunking', name: 'Chunking & Embeddings', level: 0, maxLevel: 5 },
          { id: 'semantic', name: 'Semantic Search', level: 0, maxLevel: 5 },
        ]
      },
      {
        id: 'deployment',
        name: 'Model Deployment',
        skills: [
          { id: 'quantization', name: 'Quantization', level: 0, maxLevel: 5 },
          { id: 'api-opt', name: 'API Optimization', level: 0, maxLevel: 5 },
        ]
      }
    ]
  }
];

export const INITIAL_PROFILE = {
  fullName: 'Alex Developer',
  title: 'Senior Software Engineer',
  email: 'alex@example.com',
  phone: '+1 (555) 123-4567',
  location: 'San Francisco, CA',
  education: 'BS Computer Science, University of Tech',
  visaStatus: 'Citizen',
  yearsOfExperience: 5,
  githubUrl: 'https://github.com',
  linkedinUrl: 'https://linkedin.com',
  bio: 'Passionate full-stack engineer with a focus on scalable web applications and developer experience.',
};

export const INITIAL_EXPERIENCE = [
  {
    id: '1',
    company: 'Tech Corp',
    role: 'Senior Software Engineer',
    startDate: '2022-01',
    endDate: 'Present',
    description: 'Leading the frontend migration to React. Mentoring junior developers.',
    technologies: ['React', 'TypeScript', 'Node.js'],
  },
  {
    id: '2',
    company: 'Startup Inc',
    role: 'Software Engineer',
    startDate: '2019-06',
    endDate: '2021-12',
    description: 'Built the MVP for the core product. Handled full-stack development.',
    technologies: ['Vue.js', 'Python', 'Django'],
  }
];
