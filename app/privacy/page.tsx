import Link from "next/link";
import { Contact, LegalPage } from "@/components/LegalPage";
import { ERROR_ALERTS } from "@/lib/site";

export const metadata = {
  title: "Privacy policy",
  description: "What The Blackwood Bureau collects when you play, why, where it is kept, and how to delete it.",
};

export default function Privacy() {
  return (
    <LegalPage eyebrow="The Blackwood Bureau · Records office" title="Privacy policy">
      <p>
        The Blackwood Bureau is a detective game. This page explains, in plain words, what we collect when you play, why, where it is
        kept and how you can see or delete it. We do not sell your data, we do not show ads, and we do not use advertising cookies.
      </p>

      <h2>What we collect</h2>
      <h3>When you sign in with Google</h3>
      <p>Your name, email address and profile picture, as shared by Google. We never see your Google password.</p>
      <h3>When you play</h3>
      <ul>
        <li><b>Saved progress</b> for each case: the checkpoints you have closed, the hints you opened and where you are in the file, so you can continue on any device.</li>
        <li><b>Closed cases</b>: the date, your verdict, the time taken, the number of hints and players.</li>
        <li><b>Your name at the table</b>, shown to other players in party rooms. You can change it on your account page.</li>
        <li><b>Ratings</b>: the stars and the optional note you leave after a case, linked to your account.</li>
      </ul>
      <h3>In party rooms</h3>
      <p>
        Names, table chat, suggested answers and votes travel between the players&apos; devices in real time. They are passed through our
        real-time service but not stored on our servers; they stay in the browsers of the people in the room.
      </p>
      <h3>On your device</h3>
      <p>
        Your browser&apos;s local storage keeps your notebook, suspect marks, sound settings and a copy of your progress. Notes stay on your
        device and are never sent to us. We do not use cookies for tracking.
      </p>
      <h3>To keep the site working</h3>
      <ul>
        <li><b>Error reports</b>: if something breaks in your browser, the error message, the page and your browser type are sent to us so we can fix it. They contain no name or email, and are deleted after 90 days.</li>
        <li><b>Visit statistics</b>: privacy-friendly, aggregated page counts from our host. They use no cookies and do not identify you.</li>
      </ul>

      <h2>Why we use it</h2>
      <p>
        To run the game you asked to play: to sign you in, save and restore your cases on any device, show your closed cases, seat you at a
        party table, and improve the cases from ratings and error reports. We use it for nothing else.
      </p>

      <h2>Who handles it for us</h2>
      <ul>
        <li><b>Supabase</b> stores accounts, saved progress, closed cases, ratings and error reports, on servers in Tokyo, Japan, and relays party-room messages.</li>
        <li><b>Vercel</b> hosts the website and provides the visit statistics.</li>
        <li><b>Google</b> handles signing in.</li>
        {ERROR_ALERTS && <li><b>Sentry</b> receives error reports so we are alerted when something breaks.</li>}
      </ul>
      <p>Your data may therefore be stored or processed outside India. Each provider is bound to keep it secure and use it only for us.</p>

      <h2>How long we keep it</h2>
      <p>
        Account, progress, closed cases and ratings: until you delete your account. Error reports: at most 90 days. Party-room messages are
        not kept on our servers at all.
      </p>

      <h2>Your rights</h2>
      <p>Under India&apos;s Digital Personal Data Protection Act, 2023 and similar laws, you can:</p>
      <ul>
        <li><b>See</b> your data: your <Link href="/account">account page</Link> shows your name, saved cases and closed cases.</li>
        <li><b>Correct</b> it: change your name at the table on the account page.</li>
        <li><b>Erase</b> it: use <b>Delete my account</b> on the account page. It removes your profile, progress, closed cases and ratings immediately and permanently.</li>
        <li><b>Withdraw consent</b> at any time by deleting your account, and <b>ask questions or raise a grievance</b> by writing to <Contact />.</li>
      </ul>

      <h2>Children</h2>
      <p>
        The cases deal with death and crime and are written for adults. The Bureau is meant for players aged 18 and over; anyone younger
        should play only with the consent and involvement of a parent or guardian.
      </p>

      <h2>Security</h2>
      <p>
        Data travels over encrypted connections. Each player&apos;s saved progress, closed cases and ratings can be read only by that player&apos;s
        own account, enforced by the database itself.
      </p>

      <h2>Changes</h2>
      <p>If this policy changes, the date at the top changes too. Significant changes will be shown on the site before they take effect.</p>

      <h2>Contact</h2>
      <p>Questions about your data: <Contact />.</p>
    </LegalPage>
  );
}
