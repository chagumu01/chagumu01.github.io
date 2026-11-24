---
articleId: article-fb06797ef1ded4cb
title: 从传统后端到 Agent Infra：传统软件工程与智能体工程如何融合
date: '2026-11-24 19:19:49'
updated: '2026-11-24 19:19:49'
description: 随着 Agent 从简单的对话应用走向复杂的任务执行系统，我们会发现，Agent 开发越来越多地涉及传统后端工程中的技术问题。 例如，Agent 执行长任务时需要状态持久化，多个 Agent 同时运行时需要并发控制，调用外部工具时需要权限管理，执行过程出现异常时需要任务恢复。这些问题在传统软件工程中
categories:
  - agent
tags: []
cover: false
top_img: false
mathjax: false
comments: true
abbrlink: e5624828
---

随着 Agent 从简单的对话应用走向复杂的任务执行系统，我们会发现，Agent 开发越来越多地涉及传统后端工程中的技术问题。

例如，Agent 执行长任务时需要状态持久化，多个 Agent 同时运行时需要并发控制，调用外部工具时需要权限管理，执行过程出现异常时需要任务恢复。这些问题在传统软件工程中已经存在多年，只是在 Agent 场景下出现了新的需求。

要理解两者如何融合，我们需要先分别了解传统后端工程和 Agent 工程的技术体系，再分析它们之间的连接点，以及为什么这些连接点会逐渐形成 Agent Infra 这一技术方向。

## **一、传统后端工程的技术体系**

传统后端工程主要负责业务逻辑的实现、数据的管理以及服务的稳定运行。随着系统规模扩大，后端工程还需要解决高并发、高可用、分布式协作和系统治理等问题。

以 Java 后端技术体系为例，可以将其划分为以下几个层次。

### **1.1 基础开发层**

基础开发层负责实现具体的业务功能，是整个后端系统的起点。

| 技术领域 | 核心技术                 | 主要作用               |
| -------- | ------------------------ | ---------------------- |
| 编程语言 | Java、Go、Python         | 实现业务逻辑           |
| 开发框架 | Spring Boot、Spring MVC  | 快速构建后端服务       |
| 网络通信 | HTTP、TCP、WebSocket     | 实现客户端与服务端通信 |
| 接口设计 | RESTful API、RPC         | 对外暴露业务能力       |
| 设计模式 | 工厂模式、策略模式       | 提高代码的可扩展性     |
| 并发编程 | 多线程、线程池、异步任务 | 同时处理多个请求       |

例如，开发一个电商系统，需要实现用户注册、商品查询、订单创建和支付等功能。这些业务能力通常由后端开发框架组织，并通过 API 对外提供服务。

### **1.2 数据存储层**

数据存储层负责管理业务数据、运行状态和历史记录，并根据不同场景选择合适的存储方式。

| 技术领域     | 核心技术           | 主要作用                   |
| ------------ | ------------------ | -------------------------- |
| 关系型数据库 | MySQL、PostgreSQL  | 存储结构化业务数据         |
| 缓存         | Redis              | 加速数据访问、管理临时状态 |
| 搜索引擎     | Elasticsearch      | 全文检索与复杂查询         |
| 对象存储     | MinIO、S3          | 存储文件与非结构化数据     |
| 数据一致性   | 事务、锁、幂等机制 | 保证业务操作的正确性       |
| 持久化框架   | MyBatis、JPA       | 实现业务对象与数据库交互   |

这一层需要关注数据如何保存、如何读取、如何保证一致性，以及系统发生异常之后如何恢复数据。

### **1.3 分布式与中间件层**

当单体应用无法满足业务规模时，后端系统需要引入分布式架构及相关中间件，解决不同服务之间的协作问题。

| 技术领域       | 核心技术                    | 主要作用               |
| -------------- | --------------------------- | ---------------------- |
| 消息队列       | Kafka、RabbitMQ             | 异步处理、事件传递     |
| 服务网关       | Spring Cloud Gateway、Nginx | 请求转发、认证与限流   |
| 服务注册与发现 | Nacos、Consul               | 管理服务实例           |
| 分布式调度     | XXL-JOB、Quartz             | 管理定时与异步任务     |
| 服务容错       | Sentinel、Resilience4j      | 熔断、限流与降级       |
| 分布式协调     | 分布式锁、一致性协议        | 保证多个节点之间的协作 |

