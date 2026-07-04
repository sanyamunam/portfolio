import { Atmosphere } from "@/components/light/Atmosphere";
import { Greeting } from "@/components/sections/Greeting";
import { WhatIDo } from "@/components/sections/WhatIDo";

export default function Home() {
  return (
    <>
      <Atmosphere />
      <main>
        <Greeting />
        <WhatIDo />
      </main>
    </>
  );
}
