export type ProjectDetail = {
  slug: string; name: string; repo: string; label: string; headline: string; lead: string;
  accent: string; palette: string; tags: string[];
  facts: { label: string; value: string }[];
  chapters: { slug: string; title: string; intro: string; blocks: { title: string; body: string }[] }[];
};

export const projectDetails: ProjectDetail[] = [
  {
    slug: "Real-ESRGAN-animevideov3", name: "Real-ESRGAN animevideov3", repo: "Real-ESRGAN-animevideov3",
    label: "IMAGE INTELLIGENCE / MODAL GPU", headline: "让二次元影像，清晰再进一步。",
    lead: "基于 Real-ESRGAN animevideov3 的 4× 超分辨率 API。利用 Modal GPU Serverless 运行模型，把一张图片变成细节更丰富的 PNG 输出。",
    accent: "#86e6ff", palette: "esrgan", tags: ["Real-ESRGAN", "Modal", "FastAPI", "4× Upscale"],
    facts: [{label:"推理模型",value:"animevideov3"},{label:"推理实例",value:"NVIDIA T4"},{label:"输出",value:"PNG / 4×"}],
    chapters: [
      {slug:"features",title:"图像修复与放大",intro:"围绕动漫与插画场景设计的单图推理服务。",blocks:[
        {title:"4 倍超分辨率",body:"SRVGGNetCompact 模型以 4× 输出比例增强图像。效果取决于原始图像质量，不能保证恢复不存在的真实细节。"},
        {title:"专注图片处理",body:"当前仓库接口接收单张图片的二进制数据并返回 PNG；虽然模型名包含 animevideo，但代码没有实现视频上传、逐帧处理或视频导出。"},
        {title:"GPU 按需推理",body:"使用 Modal 类实例及 NVIDIA T4 GPU，容器空闲回收窗口配置为 120 秒。"}]},
      {slug:"architecture",title:"服务端工作原理",intro:"一个轻量的 HTTP 入口，连接解码、推理和结果输出。",blocks:[
        {title:"FastAPI Endpoint",body:"POST 端点读取原始请求体，用 OpenCV 解码图片，完成超分辨率后编码为 image/png 响应。"},
        {title:"模型准备",body:"构建镜像时安装 PyTorch、BasicSR、Real-ESRGAN，下载 animevideov3 权重；使用 NumPy 1.x 以规避兼容问题。"},
        {title:"鉴权边界",body:"若环境变量 AUTH_SECRET 已设置，请求须携带匹配的 x-api-key；密钥应通过 Modal Secret 管理，不要公开到仓库。"}]},
      {slug:"deploy",title:"部署与调用",intro:"从源文件到可以发送图片的远端服务。",blocks:[
        {title:"准备 Modal 环境",body:"安装并登录 Modal，阅读仓库中的 modal_backend.py，准备名为 custom-auth-secret 的 Modal Secret，并设置 AUTH_SECRET。"},
        {title:"部署源文件",body:"在已配置 Modal 的环境中执行 modal deploy modal_backend.py。实际部署前请检查依赖与 GPU 配额、费用。"},
        {title:"请求格式",body:"向部署生成的 POST URL 直接发送图片二进制内容，并根据需要设置 x-api-key 头；成功响应是 PNG 字节流。"}]}
    ]
  },
  {
    slug:"panghu1102.github.io",name:"Panghu1102 · Legacy Blog",repo:"panghu1102.github.io",
    label:"ARCHIVE / THE EARLY WEB",headline:"一段博客旅程，仍然值得收藏。",
    lead:"基于 Jekyll 与 Minimal Mistakes 的早期个人博客。这里记录的是网站演进的起点，而目前的博客内容和新作品以 PanghuTech 主站为准。",
    accent:"#ffca8b",palette:"archive",tags:["Jekyll","GitHub Pages","Minimal Mistakes","Archive"],
    facts:[{label:"引擎",value:"Jekyll"},{label:"主题",value:"Minimal Mistakes"},{label:"定位",value:"历史项目"}],
    chapters:[
      {slug:"story",title:"从这里开始",intro:"保留早期博客如何搭建、如何组织内容的记忆。",blocks:[
        {title:"GitHub Pages",body:"以 GitHub Pages 托管静态博客，源码里保留了 CNAME、robots.txt、sitemap.xml 等站点文件。"},
        {title:"Jekyll 模板",body:"站点使用 Minimal Mistakes remote theme，通过 _config.yml 定义主题与作者信息。"},
        {title:"今天的去向",body:"新内容与项目入口集中在 panghutech.com。此项目页仅作历史介绍，不承诺旧博客持续更新。"}]},
      {slug:"stack",title:"早期技术方案",intro:"回望一套轻量、经典的静态内容架构。",blocks:[
        {title:"文章与归档",body:"_posts 保存文章，按分类、标签和年份整理内容，支持分页。"},
        {title:"可发现性",body:"Jekyll sitemap、feed、搜索功能与链接元信息构成早期站点的基础。"},
        {title:"主题和布局",body:"Minimal Mistakes 提供导航、作者卡片、页脚和文章版式，便于快速发布。"}]},
      {slug:"migration",title:"归档与迁移",intro:"访问旧页面前，先了解现在该去哪里。",blocks:[
        {title:"主要入口",body:"访问 https://panghutech.com 阅读现有博客与项目介绍。"},
        {title:"历史价值",body:"保留仓库作为旧网站结构和内容组织方式的公开记录。"},
        {title:"链接提醒",body:"旧站文件中可能包含过时外链、域名或配置信息，使用前需以现有主站为准。"}]}
    ]
  },
  {
    slug:"Aokana-GPT-Sovits",name:"Aokana GPT-SoVITS",repo:"Aokana-GPT-Sovits",
    label:"VOICE EXPERIMENT / CONCEPT",headline:"让熟悉的声线，成为一次新的探索。",
    lead:"围绕《苍之彼方的四重奏》与 GPT-SoVITS 的语音技术实验主题。当前公开仓库只包含 LICENSE，尚无可核实的模型文件、演示或安装程序。",
    accent:"#eeb8ee",palette:"aokana",tags:["Voice AI","GPT-SoVITS","Experiment","Early stage"],
    facts:[{label:"公开状态",value:"仅许可证"},{label:"技术方向",value:"语音合成"},{label:"演示",value:"暂未发布"}],
    chapters:[
      {slug:"vision",title:"声音与创作",intro:"项目名称展示了语音合成的探索方向，而非已经发布的产品能力。",blocks:[
        {title:"实验方向",body:"GPT-SoVITS 通常用于文本到语音及少样本语音相关任务，本项目未来功能需以仓库实际更新为准。"},
        {title:"使用场景",body:"面向角色配音和创作研究的可能性；此处不提供未经核实的试听、下载或功能承诺。"},
        {title:"作品边界",body:"游戏作品及角色内容归原权利方所有；模型训练、素材使用及传播应尊重版权与授权。"}]},
      {slug:"status",title:"开发状态",intro:"从公开信息出发，清楚展示已知与未知。",blocks:[
        {title:"已公开",body:"截至本页面资料核对时，GitHub 仓库根目录只有 LICENSE 文件。"},
        {title:"尚未公开",body:"未看到 README、训练脚本、模型权重、使用说明或演示页面。"},
        {title:"后续关注",body:"项目开放更多内容后，可以补充模型说明、合规数据来源与可重复的部署步骤。"}]},
      {slug:"responsibility",title:"合规与使用边界",intro:"声音技术的可能性，也需要对真实的人和原创作品负责。",blocks:[
        {title:"获得许可",body:"仅使用有相应授权的声线和训练素材，尊重原作品和配音演员的权利。"},
        {title:"透明标识",body:"发布合成语音时，应明确说明使用了人工智能生成，不冒充真实人物。"},
        {title:"项目说明",body:"本站为项目的介绍页，不代表已有可供公开调用的声音模型。"}]}
    ]
  },
  {
    slug:"SparkRelay",name:"SparkRelay",repo:"SparkRelay",
    label:"OPEN SOURCE / ORGANIZATION",headline:"Small sparks. Connected.",
    lead:"SparkRelay 是聚焦实用软件和开放协作的开源组织门户。把小想法做成真正有价值的工具，让实验、项目和贡献者连接起来。",
    accent:"#a3d4ff",palette:"spark",tags:["Next.js","Open Source","Organization","Glass UI"],
    facts:[{label:"框架",value:"Next.js App Router"},{label:"栏目",value:"Home / Projects / About"},{label:"部署",value:"GitHub Pages"}],
    chapters:[
      {slug:"mission",title:"理念与使命",intro:"让简单、可靠的工具为开放网络带来实际价值。",blocks:[
        {title:"Ideas → Experiments",body:"快速验证真实需求，再决定哪些方向值得继续成长。"},
        {title:"Useful by default",body:"尽量降低工作流里的阻力，通过小规模、实用的功能交付价值。"},
        {title:"Open by design",body:"让代码、计划和协作保持开放，欢迎早期讨论与贡献。"}]},
      {slug:"ecosystem",title:"项目生态",intro:"官方网站描述的早期组织模块及其进度。",blocks:[
        {title:"SparkRelay",body:"组织和工程实践的共同入口，官网标记为 Active。"},
        {title:"Station",body:"面向开发工作流的工具与服务工作台，官网标记为 Building。"},
        {title:"Hub",body:"连接代码仓库、贡献者与知识分享的社区层，官网标记为 Planning。"}]},
      {slug:"technology",title:"网站技术",intro:"面向长期维护的可组合 Next.js 网站。",blocks:[
        {title:"App Router",body:"网站采用 Next.js App Router，分为首页、Projects 与 About 页面。"},
        {title:"内容与组件",body:"src/lib/site-content.ts 集中管理内容，导航、页脚和卡片组件复用。"},
        {title:"设计与部署",body:"响应式玻璃质感界面、亮暗主题切换与 GitHub Actions 静态导出到 GitHub Pages。"}]}
    ]
  },
  {
    slug:"daohang",name:"Panghu · Navigation",repo:"daohang",
    label:"PERSONAL SPACE / WEB PORTAL",headline:"一个入口，连接我的互联网世界。",
    lead:"使用 Astro 构建的轻量个人导航站。以极简玻璃风格展示博客、GitHub、JYACS 和云盘，集合代码、文章与个人小工具。",
    accent:"#a8d8cd",palette:"navigation",tags:["Astro","Netlify","Bilingual","Personal Portal"],
    facts:[{label:"框架",value:"Astro"},{label:"语言",value:"中文 / English"},{label:"外观",value:"亮色 / 暗色"}],
    chapters:[
      {slug:"destinations",title:"连接的站点",intro:"一页汇聚常用入口，减少不同服务之间的切换成本。",blocks:[
        {title:"Panghu Blog",body:"指向 panghutech.com，收录开发笔记、项目和思考。"},
        {title:"GitHub 与 JYACS",body:"连接公开源码与 Just Yuri AI 对话扩展介绍。"},
        {title:"Cloud Drive",body:"保留 drive.panghu.bond 作为独立云端空间的入口。"}]},
      {slug:"design",title:"设计哲学",intro:"以更少的元素传递更直接的信息。",blocks:[
        {title:"温和的玻璃风格",body:"页面以大留白、细边框、半透明卡片和柔和渐变建立视觉层次。"},
        {title:"双语切换",body:"通过中英文本字典切换界面文案，同时保留链接的实际目标。"},
        {title:"主题体验",body:"浏览器本地保存主题选择，支持亮暗外观；交互采用轻量过渡效果。"}]},
      {slug:"build",title:"实现与部署",intro:"依赖少、内容集中、适合简单维护的小型静态网站。",blocks:[
        {title:"Astro 页面",body:"核心入口在 src/pages/index.astro，链接和描述数据集中在同一页面。"},
        {title:"静态托管",body:"仓库带有 netlify.toml，可作为静态站点部署到 Netlify。"},
        {title:"隐私和范围",body:"导航页本身是链接汇总，不代替所链接站点的访问控制或隐私声明。"}]}
    ]
  }
];

export const getProjectDetail = (slug: string) => projectDetails.find((p) => p.slug === slug);