这一层的重点是如何将不同的服务组织起来，使整个系统在业务规模增长之后仍然能够稳定运行。

### **1.4 基础设施与运维治理层**

这一层负责软件的部署、运行、监控和持续交付。

| 技术领域 | 核心技术                  | 主要作用             |
| -------- | ------------------------- | -------------------- |
| 操作系统 | Linux、进程管理           | 提供程序运行环境     |
| 容器化   | Docker                    | 隔离与标准化运行环境 |
| 容器编排 | Kubernetes                | 集群管理与弹性扩缩容 |
| 持续集成 | Jenkins、GitHub Actions   | 自动化测试与部署     |
| 日志管理 | ELK                       | 日志采集与分析       |
| 指标监控 | Prometheus、Grafana       | 监控系统运行状态     |
| 链路追踪 | OpenTelemetry、SkyWalking | 定位跨服务调用问题   |
| 安全治理 | RBAC、OAuth 2.0           | 身份认证与访问控制   |

总体来看，传统后端工程围绕四个核心问题展开：**业务如何实现、数据如何管理、服务如何协作、系统如何稳定运行。**

## **二、Agent 工程的技术体系**

Agent 工程主要负责将基础模型组织成能够理解目标、进行决策、调用外部能力并完成实际任务的系统。

一个完整的 Agent 系统通常包含模型接入、上下文管理、任务规划、工具执行、记忆管理、运行控制和质量评测等多个模块。

### **2.1 模型能力层**

模型能力层为 Agent 提供理解、推理和决策能力，是整个智能系统的核心。

| 技术领域           | 核心技术                | 主要作用               |
| ------------------ | ----------------------- | ---------------------- |
| 模型接入           | LLM API、本地模型       | 获取基础智能能力       |
| Prompt Engineering | System Prompt、Few-shot | 引导模型输出与行为     |
| Structured Output  | JSON Schema             | 约束模型输出结构       |
| Function Calling   | Tool Calling            | 生成外部工具调用请求   |
| 模型选择           | Model Routing           | 根据任务选择合适的模型 |
| 多模态             | VLM、ASR、TTS           | 处理文本之外的信息     |

这一层主要关注如何有效使用模型能力，使模型能够正确理解任务并产生可供系统处理的输出。

### **2.2 知识与上下文层**

基础模型的知识和上下文窗口都有一定限制，因此 Agent 需要建立外部知识获取与上下文管理机制。

| 技术领域            | 核心技术             | 主要作用               |
| ------------------- | -------------------- | ---------------------- |
| RAG                 | 向量检索、混合检索   | 获取外部知识           |
| Agentic Search      | 多轮检索、自主搜索   | 根据任务动态寻找信息   |
| Context Engineering | 动态加载、上下文压缩 | 管理模型输入的信息     |
| Short-term Memory   | 会话历史、工作记忆   | 保留当前任务信息       |
| Long-term Memory    | 语义记忆、情节记忆   | 沉淀长期知识与经验     |
| Agent Skill         | 指令与资源封装       | 复用特定领域的工作方法 |

这一层主要解决一个问题：模型应该在什么时候获取什么信息，才能更好地完成当前任务。

### **2.3 规划与执行层**

规划与执行层负责将用户目标转化为实际行动，是 Agent 区别于普通模型应用的重要部分。

| 技术领域          | 核心技术                   | 主要作用               |
| ----------------- | -------------------------- | ---------------------- |
| Task Planning     | 任务拆解、Plan-and-Execute | 将复杂目标拆分为子任务 |
| Agent Loop        | ReAct、循环执行            | 根据执行结果继续决策   |
| Tool Calling      | 工具注册与调用             | 操作外部系统           |
| MCP               | 标准化工具与资源接入       | 连接外部能力           |
| Workflow          | LangGraph、状态图          | 组织任务执行流程       |
| Multi-Agent       | 角色分工、智能体协作       | 完成复杂协同任务       |
| Human-in-the-Loop | 人工审批与干预             | 控制关键决策与操作     |

例如，一个 Coding Agent 接到开发需求后，需要分析仓库、制订计划、读取文件、修改代码、运行测试，并根据测试结果决定是否继续修改。这些过程都属于规划与执行层。

