import { Atmosphere } from "@/components/light/Atmosphere";
import { Greeting } from "@/components/sections/Greeting";
import { WhatIDo } from "@/components/sections/WhatIDo";
import { Work } from "@/components/sections/Work";

export default function Home() {
  return (
    <>
      <Atmosphere />
      <main>
        <Greeting />
        <WhatIDo />
        <Work />
      </main>
    </>
  );
}
