import { Lottie } from "lottie-react";

export function LottieBox({ src, className }: { src: string; className?: string }) {
  return <Lottie src={src} autoplay loop className={className} />;
}