### **2.4 运行控制与质量保障层**

当 Agent 开始执行真实业务时，需要对其行为、运行状态和任务质量建立相应的控制机制。

| 技术领域         | 核心技术                     | 主要作用             |
| ---------------- | ---------------------------- | -------------------- |
| Agent Harness    | 执行环境、行为约束、反馈机制 | 组织和控制模型行为   |
| Agent Runtime    | 生命周期管理、任务运行       | 支撑 Agent 持续执行  |
| Checkpoint       | 检查点、状态恢复             | 恢复中断的任务       |
| Guardrails       | 输入输出校验、行为限制       | 约束不符合要求的行为 |
| Agent Sandbox    | 隔离执行环境                 | 控制工具操作范围     |
| Evaluation       | LLM as a Judge、人工评测     | 衡量任务执行质量     |
| Observability    | Trace、Token、Tool Call      | 分析智能系统执行过程 |
| Self-improvement | 反馈学习、策略优化           | 持续改善任务执行能力 |

总体来看，Agent 工程也可以归纳为四个核心问题：**智能如何获取、信息如何组织、任务如何执行、行为如何控制。**

## **三、传统后端与 Agent 工程如何融合**

了解两者的技术体系之后，我们会发现，它们之间的关系可以分为三种：传统技术直接复用、传统技术针对 Agent 场景进行扩展，以及两者结合产生新的基础设施。

### **3.1 传统技术直接复用**

Agent 首先是一个软件系统，因此传统软件开发中的大量基础能力可以直接使用。

例如，开发一个企业级知识库 Agent，仍然需要用户登录、文件上传、数据库访问、接口通信和权限管理。这些功能可以继续使用 Spring Boot、MySQL、Redis 等传统技术实现。

| Agent 业务需求      | 直接复用的传统技术   |
| ------------------- | -------------------- |
| 用户注册与登录      | Spring Security、JWT |
| 保存用户会话        | MySQL、PostgreSQL    |
| 上传知识库文件      | MinIO、对象存储      |
| 实时返回模型输出    | SSE、WebSocket       |
| 对外提供 Agent 接口 | RESTful API          |
| 定时执行 Agent 任务 | Quartz、XXL-JOB      |
| 部署 Agent 服务     | Docker、Kubernetes   |

这一部分与传统后端开发没有太大的本质差异。即使未来模型和 Agent 框架发生变化，这些基础能力仍然具有复用价值。

### **3.2 传统技术针对 Agent 场景进行扩展**

Agent 的特殊性在于模型输出具有不确定性，任务的执行路径可能在运行过程中动态变化。因此，部分传统技术需要结合 Agent 的特点进行扩展。

| 传统后端技术      | Agent 工程需求         | 融合后的技术方向       |
| ----------------- | ---------------------- | ---------------------- |
| API Gateway       | 多模型选择与调用       | Model Gateway          |
| 状态机、任务调度  | 动态任务规划与执行     | Agent Runtime          |
| 数据库、检索系统  | 长期记忆管理           | Memory Infrastructure  |
| 缓存、资源管理    | 上下文动态加载与压缩   | Context Infrastructure |
| RBAC、接口鉴权    | 模型工具调用权限       | Agent Permission       |
| Docker、进程隔离  | 模型生成代码的安全执行 | Agent Sandbox          |
| 日志、链路追踪    | 模型决策与工具执行追踪 | Agent Observability    |
| 自动化测试、CI/CD | 非确定性输出质量评估   | Agent Evaluation       |

以可观测性为例，传统后端主要记录接口调用是否成功、响应时间有多长、数据库是否出现异常。

但对于 Agent 系统，即使所有接口都成功返回，最终任务仍然可能失败。模型可能选择错误的工具，也可能在获取正确数据之后作出错误判断。

因此，Agent 可观测性需要在传统链路追踪的基础上，进一步记录 Prompt、模型输出、Token 消耗、工具调用和任务执行结果。

这种扩展就产生了新的技术需求，也构成了 Agent Infra 的一部分。

### **3.3 两者通过 Harness 形成完整系统**

Harness 可以理解为围绕模型建立的一套运行、约束和反馈机制。它负责将模型能力、Agent 工程组件和底层软件基础设施组织起来。

下面是一个简化的 Agent 系统架构。

