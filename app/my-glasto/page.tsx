import type { Metadata } from "next";
import { MyGlasto } from "../../components/picks";

export const metadata: Metadata = { title: "My Glasto" };

export default function Page() {
  return <MyGlasto />;
}
