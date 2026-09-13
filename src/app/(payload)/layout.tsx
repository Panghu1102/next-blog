import config from "@payload-config";
import { RootLayout } from "@payloadcms/next/layouts";
import "@payloadcms/next/css";
import "./custom.scss";
import { importMap } from "./admin/importMap";

export default function PayloadLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return RootLayout({ children, config, importMap });
}
