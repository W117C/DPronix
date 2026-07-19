/**
 * App.tsx — 应用入口
 * 负责初始化数据，渲染 AppChrome
 */

import { useEffect } from "react";
import { useStore } from "./store";
import { listSkills, getCapabilities } from "./bridge";
import AppChrome from "./components/AppChrome";

export default function App() {
  const setSkills = useStore((s) => s.setSkills);
  const setCapabilities = useStore((s) => s.setCapabilities);

  useEffect(() => {
    getCapabilities().then(setCapabilities).catch(console.error);
    listSkills().then(setSkills).catch(console.error);
  }, [setCapabilities, setSkills]);

  return <AppChrome />;
}
