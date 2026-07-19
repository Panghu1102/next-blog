import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import type { Root, RootContent, Text, PhrasingContent, ListItem, TableRow } from "mdast";

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date?: string;
};

export type Post = PostMeta & {
  content: Root;
};

const postsDirectory = path.join(process.cwd(), "posts");

function ensurePostsDirectory() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }
}

function isMarkdownFile(fileName: string) {
  return fileName.endsWith(".md");
}

function formatTitle(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getPostSource(slug: string) {
  ensurePostsDirectory();
  const filePath = path.join(postsDirectory, `${slug}.md`);

  if (!filePath.startsWith(postsDirectory) || !fs.existsSync(filePath)) {
    return null;
  }

  return fs.readFileSync(filePath, "utf8");
}

export function getAllPosts(): PostMeta[] {
  ensurePostsDirectory();

  return fs
    .readdirSync(postsDirectory)
    .filter(isMarkdownFile)
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const source = fs.readFileSync(path.join(postsDirectory, fileName), "utf8");
      const { data, content } = matter(source);
      const excerpt = content
        .replace(/[#>*_`\-[\]]/g, "")
        .split("\n")
        .map((line) => line.trim())
        .find(Boolean);

      return {
        slug,
        title: typeof data.title === "string" ? data.title : formatTitle(slug),
        description:
          typeof data.description === "string"
            ? data.description
            : excerpt ?? "阅读这篇 Markdown 文章。",
        date: typeof data.date === "string" ? data.date : undefined,
      };
    })
    .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const source = getPostSource(slug);

  if (!source) {
    return null;
  }

  const { data, content } = matter(source);
  const parsed = await remark().use(remarkGfm).parse(content);

  return {
    slug,
    title: typeof data.title === "string" ? data.title : formatTitle(slug),
    description: typeof data.description === "string" ? data.description : "阅读这篇 Markdown 文章。",
    date: typeof data.date === "string" ? data.date : undefined,
    content: parsed,
  };
}

export function renderInline(nodes: PhrasingContent[] = []) {
  return nodes.map((node, index) => {
    if (node.type === "text") {
      return (node as Text).value;
    }

    if (node.type === "strong") {
      return <strong key={index}>{renderInline(node.children)}</strong>;
    }

    if (node.type === "emphasis") {
      return <em key={index}>{renderInline(node.children)}</em>;
    }

    if (node.type === "inlineCode") {
      return <code key={index}>{node.value}</code>;
    }

    if (node.type === "link") {
      return (
        <a key={index} href={node.url} target="_blank" rel="noreferrer">
          {renderInline(node.children)}
        </a>
      );
    }

    if (node.type === "break") {
      return <br key={index} />;
    }

    return null;
  });
}

function getPlainText(nodes: PhrasingContent[] = []): string {
  return nodes
    .map((node) => {
      if (node.type === "text" || node.type === "inlineCode") {
        return node.value;
      }

      if ("children" in node) {
        return getPlainText(node.children as PhrasingContent[]);
      }

      return "";
    })
    .join("");
}

function renderListItem(item: ListItem, index: number) {
  return <li key={index}>{renderBlocks(item.children)}</li>;
}

function renderTableRow(row: TableRow, index: number, isHeader = false) {
  const Cell = isHeader ? "th" : "td";

  return (
    <tr key={index}>
      {row.children.map((cell, cellIndex) => (
        <Cell key={cellIndex}>{renderInline(cell.children)}</Cell>
      ))}
    </tr>
  );
}

export function renderBlocks(nodes: RootContent[] = []) {
  return nodes.map((node, index) => {
    if (node.type === "heading") {
      const Heading = `h${node.depth}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      const id = getPlainText(node.children).toLowerCase().replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-");

      return (
        <Heading key={index} id={id}>
          {renderInline(node.children)}
        </Heading>
      );
    }

    if (node.type === "paragraph") {
      return <p key={index}>{renderInline(node.children)}</p>;
    }

    if (node.type === "blockquote") {
      return <blockquote key={index}>{renderBlocks(node.children)}</blockquote>;
    }

    if (node.type === "list") {
      const List = node.ordered ? "ol" : "ul";
      return <List key={index}>{node.children.map(renderListItem)}</List>;
    }

    if (node.type === "code") {
      return (
        <pre key={index}>
          <code>{node.value}</code>
        </pre>
      );
    }

    if (node.type === "thematicBreak") {
      return <hr key={index} />;
    }

    if (node.type === "table") {
      const [head, ...body] = node.children;

      return (
        <div key={index} className="markdown-table-wrap">
          <table>
            {head ? <thead>{renderTableRow(head, 0, true)}</thead> : null}
            <tbody>{body.map((row, rowIndex) => renderTableRow(row, rowIndex))}</tbody>
          </table>
        </div>
      );
    }

    return null;
  });
}