```
                  用户 / 业务系统
                         │
              REST API / SSE / RPC
                         │
┌─────────────────────────────────────┐
│           Agent Harness             │
│                                     │
│    Context      Planning     Memory │
│    上下文管理    任务规划      记忆    │
│                 │                   │
│              LLM 模型               │
│                 │                   │
│    Tool Call    Agent Loop          │
│    工具调用      循环执行             │
│                 │                   │
│    权限控制      状态管理      评测    │
└─────────────────────────────────────┘
                         │
┌─────────────────────────────────────┐
│            传统工程基础设施           │
│                                     │
│   数据库      缓存       消息队列      │
│   文件系统    进程管理    容器环境      │
│   网络通信    日志监控    权限系统      │
└─────────────────────────────────────┘
```

模型负责根据上下文产生决策，Harness 负责组织和控制决策的执行，底层基础设施则提供数据存储、工具执行、状态管理和资源隔离等能力。

Harness 与 Agent Infra 存在交集，但两者的侧重点有所不同。Harness 更关注如何组织一次或多次 Agent 执行过程，Agent Infra 则更关注支撑这些执行过程的通用基础能力。

## **四、结合实际场景理解两者如何相融**

### **4.1 数据库与 Agent Memory 的融合**

传统数据库负责数据存储，而 Agent Memory 需要进一步解决哪些信息值得保存、什么时候应该读取、如何将历史信息提供给模型。

假设我们开发一个具有长期记忆的 Agent。

传统后端负责使用 PostgreSQL 保存历史消息，使用 pgvector 进行向量检索，使用 Redis 管理临时会话状态。

Agent 工程则负责判断用户提供的信息是否具有长期价值，对历史信息进行提取和总结，并根据当前任务选择相关记忆。

```
def load_memory(user_id, query):
    # Agent 工程：理解当前任务，生成检索向量
    embedding = embedding_model.encode(query)

    # 传统后端：从数据库中检索历史记忆
    memories = memory_repository.search(
        user_id=user_id,
        embedding=embedding
    )

    # Agent 工程：筛选和组织相关记忆
    relevant_memories = memory_filter(memories, query)

    # Agent 工程：将记忆组装到模型上下文
    return build_context(relevant_memories)
```

最终形成的 Memory Infrastructure，需要同时具备数据库工程、信息检索和上下文工程能力。

### **4.2 消息队列与 Agent Runtime 的融合**

传统后端使用消息队列解决异步任务分发、流量削峰和服务解耦的问题。

Agent 系统则存在大量执行时间较长、执行路径不固定的任务。例如，用户提交一个软件开发需求，Coding Agent 可能需要经过数十轮模型推理和工具调用才能完成。

此时，可以通过传统消息队列与 Agent 执行引擎进行结合。

```
用户提交开发任务
        │
Spring Boot 接收请求
        │
PostgreSQL 保存任务状态
        │
Kafka / RabbitMQ 分发任务
        │
Agent Worker 接收任务
        │
Agent Loop 持续推理与调用工具
        │
Checkpoint 保存执行进度
        │
SSE / WebSocket 返回执行事件
```

传统后端负责任务接收、消息分发、并发管理和状态持久化，Agent 工程负责根据任务目标进行动态推理和执行。

如果用户关闭页面或者网络中断，服务端的 Agent Worker 可以继续执行任务。用户重新连接时，可以根据任务 ID 查询进度。

如果 Worker 本身发生故障，则需要通过 Checkpoint、任务重试和幂等机制实现恢复。

这就是传统分布式任务系统向 Agent Runtime 扩展的过程。

### **4.3 接口设计与 Tool Calling 的融合**

Tool Calling 是传统后端与 Agent 工程最直接的连接点。

传统后端已经实现了大量业务接口，例如查询订单、创建工单、获取项目进度。Agent 可以通过工具调用机制复用这些业务能力。

假设现有 Spring Boot 系统中已经存在订单查询接口：

```
@GetMapping("/orders/{id}")
public Order getOrder(@PathVariable Long id) {
    return orderService.findById(id);
}
```

使用 Spring AI，可以将已有的业务逻辑封装成模型能够调用的工具：

```
@Tool(description = "根据订单ID查询订单信息")
public Order queryOrder(Long orderId) {

    // 传统后端：调用已有的业务服务
    return orderService.findById(orderId);
}
```

