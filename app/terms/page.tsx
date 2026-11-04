import Link from "next/link";
import { Contact, LegalPage } from "@/components/LegalPage";

export const metadata = {
  title: "Terms of use",
  description: "The terms for playing The Blackwood Bureau.",
};

export default function Terms() {
  return (
    <LegalPage eyebrow="The Blackwood Bureau · Standing orders" title="Terms of use">
      <p>
        These terms apply when you use The Blackwood Bureau website and its cases. By signing in or playing, you agree to them. If you do
        not agree, please do not use the site.
      </p>

      <h2>The game</h2>
      <p>
        The Blackwood Bureau is a work of fiction. Every character, place, organisation and document in its case files is invented. Any
        resemblance to real people or events is coincidental. The cases deal with death and crime and are meant for adults (see the{" "}
        <Link href="/privacy">privacy policy</Link> on players under 18).
      </p>

      <h2>Your account</h2>
      <ul>
        <li>You sign in with your own Google account and are responsible for what happens under it.</li>
        <li>Choose a name at the table that is not offensive and does not impersonate anyone.</li>
        <li>You can delete your account at any time from your account page.</li>
      </ul>

      <h2>Playing fair</h2>
      <p>Please do not:</p>
      <ul>
        <li>harass, threaten or abuse other players in party rooms or table chat;</li>
        <li>try to extract answers or the solution other than by playing, or interfere with the site, its servers or other players&apos; games;</li>
        <li>copy, resell or republish the cases, their documents, images, audio or text.</li>
      </ul>
      <p>We may suspend or remove accounts that break these rules.</p>

      <h2>The case files and the print kit</h2>
      <p>
        The cases, their documents, images, narration and design belong to The Blackwood Bureau. You may play them and print the case kit
        for your own game nights. You may not sell, share publicly or redistribute them. Background music and sound effects are used under
        the Pixabay Content License.
      </p>

      <h2>Availability</h2>
      <p>
        We work to keep the site running and your progress safe, but the service is provided &ldquo;as is&rdquo;. It may change, pause or have
        interruptions, and we cannot promise it will always be available or free of errors.
      </p>

      <h2>Liability</h2>
      <p>
        To the extent the law allows, we are not liable for indirect or consequential losses arising from use of the site. Nothing in these
        terms limits rights you have under law that cannot be excluded.
      </p>

      <h2>Changes</h2>
      <p>We may update these terms. The date at the top shows the latest version; continuing to play after a change means you accept it.</p>

      <h2>Law</h2>
      <p>These terms are governed by the laws of India.</p>

      <h2>Contact</h2>
      <p>Questions about these terms: <Contact />.</p>
    </LegalPage>
  );
}
