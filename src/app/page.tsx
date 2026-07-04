import { Atmosphere } from "@/components/light/Atmosphere";
import { Greeting } from "@/components/sections/Greeting";
import { WhatIDo } from "@/components/sections/WhatIDo";
import { Work } from "@/components/sections/Work";
import { MessyMiddle } from "@/components/sections/MessyMiddle";
import { Story } from "@/components/sections/Story";

export default function Home() {
  return (
    <>
      <Atmosphere />
      <main>
        <Greeting />
        <WhatIDo />
        <Work />
        <MessyMiddle />
        <Story />
      </main>
    </>
  );
}