当用户提出查询某个订单物流状态的需求时，模型负责理解意图、选择工具和生成参数，而实际查询操作仍然由传统的 Service、Mapper 和数据库完成。

如果希望多个 Agent 或不同客户端复用这项业务能力，还可以将其封装为 MCP Server。

由此可见，传统后端中积累的大量业务接口，可以成为 Agent 操作现实业务系统的能力来源。

### **4.4 容器技术与 Agent Sandbox 的融合**

传统 Docker 主要用于应用部署、环境标准化和资源隔离，而在 Coding Agent 中，容器还可以作为模型执行代码和操作文件的隔离环境。

例如，一个 Coding Agent 需要执行以下操作：

```
npm install
npm run build
npm run test
```

由于这些命令由模型动态选择，如果直接在宿主机上运行，可能影响其他文件、进程和系统资源。

因此，Agent 可以在独立的 Docker 容器中执行任务。

传统系统工程负责创建容器、挂载工作目录、限制网络访问和计算资源。Agent 工程负责决定执行什么命令、分析命令输出，并判断是否需要继续修改代码。

两者结合形成 Agent Sandbox。对于更高安全要求的场景，还需要进一步考虑虚拟机隔离、系统调用限制和凭证管理。

### **4.5 自动化测试与 Agent Evaluation 的融合**

传统自动化测试通常面对相对确定的输入输出关系。例如，给定订单 ID，接口应该返回对应的订单数据。

Agent 的输出和执行路径可能具有不确定性。针对同一个开发需求，Agent 两次执行可能使用不同的修改方案，但最终都能够满足要求。

因此，Agent Evaluation 需要在传统自动化测试的基础上，引入任务成功率、工具调用正确性、模型评审以及成本和效率指标。

| 评价维度   | 传统软件测试         | Agent Evaluation               |
| ---------- | -------------------- | ------------------------------ |
| 功能正确性 | 单元测试、集成测试   | 任务成功率                     |
| 执行过程   | 接口调用是否符合预期 | 工具选择与调用是否合理         |
| 输出质量   | 确定性断言           | 规则评测、模型评审             |
| 性能       | 响应时间、吞吐量     | Token 成本、任务耗时           |
| 版本验证   | 代码回归测试         | Prompt、模型、Harness 回归评测 |

未来企业在更新 Agent 的 Prompt、模型版本、工具链和上下文策略时，也可以通过 CI/CD 自动触发评测任务。

这相当于将传统软件的持续集成体系扩展到了智能系统的持续优化过程。

## **五、开源项目中的实际融合方式**

前面讨论的是技术层面的融合关系，接下来可以通过实际开源项目观察这些能力是如何被组织起来的。

### **5.1 Codex Harness**

