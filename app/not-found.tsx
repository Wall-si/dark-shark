import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col justify-end">
      <p className="font-ui text-sm tracking-[0.32em] text-blood uppercase">Signal 404</p>
      <h1 className="font-display text-[22vw] leading-[0.8] md:text-[12rem]">LOST</h1>
      <p className="max-w-md text-mute">That lot, desk, or frequency is not on the Vesper mesh.</p>
      <Link href="/market" className="mt-6 font-ui text-2xl tracking-[0.18em] text-paper uppercase hover:text-blood">
        Return to market
      </Link>
    </div>
  );
}
