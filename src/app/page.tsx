import { Atmosphere } from "@/components/light/Atmosphere";
import { Greeting } from "@/components/sections/Greeting";

export default function Home() {
  return (
    <>
      <Atmosphere />
      <main>
        <Greeting />
      </main>
    </>
  );
}