**OpenAI Codex**
[github.com/openai/codex](https://github.com/openai/codex?utm_source=chatgpt.com)

Codex 比较适合研究 Agent 核心运行机制，以及传统系统编程如何支撑模型执行任务。

Codex 的 App Server 通过双向 JSON-RPC 协议对外提供 Harness 能力，使桌面端、IDE 等客户端可以复用同一套 Agent 执行系统。

| 系统模块     | 传统工程能力             | Agent 工程能力     |
| ------------ | ------------------------ | ------------------ |
| App Server   | RPC、进程管理            | Agent 服务化       |
| Agent Loop   | 循环控制、异步执行       | 模型推理与动态决策 |
| Tool Runtime | 接口分发、命令执行       | 模型工具调用       |
| Session      | 数据持久化、生命周期管理 | 会话上下文维护     |
| Sandbox      | 操作系统、资源隔离       | 安全执行模型决策   |
| Event Stream | 事件传输、通信协议       | 实时展示任务过程   |

Codex 的架构说明了，即使是一个本地 Coding Agent，也需要大量传统计算机系统知识。文件系统、异步编程、进程通信和状态管理都是其运行基础。

推荐阅读：[Codex Harness 官方架构解析](https://openai.com/zh-Hans-CN/index/unlocking-the-codex-harness/?utm_source=chatgpt.com)。

### **5.2 OpenHands**

**OpenHands Software Agent SDK**
[github.com/OpenHands/software-agent-sdk](https://github.com/OpenHands/software-agent-sdk?utm_source=chatgpt.com)

OpenHands 更适合研究 Agent 如何从本地执行走向服务化和容器化。其 SDK 将 Agent 核心、工具、Workspace 和 Agent Server 拆分为相对独立的模块。

| 模块                     | 主要作用               | 技术归属   |
| ------------------------ | ---------------------- | ---------- |
| `openhands.sdk`          | 推理、决策与上下文管理 | Agent 工程 |
| `openhands.tools`        | 注册与执行外部工具     | 两者融合   |
| `openhands.workspace`    | 管理本地和远程执行环境 | 基础设施   |
| `openhands.agent_server` | HTTP、WebSocket 服务   | 后端工程   |

其中 Workspace 是一个值得关注的设计。相同的 Agent 逻辑，可以通过不同 Workspace 在本地、Docker 或远程环境中执行。Agent Server 则提供远程访问接口。

这实际上复用了传统软件工程中的接口抽象、依赖隔离和模块化设计思想。

推荐阅读：[OpenHands 架构设计文档](https://github.com/OpenHands/docs/blob/main/sdk/arch/overview.mdx?utm_source=chatgpt.com)。

### **5.3 其他值得研究的开源项目**

除了完整的 Coding Agent，还可以选择一些专门解决 Agent Infra 问题的项目，研究传统技术如何针对智能系统进行扩展。

| 开源项目                                                     | 传统技术基础           | 值得研究的 Agent 方向  |
| ------------------------------------------------------------ | ---------------------- | ---------------------- |
| [LangGraph](https://github.com/langchain-ai/langgraph?utm_source=chatgpt.com) | 状态机、图结构、持久化 | Agent 编排与任务恢复   |
| [Temporal](https://github.com/temporalio/temporal?utm_source=chatgpt.com) | 分布式工作流、任务调度 | Agent 长任务可靠执行   |
| [LiteLLM](https://github.com/BerriAI/litellm?utm_source=chatgpt.com) | API 网关、负载均衡     | Model Gateway          |
| [Langfuse](https://github.com/langfuse/langfuse?utm_source=chatgpt.com) | 日志、链路追踪         | Agent 可观测性与评测   |
| [E2B](https://github.com/e2b-dev/E2B?utm_source=chatgpt.com) | 虚拟化、资源隔离       | Agent Sandbox          |
| [Spring AI](https://github.com/spring-projects/spring-ai?utm_source=chatgpt.com) | Spring 生态、接口抽象  | Java 与 Agent 能力集成 |
| [Mem0](https://github.com/mem0ai/mem0?utm_source=chatgpt.com) | 数据库、向量检索       | Memory Infrastructure  |
| [Dify](https://github.com/langgenius/dify?utm_source=chatgpt.com) | 后端服务、工作流引擎   | Agent 应用开发平台     |

这些项目既可以作为 Agent 工程的学习资料，也可以作为传统后端技术的实际应用案例。

## **写在最后**

如果重新审视传统后端、Agent 工程和 Agent Infra 三者之间的关系，可以得到以下结论。

传统后端工程提供了软件系统可靠运行的基础能力，包括数据存储、网络通信、任务调度和服务治理。Agent 工程提供了智能系统的理解、推理、规划和决策能力。

**Agent Infra 则是在传统软件基础设施之上，针对智能系统的特殊运行需求进行扩展，形成的一套通用工程能力。**

对于同时学习 Java 后端和 Agent 开发的人而言，可以围绕同一个工程问题建立两套技术知识之间的联系。

学习数据库时，可以延伸到 Agent Memory 和 Checkpoint；学习消息队列时，可以延伸到 Agent Runtime；学习 Docker 时，可以延伸到 Agent Sandbox；学习网关时，可以延伸到 Model Gateway。

这样，传统后端和 Agent 开发就不再是两条相互独立的学习路线，而是能够相互支撑、持续积累的一套技术体系。

从未来 AI 产业的发展来看，当 Agent 从个人工具走向企业级服务，从单次任务走向长期运行，从单个智能体走向智能组织，传统软件工程的能力也将获得更多新的应用场景。

这正是 Agent Infra 值得长期关注的原因。

<!-- blogloom:article-fb06797ef1ded4cb:d76a860cce51112edc2ab8b35cc3f56459dc13703f488605246fba3d25b0cbee -->
