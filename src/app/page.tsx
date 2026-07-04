import { Atmosphere } from "@/components/light/Atmosphere";
import { ThreadNav } from "@/components/nav/ThreadNav";
import { Greeting } from "@/components/sections/Greeting";
import { About } from "@/components/sections/about/About";
import { Work } from "@/components/sections/Work";
import { MessyMiddle } from "@/components/sections/MessyMiddle";
import { PlaygroundBeat } from "@/components/sections/PlaygroundBeat";
import { Invitation } from "@/components/sections/Invitation";

export default function Home() {
  return (
    <>
      <Atmosphere />
      <ThreadNav />
      <main>
        <Greeting />
        <About />
        <Work />
        <MessyMiddle />
        <PlaygroundBeat />
        <Invitation />
      </main>
    </>
  );
}
