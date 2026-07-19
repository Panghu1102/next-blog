import { generatedPosts } from "@/generated/posts";
import type { Root, RootContent, Text, PhrasingContent, ListItem, TableRow } from "mdast";

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date?: string;
  pinned: boolean;
};

export type Post = PostMeta & {
  content: Root;
};

export function getAllPosts(): PostMeta[] {
  return generatedPosts.map(({ slug, title, description, date, pinned }) => ({
    slug,
    title,
    description,
    date,
    pinned,
  }));
}

export function getPostBySlug(slug: string): Post | null {
  return generatedPosts.find((post) => post.slug === slug) ?? null;
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
